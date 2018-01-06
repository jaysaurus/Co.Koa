<link rel='stylesheet' type='text/css' href='style.css' />
<table class="headerTable">
<tr class="headerTR">
<td class="headerTD">
<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">Home</a> |
<a title="Documentation" href="https://jaysaurus.github.io/Co.Koa/miniSite/Documentation.html">Documentation</a> |
<a title="co-koa-core on github" href="https://github.com/jaysaurus/co-koa-core">Core</a> |
<a title="co-koa-cli on github" href="https://github.com/jaysaurus/co-koa-cli">CLI</a>
</td>
</tr>
</table>

<img style="margin: 0 15%; width: 70%" src="https://raw.githubusercontent.com/jaysaurus/Co.Koa/master/siteStrapCoKoa.png?sanitize=true" />

* [Config](Config.md)
* Controller
* [Dependency Manager](DependencyManager.md)
* [Model](Model.md)
* [Service](Service.md)
* [View](View.md)

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

The order in which your actions are defined is important.  If a URI expects to be supplied parameters and shares the same request verb as other actions, it **must** be defined after the other URIs.

**For Example:**

```javascript
module.exports = function ($) {
  return {
    async 'GET /foo' (ctx) {},
    async 'GET /:id' (ctx) {},
  }
}
```

In the above instance, if `:id` was before `foo`, your controller would treat "/foo" as an `:id` parameter.

### IndexController.js

Each project is supplied with an **"IndexController.js"**.  Routes within this file will point directly to the virtual root of your web application.  For example, in a development instance at `localhost:3000`, `GET /` will route to the address `localhost:3000/`.  It is **strongly** advised that, at most, you supply only the following actions to this controller:

```javascript
module.exports = function IndexController ($) {
  return {
    async 'GET /' (ctx) {},
    async 'POST /' (ctx) {},
    async 'PUT /' (ctx) {},
    async 'PATCH /' (ctx) {},
    async 'DELETE /' (ctx) {}
  }
}
```

### Rendering Pages

Koa supports static and dynamic content.  To load `.hbs` files within your views folder, supply an asynchronous call to `ctx.render()` with the view's name and, if necessary, an object containing variables to be used by the rendering engine:

```javascript
'GET /foo': async (ctx) => {
  await ctx.render('FooView', { bar: 'bar' });
}
```

the `fs` module's capacity for streaming files is exposed via the [Dependency Manager](DependencyManager.md).  In this fashion we can easily render static HTML from our resources file (ensure that the router informs the browser to handle html):

```javascript
async 'GET /' (ctx) {
  ctx.type = 'html';
  ctx.body = $(':html').stream('index');
}
```
