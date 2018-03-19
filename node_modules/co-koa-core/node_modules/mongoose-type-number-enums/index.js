const echoHandler = require('echo-handler');
const getCast = require('./lib/getCast');

module.exports = function MongooseTypeNumberEnums (i18n = 'en') {
  let language = 'en';
  if (i18n !== 'en') {
    const supportedLanguages = ['en'];
    for (let i in supportedLanguages) {
      if (i18n === supportedLanguages[i]) {
        language = i18n;
        break;
      }
    }
  }
  const echo =
    echoHandler
      .configure({ language, messageFolder: `${__dirname}/lib/i18n` })
      .load('messages', language);

  function getNewType (mongoose) {
    return function newType (key, options) {
      mongoose.SchemaType.call(this, key, options, 'Enum');
    };
  }

  this.upgradeMongoose = mongoose => {
    try {
      if (typeof mongoose === 'object') {
        let newType = getNewType(mongoose);
        newType.prototype = Object.create(mongoose.SchemaType.prototype);
        newType.prototype.cast = getCast(echo);
        mongoose.Schema.Types['Enum'] = newType;
        return mongoose;
      } else echo.throw('badMongoose', mongoose);
    } catch (e) {
      echo.throw('error', e.message);
    }
  };
};
