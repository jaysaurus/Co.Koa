const AssetHandler = require('./handlers/AssetHandler.js');
const AsyncHandler = require('./handlers/AsyncHandler.js');
const EchoHandler = require('./handlers/EchoHandler.js');
const EchoHandlerFactory = require('./handlers/EchoHandlerFactory.js');
const EnumHandler = require('./handlers/EnumHandler.js');
const MongooseHandler = require('./handlers/MongooseHandler.js');

module.exports = function DependencyManager (conf) {
  const _this = this;
  const echo = new EchoHandler(require(`./i18n/${conf['i18n']}.depManMessages.json`), conf.logger);
  const enumsDir = require(`${conf.root}/api/Enums.js`);
  const Mongoose = new MongooseHandler(conf).fetch();

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
      case 'Messages':
        return new EchoHandlerFactory(conf, item, echo);
      case 'Service':
        return new (getter(type, item))(_this.call);
      case 'Validator':
        return getter('Model', `validators/${item}`)(_this.call);
      default:
        return Mongoose.models[item] ||
          Mongoose.model(type, getter('Model', item)(_this.call));
    }
  };

  const fetchToken = (type) => {
    switch (type) {
      case ':async':
        return new AsyncHandler();
      case ':enums':
        return new EnumHandler(conf).mapEnumMethods(enumsDir);
      case ':schema':
        Mongoose.Schema.Types.create = (obj, opts) => new Mongoose.Schema(obj, opts);
        return Mongoose.Schema.Types;
      default:
        return AssetHandler(type, conf);
    }
  };

  const getter = (type, item, lang) => {
    try {
      return require(`${conf['root']}/api/${type.toLowerCase()}s/${item}`);
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
