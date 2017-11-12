module.exports = {
  bootstrap: async ($) => {
    const _echo = $(':echo').load('BootstrapMessages', 'es'); // retrieve the sample messages for bootstrap
    try {
      const sampleService = $('SampleService'); // require a sample service.
      const TextBlock = $('TextBlock');
      _echo.log('getSampleService'); // log a locale-friendly message from BootstrapMessages
      const generated = await sampleService.generateNewSamples();

      // if you don't want to use the i18n messages, you can defer to your build's default logger with $.logger.log():
      $.logger.log(generated
          ? 'Sample services successfully generated'
          : 'Sample services were found');

      $.logger.log('attempting to create TextBlock');
      const Sample = $('Sample');
      const s = await Sample.findStuff();
      console.log(s.reduce(
        (string, sample) => {
          return (string += sample.name ? `${sample.name}\n` : '');
        }, ''));

      await Sample.createTextBlock($('TextBlock'));
      const textBlock = await new TextBlock({ text: 'test' }).save();
      await textBlock.updateText('Vestibulum lacus tellus, egestas sit amet neque sed, vulputate fermentum nunc. Phasellus et pretium augue, ac aliquam lorem. In eu augue et lacus pulvinar ultricies et at diam. Suspendisse vitae tempor mi, quis facilisis tortor. Nulla ultricies mauris nisi, a hendrerit sapien vehicula ac. Donec lobortis, ligula maximus luctus auctor, lorem enim accumsan felis, et consequat felis massa ac mi. Nulla enim nibh, tincidunt id sagittis in, ornare vel lorem. Pellentesque leo ex , molestie ac bibendum posuere, aliquam nec purus. Nulla facilisi. Donec in est at mi ullamcorper hendrerit. Integer in velit leo. Nunc eget consectetur ipsum, nec fringilla nunc. Pellentesque elementum, nisl a sollicitudin vulputate, felis ante sagittis velit, id ornare neque orci et metus. Integer gravida neque et sem tincidunt varius. Aliquam erat volutpat. Aliquam sit amet convallis justo, eu consequat purus.  Vestibulum lacus tellus, egestas sit amet neque sed, vulputate fermentum nunc. Phasellus et pretium augue, ac aliquam lorem. In eu augue et lacus pulvinar ultricies et at diam. Suspendisse vitae tempor mi, quis facilisis tortor. Nulla ultricies mauris nisi, a hendrerit sapien vehicula ac. Donec lobortis, ligula maximus luctus auctor, lorem enim accumsan felis, et consequat felis massa ac mi. Nulla enim nibh, tincidunt id sagittis in, ornare vel lorem. Pellentesque leo ex, molestie ac bibendum posuere, aliquam nec purus. Nulla facilisi. Donec in est at mi ullamcorper hendrerit. Integer in velit leo. Nunc eget consectetur ipsum, nec fringilla nunc. Pellentesque elementum, nisl a sollicitudin vulputate, felis ante sagittis velit, id ornare neque orci et metus. Integer gravida neque et sem tincidunt varius. Aliquam erat volutpat. Aliquam sit amet convallis justo, eu consequat purus. ');
      const tb = await TextBlock.findById(textBlock._id);
      console.log(tb.medium);
    } catch (e) {
      console.error('test');
      _echo.log('failed', e.message);
    }
  }
};
