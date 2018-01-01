[Home](https://jaysaurus.github.io/Co.Koa) | Documentation | <a title="co-koa-core on github" href="https://github.com/jaysaurus/co-koa-core">Core</a> | <a title="co-koa-cli on github" href="https://github.com/jaysaurus/co-koa-cli">CLI</a>

* [Config](Config.md)
* [Controller](Controller.md)
* Dependency Manager
* [Model](Model.md)
* [Service](Service.md)
* [View](View.md)

## Dependency Manager

The Dependency Manager is kind of a Swiss-Army knife of useful interrelated tools. It is exposed throughout Co.Koa; controllers, services, models and middleware all have access to the Dependency Manager courtesy of the supplied `$` parameter.

The Dependency Manager breaks down into 3 use categories:

### Static Resources

prefixing your argument string with ':' tells Co.Koa you are requesting a static resource of some kind.  At the time of writing, the following resources are available:

<table>
<tr>
<td>
```
$(':async')
```
</td>
<td>
Exposes await/async-friendly .each() and .reduce() methods.
</td>
</tr>
</table>

You will likely be familiar with [`.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) and [`.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) closures.  Unfortunately, using `await/async` in ecma 8+ is merely syntactic sugar disguising an underlying `promise` methodology.  Therefore, if you use JavaScript's traditional `.forEach()` and `.reduce()` methods on asynchronous calls you probably wont get the results you're after.  The async call resolves this issue as illustrated in the contrived example below.

Suppose you want to create a couple of `Sample` objects; assigning each a distinct name:

```javascript
const _async = $(':async'); // retrieve the async library
const Sample = $('Sample');
await _async.each(
  ['Foo','Bar'], // the array to iterate over
  async (name) => { // use the async library's each method to iterate over array
  await new Sample({ name: `My name is: ${name}` }).save();
});
```

perhaps you'd like to return a count as well, for this we could employ `_async.reduce()`.  The syntax should look familiar:

```javascript
const _async = $(':async'); // retrieve the async library
const Sample = $('Sample');
const count = await _async.reduce(
  ['Foo','Bar'], // the array to iterate over
  async (i, name) => { // use the async library's each method to iterate over array
  await new Sample({ name: `My name is: ${name}` }).save();
  return ++i; // i must be returned at the end of this function.
  },
  0 // the number to count assigned to 'i' in the function above.
);
$.logger.log(count == 2);
```
