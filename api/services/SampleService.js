module.exports = function SampleService ($) {
  const _async = $(':async');
  const sample = $(':enums').Sample;

  const Sample = $('Sample');

  this.getNewSamples = async () => {
    try {
      await _async.each(sample.Action, async(action) => {
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
