'use strict';

const Builder = require('./Builder');
const mongoose = require('mongoose');
const MongooseTypeNumberEnums = require('mongoose-type-number-enums');
const echoHandler = require('echo-handler');

/*
* Interpolate custom mongoose Enum type
*/
module.exports = function MongooseModeller (conf) {
  const builder = new Builder(conf);
  const echo = echoHandler.configure({
    factoryOverride: `${__dirname}/i18n/${conf.i18n}.depManMessages.json`,
    logger: conf.logger });
  const mongooseEnums = new MongooseTypeNumberEnums(conf.i18n);

  const assignVirtuals = (schema, virtuals) => {
    Object.keys(virtuals).forEach(key => {
      const virtual = schema.virtual(key);
      ['get', 'set'].forEach(getSet => {
        if (virtuals[key].hasOwnProperty(getSet)) {
          virtual[getSet](virtuals[key][getSet]);
        }
      });
    });
  };

  const buildModelCallback = ($, echo) => {
    return (modelCallback, modelName) => {
      const model = modelCallback($);
      if (model.hasOwnProperty('schema')) {
        const schema = new mongoose.Schema(model.schema, (model.hasOwnProperty('options') ? model.options : undefined));
        let statics = [];
        Object.keys(model).forEach(key => {
          switch (key) {
            case 'virtuals':
              assignVirtuals(schema, model[key]);
              break;
            case 'methods':
              Object.assign(schema[key], model[key]);
              break;
            case 'statics':
              statics = Object.keys(model[key]);
              Object.assign(schema[key], model[key]);
              break;
          }
        });
        const Model = mongoose.model(modelName, schema);
        statics.forEach(func => { // bind Model class as 'this' to statics
          Model[func] = Model[func].bind(Model);
        });
      } else this.echo.throw('noSchema', modelName);
    };
  };

  const buildType = (type, typeName) => {
    const tName = typeName.replace('models', '');
    function newType (key, options) {
      mongoose.SchemaType.call(this, key, options, tName);
    }
    newType.prototype = Object.create(mongoose.SchemaType.prototype);
    newType.prototype.cast = type;
    mongoose.Schema.Types[tName] = newType;
  };

  this.model = ($) => {
    mongooseEnums.upgradeMongoose(mongoose); // allow numeric Enum support by default
    builder.build('models/Type', buildType);
    builder.build('Model', buildModelCallback($, echo));
  };
};
