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

<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">Home</a> > <a title="Documentation" href="https://jaysaurus.github.io/Co.Koa/miniSite/Documentation.html">Documentation</a> > [Dependency Manager](DependencyManager.md) > Properties

<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">
<img alt="Co.Koa header" title="Co.Koa" style="margin: 0 15%; width: 70%" src="https://raw.githubusercontent.com/jaysaurus/Co.Koa/master/siteStrapCoKoa.png?sanitize=true" />
</a>

* [Config](Config.md)
* [Controller](Controller.md)
* [Dependency Manager](DependencyManager.md)
  * [Dynamic Resources](DMDynamicResources.md)
  * Properties
  * [Static Resources](DMStaticResources.md)
* [Model](Model.md)
* [Service](Service.md)
* [View](View.md)

## Dependency Manager:
### Properties

The Dependency Manager is also supplied with some handy properties:

<table>
<tr>
<td class="tdHilight">
$.env
</td>
<td>
Exposes an object that most notably contains the project's [mongoose](http://mongoosejs.com/) object
</td>
</tr>
<tr>
<td class="tdHilight">
$.environment
</td>
<td>
The name of the running environment (specified when launching Co.Koa); defaults to 'development'.
</td>
</tr>
<tr>
<td class="tdHilight">
$.i18n
</td>
<td>
the default language specified in config.json
</td>
</tr>
<tr>
<td class="tdHilight">
$.logger
</td>
<td>
Simply returns the `.log()` and `.error()` methods defined in your `./config/logger.js`
</td>
</tr>
<tr>
<td class="tdHilight">
$.messageFolder
</td>
<td>
The absolute location of your i18n folder
</td>
</tr>
<tr>
<td class="tdHilight">
$.root
</td>
<td>
The root directory of your project
</td>
</tr>
</table>
