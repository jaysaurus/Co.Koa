module.exports = function TextBlock ($) {
  const _schema = $(':schema');
  const validator = $('TextBlockValidator');

  var Schema = _schema.create({
    extraLong: {
      type: String,
      maxlength: 10000,
      trim: true
    },

    long: {
      type: String,
      maxlength: 5000,
      trim: true
    },

    medium: {
      type: String,
      maxlength: 2000,
      trim: true
    },

    short: {
      type: String,
      maxlength: 255,
      trim: true
    }
  }, { runSettersOnQuery: true });

  function getText () {
    var Schema = this._doc;
    var keys = Object.keys(Schema);
    for (let key of keys) {
      switch (key) {
        case 'short':
        case 'medium':
        case 'long':
        case 'extraLong':
          if (Schema[key]) return Schema[key];
      }
    }
    return '';
  }

  function setText (text) {
    var length = typeof text === 'string' ? text.length : false;
    if (length) {
      var textField = validator.getTextField(length);
      this[textField] = text;
      var keys = Object.keys(this);
      if (keys && keys.length) {
        ['short', 'medium', 'long', 'extraLong'].forEach((item) => {
          if (item !== textField) {
            if (typeof this['$unset'] === 'object') {
              this['$unset'][item] = /./;
            } else if (this[item]) delete this[item];
          }
        });
        return this;
      } else throw new Error('something unexpected happened.');
    } else return new Error('Invalid text object.');
  }

  Schema.methods.updateText = async function (text) {
    var textObject = setText.call({ $unset: {} }, text);  // override "this" with custom obj.
    await this.update(textObject);
  };

  Schema
    .virtual('text')
    .get(getText)
    .set(setText);

  return Schema;
};
