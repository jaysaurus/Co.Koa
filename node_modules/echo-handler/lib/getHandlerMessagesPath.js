const fs = require('fs');

module.exports = conf => {
  const i18nPath = `${__dirname}/i18n/${conf.i18n}.handlerMessages.json`;
  return fs.existsSync(i18nPath) ? i18nPath : './i18n/en.handlerMessages.json';
};
