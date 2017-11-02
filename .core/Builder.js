'use strict';

const echoHandler = require('echo-handler');
const fs = require('fs');

module.exports = function Builder (conf) {
  const echo =
    echoHandler.configure({
      factoryOverride: `${conf.root}/.core/i18n/${conf.i18n}.buildMessages.json`,
      logger: conf.logger });

  const appendFileCommands = (files, type, next) => {
    if (files) {
      const dirName = `${type.toLowerCase()}s`;
      files.forEach((file) => {
        const suffix = type.match(/[A-Za-z]+$/); // e.g. dir/SubDir -> "SubDir"
        const name = file.replace(/\.js$/, ''); // e.g. file.js -> "file"
        if (nameMatchesType(name, type)) {
          const requirement = require(`${conf.root}/api/${dirName}/${name}`);
          const objectName = name.replace((suffix ? suffix[0] : ''), '');
          next(requirement, objectName);
        } else echo.log('invalidType', file, dirName);
      });
    }
  };

  const nameMatchesType = (name, type) => name.match(`${type.replace(/^[A-Za-z]+\//, '')}$`);

  this.build = (type, $) => {
    try {
      const dirName = `${type.toLowerCase()}s`;
      const dir = `${conf.root}/api/${dirName}/`;
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
  };
};
