const echoHandler = require('echo-handler');

const AssetHandler = require('./handlers/AssetHandler.js');
const AsyncHandler = require('./handlers/AsyncHandler.js');
// const MongooseHandler = require('./handlers/MongooseHandler.js');
const mongoose = require('mongoose');
module.exports = function DependencyManager (conf) {
  const _this = this;
  const echo = echoHandler.configure({ factoryOverride: `${__dirname}/i18n/${conf.i18n}.depManMessages.json`, logger: conf.logger });

  // new EchoHandler(require(`./i18n/${conf['i18n']}.depManMessages.json`), conf.logger);
  const enumsDir = require(`${conf.root}/api/Enums.js`);
  // const mongoose = new MongooseHandler(conf); //TODO MOVE ME!!!

  const appendConfigToCallerMethod = () => {
    if (!_this.call.environment) {
      Object.keys(conf)
        .forEach((key) => {
          _this.call[key] = conf[key];
        });
    }
  };

  const fetchFile = (type, item) => {
    switch (type) {
      case 'Service':
        return new (getter(type, item))(_this.call);
      case 'Validator':
        return getter('Model', `validators/${item}`)(_this.call);
      default:
        return mongoose.models[item];
    }
  };

  const fetchToken = (type) => {
    switch (type) {
      case ':async':
        return new AsyncHandler();
      case ':echo':
        return echoHandler.configure(conf);
      case ':enums':
        return enumsDir;
      //   // return new EnumHandler(conf).mapEnumMethods(enumsDir);
      // case ':schema':
      //   Mongoose.Schema.Types.create = (obj, opts) => new Mongoose.Schema(obj, opts);
      //   return Mongoose.Schema.Types;
      default:
        return AssetHandler(type, conf);
    }
  };

  const getter = (type, item, lang) => {
    try {
      return require(`${conf.root}/api/${type.toLowerCase()}s/${item}`);
    } catch (e) { echo.throw('failed', item); }
  };

  this.call = (item) => {
    try {
      appendConfigToCallerMethod();
      if (typeof item === 'string') {
        if (item.match(/^:/)) return fetchToken(item);
        else {
          let type = item.match(/[A-Z]{1}[a-z]+$/);
          if (type && type.length) {
            return fetchFile(type[0], item.replace('.', '/'));
          } else echo.throw('unsupported', item);
        }
      } else echo.throw('invalidType', typeof item);
    } catch (e) { echo.throw('invalidDependency', e.message, e); }
  };
};
