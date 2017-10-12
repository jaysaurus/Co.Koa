module.exports = function Sample ($) {
  const _enums = $(':enums'); // import the enums object
  const _schema = $(':schema'); // import the mongoose schema object

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
