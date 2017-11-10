module.exports = function SampleService ($) {
  const _async = $(':async'); // retrieve the async library
  const _echo = $(':echo').load('services/SampleMessages', 'es'); // initialise SampleMessages with your Co.Koa build's default language;
  const _enum = $(':enums'); // retrieve the Sample enum
  const Sample = $('Sample'); // retrieve the Sample model

  this.fetchAllToList = async () => {
    const samples = await Sample.findStuff();
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
        _echo.log('generating');
        // a normal each closure will not work for iterating over model creation so the _async library is employed.
        await _async.each(_enum.Sample.Action, async (action) => { // use the async library's each method to iterate over the sample enum
          console.log(`getting: ${_enum.Sample.Action.indexOf(action)} which is ${action}`);
          new Sample({
            name: `Sample Object: ${action}`,
            action: _enum.Sample.Action.indexOf(action) // retrieve the index number of enum by it's given string name
          }).save();
        });
        _echo.log('success'); // log locale-friendly message from **.SampleMessages.json
        return true;
      }
      return false;
    } catch (e) {
      _echo.throw('failed', e.message); // generate locale friendly message and throw it.
    }
  };
};
