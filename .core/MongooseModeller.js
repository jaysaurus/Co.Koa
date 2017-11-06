'use strict';

const Builder = require('./Builder');
const DependencyManager = require('./DependencyManager');
const mongoose = require('mongoose');
const MongooseTypeNumberEnums = require('mongoose-type-number-enums');
const echoHandler = require('echo-handler');

/*
* Interpolate custom mongoose Enum type
*/
module.exports = function MongooseModeller (conf) {
  const builder = new Builder(conf);
  const echo = echoHandler.configure({
    factoryOverride: `${conf.root}/.core/i18n/${conf.i18n}.depManMessages.json`,
    logger: conf.logger });
  const mongooseEnums = new MongooseTypeNumberEnums(conf.i18n);
  const $ = new DependencyManager(conf);

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
      const model = modelCallback($.call);
      if (model.hasOwnProperty('schema')) {
        const schema = new mongoose.Schema(model.schema, (model.hasOwnProperty('options') ? model.options : undefined));
        Object.keys(model).forEach(key => {
          switch (key) {
            case 'virtuals':
              assignVirtuals(schema, model[key]);
              break;
            case 'methods':
            case 'statics':
              Object.assign(schema.methods, model[key]);
              break;
          }
        });
        mongoose.model(modelName, schema);
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

  this.model = () => {
    mongooseEnums.upgradeMongoose(mongoose); // allow numeric Enum support by default
    builder.build('models/Type', buildType);
    builder.build('Model', buildModelCallback($, echo));
  };
};
