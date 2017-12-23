module.exports = function ($, conf) {
  return {
    async logRequest (ctx, next) {
      const start = new Date();
      await next();
      const ms = new Date() - start;
      $.logger.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    }
  };
};
