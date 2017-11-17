const bluebird = require('bluebird');
const mongoose = require('mongoose');

module.exports = (env, envConfig) => {
  switch (env) {
    case 'development':
    case 'test':
      mongoose.Promise = bluebird;
      mongoose.connect(envConfig['mongoDB_URI'], { useMongoClient: true });
      envConfig.mongoose = mongoose;
      return envConfig;

    case process.env.NODE_ENV:
      return envConfig; // <- LIVE DEPLOYMENT GOES HERE

    default:
      return null;
  }
};
