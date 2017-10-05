const AssetHandler = require('./handlers/AssetHandler.js');
const AsyncHandler = require('./handlers/AsyncHandler.js');
const EchoHandler = require('./handlers/EchoHandler.js');
const EnumsHandler = require('./handlers/EnumHandler.js');
const MongooseHandler = require('./handlers/MongooseHandler.js');

module.exports = function DependencyManager (conf) {
  const _this = this;

  const echo = new EchoHandler(require(`./i18n/${conf['i18n']}.depManMessages.json`), conf.logger);
  const enums = new EnumsHandler().mapEnumMethods(require(`${conf.root}/api/Enums.js`));
  const Mongoose = new MongooseHandler(conf).fetch();

  const appendConfigToCallerMethod = () => {
    if (!_this.call.environment) {
      Object.keys(conf)
        .forEach((key) => {
          _this.call[key] = conf[key];
        });
    }
  };

  const fetchDirectory = (type, item) => {
    switch (type) {
      case 'Messages':
        return { setLanguage: (lang) => new EchoHandler(i18nRequirement(item, lang), conf.logger) };
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
        return enums;
      case ':schema':
        Mongoose.Schema.Types.create = (obj, opts) => new Mongoose.Schema(obj, opts);
        return Mongoose.Schema.Types;
      default:
        return AssetHandler(type, conf);
    }
  };

  const i18nRequirement = (item, lang = (conf.language ? conf.language : 'en')) => {
    try {
      if (lang.length === 2) {
        if (item.match(/\//)) {
          let arr = item.split('/');
          arr[arr.length - 1] = `${lang.toLowerCase()}.${arr[arr.length - 1]}`;
          item = arr.toString().replace(/,/g, '/');
        } else item = `${lang}.${item}`;
        return require(`${conf['root']}/i18n/${item}.json`);
      } else echo.throw('i18nTooLong');
    } catch (e) { echo.throw('failed', item + (e.message ? ': ' + e.message : '.')); }
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
            return fetchDirectory(type[0], item.replace('.', '/'));
          } else echo.throw('unsupported', item);
        }
      } else echo.throw('invalidType', typeof item);
    } catch (e) { echo.throw('invalidDependency', e.message, e); }
  };
};
