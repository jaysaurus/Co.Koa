const CoKoa = require('./index.js');

try {
  const coKoa = new CoKoa(__dirname, process.env.NODE_ENV || 'development').launch();

  coKoa
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
