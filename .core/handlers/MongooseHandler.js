'use strict';

const Builder = require('../Builder');
const mongoose = require('mongoose');
const MongooseTypeNumberEnums = require('mongoose-type-number-enums');
/*
* Interpolate custom mongoose Enum type
*/
function MongooseHandler (conf) {
  const builder = new Builder(conf);
  const mongooseEnums = new MongooseTypeNumberEnums(conf.i18n);
  mongooseEnums.upgradeMongoose(mongoose);
  builder.build('models/Type', (type, typeName) => {
    const tName = typeName.replace('models', '');
    function newType (key, options) {
      mongoose.SchemaType.call(this, key, options, tName);
    }
    newType.prototype = Object.create(mongoose.SchemaType.prototype);
    newType.prototype.cast = type;
    mongoose.Schema.Types[tName] = newType;
  });
}

function assignVirtuals (schema, virtuals) {
  Object.keys(virtuals).forEach(key => {
    schema.virtual(key);
    ['get', 'set'].forEach(getSet => {
      if (virtuals[key].hasOwnProperty(getSet)) {
        schema[getSet](virtuals[key][getSet]());
      }
    });
  });
}

MongooseHandler.prototype.create = (name, model) => {
  if (model.hasOwnProperty('schema')) {
    const schema = new mongoose.Schema(model.schema, (model.hasOwnProperty('options') ? model.options : undefined));
    Object.keys(model).forEach(key => {
      switch (key) {
        case 'virtuals':
          assignVirtuals(schema, model[key]);
      }
    });
  } else { // ERROR HANDLE
    // TODO Echo-handler
  }
};

module.exports = MongooseHandler;
