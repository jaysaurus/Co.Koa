const defaultRegionalizer = require('./defaultRegionalizer');
const EchoHandler = require('./EchoHandler');
const getHandlerMessagePath = require('./getHandlerMessagesPath');

const getDefaultEcho = conf => {
  let defaultConf = {};
  Object.assign(defaultConf, conf);
  defaultConf.regionalizer = defaultRegionalizer;
  return new EchoHandler(
      require(getHandlerMessagePath(conf)),
      defaultConf);
};

module.exports = function EchoHandlerFactory (conf) {
  const echo = getDefaultEcho(conf);
  const i18nRequirement = (item, lang) => {
    try {
      if (typeof lang === 'string' && lang.length === 2) {
        if (typeof conf.messageFolder === 'string') {
          if (typeof conf.regionalizer === 'function') {
            return require(`${conf.messageFolder}/${conf.regionalizer(item, lang)}.json`);
          } else echo.throw('regionalizerInvalid');
        } else echo.throw('folderInvalid');
      } else echo.throw('i18nInvalid', lang);
    } catch (e) { echo.throw('failed', item + (e.message ? ': ' + e.message : '.')); }
  };

  this.load = (item, lang = conf.i18n) => {
    return new EchoHandler(i18nRequirement(item, lang), conf);
  };

  ['log', 'error', 'raw', 'throw'].forEach((dummy) => {
    this[dummy] = (name, ...args) => echo.throw('notInitialised', dummy);
  });
};
