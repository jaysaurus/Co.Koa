

## DependencyManager:
### Static Resources

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

---

<table>
<tr>
<td>
```
$(':echo')
```
</td>
<td>
Exposes the [echo-handler](http://npmjs.com/echo-handler) NPM module
</td>
</tr>
</table>

The echo call Will load messages based on the folder location specified in `config/logger.js` (see the [config](Config.md) documentation).

**example**
You have your default language set as 'en' in `./config/config.json` and a json file called `en.test.json` in your `./i18n` folder with the following content:

```json
{
  "hello": "hello world!"
}
```

you can load the file and call this message wherever DependencyManager is exposed as below:

```javascript
  const echoEn = $(':echo').load('test'); // load ./i18n/en.test.json
  echoEn.log('hello'); // log with logger.log()
  echoEn.error('hello'); // log with logger.error()
  echoEn.raw('hello'); // return the message as a string
  echoEn.throw('hello'); // throw an error with the supplied message
```

Using the default `./config/logger.js` configuration; running the call in a test environment, you can supply the log/error calls with an observer:

```javascript
  const echoEn = $(':echo').load('test'); // load ./i18n/en.test.json
  const observer = [];
  echoEn.log('hello', observer); // push hello message to observer
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
const echoEs = $(':echo').load('test', 'es');
echoEs.log('hello'); // will log '¡hola todo el mundo!'
```

---

<table>
<tr>
<td>
```
$(':enums')
```
</td>
<td>
returns `./api/Enums.js`
</td>
</tr>
</table>

---

<table>
<tr>
<td>
```
$(':tree')
```
</td>
<td>
returns a stack-tree algorithm that can be used to iterate through object trees.
</td>
</tr>
</table>
