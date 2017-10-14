# Co.Koa 0.2.0a4
An opinionated MVC; inspired by Grails MVC, written for Koa.

**Co.Koa** obeys convention over configuration. It is the fruit of a number of years of study and industry work with MVC products. **Co.Koa's** greatest strength comes in its implementation of Dependency Management.  Controllers, Models and Services are each supplied with a powerful callback that reads and feels like a JQuery call.  No need to worry about requiring reams of files from across your project.  This build is currently early alpha and, as such, available here for research and interest purposes.

Comprehensive documentation will evolve over time.

## Structure


## Dependency Injection


## Model
Here's an example of a simple model
```javascript
module.exports = function Sample ($) {  
  const _schema = $(':schema');   
  const Schema = _schema.create({    
    name: {
      type: String,
      trim: true,
      default: '(Unnamed Sample)'
    }
  });
  return Schema;
};
```
let's run through it line by line:
* `function Sample ($) {` convention dictates that your function should be given the name of your model (e.g. "Sample"). Your function *must* be defined with the $ argument.
* `const _schema = $(':schema');` tells the project to require an encapsulated version of Mongoose's schema. the ':' prefix tells us that we're loading a 'token' resource.  Token resources should always be assigned to variables prefixed with an underscore; thus, `const _schema`.
* `_schema.create` returns a new mongoose Schema instance
* `name: { ... }` is a standard mongoose Schema object
* `return Schema;` should always appear at the bottom of your function

## Controller

## Views
**Co.Koa** Supports handlebars .hbs; this is a work in progress (I'm currently awaiting an update to koa-hbs-renderer so it can implement support for multiple helpers in one file) but should be available soon.  More details to follows

## To Do
- [x] Controller Implementation
- [x] Model Implementation
- [x] Dependency Injection Implementation
- [x] Support for Jest testing
- [ ] Support for Gulp build and asset management
- [ ] Command line interface
- [ ] Incorporate asset management tools (Grunt)
- [ ] Enable view support for .hbs

Co.Koa will implement Grunt for asset management
