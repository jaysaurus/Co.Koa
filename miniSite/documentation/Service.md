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

<img alt="Co.Koa header" title="Co.Koa" style="margin: 0 15%; width: 70%" src="https://raw.githubusercontent.com/jaysaurus/Co.Koa/master/siteStrapCoKoa.png?sanitize=true" />

* [Config](Config.md)
* [Controller](Controller.md)
* [Dependency Manager](DependencyManager.md)
* [Model](Model.md)
* Service
* [View](View.md)

## Services

Services allow us to separate our business concerns from the nuts and bolts of serving data to users and storing data to the database.  Effectively, they sit between Models and Controllers as below:

```
  model
    ↑
    ↓
 Service
    ↑
    ↓
Controller
```

Choosing when to use services to manage business logic and when to use Model methods is at the client's discretion.  One tactic is to think out loud what the business you are trying to model is doing.

For example, consider a book distributor who has set up a `Publisher` model.  Perhaps they have a series of complex logic that can be amalgamated into one call to represent when a Publisher publishes a new book.  Maybe that logic could be expressed by defining a model method like: `Publisher.publish()`.  However, maybe calling `Publisher.publish()` is only one of a number of tasks that need performing when the book distributor calls the request `/Publisher/NewBook`.  Maybe 2 or 3 other complex tasks need writing.  We could store that in a controller action, but in so doing we are adding business logic to the system logic required to request and respond to a user's request.  It would be better to amalgamate these business tasks into `PublisherService.handleNewBookRequest()`:

```javascript
module.exports = function PublisherService ($) {
  const Publisher = $('Publisher');

  return {
    async handleNewBookRequest () {
      try {
        const published = await Publisher.publish()
        if (published) {
          ... // more tasks
        }
        return ...
      } catch (e) {
        ...
      }
    }
  };
};

```

Our controller action can be kept legible and your business logic discrete:

```javascript
module.exports = function ($) {
  const publisherService = $('PublisherService');
  return {
    async 'GET /' (ctx, next) {
      publisherService.handleNewBookRequest();
      ctx.body = 'success';
    }
  };
};
```
