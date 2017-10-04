process.ENVIRONMENT = process.env.NODE_ENV || 'development';

const mongoose = require('mongoose');
const config = require(`${__root}/config/config.json`);
const envConfig = config['environment'][process.ENVIRONMENT];
const { setLog } = require(`${__root}/config/log.js`);

global.__i18n = config['defaultLanguage'];

switch (process.ENVIRONMENT) {
  case 'development':
  case 'test':
    Object.keys(envConfig).forEach(
      (key) => {
        process.env[key] = envConfig[key];
      });
    mongoose.Promise = global.Promise; // TODO sort out promise library!!
    mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

    module.exports = { mongoose };
    break;
  case process.env.NODE_ENV:
    // TODO sort out server environment stuff
    break;
  default:
    throw new Error('[Jay] unrecognised DB environment');
}

setLog(process.ENVIRONMENT);
