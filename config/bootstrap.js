module.exports = {
  bootstrap: async ($) => {
    try {
      const sampleService = $('SampleService');
      const echo = $('deeper/SampleMessages');
      await sampleService.getNewSamples();
      echo.log('A Message');
      // process.log(result);
    } catch (e) {
      process.log(e.message);
    }
  }
};
