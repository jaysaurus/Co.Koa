module.exports = function (env, logSpy = []) {
  this.log = (message) => {
    switch (env) {
      case 'development':
        console.log(`[Jay - ${new Date()}] ${message}`);
        break;
      case 'test':
        logSpy.push(message);
        break;
      case process.env.NODE_ENV:
        // TODO Live logs go here.
    }
  };
};
