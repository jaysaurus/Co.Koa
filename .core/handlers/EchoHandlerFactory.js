const EchoHandler = require('./EchoHandler');

module.exports = function EchoHandlerFactory (conf, item, echo) {
  const i18nRequirement = (item, lang) => {
    try {
      if (lang.length === 2) {
        var regionalItem = item.replace(
          /([a-z\d._-]+$)/gi,
          (match, fileName) => { return `en.${fileName}`; });
        return require(`${conf['root']}/i18n/${regionalItem}.json`);
      } else echo.throw('i18nTooLong');
    } catch (e) { echo.throw('failed', item + (e.message ? ': ' + e.message : '.')); }
  };

  this.init = (lang = (conf.language ? conf.language : 'en')) => {
    return new EchoHandler(i18nRequirement(item, lang), conf.logger);
  };
  ['log', 'raw', 'throw'].forEach((dummy) => {
    this[dummy] = (name, ...args) => echo.throw('echoNotInitialised', item);
  });
};
