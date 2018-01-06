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

* [Config](Config.md)
* [Controller](Controller.md)
* Dependency Manager
  * [Dynamic Resources](DMDynamicResources.md)
  * [Static Resources](DMStaticResources.md)
  * [Properties](DMProperties.md)
* [Model](Model.md)
* [Service](Service.md)
* [View](View.md)

## Dependency Manager

The Dependency Manager is kind of a Swiss-Army knife of useful interrelated tools. It is exposed throughout Co.Koa; controllers, services, models and middleware all have access to the Dependency Manager courtesy of the supplied `$` parameter.

The Dependency Manager breaks down into 3 use categories:

#### [DynamicResources](DMDynamicResources.md)

The DependencyManager knows to look for Models and Services within their respective folders.  the example below demonstrates the syntax:

```javascript
const sampleService = $('SampleService'); // load an instance of SampleService in ./api/services/SampleService.js
const Sample = $('Sample') // call a Mongoose model instance derived from the Sample schema in ./api/models/Sample.js
const SampleValidator = $('SampleValidator') // call a validator library for your mongoose instance from ./api/models/validators/SampleValidator.js
```

#### [Static Resources](DMStaticResources.md)

prefixing your argument string with ':' tells Co.Koa you are requesting a static resource of some kind.  The following resources are available:

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
Exposes the [echo-handler](http://npmjs.com/echo-handler) NPM module
</td>
</tr>
<tr>
<td class="tdHilight">
$(':enums')
</td>
<td>
returns `./api/Enums.js`
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
</table>

more information on Static Resources can be found [here](DMDynamicResources.md)

#### Properties

The Dependency Manager is also supplied with some handy properties:

<table>
<tr>
<td class="tdHilight">
$.environment
</td>
<td>
The name of the running environment (specified when launching Co.Koa)
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
<tr>
<td class="tdHilight">
$.useHBS
</td>
<td>
whether the environment is currently using handlebars templating engine (as specified in your config.json)
</td>
</tr>
</table>
