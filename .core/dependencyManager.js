const AssetDependency = require('./handlers/AssetHandler.js');
const AsyncDependency = require('./handlers/AsyncHandler.js');
const EchoHandler = require('./handlers/EchoHandler.js');
const EnumsDependency = require('./handlers/EnumHandler.js');
const MongooseDependency = require('./handlers/MongooseHandler.js');
const echo = new EchoHandler(require(`./i18n/${__i18n}.depManMessages.json`));

const dependencyManager = (item) => {
  try {
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

const fetchDirectory = (type, item) => {
  switch (type) {
    case 'Messages':
      return new EchoHandler(i18nRequirement(item));
    case 'Service':
      return new (getter(type, item))(dependencyManager);
    case 'Validator':
      return getter('Model', `validators/${item}`)(dependencyManager);
    default:
      return MongooseDependency.models[item] ||
        MongooseDependency.model(type, getter('Model', item)(dependencyManager));
  }
};

const fetchToken = (type) => {
  switch (type) {
    case ':async':
      return new AsyncDependency();
    case ':enums':
      return EnumsDependency;
    case ':schema':
      MongooseDependency.Schema.Types.create = (obj, opts) => new MongooseDependency.Schema(obj, opts);
      return MongooseDependency.Schema.Types;
    default:
      return AssetDependency(type);
  }
};

const i18nRequirement = (item, lang = 'en') => {
  try {
    if (lang.length === 2) {
      if (item.match(/\//)) {
        let arr = item.split('/');
        arr[arr.length - 1] = `${lang}.${arr[arr.length - 1]}`;
        item = arr.toString().replace(/,/g, '/');
      } else item = `${lang}.${item}`;
      return require(`${__root}/i18n/${item}.json`);
    } else echo.throw('i18nTooLong');
  } catch (e) { echo.throw('failed', item + (e.message ? ': ' + e.message : '.')); }
};

const getter = (type, item, lang) => {
  try {
    return require(`${__root}/api/${type.toLowerCase()}s/${item}`);
  } catch (e) { echo.throw('failed', item); }
};

module.exports = dependencyManager;
