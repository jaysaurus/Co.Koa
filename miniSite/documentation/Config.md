<link rel='stylesheet' type='text/css' href='style.css' />
<table class="headerTable">
<tr class="headerTR">
<td class="headerTD">
<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">Home</a> |
<a title="Documentation" href="https://jaysaurus.github.io/Co.Koa/miniSite/Documentation.html">Documentation</a> |
<a title="co-koa-core on github" href="https://github.com/jaysaurus/co-koa-core">Core</a> |
<a title="co-koa-cli on github" href="https://github.com/jaysaurus/co-koa-cli">CLI</a> | <a href="https://github.com/jaysaurus/Co.Koa/wiki/Installation-&-Execution">Install</a>
</td>
</tr>
</table>

<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">
<img alt="Co.Koa header" title="Co.Koa" style="margin: 0 15%; width: 70%" src="https://raw.githubusercontent.com/jaysaurus/Co.Koa/master/siteStrapCoKoa.png?sanitize=true" />
</a>

* Config
* [Controller](Controller.md)
* [Dependency Manager](DependencyManager.md)
* [Model](Model.md)
* [Service](Service.md)
* [View](View.md)

## Config

The Config folder is perhaps the most intimidating component of Co.Koa. Don't worry, just like everything else in Co.Koa, it's designed to keep things simple!

---

### AssetConfig.js

The AssetConfig file tells Co.Koa's [Dependency Manager](DependencyManager.md) where to look for CSS, HTML, IMG & JS files within the public folder.  You can also supply other assets within your public folder from this location (txt, pdf, etc.)

**For Example**

when you call `$(':css').loadURL('foo')`, the [Dependency Manager](DependencyManager.md) will cross reference the folder based on the running environment.  For example, by default we can see that the `development` css uri points to:

```javascript
'css': '/src/assets/css',
```

if we call `$(':css').loadURL('foo')` in any function that exposes the [Dependency Manager](DependencyManager.md), a string will be returned as follows: '/src/assets/css/foo.css' that points to the physical directory './public/src/assets/css/foo.css'.

---

### bootstrap.js

As the name would suggest, bootstrap is the place to inject code you would like to execute when starting your server.  Bootstrap is injected with the [Dependency Manager](DependencyManager.md) and operates much like a method in a service object

---

### config.json

The config.json file houses a number of core configurations for your project:

```javascript
"appKeys": [],
```

supply a default list of keys for koa's implementation of [key grip](https://github.com/crypto-utils/keygrip).
**Note** as of co-koa-core@0.21.0, If you set app.keys in a Co.Koa [plugin](Plugins.md), this config property will be ignored.

---

```javascript
"dependencyRegister": {},
```

The <span id="DependencyRegister">Dependency Register</span> allows you to specify custom dynamic dependencies for the Dependency Manager.  Co.Koa expects this property to be defined as an object literal `"Type": "Path"` pairs.

**Type** dictates the suffix the files are expected to have.  For example:

If a type key is set to `"Validator"`, the files in the designated directory should be suffixed as below:

```javascript
FooValidator.js
BarValidator.js
BazValidator.js
...
```
**Path** dictates the directory  <u>starting from the api directory</u>.  For example:

If a path value is set to `"models/virtuals"` then your files will be located at:

```javascript
rootDir/api/models/virtuals
```
now, given the examples above, all files with access to the DependencyManager would be able to call:

```javascript
$('FooValidator');
```

If a custom dependency file supplies `module.exports` with a function, the function in question will be supplied the dependency manager as an argument just like models, services and so on:

```javascript
module.exports = function FooValidator ($) {
  ...
}
```

#### Caveat
**Be very careful what you add to the register!** once it's in the register, the dependencyManager may not be able to load Models that share the same suffix.

**Do not add a forward slash at the beginning or the end of your path value!** Co.Koa has it covered!

---

```javascript
"defaultLanguage":"en",
```

Default language specifies the language you want Co.Koa to use both within its core files and by default for your local i18n folder.  This should adhere to the 2 letter language codes acknowledged by the W3C.  Currently, co-koa-core will default to English (contributions welcome!) But don't let that stop you from using other languages within your i18n folder.  For more information on i18n and Co.Koa, visit the [Dependency Manager](DependencyManager.md) page.

---

```javascript
"environment": {
  "test": {
    "port": 3000
  },
  "development": {
    "port": 3000
  }
},
```
The environment property allows you to supply a port.  This may be expanded in future.

---

```javascript
"messageFolder": "./i18n/",
```

The messageFolder tells Co.Koa's DependencyManager where to look for internationalised messages to echo to your users.  For example, by default, suppose you had a file stored at:
```
./i18n/en.messages.json
```
 this could be loaded in a model/controller/service/middleware function as follows:
 ```javascript
 $(':echo').load('messages');
 ```
for more information on `$(':echo')`, please see the [Dependency Manager](DependencyManager.md) documentation.

---

```javascript
"optionalModules": {
  "koa-hbs-renderer": true,
  "koa-locale": true,
  "@koa/cors": true
}
```

Optional modules are added to Co.Koa via the "optionalModules" object.  Most notably, Co.Koa supports handlebars by default, but can be made into a pure API simply by setting the [`koa-hbs-renderer`](https://npmjs.com/koa-hbs-renderer) flag to `false`.  Co.Koa will not load any HBS components on launch if the flag is set to `false` (this has no effect on accessing static resources within the `/public` folder).

If you wish to use [Vue](VueIntegration.md) with your instance, you will need to use `@koa/cors` to communicate between the Vue development instance server and Co.Koa

---

### hbsConfig.js

The hbsConfig exposes, like-for-like the configurations file for [koa-hbs-renderer](https://www.npmjs.com/package/koa-hbs-renderer).  Needless to say, be careful changing this file!

---

### logger.js

The logger is the brains behind the `$.logger.log()` method exposed by the [Dependency Manager](DependencyManager.md). It allows you to log messages based on the running environment.  Perhaps you'd like to have console.log() calls for dev, but store the same data in a log file on your production box.  Co.Koa encourages you to use `$.logger.log()` and `$.logger.error()` rather than - for example - `console.log()`.

By default, the development environment will simply default to `console.log()` and `console.error()`.  For convenience, the test environment expects a secondary array argument and will push the message to that array.  Production is entirely up to you!

The logger is also passed to the `$(':echo')` component and will be used therein when calling `.log()` or `.error()`.  For more information on `$(':echo')`, please see the [Dependency Manager](DependencyManager.md) documentation.

---

### middleware.js

the middleware.js is a location from which to perform koa-style middleware actions.  Each method supplied to the middleware.js object will be called (sequentially) by koa's app.use() on launch.  As an example, Co.Koa sets up a simple function that will be called each time it receives a request:

```javascript
module.exports = function ($, conf) {
  return {
    async logRequest (ctx, next) {
      const start = new Date();
      await next();
      const ms = new Date() - start;
      // use the aforementioned logger to log the load time
      $.logger.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    }
  };
};
```

As you can see, it has full access to the [Dependency Manager](DependencyManager.md).
