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

## Testing

As of [co-koa-core](https://npmjs.com/package/co-koa-core)@1.13.0, Co.Koa now supports integration for jest unit tests.  a new project will contain the following example:

```javascript
const testHarness = require('../app.test.harness.js');
const coKoa = testHarness.init();
describe('Demonstrative Integration Test Suite', async () => {
  test('An integration test', async () => {
    try {
      // EXAMPLE:
      // const Example = coKoa.$('Example');
      // const eg = await new Example({ name: 'I am an example' }).save();
      // expect(typeof eg).toBe('object');
      expect('test').toBe('test');
    } catch (e) {
      console.error(e.message)
    }
  });

  afterAll((done) => {
    coKoa.app.close() // Make sure to close the Koa app listener
    testHarness.destroy(done) // optionally empty the test database
  });
});
```

the app.test.harness is visible in your base directory.
