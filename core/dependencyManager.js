const AssetDependency = require('./handlers/AssetHandler.js');
const AsyncDependency = require('./handlers/AsyncHandler.js');
const EchoHandler = require('./handlers/EchoHandler.js');
const EnumsDependency = require('./handlers/EnumHandler.js');
const MongooseDependency = require('./handlers/MongooseHandler.js');

var dependencyManager = (item) => {
  try {
    if (typeof item === 'string') {
      if (item.match(/^:/)) return fetchToken(item);
      else {
        var type = item.match(/[A-Z]{1}[a-z]+$/);
        if (type && type.length) {
          return fetchDirectory(type[0], item.replace('.', '/'));
        } else throw new Error(`unsupported dependency format: ${item}`);
      }
    } else throw new Error(`dependency expects strings, got: ${typeof item}`);
  } catch (e) { throw new Error(`attempt to retrieve a dependency failed: ${e.message}\n${e}`); }
};

var fetchDirectory = (type, item) => {
  switch (type) {
    case 'Messages':
      return new EchoHandler(getter(type.replace(/s$/, ''), `${item}.json`));
    case 'Service':
      return new (getter(type, item))(dependencyManager);
    case 'Validator':
      return getter('Model', `validators/${item}`)(dependencyManager);
    default:
      return MongooseDependency.models[item] ||
        MongooseDependency.model(type, getter('Model', item)(dependencyManager));
  }
};

var fetchToken = (type) => {
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

var getter = (type, item) => {
  try {
    return require(`${__root}/api/${type.toLowerCase()}s/${item}`);
  } catch (e) { throw new Error(`Failed to load ${item}`); }
};

module.exports = dependencyManager;
