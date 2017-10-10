module.exports = function AssetHandler (tokenName, conf) {
  var dir = tokenName.replace(/^:/, '');
  switch (conf.environment) {
    case 'development':
    case 'test':
    default:
      return {
        get: (file) => {
          switch (dir) {
            case 'css':
            case 'js':
            case 'html':
              return `${conf.root}/public/${dir}/${file}`;
          }
        }
      };
    case process.env.NODE_ENV:
      return 'TODO'; // uglified data goes here.
  }
};
