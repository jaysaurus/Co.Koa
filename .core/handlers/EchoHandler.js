module.exports = function EchoHandler (echoObject, logger) {
  const getEcho = (name, returnErr, ...args) => {
    try {
      const echo = echoObject;
      if (echo && echo[name]) {
        if (typeof args === 'object' && args.length) {
          var splitString = (echo[name] + ' ').split(/\{[0-9]+\}/);
          if (splitString.length - 1 === args.length) {
            let i = 0;
            var message = splitString.reduce(
              (msg, chunk) => {
                return msg + chunk + ((i < args.length) ? args[i++] : '');
              }, '').trim();
            return returnErr ? new Error(message) : message;
          } else throw new Error('wrong number of options provided for message');
        } else return returnErr ? new Error(echo[name]) : echo[name];
      } else throw new Error('could not find message');
    } catch (e) {
      return returnErr ? new Error(e.message) : e.message;
    }
  };

  this.log = (name, ...args) => {
    logger.log(getEcho(name, false, ...args));
  };
  this.raw = (name, ...args) => {
    return getEcho(name, false, ...args);
  };
  this.throw = (name, ...args) => {
    throw getEcho(name, true, ...args);
  };
};
