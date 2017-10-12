module.exports = function SampleService ($) {
  const _async = $(':async'); // retrieve the async library
  const _enum = $(':enums'); // retrieve the Sample enum
  const echo = $('services/SampleMessages').init(); // initialise SampleMessages with your Co.Koa build's default language;
  const Sample = $('Sample'); // retrieve the Sample model

  this.fetchAllToList = async () => {
    const samples = await Sample.find();
    const sampleList = samples.reduce(
      (string, sample) => {
        return (string += sample.name ? `<li>${sample.name}</li>` : '');
      }, '');
    return `<ul>${sampleList}</ul>`;
  };

  this.generateNewSamples = async () => {
    try {
      const sampleData = await Sample.findOne();
      if (!sampleData) {
        echo.log('generating');
        // a normal each closure will not work for iterating over model creation so the _async library is employed.
        await _async.each(_enum.Sample.Action, async (action) => { // use the async library's each method to iterate over the sample enum
          new Sample({
            name: `Sample Object: ${action}`,
            action: _enum.Sample.Action.get(action) // retrieve the index number of enum by it's given string name
          }).save();
        });
        echo.log('success'); // log locale-friendly message from **.SampleMessages.json
        return true;
      }
      return false;
    } catch (e) {
      echo.throw('failed', e.message); // generate locale friendly message and throw it.
    }
  };
};
