const _ = require('lodash');

// TODO Not currently supported.
// hbs.registerPartials(__dirname.replace('core', 'api/views/partials'));

module.exports = function (build, $, hbs) {
  build('views/tagLibs', (file) => {
    try {
      if (typeof file === 'function') {
        file = file($);
        var namespace = file.namespace ? file.namespace + '.' : '';
        if (file.tags) {
          _.each(
            file.tags,
            (name, callback) => hbs.registerHelper(namespace + name, callback));
          return;
        }
      }
      throw new Error('Unsupported file spotted in tag library');
    } catch (e) {
      process.log(
        e.message
        ? e.message
        : 'Failed to render a tag library');
    }
  });
};
