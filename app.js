const CoKoa = require('../co-koa-core/src/index.js');
const yargs = require('yargs');
const {argv} =
  yargs.options({
    environment: {
      alias: 'e',
      describe: 'choose the environment to run, defaults to "development"',
      string: true
    }
  })
  .help()
  .alias('help', 'h');

try {
  const coKoa =
    new CoKoa(
      __dirname,
      argv['environment'] || 'development')
      .launch();
  coKoa // koa-router is exposed below as "coKoa.router"
    .app
    .use(coKoa.router.routes())
    .use(coKoa.router.allowedMethods())
    .listen(coKoa.port);
} catch (e) {
  console.error(
    e.message
      ? e.message
      : 'something unexpected brought the server down:');
}
