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
* [Service](Service.md)
* View

## Views

View components are maintained according to the structure below:

```
./api/views/helpers
           /layouts
           /partials
```

The principal is simple: store your views in the `views` directory and your `helpers`, `layouts` and `partials` accordingly.  Views are simply an implementation of [koa-hbs-renderer](https://www.npmjs.com/package/koa-hbs-renderer); it is recommended that you explore the [koa-hbs-renderer](https://www.npmjs.com/package/koa-hbs-renderer) module, the [Handlebars](http://handlebarsjs.com/) documentation and the [HBS](https://www.npmjs.com/package/hbs) documentation to fully understand Co.Koa's views and what they can do.  Below is a simple sample:

### Requesting a View

Suppose we have a view called `SampleView.hbs` saved in the  `\api\views` directory.  The view is expecting a single variable called `action` to be passed to it:

```HTML
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en"><head></head>
<body> <p>I'm a view, I was called by the action: {{action}}</p> </body>
</html>
```

If we add the following to a controller, we're good to go!

```javascript
'GET /HBSDemo': async (ctx) => {
  await ctx.render('SampleView', { action: '/HBSDemo' });
}
```

### Helpers

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

now your `.hbs` file can use custom logic!

```HTML
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

Note that your helpers are prefixed with `CK_`.  helper methods are prefixed with their filenames (acting like a namespace).

### Layouts

Layouts, as their name suggests, are intended to layout pages. They can be useful for maintaining generic client-side JS libraries, styling, etc.  You could have a layout manage the theme of your website with something as elementary as:

```HTML
<head>
  <title>Website Title</title>
  <script ... >
  <link ... >
  ...
</head>
<h3>Website Title</h3>
{{{content}}}
```

### Partials

Cached partials allow you to modularise your HTML pages, perhaps we have a partial called `partialsSample.hbs` we would like to inject data into.  That might look as below:

```HTML
<ul>
  <li>
    {{> PartialSample parent="SampleView"}}
  </li>
</ul>
```

Our partial might look something like the following:

```HTML
I am a partial, I have been injected into view {{parent}}
<p>
  I can also inject partials into myself; I will demonstrate by putting some content in an undordered list below:
</p>
  <ul>
    <li>
      {{> PartialInnerSample parent="PartialSample"}}
    </li>
  </ul>
</div>
```

Note that the above reads the `parent` variable supplied by the view and - in turn - can be passed partials as well (for example: `PartialInnerSample`).
