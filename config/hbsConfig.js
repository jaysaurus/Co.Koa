module.exports = (conf) => {
  const bluebird = require('bluebird');
  return {
    // cacheExpires: 60,
    // contentTag: 'content',
    defaultLayout: 'default',
    environment: conf.environment,
    extension: '.hbs',
    paths: {
      views: `${conf.root}/api/views`,
      layouts: `${conf.root}/api/views/layouts`,
      partials: `${conf.root}/api/views/partials`,
      helpers: `${conf.root}/api/views/helpers`
    },
    Promise: bluebird
  };
};
