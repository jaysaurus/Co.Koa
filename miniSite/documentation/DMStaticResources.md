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

<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">Home</a> > <a title="Documentation" href="https://jaysaurus.github.io/Co.Koa/miniSite/Documentation.html">Documentation</a> > [Dependency Manager](DependencyManager.md) > Static Resources

<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">
<img alt="Co.Koa header" title="Co.Koa" style="margin: 0 15%; width: 70%" src="https://raw.githubusercontent.com/jaysaurus/Co.Koa/master/siteStrapCoKoa.png?sanitize=true" />
</a>

* [Config](Config.md)
* [Controller](Controller.md)
* [Dependency Manager](DependencyManager.md)
  * [Dynamic Resources](DMDynamicResources.md)
  * [Properties](DMProperties.md)
  * Static Resources
* [Model](Model.md)
* [Service](Service.md)
* [View](View.md)

## Dependency Manager:
### Static Resources
---
#### Assets
<table>
<tr>
<td class="tdHilight">
$(':html')
$(':css')
$(':img')
$(':js')
</td>
<td>
returns an object containing the methods <span class=".highlighter-rouge">.stream(filename)</span> (under the hood this employs <span class=".highlighter-rouge">fs.createReadStream()</span>) and <span class=".highlighter-rouge">.loadURL(fileName, fileExtension)</span>.  The `fileExtension` argument is optional (use it with images).  You can add more static assets to this list via the AssetConfig.js.
</td>
</tr>
</table>

Assets work in conjunction with their respective config.  Please the [config](Config.md) documentation for more information.

---

#### Async

<table>
<tr>
<td class="tdHilight">
$(':async')
</td>
<td>
Exposes await/async-friendly .each() and .reduce() methods.
</td>
</tr>
</table>

You will likely be familiar with [`.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) and [`.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) closures.  Unfortunately, using `await/async` in ecma 8+ is merely syntactic sugar for an underlying `promise` structure.  Therefore, if you use JavaScript's traditional `.forEach()` and `.reduce()` methods on asynchronous calls you probably wont get the results you're after.  The async call resolves this issue as illustrated in the contrived example below.

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

---

#### Echo

<table>
<tr>
<td class="tdHilight">
$(':echo')
</td>
<td>
Exposes the echo-handler NPM module
</td>
</tr>
</table>

