var validator = require('validator');

module.exports = function ($) {
  validator.getSupportedImageRules = () => {
    return [{
      validator: validator.isValidURL,
      message: '{VALUE} is not a valid URL'
    },
    {
      validator: validator.hasValidSuffix,
      message: 'the chosen image is not a supported file type!'
    }];
  };

  validator.hasValidSuffix = function (value) {
    var suffix = ['jpg', 'png', 'svg', 'gif'];
    for (var i in suffix) {
      if (value.match(`.${suffix[i]}$`)) return true;
    }
    return false;
  };

  validator.isNotSelfReferential = function (value) {
    return !this.getQuery()._id.equals(value);
  };

  validator.isValidURL = function (value) {
    return validator.isURL(value, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true
    });
  };

  return validator;
};
