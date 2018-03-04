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

## Vue Integration
Co.koa will very happily interface with a vue instance in tow.  With the release of [co-koa-cli](https://npmjs.com/co-koa-cli)@1.0.0 [VueJS](https://vuejs.org/) is easy to ship as your development front end.

**Note** the following installation assumes prior knowledge of the Vue CLI, please visit [VueJS](https://vuejs.org/) for more information.
#### Installation
Install Co.Koa as normal using the latest implementation of [co-koa-cli](https://npmjs.com/co-koa-cli).  Don't forget to run npm install! Navigate to your project's `./public` folder.  run `vue init webpack` (or equivalent command) and follow the instructions provided by the CLI.

Once installation has finished, navigate back to your project's root folder and simply type `npm run dev-with-vue`.  Co.Koa will launch first, followed by the Vue dev server! You can access your Vue instances as normal via http://localhost:8080 and communicate with Co.Koa via http://localhost:3000 (or whatever port you've specified in Co.Koa's [config.json](Config.md))

#### Accessing Vue's Command Line Tools
Co.Koa now exposes any scripts in your public folder from its base directory by running `npm run public [command in your public folder]`.  That means that rather than having to run VueJS commands in your public folder you can simply run them while in your Co.Koa project folder.
