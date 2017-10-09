const EchoHandler = require('./EchoHandler');

module.exports = function EchoHandlerFactory (conf, item) {
  const echo = new EchoHandler(require(`../i18n/${conf.i18n}.handlerMessages.json`), conf.logger);

  const i18nRequirement = (item, lang) => {
    try {
      if (lang.length === 2) {
        var regionalItem = item.replace(
          /([a-z\d._-]+$)/gi,
          (match, fileName) => { return `en.${fileName}`; });
        return require(`${conf.root}/i18n/${regionalItem}.json`);
      } else echo.throw('eh.i18nTooLong', item);
    } catch (e) { echo.throw('ehFailed', item + (e.message ? ': ' + e.message : '.')); }
  };

  this.init = (lang = (conf.language ? conf.language : 'en')) => {
    return new EchoHandler(i18nRequirement(item, lang), conf.logger);
  };
  ['log', 'raw', 'throw'].forEach((dummy) => {
    this[dummy] = (name, ...args) => echo.throw('ehNotInitialised', item, dummy);
  });
};
