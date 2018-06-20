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

**Note** When you install Co.Koa with CLI@1.3.0 or higher, you Co.Koa instance will come installed with the mongoose plugin.  This can easily be removed should you wish (just remove the plugin from app.js and delete the dependency from your package.json).  The following document assumes you want to use the mongoose plugin to some degree; whether you will be writing your own plugin or using mongoose, it may be useful to read the below to get a feel for the way Co.Koa ticks.

## Models

The Models associated with the co-koa-mongoose-plugin are effectively window dressing for mongoose's framework.  Out of the box, Mongoose models and schemas can get a little confusing; different mechanisms are supplied to mongoose in different places.  Co.Koa tries to mitigate some of the complexity by allowing you to declare all the possible objects Mongoose expects in one discrete collection of objects:

```javascript
module.exports = function SomeModel ($) {
  return {
    _modelType: 'mongoose',
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

Using [co-koa-cli](https://npmjs.com/co-koa-cli), you can install a fresh model template by typing `co-koa-cli --createModel <ModelName>` in your project's root directory. (do not append the name with the word "Model"!)

---

### Foreign Keys

Mongoose tends toward embedded documents for many situations.  However, there may be times where you wish to associate 2 separate collections.  To do so, you do not have to define the type in your schema as `ObjectId` by loading in a Mongoose reference.  Co.Koa can inject the dependency on your behalf.  All you need to do is set your type to one of 3 preferred placeholder names: "ForeignKey", "FK" or "ObjectId".  For example:

```JavaScript
authors: [{
  type: 'ForeignKey',
  ref: 'Author'
}]
```

It's that simple, Co.Koa will wire up the reference when the application is launched!

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

Your vaildators are exposed dynamically wherever the [Dependency Manager](https://DependencyManager.md) is exposed.  Primarily, they are designed to help decouple your model logic (though they may be used elsewhere as well).  For example, given a "Book" model, perhaps you'd like to have a `BookValidator.js` validate things like incoming book records' ISBN numbers:

```javascript
module.exports = function Book ($) {
  const bookValidator = $('BookValidator');
  return {
    _modelType: 'mongoose',
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

### Hooks
As of `co-koa-mongoose-plugin`@1.4.0, Co.Koa's mongoose plugin now supports [hooks](http://mongoosejs.com/docs/middleware.html).  The syntax is to define either or both a `pre` and/or `post` and supply said object(s) with document middleware methods as below:
```
    init
    validate
    save
    remove
```
and query middleware methods:
```
    count
    find
    findOne
    findOneAndRemove
    findOneAndUpdate
    update
```
Thus a pre-save action should be set out as below:

```javascript
module.exports = function Book ($) {
  const bookValidator = $('BookValidator');
  return {
    _modelType: 'mongoose',
    schema: {
      ...
      hooks: {
        pre: {
          async save (next) {
            ... // your pre-save action here
            next();
          }
        }
        post: {

        }
      }
...
```
For more information on Mongoose middleware hooks, please visit the [Mongoose Documentation](http://mongoosejs.com/docs/middleware.html).  Please also see the [Dependency Manager Caveat Notes](http://cokoajs.com/miniSite/documentation/DMDynamicResources.html#caveats) for some inspiration!

---

### Virtuals
Virtuals behave exactly as they would if supplied to a mongoose schema. Simply add an object to a model's virtuals object and supply it a get and/or set method:

```javascript
module.exports = function Author ($) {
  return {
    _modelType: 'mongoose',
    schema: {
      firstName: String,
      lastName: String
    },
    /* ------ OPTIONAL COMPONENTS ----- */
    virtuals: {
      fullName: {
        get () { return `${this.lastName}, ${this.firstName}`; },
        set (name) {
          const fullName = name.split(' ');
          this.firstName = fullName[0];
          this.lastName = fullName[1];
          return this;
        }
      }
    }
  };
};
```
thus, a virtual property is associated with your model
```javascript
module.exports = function BookService ($) {
  const Author = $('Author');

  return {
    async createAuthor () {
      const author = await new Author({
        name: 'J.K Rowling' }).save();
      return author;
    }
  };
};
```
---

### Nested schemas

as of `co-koa-mongoose-plugin`@^1.8.0 you can now nest schemas within other schemas by supplying the model you wish to nest with a `_nest` property assigned a number:

```javascript
module.exports = function Foo ($) {
  return {
    _modelType: 'mongoose',
    _nest: 0,
    schema: { ...
  ...
```
To make a schema available for nesting within other schemas, it must be initialised by mongoose **prior** to any schemas you'd like to assign it to.  To represent the order in which nested schemas are defined, therefore, the _nest property number explicitly allows you to set the order in which specific schemas are initialised.

So if, for example, we wanted to nest schema `Foo` within schema `Bar`. And we wanted to nest `Bar` in schema `Baz`...  `Foo` would need a **lower** number than `Bar`, while `Baz` - at least in this example - wouldn't need a _nest property at all

```JavaScript
Foo: { _nest: 0 }
Bar: { _nest: 10 }
Baz: {} // if a model doesn't have a _nest property, it'll run AFTER all models with a _nest property
```
**note.** It is advised that you leave space between schema `_nest` numbers to help future-proof your build.

To tell mongoose to assign a nested schema to a schema, simply defined a string with the nomenclature `"nested:<SchemaName>"`.  For example, using the Baz analogy above, Bar could be assigned as below:

```javascript
module.exports = function Foo ($) {
  return {
    _modelType: 'mongoose',
    _nest: 0,
    schema: {
      bar: 'nested:Bar'
      ...
    }
    ...
  }
}
```

`"nested:<SchemaName>"` is a place holder, so it can be used with arrays, sub-documents and so on.

```javascript
schema: {
  foos: ['nested:Foo'],
  subDoc: {
    subSubDoc: {
      bar: 'nested:Bar'
    }
  }
  ...
```

Try to keep track of your nest order.  A schema of `_nest: 0` cannot contain a schema of `_nest: 10`!  Likewise, 2 schemas cannot contain the same `_nest` number (which could result in undesireable behaviour).

---

### Additional DependencyManager callback

as of `co-koa-mongoose-plugin`@^1.6.0, the plugin supplies the  dependency manager with a callback enabling you to access Mongoose's `Types` object.  simply by calling `$.getMongooseTypes()` wherever the DependencyManager is exposed.

### More Information

Since the overwhelming majority of **Co.Koa's** mongoose plugin implementation is based on Mongoose's default behaviour, please visit the [Mongoose documentation website](http://mongoosejs.com/docs/guide.html) for more information.

### shipping other ORMs and data persistence services

The future for Co.Koa is looking bright for Co.Koa!  As of @1.7.0 and higher, the intention is to make Co.Koa's model behaviour entirely open to those who wish to use it.  In theory, you can integrate as many different APIs and services as you like.  Please keep an eye on the [Plugin documentation](Plugins.md) for information on how to introduce other data sources into the blend.
