const fs = require('fs');

let appendFileCommands = (files, type, next) => {
  if (files) {
    files.forEach((file) => {
      const suffix = type.match(/[A-Za-z]+$/); // e.g. dir/SubDir -> "SubDir"
      const name = file.replace(/\.js$/, ''); // e.g. file.js -> "file"
      if (nameMatchesType(name, type)) {
        const requirement = require(`${__root}/api/${type.toLowerCase()}s/${name}`);
        const objectName = name.replace((suffix ? suffix[0] : ''), '');
        next(requirement, objectName);
      } else {
        process.log(`Spotted "${file}" in "/${type}". Build will not action this item.`);
      }
    });
  }
};

let nameMatchesType = (name, type) => name.match(`${type.replace(/^[A-Za-z]+\//, '')}$`);

module.exports = {
  build: (type, $) => {
    try {
      const dir = `${__root}/api/${type.toLowerCase()}s/`;
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
