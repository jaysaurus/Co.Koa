module.exports = function Sample ($) {
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
        enum: $(':enums').Sample.Action
      }
    }
  };
};
