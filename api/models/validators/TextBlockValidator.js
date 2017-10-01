module.exports = function ($) {
  var validator = $('CoreValidator');

  validator.getTextField = function (length) {
    if (length <= 255) return 'short';
    else if (length <= 2000) return 'medium';
    else if (length <= 5000) return 'long';
    else if (length <= 10000) return 'extraLong';
    else throw new Error('Maximum text block length has been reached. If possible, please add another textblock.');
  };

  return validator;
};
