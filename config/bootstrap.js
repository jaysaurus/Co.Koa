module.exports = {
  bootstrap: async ($) => {
    const echo = $('BootstrapMessages').init(); // retrieve the sample messages for bootstrap
    try {
      const sampleService = $('SampleService'); // require a sample service.

      echo.log('getSampleService'); // log a locale-friendly message from BootstrapMessages
      const generated = await sampleService.generateNewSamples();

      // if you don't want to use the i18n messages, you can defer to your build's default logger with $.logger.log():
      $.logger.log(generated
          ? 'Sample services successfully generated'
          : 'Sample services were found');
    } catch (e) {
      echo.log('failed', e.message);
    }
  }
};
