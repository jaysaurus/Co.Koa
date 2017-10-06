module.exports = function EchoHandler (echoObject, logger) {
  const getEcho = (name, ...args) => {
    try {
      const echo = echoObject;
      if (parseParams(echo, name)) {
        return echo[name].replace(/{(\d+)}/g, (match, number) => {
          return typeof args[number] !== 'undefined'
            ? args[number]
            : match;
        });
      } else throw new Error('could not find message');
    } catch (e) {
      return e.message;
    }
  };

  const parseParams = (echo, name) => {
    return typeof echo === 'object' &&
      typeof name === 'string' &&
      echo.hasOwnProperty(name);
  };

  this.log = (name, ...args) => {
    logger.log(getEcho(name, ...args));
  };
  this.raw = (name, ...args) => {
    return getEcho(name, ...args);
  };
  this.throw = (name, ...args) => {
    throw new Error(getEcho(name, ...args));
  };
};
