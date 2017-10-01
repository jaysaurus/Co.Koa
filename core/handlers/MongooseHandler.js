const mongoose = require('mongoose');
const { build } = require('../build');

/*
* Interpolates custom mongoose data types (where applicable)
*/
build('models/Type', (type, typeName) => {
  var tName = typeName.replace('models', '');
  function newType (key, options) {
    mongoose.SchemaType.call(this, key, options, tName);
  }
  newType.prototype = Object.create(mongoose.SchemaType.prototype);
  newType.prototype.cast = type;
  mongoose.Schema.Types[tName] = newType;
});

module.exports = mongoose;
