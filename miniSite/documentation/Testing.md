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
<img alt="Co.Koa header" title="Co.Koa" style="margin: 0 15%; width: 70%" src="https://raw.githubusercontent.com/jaysaurus/Co.Koa/master/siteStrapCoKoa.png" />
</a>

## Testing

As of [co-koa-core](https://npmjs.com/package/co-koa-core)@^1.17.0, you can add new unit and/or integration tests to your Co.Koa instance by calling:
```shell
npx co-koa-cli --createUnitTest <ItemToTest>
# or
npx co-koa-cli --createIntegrationTest <ItemToTest>
```
Both unit and integration tests utilise a test harness; the notable difference between the two being that the former neither harnesses the mongoose plugin nor exposes a running instance of the koa.app server.  

### Unit Test
Calling a model in your unit test will return the unadulterated schema rather than the model.  Unit tests like the below are limited in scope therefore.

```javascript
const testHarness = require('../app.test.harness.js');
const coKoa = testHarness.init({ type: 'unit' });
describe('Unit Test Suite For Example', async () => {
  const $ = coKoa.$
  const Example = $('Example');

  test('A unit test', async () => {
    try {

    } catch (e) {
      console.error(e.message)
    }
  });
});
```

Sometimes you will be better off manually loading a file and injecting your own mock dependencyManager:

```javascript
const exampleController = require('../api/controllers/ExampleController');

describe('Manually loaded controller') {
  const spy = [];
  const controller = exampleController(
    function (value) { // Mock dependencyManager
      switch (value) {
        case 'Example': // $('Example').findOne({ query: 'eg' });
          return { findOne (obj) { spy.push(obj); } };
      }
    })
  test('Controller action called on mock supplied with ', async () => {
    let body = {}
    await controller['GET /']({ body });
    expect(body.name).toBe('Example');
  })
}
```
### Integration Test
Integration tests are notably slower than their counterparts.   By default, each requires a server restart and will delete the contents of your test database using Jest's afterAll command.  to help prevent `EADDRESS` issues when running a number of integration tests simultaneously, each test is assigned its own port.

```javascript
const testHarness = require('../app.test.harness.js');
const coKoa = testHarness.init({ port: 3004, type: 'integration' });
describe('Integration Test Suite For Example', async () => {
  const $ = coKoa.$
  const Example = $('Example');

  test('An integration test', async () => {
    try {
      const result = await new Example({ }).save();
      expect(typeof result).toBe('object');
    } catch (e) {
      console.error(e.message)
    }
  });

  afterAll(async (done) => {
    await coKoa.app.close() // close the Koa app listener
    await testHarness.destroy(done) // (optional) empty test database
  });
});
```
Caution is advised when running Integration Tests; large batches of tests could have a significant performance overhead.  If writing a sizable number of integration tests, consider writing a test bootstrap for your project and importing multiple different tests into one file so that the database is not being created and destroyed unneccessarily.  Integration tests may also require additional configuration if working with a Continuous Integration suite.

---

the app.test.harness is visible in your project's base directory.  Should you wish to roll your own model plugin with Co.Koa, you will need to explicitly initialise it within the following block of the test.harness file:

```javascript
if (type === 'integration') {
  const harness = mongoosePlugin({
    connectionString: 'mongodb://localhost:27017/co-koa-test'
  });
  harness.init(coKoa.app, coKoa.$);
}
```
