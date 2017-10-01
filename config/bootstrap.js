module.exports = {
  bootstrap: async ($) => {
    try {
      var sampleService = $('SampleService');
      var result = await sampleService.getNewSamples();
      process.log(result);
    } catch (e) {
      process.log(e.message);
    }
  }
};
