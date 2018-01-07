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

<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">Home</a> > <a title="Documentation" href="https://jaysaurus.github.io/Co.Koa/miniSite/Documentation.html">Documentation</a> > [Dependency Manager](DependencyManager.md) > Dynamic Resources

<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">
<img alt="Co.Koa header" title="Co.Koa" style="margin: 0 15%; width: 70%" src="https://raw.githubusercontent.com/jaysaurus/Co.Koa/master/siteStrapCoKoa.png?sanitize=true" />
</a>

* [Config](Config.md)
* [Controller](Controller.md)
* [Dependency Manager](DependencyManager.md)
  * Dynamic Resources
  * [Properties](DMProperties.md)
  * [Static Resources](DMStaticResources.md)
* [Model](Model.md)
* [Service](Service.md)
* [View](View.md)

## Dependency Manager
### Dynamic Resources

Dynamic resources are loaded by the conventions stipulated by Co.Koa.  Controllers, Services, Views and Models must all be stored in their respective folders.  Services and Controllers must be suffixed with `Service` and `Controller` respectively.  For example:

```
./api/controllers/TestController.js
./api/services/TestService.js
```

while you may place unconventional js files in these locations, `co-koa-core` will neither route nor expose anything it doesn't recognise.  Crucially, models are not suffixed with the word `Model` (since they represent like-for-like the real-world data you want your application to store and consume).  It is important, therefore, that **only** models are placed inside the `./api/models` folder!

Presently, [Services](Service.md), [Models](Model.md) and [Validators](Model.md) can be accessed dynamically via the Dependency Manager wherever it is exposed:

```javascript
const sampleService = $('SampleService'); // load an instance of SampleService in ./api/services/SampleService.js
const Sample = $('Sample') // call a Mongoose model instance derived from the Sample schema in ./api/models/Sample.js
const SampleValidator = $('SampleValidator') // call a validator library for your mongoose instance from ./api/models/validators/SampleValidator.js
```
