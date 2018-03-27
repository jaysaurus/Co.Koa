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

* [Config](Config.md)
* [Controller](Controller.md)
* Dependency Manager
  * [Dynamic Resources](DMDynamicResources.md)
  * [Properties](DMProperties.md)
  * [Static Resources](DMStaticResources.md)
* [Model](Model.md)
* [Service](Service.md)
* [View](View.md)

## Dependency Manager

The Dependency Manager is kind of a Swiss-Army knife of useful interrelated tools. It is exposed throughout Co.Koa; [Controllers](Controller.md), [Bootstrap](Config.md), [Middleware](Config.md), [Models](Model.md) (and their) [Validators](Model.md), [Services](Service.md) and middleware all have access to the Dependency Manager courtesy of the supplied `$` parameter.

The Dependency Manager breaks down into 2 use categories:

#### [DynamicResources](DMDynamicResources.md)

The DependencyManager knows how to find [Services](Service.md), [Models](Model.md) and [Validators](Model.md) within their respective folders.  the example below demonstrates the syntax:

```javascript
const sampleService = $('SampleService'); // load an instance of SampleService in ./api/services/SampleService.js
const Sample = $('Sample') // call a Mongoose model instance derived from the Sample schema in ./api/models/Sample.js
const SampleValidator = $('SampleValidator') // call a validator library for your mongoose instance from ./api/models/validators/SampleValidator.js
```

---

#### [Static Resources](DMStaticResources.md)


<div>
  prefixing your argument string with ':' tells Co.Koa you are requesting a static resource of some kind.  The following resources are available:
</div>

<table>
<tr>
<td class="tdHilight">
$(':async')
</td>
<td>
Exposes await/async-friendly .each() and .reduce() methods.
</td>
</tr>
<tr>
<td class="tdHilight">
$(':echo')
</td>
<td>
Exposes the echo-handler NPM module
</td>
</tr>
<tr>
<td class="tdHilight">
$(':builder')
</td>
<td>
returns the co-koa-core's builder tool for iterating through files.  This is an invaluable tool for handling custom database implementations in your plugins.  See the [index.js](https://github.com/jaysaurus/co-koa-mongoose-plugin/blob/master/index.js) of the co-koa-mongoose-plugin to get a feel for how it works.
</td>
</tr>
<tr>
<tr>
<td class="tdHilight">
$(':enums')
</td>
<td>
returns ./api/Enums.js
</td>
</tr>
<tr>
<td class="tdHilight">
$(':tree')
</td>
<td>
returns a stack-tree algorithm that can be used to iterate through object trees.
</td>
</tr>
<tr>
<td class="tdHilight">
$(':html')
$(':css')
$(':img')
$(':js')
</td>
<td>
returns an object containing the methods <span class=".highlighter-rouge">.stream(filename)</span> (under the hood this employs <span class=".highlighter-rouge">fs.createReadStream()</span>) and <span class=".highlighter-rouge">.loadURL(fileName)</span>.  You can add more static assets to this list via the AssetConfig.js.
</td>
</tr>
</table>

more information on Static Resources can be found [here](DMStaticResources.md)

---

### Adding Custom Dependencies to the Dependency Manager

as of @1.8.0, Co.Koa supports the use of custom dependencies via the [Dependency Register](http://cokoajs.com/miniSite/documentation/Config.html#DependencyRegister) within your project's config.json. more information on custom dependencies can be found in the [Config Documentation](http://cokoajs.com/miniSite/documentation/Config.html#DependencyRegister).

```javascript
const yourDependencyHere = $('YourDependencyHere');
```
