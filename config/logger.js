module.exports = (env, errorHandler) => {
  return ['error', 'log'].reduce((obj, method) => {
    return Object.assign(obj, { [method] (message, spy) {
      switch (env) {
        case 'development':
          // e.g. set up console.log() and console.error with an embellishment
          console[method](`[${new Date()}] ${message}`);
          break;
        case 'test':
          // e.g. test can be used to write to a file/log to an observer etc.
          if (spy && typeof spy === 'object') spy.push(message);
          break;
        case 'production':
          // Live logging goes here.
          break;
        default:
          errorHandler();
      }
    }
    });
  }, {});
};
