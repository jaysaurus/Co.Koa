module.exports = function SampleService ($) {
  var _async = $(':async');
  var sample = $(':enums').Sample;

  var Sample = $('Sample');

  this.getNewSamples = async () => {
    try {
      await _async.each(sample.Action, async(action) => {
        console.log(sample.Action.get(action));
        new Sample({
          name: `sample method: ${action}`,
          action: sample.Action.get(action)
        }).save();
      });
      return 'Sample methods demo generated!';
    } catch (e) {
      process.log(e);
    }
  };
};
