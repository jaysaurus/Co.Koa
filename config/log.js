module.exports = {
  setLog: (env) => {
    switch (env) {
      case 'development':
        process.log = (message) => console.log(`[Jay - ${new Date()}] ${message}`);
        break;
      case 'test':
        process.logSpy = [];
        process.log = (message) => process.logSpy.push(message);
        break;
      case process.env.NODE_ENV:
        // TODO Live logs go here.
    }
  }
};
