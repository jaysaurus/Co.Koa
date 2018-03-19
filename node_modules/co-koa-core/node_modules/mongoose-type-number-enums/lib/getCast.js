module.exports = function getCast (echo) {
  return function (val) {
    if (this && this.options && this.options['enum']) {
      var _val = Number(val);
      if (!isNaN(_val)) {
        for (var i in this.options['enum']) {
          if (parseInt(i) === _val) return _val;
        }
      } else echo.throw('notAnumber', val);
      throw echo.throw('notFound');
    } else echo.throw('notArray');
  };
};
