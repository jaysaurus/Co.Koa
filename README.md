<link rel='stylesheet' type='text/css' href='style.css' />
<table class="headerTable">
<tr class="headerTR">
<td class="headerTD">
<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">Home</a> |
<a title="Documentation" href="https://jaysaurus.github.io/Co.Koa/miniSite/Documentation.html">Documentation</a> |
<a title="co-koa-core on github" href="https://github.com/jaysaurus/co-koa-core">Core</a> |
<a title="co-koa-cli on github" href="https://github.com/jaysaurus/co-koa-cli">CLI</a> |
<a href="https://github.com/jaysaurus/Co.Koa/wiki/Installation-&-Execution">Install</a>
</td>
</tr>
</table>
<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">
<img alt="Co.Koa header" title="Co.Koa" style="margin: 0 15%; width: 70%" src="https://raw.githubusercontent.com/jaysaurus/Co.Koa/master/siteStrapCoKoa.png?sanitize=true" />
</a>

**<a href="https://github.com/jaysaurus/co-koa-core" target="_blank">co-koa-core</a> module status**

[![Build Status](https://travis-ci.org/jaysaurus/co-koa-core.svg?branch=master)](https://travis-ci.org/jaysaurus/co-koa-core)
[![Coverage Status](https://coveralls.io/repos/github/jaysaurus/co-koa-core/badge.svg?branch=master)](https://coveralls.io/github/jaysaurus/co-koa-core?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/jaysaurus/co-koa-core.svg)](https://greenkeeper.io/)
[![Test for Vulnerabilities](https://snyk.io/test/github/jaysaurus/co-koa-core/badge.svg)](https://snyk.io/test/github/jaysaurus/co-koa-core)

**<a href="https://github.com/jaysaurus/co-koa-cli" target="_blank">co-koa-cli</a> module status**

[![Build Status](https://travis-ci.org/jaysaurus/co-koa-cli.svg?branch=master)](https://travis-ci.org/jaysaurus/co-koa-cli)
[![Coverage Status](https://coveralls.io/repos/github/jaysaurus/co-koa-cli/badge.svg?branch=master)](https://coveralls.io/github/jaysaurus/co-koa-cli?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/jaysaurus/co-koa-cli.svg)](https://greenkeeper.io/)
[![Test for Vulnerabilities](https://snyk.io/test/github/jaysaurus/co-koa-cli/badge.svg)](https://snyk.io/test/github/jaysaurus/co-koa-cli)

---

An opinionated MVC; inspired by [Grails](https://grails.org/) MVC, written for Koa with optional support for MongoDB (via [mongoose](http://mongoosejs.com/)) and [Handlebars](http://handlebarsjs.com/) (HBS).

**Co.Koa** obeys convention over configuration. It is the fruit of a number of years of study and industry work with MVC products. **Co.Koa's** greatest strength comes in its implementation of Dependency Management.  Controllers, Models and Services are each supplied with a powerful callback that reads and feels like a JQuery call.  No need to worry about requiring reams of files from across your project.

**Note on release ^1.2.0** if you installed Co.Koa with a version of co-koa-cli prior to 1.2.0 and wish to use co-koa-core@1.2.0 or higher, simply add `"useMongoose":true` to your `config.json`.
---

## Structure & Installation
To install Co.Koa please visit: the <a href="https://github.com/jaysaurus/Co.Koa/wiki/Installation-&-Execution">wiki installation page</a>

Co.Koa's directory structure is as below
```
\api\controllers
    \models
    \services
    \views\helpers
          \layouts
          \partials
\config
\i18n
\node_modules
```
at the root of the project is an `app.js` file that loads in the `co-koa-core` module and configures it accordingly.

## Dependency Management
Nearly every component in the Co.Koa toolchain is supplied a Dependency Management tool (signified by a `$`).  The Dependency Management tool allows you to - among other things - easily load in Models, Services and Controllers.

Controllers, Models and their associated Services are all designed around the following boilerplate:
```javascript
module.exports = function ($) {
  return {};
};
```

**Example**
Suppose we are using Co.Koa's mongoose functionality OOB; and we have a `Book` document (table) in our Mongo database, modelled within our Co.Koa project.  Furthermore, let's suppose we've setup a `BookService` that supports our controllers' interactions with the `Book` model.  To expose the `Book` mongoose model within our `Bookservice` we simply do as below:
```javascript
module.exports = function BookService ($) {
  const Book = $('Book');
  return {
    const book = new Book({ ... }).save();
    ...
  };
};
```

Perhaps a `BookController` model would like access to the `BookService`; simple!
```javascript
module.exports = function BookController ($) {
  const bookService = $('BookService');
  return {
    ...
  };
};
```
not a `require` or `import` statement in sight! Everything is routed for you under the hood thanks to Dependency Management!

## Models
Co.Koa models are a pragmatic concept. Out of the box, they're simply a light-touch abstraction of mongoose Schemas; featuring all the components one would expect to find therein.  However, you can easily switch mongoose off and roll out your own persistence mechanisms with Co.Koa's plugin functionality (using local Databases and ORMs, serverless configurations or whatever!)

For the OOB Mongoose approach, you're dealing with the same mongoose API you already know, only you're not having to worry about requirements and which object goes where! Thus, you need only defer to mongoose API's own documentation to know what a component does!

Continuing our example from above let's contrive simple `Book` and `Author` models.

**Book**
```javascript
module.exports = function Book ($) {
  const Author = $('Author'); // load the Author mongoose model, used in the public method defined below.

  return {
    schema: { // represents the mongoose schema like-for-like
      Accredited: {
        authors: [{
          type: 'ForeignKey', // also supprots the keywords 'FK' or 'ObjectId'.  Co.Koa will replace these 3 with the correct reference ObjectId on load!
          ref: 'Author'
        }]
      },
      title: {
        type: String,
        trim: true,
        default: '(Unnamed Book)'
      }
    },
    /* ------ OPTIONAL COMPONENTS ----- */
    index: { // mongoose secondary indexes
      title: 1,
      Accredited: -1
    },
    methods: { // public methods
      async findAssociatedAuthor () {
        const author = await Author.findById(this._doc.Accredited.authors[0]);
        return author;
      }
    },
    options: { runSettersOnQuery: true }, // mongoose options
    statics: { // Static methods
      async findCompleteReferenceByTitle (title) {
        const book = await this.findOne({ title });
        const author = await book.findAssociatedAuthor();
        return Object.assign({}, book._doc, { Accredited: { authors: [author._doc] } });
      }
    }
  };
};
```

observe that Co.Koa fully supports (and strongly encourages) `await/async` throughout!  No more callback hell! No more hefty promise statements! Just easy-to-read and powerful code!

**Author**
```javascript
module.exports = function Author ($) {
  return {
    schema: {
      firstName: String,
      lastName: String
    },
    /* ------ OPTIONAL COMPONENTS ----- */
    virtuals: { // virtuals behave exactly as they would if supplied to a mongoose schema
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

## Controllers
Controllers are also a piece of cake.  Under the hood, your controllers are routed by koa-router (https://www.npmjs.com/package/koa-router).

Continuing with our Bookish theme, let's look at a contrived book example:
```javascript
'use strict';

module.exports = function BookController ($) {
  const Book = $('Book');
  const bookService = $('BookService');

  return {
    'GET /:id': async (ctx) => { // uri = Book/:id (':id' is variable)
      const book = await Book.findById(ctx.params.id); // ctx.params.id contains the ":id" variable
      ctx.body = book;
    },
    'GET /Author': async (ctx) => { // uri = Book/Author
      const book = await Book.find({ title: 'Harry Potter and the Philosopher\'s Stone' });
      const author = await book[0].findAssociatedAuthor();
      ctx.body = author;
    },
    'GET /HarryPotter': async (ctx) => { // Book/HarryPotter
      const harryPotter = await Book.findCompleteReferenceByTitle('Harry Potter and the Philosopher\'s Stone');
      ctx.body = harryPotter;
    }
  };
};
```

## Services
Services allow you to decouple your business logic from your application's logic. Ideally, we want to keep controller logic svelte; and some code just doesn't sit right in a model method.  As we saw in the `BookController` example above **Co.Koa** exposes services via the `$` DependencyManager. Let's continue the book theme by contriving `BookService.js` in `api\services`:
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

**Co.Koa** will sort out the requirements for you! The service is exposed via the `$` DependencyManager in your controllers, models and other services as `$('BookService')`.

## Views
**Co.Koa** Supports the handlebars .hbs extension using "koa-hbs-renderer" (https://www.npmjs.com/package/koa-hbs-renderer). supply your views, helpers, layouts and partials within the directories indicated below:
```
\api\views\helpers
          \layouts
          \partials
```

rendering .hbs is simple and powerful; suppose we have a view called `SampleView.hbs` saved in the  `\api\views` directory.  The view is expecting a single variable called `action` to be passed to it:

{% raw %}
```hbs
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en"><head></head>
<body> <p>I'm a view, I was called by the action: {{action}}</p> </body>
</html>
```
{% endraw %}

If we add the following to `BookController`, we're good to go!
```javascript
'GET /HBSDemo': async (ctx) => {
  await ctx.render('SampleView', { action: '/HBSDemo' });
}
```
you can add custom helpers with ease! for example, maybe you want to make hbs files handle more complex conditional statements.  No prob, suppose we have a file saved at `\api\views\helpers\CK.js`:
```javascript
module.exports = {
  eq: (foo, bar) => foo === bar,
  ne: (foo, bar) => foo !== bar,
  lt: (foo, bar) => foo < bar,
  gt: (foo, bar) => foo > bar,
  lte: (foo, bar) => foo <= bar,
  gte: (foo, bar) => foo >= bar,
  and: (foo, bar) => foo && bar,
  or: (foo, bar) => foo || bar
};
```

now your .hbs file can use custom logic!

{% raw %}
```hbs
<ul>
  <li>
    {{#if (CK_and (CK_eq parent 'PartialSample')
                  (CK_ne parent 'SampleView')) }}
      I am the product of an "if" condition using embedded operands!
    {{else}}
      I am the product of an "else" condition
    {{/if}}
  </li>
</ul>
```
{% endraw %}

Note that your helpers are prefixed with `CK_`. Co.Koa uses `koa-hbs-renderer`.  For more information please navigate to the <a href="https://github.com/ConnorWiseman/koa-hbs-renderer/">koa-hbs-renderer github</a>.  For more information on how to use Handlebars, please visit: http://handlebarsjs.com/

## Vue Integration
Co.koa now ships with `@koa/cors` and will very happily interface with a vue instance in tow.  With the release of [co-koa-cli](https://npmjs.com/co-koa-cli)@1.0.0 [VueJS](https://vuejs.org/) is easy to ship as your development front end!  For more information please visit the [CoKoa Documentation](http://cokoajs.com/miniSite/documentation/VueIntegration.html)
