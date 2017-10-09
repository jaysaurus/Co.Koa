# Co.Koa 0.2.0a1
An opinionated MVC; inspired by Grails MVC, written for Koa. 

**Co.Koa** obeys convention over configuration. It is the fruit of a number of years of study and industry work with MVC products. **Co.Koa's** greatest strength comes in its implementation of Dependency Management.  Controllers, Models and Services are each supplied with a powerful callback that reads and feels like a JQuery call.  No need to worry about requiring reams of files from across your project.  This build is currently early alpha and, as such, available here for research and interest purposes.

Comprehensive documentation will evolve over time.

## Structure


## Dependency Injection


## Model
Here's an example of a simple model
```javascript
module.exports = function Sample ($) {  
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

## Controller

## Views
Co.Koa does not currently support views. It may support a basic implementation of handlebars in due course, though I favour implementing something with a pure API and static resources

## To Do
- [x] Controller Implementation
- [x] Model Implementation
- [x] Dependency Injection Implementation
- [x] Support for Jest testing
- [ ] Support for Grunt asset management
- [ ] Command line interface
- [ ] Incorporate asset management tools (Grunt)
- [ ] Enable view support for .ejs

Co.Koa will implement Grunt for asset management
