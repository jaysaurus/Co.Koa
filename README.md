# Co.Koa 0.4.0
An opinionated MVC; inspired by Grails MVC, written for Koa.

**Co.Koa** obeys convention over configuration. It is the fruit of a number of years of study and industry work with MVC products. **Co.Koa's** greatest strength comes in its implementation of Dependency Management.  Controllers, Models and Services are each supplied with a powerful callback that reads and feels like a JQuery call.  No need to worry about requiring reams of files from across your project.  This build is currently early alpha and, as such, available here for research and interest purposes.

Comprehensive documentation will evolve over time.

## Structure


## Dependency Injection


## Model

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
- [ ] Command line interface
- [x] Enable view support for .hbs

Co.Koa will implement Grunt for asset management
