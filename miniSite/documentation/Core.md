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

## Core Execution Order

This document briefly explains the order in which things run when a Co.Koa instance is launched:

#### 1) Core Configuration is setup

This serves to build the configurations used by the rest of co-koa-core.  The majority of the configurations are supplied to the Dependency Manager later on (though some are removed prior to client-side exposure)

#### 2) DependencyManager is initialized

The configuration is supplied to the DependencyManager object in turn

#### 3) ModelFactory is called

This initializes mongoose using your configs and any custom types you choose to supply and takes the files found in your model folder and wires them up to mongoose and the DependencyManager.

#### 4) Plugins are called

Any plugins supplied from the client to co-koa-core via `app.js` are processed here.

#### 5) Middleware is called

The built-in middleware referenced in `./config/config.json` is called, followed by any middleware supplied by the client in `./config/middleware.js`

#### 6) ControllerFactory builds controllers

Injecting each with the Dependency Manager and routing as it goes.

#### 7) Client bootstrap is called

#### 8) return

Lastly an object is returned to the client containing koa's `app`, the `port` and the `koa-router` middleware.
