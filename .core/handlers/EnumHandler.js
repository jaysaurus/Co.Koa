var enums = require(`${__root}/api/Enums.js`);

var mapEnumMethods = (enums) => {
  if (enums) {
    var keys = Object.keys(enums);
    if (keys) {
      keys.forEach((key) => {
        if (typeof enums[key] === 'object') {
          var childKey = Object.keys(enums[key]);
          if (childKey.length && isNaN(parseInt(childKey[0]))) {
            mapEnumMethods(enums[key]);
          } else {
            // Map more enum methods here
            var limitGuard = enums[key].length; // limit number of calls to exclude .get from enum results
            enums[key].get = enumGetCallback(limitGuard);
          }
        }
      });
    }
  }
};

var enumGetCallback = (limit) => {
  return function (item) {
    for (var i in this) {
      if (i < (limit) &&
          this[i] === item) return i;
    }
    return -1;
  };
};

mapEnumMethods(enums);

module.exports = enums;
