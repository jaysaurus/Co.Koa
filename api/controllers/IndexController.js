'use strict';

module.exports = function IndexController ($) {
  return {
    async 'GET /' (ctx) {
      ctx.type = 'html';
      ctx.body = $(':html').stream('index');
    }
  };
};
