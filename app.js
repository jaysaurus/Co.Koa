global.__root = __dirname;

/*
* KOA IMPORTS
*/
const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');

/*
* NPM MISC IMPORTS
*/
const _ = require('lodash');
// const hbs = require('handlebars');

try {
  /*
  * CO.KOA IMPORTS
  */
  require('./.core/environment');
  require('./.core/welcomeMessage');

  const $ = require('./.core/dependencyManager');

  const { bootstrap } = require('./config/bootstrap');
  const { build } = require('./.core/build');

  bootstrap($);

  var app = new Koa();
  var router = new Router();

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
      process.log(`${ctx.method} ${ctx.url} - ${ms}`);
    });

  /*
  * TODO TAGLIB
  */
  // require('./core/handlebars')(build, $, hbs);

  /*
  * BUILD CONTROLLERS
  */
  build('Controller', (controller, prefix) => {
    _.each(
      controller($),
      (action, route) => {
        var routeArray = route.split(' ');
        try {
          if (routeArray.length === 2) {
            router[routeArray[0].toLowerCase()](
              '/' + prefix + routeArray[1], action);
          } else throw new Error();
        } catch (e) {
          process.log(`failed to generate action "${route}": is your verb valid?'}`);
        }
      });
  });

  /*
  * MAIN APP LISTENER
  */
  process.log(`listening on port ${process.env.PORT}`);
  app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(process.env.PORT);
} catch (e) {
  process.log(e.message ? e.message : 'something unexpected brought the server down:');
}
