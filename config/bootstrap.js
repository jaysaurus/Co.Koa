module.exports = {
  bootstrap: async ($) => {
    try {
      const sampleService = $('SampleService');
      const echo = $('deeper/SampleMessages').setLanguage('en');
      $.logger.log($(':enums').Sample.Action.get('A'));
      await sampleService.getNewSamples();
      echo.log('A Message');
      $.logger.log('I dunno, this should be present too!');
    } catch (e) {
      $.logger.log(e.message);
    }
  }
};
