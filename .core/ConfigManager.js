const echoHandler = require('echo-handler');
const mongoose = require('mongoose');

module.exports = function ConfigManager (root) {
  const config = require(`${root}/config/config.json`);
  const envConfig = require(`${root}/config/envConfig`);
  const confMessages = require(`${__dirname}/i18n/${config.defaultLanguage}.confManMessages.json`);
  const Logger = require(`${root}/config/Logger.js`);

  const getEchoObject = (env) => {
    try {
      const echo =
        echoHandler.configure({
          factoryOverride: `${__dirname}/i18n/${config.defaultLanguage}.confManMessages.json`,
          logger: new Logger(env) });
      return echo;
    } catch (e) { return undefined; }
  };

  const getEnvConfig = (env, echo) => {
    const ec = envConfig(env, config['environment'][env], mongoose);
    if (ec) return ec;
    else echo.throw('invalidEnv');
  };

  this.build = function (env, spy) {
    const echo = getEchoObject(env);
    if (typeof echo === 'object') {
      try {
        return {
          env: getEnvConfig(env, echo),
          environment: env,
          i18n: config['defaultLanguage'],
          logger: new Logger(env, spy),
          messageFolder: config['messageFolder'].replace(/^\.*/, root),
          root,
          useHBS: config['useHBS']
        };
      } catch (e) {
        echo.throw('failed', e.message);
      }
    } else {
      throw new Error(
        (confMessages && confMessages.fatalError)
          ? confMessages.fatalError
          : 'FATAL: Something went fatally wrong, ConfigManager could not find it\'s messages AND config.json was not understood. Your Co.Koa installation may have become corrupted.');
    }
  };
};
