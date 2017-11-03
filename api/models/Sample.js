module.exports = function Sample ($) {
  const _enums = $(':enums'); // import the enums object

  return {
    schema: {
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
    }
  };
};
