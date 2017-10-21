const Builder = require('../Builder');
const mongoose = require('mongoose');
const MongooseTypeNumberEnums = require('mongoose-type-number-enums');
/*
* Interpolate custom mongoose Enum type
*/
module.exports = function MongooseHandler (conf) {
  const builder = new Builder(conf);
  const mongooseEnums = new MongooseTypeNumberEnums(conf.i18n);

  this.fetch = () => {
    mongooseEnums.upgradeMongoose(mongoose);
    builder.build('models/Type', (type, typeName) => {
      var tName = typeName.replace('models', '');
      function newType (key, options) {
        mongoose.SchemaType.call(this, key, options, tName);
      }
      newType.prototype = Object.create(mongoose.SchemaType.prototype);
      newType.prototype.cast = type;
      mongoose.Schema.Types[tName] = newType;
    });
    return mongoose;
  };
};
