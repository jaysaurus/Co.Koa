const EchoHandler = require('./handlers/EchoHandler.js');
const echo = new EchoHandler(require('./.coreEchos.json'));
const fs = require('fs');

let appendFileCommands = (files, type, next) => {
  if (files) {
    const dirName = `${type.toLowerCase()}s`;
    files.forEach((file) => {
      const suffix = type.match(/[A-Za-z]+$/); // e.g. dir/SubDir -> "SubDir"
      const name = file.replace(/\.js$/, ''); // e.g. file.js -> "file"
      if (nameMatchesType(name, type)) {
        const requirement = require(`${__root}/api/${dirName}/${name}`);
        const objectName = name.replace((suffix ? suffix[0] : ''), '');
        next(requirement, objectName);
      } else echo.log('invalidType', file, dirName);
    });
  }
};

let nameMatchesType = (name, type) => name.match(`${type.replace(/^[A-Za-z]+\//, '')}$`);

module.exports = {
  build: (type, $) => {
    try {
      const dirName = `${type.toLowerCase()}s`;
      const dir = `${__root}/api/${dirName}/`;
      if (!fs.existsSync(dir)) {
        echo.throw('invalidDirectory', dirName);
      } else {
        appendFileCommands(fs.readdirSync(dir), type, $);
        echo.log('success', type.match(/[A-Za-z0-9]+$/));
      }
    } catch (e) {
      echo.throw('buildFailed', type, e.stack);
    }
    return $;
  }
};
