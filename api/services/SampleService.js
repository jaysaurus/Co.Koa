module.exports = function SampleService ($) {
  const _async = $(':async');
  const _enum = $(':enums').Sample;

  const Sample = $('Sample');

  this.getNewSamples = async () => {
    try {
      await _async.each(_enum.Action, async(action) => {
        new Sample({
          name: `sample method: ${action}`,
          action: _enum.Action.get(action)
        }).save();
      });
      return 'Sample methods demo generated!';
    } catch (e) {
      $.logger.log(e);
    }
  };
};
