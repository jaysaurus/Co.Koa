const mongoose = require('mongoose');

module.exports = function ConfigManager (root) {
  const config = require(`${root}/config/config.json`);
  const Logger = require(`${root}/config/Logger.js`);

  const getEnvConfig = (env) => {
    const envConfig = config['environment'][env];
    switch (env) {
      case 'development':
      case 'test':
        mongoose.Promise = global.Promise; // TODO sort out promise library!!
        mongoose.connect(envConfig['mongoDB_URI'], { useMongoClient: true });
        envConfig.mongoose = mongoose;
        return envConfig;

      case process.env.NODE_ENV:
        // TODO DEPLOYMENT GOES HERE
        return envConfig;

      default:
        throw new Error('UNRECOGNISED DB ENVIRONMENT');
    }
  };

  this.build = function (env, spy) {
    try {
      return {
        environment: env,
        i18n: config['defaultLanguage'],
        logger: new Logger(env, spy),
        env: getEnvConfig(env),
        root: root
      };
    } catch (e) {
      console.log(`FAILED TO BUILD CONFIG: ${e.message}`);
    }
  };
};
