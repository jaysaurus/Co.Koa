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

## Plugins

As of [co-koa-core](https://npmjs.com/package/co-koa-core)@0.17.0 (and higher) Co.Koa will support plugin integration.  This is a more versatile way of implementing middleware in a discrete fashion.  The first official Co.Koa MVC plugin is [co-koa-session-plugin](https://www.npmjs.com/package/co-koa-session-plugin) which is designed to integrate [koa-session](https://www.npmjs.com/package/koa-session) with your mongoDB instance.  But feel free to write your own!

### Why plugins?

While writing Co.Koa, it became apparent that it ought to handle sessions without requiring the user to go to great lengths to implement them.  However, it was hard to know where they would sit in the build pipeline without either enforcing a session module (which the client might not want to use) or via pre-installed requirements baked into the client's Co.Koa project.  Ideally, when you install a Co.Koa implementation, it wants to ship with one (and only one) dependency: co-koa-core.

Really, though, this conundrum betrayed something the build would probably always have wanted/needed: a dedicated way to implement plugin modules.  In the spirit of [koajs](http://koajs.com), let's keep things flexible!

### Plugin Specification

Plugins are triggered **directly before** Co.Koa's built-in middleware.  The boilerplate for a plugin is as below:

```javascript
module.exports = {
  init (app, $) {  }
}
```

the `app` variable is literally koa's `app` variable.  The `$` is Co.Koa's [Dependency Manager](DependencyManager.md).  The rest is literally up to you!  The most important thing is that your must return an object with at least the `init` property and the `app` and `$` arguments.

Suppose we were to store an implementation derived from the above in `MyFirstPlugin.js` in `./plugins`, you can add it to Co.Koa as follows:

```javascript
const fs = require('fs');
const MyFirstPlugin = require('./plugins/MyFirstPlugin');

if (fs.existsSync('./node_modules')) {
  const CoKoa = require('co-koa-core');
  try {
    const coKoa = CoKoa(__dirname).launch(MyFirstPlugin); // <= HERE!
    ...
```

Co.Koa supports an unlimited number of plugins:

```javascript
const coKoa = CoKoa(__dirname).launch(
  MyFirstPlugin,
  MySecondPlugin,
  MyThirdPlugin,
  etc);
```

In the spirit of Convention over Configuration, you are strongly encouraged to suffix your plugin files with the word "Plugin".

### Writing a Model Plugin

Arguably the greatest strength of Co.Koa is its pragmatism toward the concept of data models.  to create a plugin that supports data models the plugin must register it's desired model format against `app._modelRegister`.  For example, suppose we had some kind of database ORM that expected you to call `get(<theNameOfSomeDataModel>)` in order to load a model from memory.  Your plugin would need to do something like the below:

```JavaScript
module.exports = function someDB (app, $) {
  ...
  app._modelRegister.someDb = itemName => someDBInterface.get(itemName)
}
```

then, in turn, each of the models you would like to wire to this plugin would need to be supplied with the `_modelType` property as below:

```javascript
module.exports = function Foo ($) {
  return {
    _modelType: 'someDb', // wording must precisely match your _modelRegister property
    ... // your ORM-specific configuration
  }
}
```

Thus, when `$('Foo')` is called elsewhere in the system, `someDBInterface('Foo')` will be called!  In this fashion you can have different models pointing to different databases or completely different service behaviours! It's up to you!
