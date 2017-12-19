# Co.Koa MVC
**These notes are a work in progress, release on NPM is pending the release of documentation**


An opinionated MVC; inspired by Grails MVC, written for Koa with support for MongoDB and Handlebars (HBS).

**Co.Koa** obeys convention over configuration. It is the fruit of a number of years of study and industry work with MVC products. **Co.Koa's** greatest strength comes in its implementation of Dependency Management.  Controllers, Models and Services are each supplied with a powerful callback that reads and feels like a JQuery call.  No need to worry about requiring reams of files from across your project.  This build is currently early alpha and, as such, available here for research and interest purposes.

Comprehensive documentation will evolve over time.

## Structure & Installation
The majority of Co.Koa focuses around the api folder ()
```
/api/controllers
    /models
    /services
    /views/helpers
          /layouts
          /partials
/config
/i18n
/node_modules
```
Setting things up is a piece of cake thanks to the Co.Koa CLI (Installation Documentation to follow)

## Dependency Injection
Nearly every component in the Co.Koa toolchain has access to a Dependency Management tool (signified by the `$` symbol supplied to each Controller, Model and Service function) via Dependency Injection.  The Dependency Management tool allows you to - among other things - easily load in Models, Services and Controllers.

Controllers, Models and their associated Services are all designed around the following basic boilerplate:

```javascript
module.exports = function ($) {
  return {};
};
```
**Example**
Suppose we have a `Book` document (table) in our Mongo database that we have modelled within our Co.Koa project.  Now suppose we have a `BookService` that supports our controllers' interactions with the `Book` model.  To expose the `Book` mongoose model within our `Bookservice` we simply do as below:

```javascript
module.exports = function BookService ($) {
  const Book = $('Book');
  return {
    ...
  };
};
```
Likewise, perhaps our `BookController` model would like access to the `BookService`; simple!

```javascript
module.exports = function BookController ($) {
  const bookService = $('BookService');
  return {
    ...
  };
};
```
not a `require` statement in sight! Everything is routed for you under the hood thanks to Dependency Management!

## Model
Co.Koa models are a light-touch abstraction of mongoose Schemas; they feature all the components one would expect to find therein.   To all intents and purposes, you're dealing with the same mongoose API you already know, only you're not having to worry about requirements and which object goes where! Thus, you need only defer to mongoose API's own documentation to know what a component does!

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
    }, // <- Model details go here
    /* ------ OPTIONAL COMPONENTS ----- */
    virtuals: { // see mongoose
      name: {
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

## Controller

## Views
**Co.Koa** Supports handlebars .hbs; this is a work in progress (I'm currently awaiting an update to koa-hbs-renderer so it can implement support for multiple helpers in one file) but should be available soon.  More details to follows

## To Do
- [x] Controller Implementation
- [x] Model Implementation (improved)
- [x] Dependency Injection Implementation
- [x] Support for Jest testing
- [x] Middleware implementation
- [ ] Support for Gulp build and asset management (sort of there)
- [x] Command line interface
- [x] Enable view support for .hbs

Co.Koa will implement Gulp for asset management
