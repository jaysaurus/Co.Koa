const fs = require('fs');

var appendFileCommands = (files, type, next) => {
  if (files) {
    files.forEach((file) => {
      var suffix = type.match(/[A-Za-z]+$/);
      var name = file.replace(/\.js$/, '');
      if (name.match(`${type.replace(/^[A-Za-z]+\//, '')}$`)) {
        var requirement = require(`${__root}/api/${type.toLowerCase()}s/${name}`);
        var objectName = name.replace((suffix ? suffix[0] : ''), '');
        next(requirement, objectName);
      } else {
        process.log(`Spotted "${file}" in "/${type}". Build will not action this item.`);
      }
    });
  }
};

module.exports = {
  build: (type, $) => {
    try {
      var dir = `${__root}/api/${type.toLowerCase()}s/`;
      if (!fs.existsSync(dir)) {
        throw new Error(`directory "${type}" doesn't exist`);
      } else {
        appendFileCommands(fs.readdirSync(dir), type, $);
        process.log(`The ${type.match(/[A-Za-z0-9]+$/)}s have been imported`);
      }
    } catch (e) {
      throw new Error(`Failed to fetch ${type}: ${e.stack}`);
    }
    return $;
  }
};
