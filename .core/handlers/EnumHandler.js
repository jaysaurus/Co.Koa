const EchoHandler = require('./EchoHandler');

module.exports = function EnumHandler (conf) {
  let hasFailed = false;
  const _this = this;
  const echo = new EchoHandler(require(`${conf.root}/.core/i18n/${conf.i18n}.handlerMessages.json`), conf.logger);

  const enumGetCallback = (limit) => {
    return function (item) {
      const duplicateMembers = findDuplicateEnumMembers(this);
      if (!duplicateMembers.length) {
        for (let i in this) {
          if (i < (limit) &&
              this[i] === item) return i;
        }
        return -1;
      } else echo.throw('enumNotUnique', `"${duplicateMembers.join('", "')}"`);
    };
  };

  const findDuplicateEnumMembers = (enumArray) => {
    return enumArray.filter((value, index, self) => self.indexOf(value) !== index);
  };

  this.mapEnumMethods = (enums, init = true) => {
    if (enums && !hasFailed) {
      var keys = Object.keys(enums);
      if (keys) {
        keys.forEach((key) => {
          if (typeof enums[key] === 'object') {
            var childKey = Object.keys(enums[key]);
            if (childKey.length && isNaN(parseInt(childKey[0]))) {
              _this.mapEnumMethods(enums[key], false);
            } else { // enum methods go here:
              const limitGuard = enums[key].length; // limit number of calls to exclude .get from enum results
              enums[key].get = enumGetCallback(limitGuard);
            }
          }
        });
      }
      if (init) return enums;
    }
  };
};
