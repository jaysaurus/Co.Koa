module.exports = function Sample ($) {
  var _enums = $(':enums');
  var _schema = $(':schema');

  var Schema = _schema.create({
    description: { type: require('./TextBlock')($) },

    name: {
      type: String,
      trim: true,
      default: '(Unnamed Sample)'
    },

    action: {
      type: 'Enum',
      enum: _enums.Sample.Action
    }
  });

  return Schema;
};
