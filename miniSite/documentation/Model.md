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
* [Dependency Manager](DependencyManager.md)
* Model
* [Service](Service.md)
* [View](View.md)

## Models

Models are effectively window dressing for mongoose's framework.  Out of the box, Mongoose can get a little confusing; different mechanisms are supplied to it in different places.  **Co.Koa** tries to mitigate some of the complexity by allowing you to declare all the possible objects Mongoose expects in one discrete collection of objects:

```javascript
module.exports = function SomeModel ($) {
  return {
    schema: {},  // <- Model details go here
    /* ------ OPTIONAL COMPONENTS ----- */
    index: {}, // <- custom indexes
    methods: {}, // <- custom Model instance methods
    options: {}, // <- mongoose optional configurations
    statics: {}, // <- custom Model static methods
    virtuals: {} // <- getters and setters for virtual fields
  };
};
```

With [co-koa-cli](https://npmjs.com/co-koa-cli) installed, you can install a fresh model template by typing `co-koa-cli --createModel <ModelName>` in your project's root directory. (do not append the name with the word "service!")

---

### Foreign Keys

Mongoose tends toward embedded documents for many situations.  However, there may come times where you wish to associate 2 separate collections.  To do so, you do not have to define the type in your schema as `ObjectId` by loading in a Mongoose reference.  **Co.Koa** will inject the dependency on your behalf.  All you need to do is set your type to one of 3 preferred types: "ForeignKey", "FK" or "ObjectId".  For example:

```JavaScript
authors: [{
  type: 'ForeignKey',
  ref: 'Author'
}]
```

It's that simple, **Co.Koa** does the rest!

---

### Custom Types

To add a custom data type to your Mongoose models, you need only create a new type file in the `./api/models/types` folder.  Files within this folder should be suffixed with the word "Type" (e.g. `SampleType.js`).  The only thing required is the cast object. If we borrow the custom type example from the [Mongoose documentation](http://mongoosejs.com/docs/customschematypes.html), you can define the `Int8` as a type by creating an `Int8Type.js` file and entering a "cast" method within it:

```javascript
module.exports = function Int8 (val) {
      var _val = Number(val);
      if (isNaN(_val)) {
        throw new Error('Int8: ' + val + ' is not a number');
      }
      _val = Math.round(_val);
      if (_val < -0x80 || _val > 0x7F) {
        throw new Error('Int8: ' + val +
          ' is outside of the range of valid 8-bit ints');
      }
      return _val;
    };
```

The name of the file dictates the type name used by your Mongoose models.  `type: 'Int8'` will be available across your models thereafter.

---

### validators

Validators can be decoupled into the validators folder.  Their file names must be suffixed with the word `Validator`; for example: `SampleValidator.js`.  A Validator file should export a function that takes the [Dependency Manager](https://DependencyManager.md) as its only argument:

```javascript
module.exports = function ($) {
  const validator = {};
  ... // custom validation logic
  return validator;
};
```

Your vaildators are exposed dynamically wherever the [Dependency Manager](https://DependencyManager.md) is exposed.  Primarily, they are designed to help decouple your model logic (though they may be used elsewhere as well).  For example, given a "Book" model, perhaps you'd like to have a `BookeValidator.js` validate things like incoming book records' ISBN numbers:

```javascript
module.exports = function Book ($) {
  const bookValidator = $('BookValidator');
  return {
    schema: {
      isbn: {
        trim: true,
        type: String,
        validate: bookValidator.isValidISBN()
      }
    }
  }
}
```

Please see [Mongoose's validation documentation](http://mongoosejs.com/docs/validation.html) for more information.

---

### More Information

Since the overwhelming majority of **Co.Koa's** model implementation is based on Mongoose's default behaviour, please visit its [documentation website](http://mongoosejs.com/docs/guide.html) for more information.