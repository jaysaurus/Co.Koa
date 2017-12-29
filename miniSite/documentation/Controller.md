[Home](https://jaysaurus.github.io/Co.Koa) | Documentation | <a title="co-koa-core on github" href="https://github.com/jaysaurus/co-koa-core">Core</a> | <a title="co-koa-cli on github" href="https://github.com/jaysaurus/co-koa-cli">CLI</a>

* Controller
* [Model](Model.md)
* [Service](Service.md)
* [View](View.md)
* [Config](Config.md)

## Controllers

Co.Koa's controllers are a facade for the [koa-router](https://www.npmjs.com/package/koa-router) module; it is advised that you read said documentation in conjunction with the below.  Should you wish to perform custom logic against the Koa-router module, you can access it via **Co.Koa's** app.js as `coKoa.router`:

```javascript
coKoa
  .app
  .use(coKoa.router.routes())
  .use(coKoa.router.allowedMethods())
  .listen(coKoa.port);
```

### Verbs

Controllers support the following verbs:

```javascript
module.exports = function ($) {
  return {
    async 'GET /' (ctx, next) {},
    async 'PUT /' (ctx, next) {},
    async 'POST /' (ctx, next) {},
    async 'PATCH /' (ctx, next) {},
    async 'DELETE /' (ctx, next) {}
  }
}
```

just as with `koa-router`, **Co.Koa** exposes the `ctx` and `next` arguments.  See `koa-router's` documentation for more details.

### Routing

Each method within a controller is an "action" that the server can perform on request.  Co.Koa automatically routes by convention.  for example: if you have a "BookController" with a method called `GET /Foo` then get requests will be routed to `Book/Foo`.  
