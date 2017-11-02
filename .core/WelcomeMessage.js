'use strict';

const fs = require('fs');

module.exports = function WelcomeMessage (conf) {
  this.sayHello = function () {
    if (conf.environment === 'development' ||
    conf.environment === 'test') {
      try {
        fs.readFileSync(`${conf.root}/.core/welcomeMessage.txt`)
          .toString()
          .split('\n').forEach(
          (line) => {
            console.log(line);
          });
      } catch (e) {
        console.log('-- Welcome to Co.Koa --');
      }
    }
  };
};
