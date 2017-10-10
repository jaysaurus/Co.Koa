const bluebird = require('bluebird');
const mongoose = require('mongoose');

const EchoHandler = require('./handlers/EchoHandler.js');

module.exports = function ConfigManager (root) {
  const config = require(`${root}/config/config.json`);
  const confMessages = require(`./i18n/${config['defaultLanguage']}.confManMessages.json`);
  const Logger = require(`${root}/config/Logger.js`);

  const getEchoObject = (env) => {
    try {
      return new EchoHandler(confMessages, new Logger(env));
    } catch (e) { return undefined; }
  };

  const getEnvConfig = (env, echo) => {
    const envConfig = config['environment'][env];
    switch (env) {
      case 'development':
      case 'test':
        mongoose.Promise = bluebird;
        mongoose.connect(envConfig['mongoDB_URI'], { useMongoClient: true });
        envConfig.mongoose = mongoose;
        return envConfig;

      case process.env.NODE_ENV:
        // TODO DEPLOYMENT GOES HERE
        return envConfig;

      default:
        echo.throw('invalidEnv');
    }
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
          root: root,
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
