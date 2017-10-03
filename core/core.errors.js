function Errors (asdf = 'test') {
  var self = this;
  this.buildFailed = 'Failed to build {1}s: {2}';
  this.noDir = 'directory "{1}" doesn\'t exist.';
  this.notOfType = 'Spotted "{1}" in "/{2}". Build will not action this item.';

  var loadError = (name, returnErr, ...args) => {
    try {
      if (self[name]) {
        if (args && args.length) {
          var splitString = (self[name] + ' ').split(/\{[0-9]+\}/);
          if (splitString.length - 1 === args.length) {
            let i = 0;
            var message = splitString.reduce(
              (msg, chunk) => {
                return msg + chunk + ((i < args.length) ? args[i++] : '');
              }, '').trim();
            return returnErr ? new Error(message) : message;
          } else throw new Error('wrong number of arguments provided for string');
        } else return returnErr ? new Error(self[name]) : self[name];
      } else throw new Error('unknown error message');
    } catch (e) {
      return returnErr ? new Error(e.message) : e.message;
    }
  };

  this.get = (name, ...args) => {
    return loadError(name, true, ...args);
  };
  this.message = (name, ...args) => {
    return loadError(name, false, ...args);
  };
}

module.exports = new Errors();
