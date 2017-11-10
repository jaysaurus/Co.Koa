module.exports = {
  bootstrap: async ($) => {
    const _echo = $(':echo').load('BootstrapMessages', 'es'); // retrieve the sample messages for bootstrap
    try {
      const sampleService = $('SampleService'); // require a sample service.

      _echo.log('getSampleService'); // log a locale-friendly message from BootstrapMessages
      const generated = await sampleService.generateNewSamples();

      // if you don't want to use the i18n messages, you can defer to your build's default logger with $.logger.log():
      $.logger.log(generated
          ? 'Sample services successfully generated'
          : 'Sample services were found');

      $.logger.log('attempting to create TextBlock');
      const Sample = $('Sample');
      const s = await Sample.findStuff();
      // console.log(s.name);
      console.log(s.reduce(
        (string, sample) => {
          return (string += sample.name ? `${sample.name}\n` : '');
        }, ''));
      await Sample.createTextBlock($('TextBlock'));
      $.logger.log('done');
    } catch (e) {
      debugger;
      console.error('test');
      _echo.log('failed', e.message);
    }
  }
};
