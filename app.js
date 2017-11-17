/*
* KOA IMPORTS
*/
const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');

/*
* CO.KOA IMPORTS
*/
const Builder = require('./.core/Builder');
const ConfigFactory = require('./.core/ConfigManager');
const DependencyManager = require('./.core/DependencyManager');
const middleware = require('./config/middleware');
const MongooseModeller = require('./.core/MongooseModeller');
const WelcomeMessage = require('./.core/WelcomeMessage');

console.log(process.cwd())
const conf = new ConfigFactory(process.cwd()).build(process.env.NODE_ENV || 'development');

try {
  const app = new Koa().use(BodyParser());
  const router = new Router();

  new WelcomeMessage(conf).sayHello();
  const $ = new DependencyManager(conf);

  /*
  * SETUP MODELS
  */
  new MongooseModeller(conf).model($.call);

  /*
  * SETUP VIEWS (OPTIONAL)
  */
  if (conf.useHBS) {
    const hbsOptions = require('./config/hbsConfig');
    const renderer = require('koa-hbs-renderer');
    app.use(renderer(hbsOptions(conf)));
  }

  /*
  * SETUP MIDDLEWARE
  */
  const wares = middleware($.call, conf);
  Object.keys(wares).forEach(key => { app.use(wares[key]); });

  /*
  * BUILD CONTROLLERS
  */
  new Builder(conf)
    .build('Controller', (controller, prefix) => {
      const routes = controller($.call);
      Object.keys(routes)
        .forEach(
          (route) => {
            var routeArray = route.split(' ');
            try {
              if (routeArray.length === 2) {
                router[routeArray[0].toLowerCase()](
                  '/' + prefix + routeArray[1], routes[route]);
              } else throw new Error();
            } catch (e) {
              conf.logger.error(`failed to generate action "${route}": is your verb valid?'}`);
            }
          });
    });

  /*
  * BOOTSTRAP
  */
  require('./config/bootstrap').bootstrap($.call);

  /*
  * MAIN APP LISTENER
  */
  conf.logger.log(`listening on port ${conf.env.port}`);
  app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(conf.env.port);
} catch (e) {
  conf.logger.log(e.message ? e.message : 'something unexpected brought the server down:');
}
