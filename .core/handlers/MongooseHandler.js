const mongoose = require('mongoose');
const Builder = require('../Builder');

/*
* Interpolates custom mongoose data types (where applicable)
*/
module.exports = function MongooseHandler (conf) {
  const builder = new Builder(conf);

  this.fetch = () => {
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