The echo call Will load messages based on the folder location specified in `config/logger.js` (see the [config](Config.md) documentation).  See also the [echo-handler](http://npmjs.com/echo-handler) for more information.

**example**
You have your default language set as 'en' in `./config/config.json` and a json file called `en.test.json` in your `./i18n` folder with the following content:

```json
{
  "hello": "hello world!"
}
```

you can load the file and call this message wherever DependencyManager is exposed as below:

```javascript
  const _echo = $(':echo').load('test'); // load ./i18n/en.test.json
  _echo.log('hello'); // log with logger.log()
  _echo.error('hello'); // log with logger.error()
  _echo.raw('hello'); // return the message as a string
  _echo.throw('hello'); // throw an error with the supplied message
```

Using the default `./config/logger.js` configuration; running the call in a test environment, you can supply the log/error calls with an observer:

```javascript
  const _echo = $(':echo').load('test'); // load ./i18n/en.test.json
  const observer = [];
  _echo.log('hello', observer); // push hello message to observer
  // using a test framework like jest, the below would pass:
  expect(observer[0]).toBe('hello world!');
```

Most importantly, the chosen language can be decided at runtime! suppose we also had an `es.test.json` as below:

```json
{
  "hello": "¡hola todo el mundo!"
}
```

We can call this as below:

```javascript
const _echo = $(':echo').load('test', 'es');
_echo.log('hello'); // will log '¡hola todo el mundo!'
```

---

#### Enums

<table>
<tr>
<td class="tdHilight">
$(':enums')
</td>
<td>
returns `./api/Enums.js`
</td>
</tr>
</table>

Co.Koa extends mongoose's core functionality with a numeric enum type courtesy of the ['mongoose-type-number-enums'](https://www.npmjs.com/package/mongoose-type-number-enums) npm package.

**Example use:**
Let's suppose you're coding an application for a book shop.  The book shop only sells 3 formats of physical book: paperback, hardback and spiral-bound.  We could (arguably) model this logic with an enum.  JavaScript doesn't natively support the Enum type, but we could simulate something similar by adding such an enum to Co.Koa's `./api/Enums.js` file:

```javascript
module.exports = {
  BookFormats: ['PAPERBACK', 'HARDBACK', 'SPIRAL_BOUND'];
}
```

mongoose supports an enum type by default, but stores that enum as a string in the database.  However, that doesn't really fall in-line with the "C-like" conventions we might expect.  Co.Koa supports mongoose's default enums, but encourages the definition of numeric integers as below:

```javascript
module.exports = function Book ($) {
  const _enums = $(':enums');
  return {
    schema: {
      format: {
        type: 'Enum',
        enum: _enums.BookFormats
      }
      ...
    }
    ...
  }
}
```

Subsequently, you can perform requests against that type as below:

```javascript
const _enums = $(':enums');
await new Book({
  format: _enums.BookFormats.indexOf('HARDBACK'),
  ...
}).save();
```

The database will store the index number of 'HARDBACK' (1) as type "number"

---

#### Tree

<table>
<tr>
<td class="tdHilight">
$(':tree')
</td>
<td>
returns a stack-tree algorithm that can be used to iterate through object trees.
</td>
</tr>
</table>

This is a powerful tool used by [co-koa-core](https://npmjs.come/package/co-koa-core) that has been exposed for your convenience. It is used to map mongoose ObjectIds to the place-holder types: "ForeignKey", "FK" and "ObjectId" defined by clients in their models.  You can see it in action on the [`ModelFactoryHelper`](https://github.com/jaysaurus/co-koa-core/blob/master/lib/helpers/ModelFactoryHelper.js).

suppose you have a complex object you wish to analyse:

```javascript
const dataset = {
  a: {
    a1: 'a1',
    a2: 'a2',
    a3: {
      a3_1: {
        a3_1_1: {
          a3_1_1_1: 'a3_1_1_1'
        }
      }
    }
  },
  b: {
    b1: {
      b1_1: 'b1_1',
      b1_2: 'b1_2',
      b1_3: {
        b1_3_1: 'b1_3_1',
        b1_3_2: {
          b_deep: { deeper: { deepest: 'Deep!' } }
        }
      },
      b1_4: 'b1_4'
    }
  },
  c: 'c'
};
```

The following code easily digests the above:

```javascript
const keyObserver = [];
const nodeObserver = {};
let outObserver = null;
const _tree = $(':tree');

_tree(dataset)
  .process((it) => {
    // args:
    // it._keyTree: an array of the path to the current node;
    // it._out: a pointer to the observed object.
    // it.item: the current node's value
    // it.key: the current node's key
    keyObserver.push(it._keyTree.reduce((list, i) => {
      list.push(i);
      return list;
    }, []));
    if (!outObserver) outObserver = it._out
    nodeObserver[it.key] = it.item;  
  });

console.log(keyObserver[0]) // [ 'a', 'a3', 'a3_1', 'a3_1_1' ]
console.log(keyObserver[1]) // [ 'a' ]
console.log(keyObserver[2]) // [ 'a' ]
console.log(keyObserver[3]) // [ 'b', 'b1' ]
console.log(keyObserver[4]) // [ 'b', 'b1', 'b1_3', 'b1_3_2', 'b_deep', 'deeper' ]
console.log(keyObserver[5]) // [ 'b', 'b1', 'b1_3' ]
console.log(keyObserver[6]) // [ 'b', 'b1' ]
console.log(keyObserver[7]) // [ 'b', 'b1' ]
console.log(outObserver === tree) // true
console.log(nodeObserver) // would render an object as below:

{ a3_1_1_1: 'a3_1_1_1',
        a2: 'a2',
        a1: 'a1',
        b1_4: 'b1_4',
        deepest: 'Deep!',
        b1_3_1: 'b1_3_1',
        b1_2: 'b1_2',
        b1_1: 'b1_1',
        c: 'c' }
```
