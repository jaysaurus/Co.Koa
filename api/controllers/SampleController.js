module.exports = function SampleController ($) {
  var Sample = $('Sample');
  return {
    'POST /create': async (ctx, next) => {
      try {
        await new Sample(ctx.request.body).save();
      } catch (e) {
        ctx.body = e.message;
        $.logger.log(e.message);
      }
    }
  };
};
