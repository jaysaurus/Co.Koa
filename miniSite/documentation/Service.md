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
* [Model](Model.md)
* Service
* [View](View.md)

## Services

Services allow us to separate our business concerns from the nuts and bolts of serving data to users/storing data to the database.  Services sit between Models and Controllers as below:

{% raw %}
```
  model
    ↑
    ↓
 Service
    ↑
    ↓
Controller
```
{% endraw %}

Choosing when to use services to manage business logic and when to use Model methods is at the client's discretion.  One tactic is to think about what real life problem you are trying to solve.

For example, consider a book distributor who has set up a `Publisher` model and a `/Publisher/NewBook` controller action.  The action is used by publishers to alert the system to that they have published a new book.  Perhaps the distributer has a series of complex logic it performs in this situation; and maybe that could be stored in one call.  In this instance, the logic could be expressed by defining the model method: `Publisher.publish()`.  

That said, what if calling `Publisher.publish()` is only one of a number of tasks that need performing when `/Publisher/NewBook` is requested?  Maybe a bunch of stakeholders need to be informed as well.  It doesn't read well recording this behaviour in Publisher.publish(); it's a separate concern! Likewise, we don't want to store the extra logic in a controller action; in so doing we would be adding business logic to our system's logic.  The actions within a controller should route requests and send responses.  It would be better therefore to have a service method call `Publisher.publish()` and the Book Store logic: `PublisherService.handleNewBookRequest()`:

```javascript
module.exports = function PublisherService ($) {
  const Book = $('Book');
  const Publisher = $('Publisher');

  return {
    async handleNewBookRequest () {
      try {
        const published = await Publisher.publish({ bookTitle: 'Co.Koa Rocks!' });
        if (published) {
          ... // notify interested bookstores
        }
        return true;
      } catch (e) {
        ...
        return false;
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

With [co-koa-cli](https://npmjs.com/co-koa-cli) installed, you can create a fresh service template by typing `co-koa-cli --createService <ServiceName>` in your project's root directory. (do not append the name with the word "service!")
