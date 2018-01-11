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

## A Note on Conventions

**Co.Koa** is a [Convention Over Configuration](https://en.wikipedia.org/wiki/Convention_over_configuration) framework.  It endeavours to keep configuration to a minimum so you can focus on writing well-ordered human-readable code.  If you haven't worked with a Convention over Configuration toolchain before, it can seem a little intimidating trying to play by the rules. However, once you know the lingo, it's a piece of cake!

It is advised to play by the following rules:

---

### The Model folder must only contain models, most other locations are fair game!

Because of how the [Dependency Manager](DependencyManager.md) works, you will run in to problems if you put Plain Old JavaScript files in there.

The same is not true with [Controllers](Controller.md),  [Services](Service.md), [Validators](Model.md) or custom folders of your choosing within the API directory.  For **Co.Koa** to recognise a Service or Controller its file name must be suffixed with their respective Type (Controller/Service/Validator).

Keep in mind when adding unconventional JS to your software that **Co.Koa** will not know what to do with it.  At some stage there may be scope for making **Co.Koa** smart to custom dynamic types; but, at present, what you see within this <a title="Documentation" href="https://jaysaurus.github.io/Co.Koa/miniSite/Documentation.html">Documentation</a> is what you get.

---

### Co.Koa has rules, but play by them and the rest is really all yours

NPM modules and your own unconventional code is only ever a `require` call away! if you want to use custom libraries within the different conventional js components of the build, simply require them as usual:

```javascript
const _ = require('lodash');

module.exports = function TestController ($) {
  return {
    async 'GET /compact' (ctx, next) {
      const compacted = _.compact([0, 1, false, 2, '', 3]);
      ctx.body = compacted;
    }
  }
}
```

---

### Try to keep the nomenclature consistent

Nomenclature is not enforced with an iron fist, but if we work to the same conventions across builds, our code becomes much easier to share and understand.  Please try to use the conventions below wherever using the [Dependency Manager](DependencyManager.md):

[Model](Model.md) files should have their first letter capitalised, and when declared, they should be assigned to a capitalised variable of the same name:

```javascript
const Book = $('Book');
```

[Services](Service.md) and [Validators](Model.md) files should have the first letter of their file names capitalised.  However, because they are considered to be instances rather than modelled objects, they should be assigned to "camelCase" variables as below:

```javascript
const bookService = $('BookService');
const bookValidator = $('BookValidator');
```

when assigning [Static Resources](DMStaticResources.md) to a variable, it is encouraged to prefix the variable name with an underscore:

```javascript
const _enums = $(':enums');
const _echo =  $(':echo');
```

---

### Be Wary of Calling the Dependency Manager repeatedly when a variable assignment will do

Much like JQuery, it is a good idea to assign your Dependency Manager calls to variable at the top of your module export rather than having them occur repeatedly.  Calls to the Dependency Manager (particularly calls to models) are computationally expensive.  Be very careful to **avoid** writing code like the below:

```javascript
$(':async').each(
  ['Foo','Bar'], // the array to iterate over
  async (name) => { // use the async library's each method to iterate over array
    await new $('Sample')({ name: `My name is: ${name}` }).save();
});
```

The above would be better expressed as:

```javascript
const Sample = $('Sample');
...
await _async.each(
  ['Foo','Bar'], // the array to iterate over
  async (name) => { // use the async library's each method to iterate over array
  await new Sample({ name: `My name is: ${name}` }).save();
});
```

---

### Only put non-sensitive data in the Public folder

If it's in the Public folder it's available to the world at large.  **Co.Koa** uses [koa-static](npmjs.com/koa-static) under the hood, feel free to serve your own custom static assets.

---

### If all else fails, defer to app.js

`app.js` exposes the [Koa](npmjs.com/koa) modules' `app` object via `coKoa.app`.  If you're struggling to implement [middleware](Config.md) via `./config/middleware.js`, you can inject your middleware within `app.js` itself.  Bear in mind that any middleware implemented in this fashion will be triggered **after** the middleware within `./config/middleware.js`.
