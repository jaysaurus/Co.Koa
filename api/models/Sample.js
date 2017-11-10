module.exports = function Sample ($) {
  return {
    schema: {
      description: {
        type: require('./TextBlock')($)
      },

      name: {
        type: String,
        trim: true,
        default: '(Unnamed Sample)'
      },

      action: {
        type: 'Enum',
        enum: $(':enums').Sample.Action
      }
    },
    statics: {
      createTextBlock: async function (TextBlock) {
        new TextBlock({
          Text: 'here goes nothing!!'
        }).save();
      },
      findStuff: async function () {
        const stuff = await this.find();
        return stuff;
      }
    }
  };
};
