module.exports = function (val) {
  if (this && this.options && this.options['enum']) {
    var _val = Number(val);
    if (!isNaN(_val)) {
      for (var i in this.options['enum']) {
        if (parseInt(i) === _val) return _val;
      }
    } else throw new Error(`Enum: "${val}" is not a number`);
    throw new Error('Enum value was not found');
  } else throw new Error('Enum type requires an enum array');
};
