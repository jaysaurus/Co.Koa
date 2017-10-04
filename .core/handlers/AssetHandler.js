module.exports = function (tokenName) {
  var dir = tokenName.replace(/^:/, '');
  switch (process.ENVIRONMENT) {
    case 'development':
    case 'test':
    default:
      return {
        get: (file) => {
          switch (dir) {
            case 'css':
            case 'js':
            case 'html':
              return require(`${_root}/public/${dir}/${file}`);
          }
        }
      }
  }
};
