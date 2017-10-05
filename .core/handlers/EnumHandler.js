module.exports = function EnumHandler () {
  const _this = this;

  const enumGetCallback = (limit) => {
    return function (item) {
      for (let i in this) {
        if (i < (limit) &&
            this[i] === item) return i;
      }
      return -1;
    };
  };

  this.mapEnumMethods = (enums, init = true) => {
    if (enums) {
      var keys = Object.keys(enums);
      if (keys) {
        keys.forEach((key) => {
          if (typeof enums[key] === 'object') {
            var childKey = Object.keys(enums[key]);
            if (childKey.length && isNaN(parseInt(childKey[0]))) {
              _this.mapEnumMethods(enums[key], false);
            } else {
              // enum methods go here
              var limitGuard = enums[key].length; // limit number of calls to exclude .get from enum results
              enums[key].get = enumGetCallback(limitGuard);
            }
          }
        });
      }
      if (init) return enums;
    }
  };
};
