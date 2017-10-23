/*
* KOA IMPORTS
*/
const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');

/*
* NPM MISC IMPORTS
*/
// const _ = require('lodash');
// const hbs = require('handlebars');

/*
* CO.KOA IMPORTS
*/
const Builder = require('./.core/Builder');
const ConfigFactory = require('./.core/ConfigManager');
const DependencyManager = require('./.core/DependencyManager');
const welcome = require('./.core/welcomeMessage');

const conf = new ConfigFactory(__dirname).build(process.env.NODE_ENV || 'development');

try {
  welcome(conf);
  const $ = new DependencyManager(conf);
  const hbsOptions = require('./config/hbsConfig');

  require('./config/bootstrap').bootstrap($.call);

  var app = new Koa();
  var router = new Router();

  /*
  * VIEW SUPPORT
  */
  if (conf.useHBS) {
    const renderer = require('koa-hbs-renderer');
    app.use(renderer(hbsOptions(conf)));
  }
  /*
  * TODO MIDDLEWARE
  */
  app
    .use(BodyParser())
    .use(async (ctx, next) => {
      const start = new Date();
      ctx.body = `${start} request received.`;
      await next();
      const ms = new Date() - start;
      conf.logger.log(`${ctx.method} ${ctx.url} - ${ms}`);
    });

  /*
  * BUILD CONTROLLERS
  */
  new Builder(conf)
    .build('Controller', (controller, prefix) => {
      var routes = controller($.call);
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
              conf.logger.log(`failed to generate action "${route}": is your verb valid?'}`);
            }
          });
    });

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
