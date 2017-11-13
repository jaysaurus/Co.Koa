module.exports = function ($, conf) {
  return {
    'example': async (ctx, next) => {
      const start = new Date();
      ctx.body = `${start} request received.`;
      await next();
      const ms = new Date() - start;
      conf.logger.log(`${ctx.method} ${ctx.url} - ${ms}`);
    }
  };
};
