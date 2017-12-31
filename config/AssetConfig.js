module.exports = ['development', 'test', 'production'].reduce(
  (obj, environment) => {
    switch (environment) {
      case 'development':
      case 'test':
        return Object.assign(obj, { [environment]: {
          'css': '/css',
          'html': '/html',
          'img': '/images',
          'js': '/js'
        } });
      case 'production':
        return Object.assign(obj, { [environment]: {
          'css': '/.min/css',
          'html': '/html',
          'img': '/images',
          'js': '/.min/js'
        } });
    }
  }, {});
