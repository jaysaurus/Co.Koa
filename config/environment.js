const mongoose = require('mongoose');
const { setLog } = require('./log');

process.ENVIRONMENT = process.env.NODE_ENV || 'development';

switch (process.ENVIRONMENT) {
  case 'development':
  case 'test':
    const envConfig = require('./.config.json')['environment'][process.ENVIRONMENT];
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
