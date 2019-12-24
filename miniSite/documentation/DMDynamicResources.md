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

<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">Home</a> > <a title="Documentation" href="https://jaysaurus.github.io/Co.Koa/miniSite/Documentation.html">Documentation</a> > [Dependency Manager](DependencyManager.md) > Dynamic Resources

<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">
<img alt="Co.Koa header" title="Co.Koa" style="margin: 0 15%; width: 70%" src="https://raw.githubusercontent.com/jaysaurus/Co.Koa/master/siteStrapCoKoa.png" />
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

Dynamic resources are loaded according to Co.Koa's conventions.  Controllers, Services, Views and Models must all be stored in their respective folders.  Services and Controllers must be suffixed with `Service` and `Controller` respectively.  For example:

```
./api/controllers/TestController.js
./api/services/TestService.js
```

while you may place unconventional js files in conventional locations, `co-koa-core` will neither route nor expose anything it doesn't recognise.  Crucially, models are not suffixed with the word `Model` (since they represent like-for-like the real-world data you want your application to store and consume).  It is important, therefore, that **only** models are placed inside the `./api/models` folder!

Presently, [Services](Service.md), [Models](Model.md) and [Validators](Model.md) can be accessed dynamically via the Dependency Manager wherever it is exposed:

```javascript
const sampleService = $('SampleService'); // load an instance of SampleService in ./api/services/SampleService.js
const Sample = $('Sample') // call a Mongoose model instance derived from the Sample schema in ./api/models/Sample.js
const SampleValidator = $('SampleValidator') // call a validator library for your mongoose instance from ./api/models/validators/SampleValidator.js
```

### Caveats

Be careful to avoid accessing dependencies cyclically.  An example would be allowing the the full function block of a model to load itself.  Suppose we have `Sample.js` as a model, and we call `$('Sample')` at the top of the function:

```javascript
module.exports = function Sample ($) {
  const Sample = $('Sample'); // CRASH CRASH CRASH!
  return {
    ...
  }
}
```

The above will crash the server.  as will calling the service  below in the Sample Model:

```javascript
// SampleService.js
module.exports = function SampleService ($) {
  const Sample = $('Sample');
  return {
    ...
  }
}
```
```javascript
// Sample.js (model)
module.exports = function Sample ($) {
  const sampleService = $('SampleService'); // CRASH CRASH CRASH!
  return {
    ...
  }
}
```


*However*, there are legitimate instances where loading an ostensibly cyclical dependency will work just fine; provided that the cyclical reference is loaded within the scope of a callback.

**For Example** the `co-koa-mongoose-plugin` that ships with Co.Koa can load in a model cyclically via a callback; this allows you to cross reference an existing document before/after a mongoose event is actioned.

Since [Mongoose doesn't ship with a traditional 'Unique' validator](http://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator), this is a good tactic for validating unique fields in Mongoose before saving a document. See below:

```javascript
module.exports = function Sample ($) {
  return {
    ...
    hooks: {
      pre: {
        async save (next) {
          // check if a document has the same "name" as the new document the user is trying to create
          if (this._doc.hasOwnProperty('name')) {
            const Model = $('Sample');
            const hasModel = await Model.findOne({ name: this._doc.name });
            if (hasModel) throw new Error('The name field is not unique!');
          }
          next()
        }
      }
    }
  }
}
```
