module.exports = ['development', 'test', 'production'].reduce(
  (obj, environment) => {
    switch (environment) {
      case 'development':
      case 'test':
        return Object.assign(obj, { [environment]: {
          'css': '/public/css',
          'html': '/public/html',
          'img': '/public/images',
          'js': '/public/js'
        } });
      case 'production':
        return Object.assign(obj, { [environment]: {
          'css': '/.min/css',
          'html': '/public/html',
          'img': '/public/images',
          'js': '/.min/js'
        } });
    }
  }, {});
