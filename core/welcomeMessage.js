var fs = require('fs');

if (process.ENVIRONMENT === 'development' ||
  process.ENVIRONMENT === 'test') {
  try {
    fs.readFileSync(`${__root}/core/welcomeMessage.txt`)
      .toString()
      .split('\n').forEach(
        (line) => {
          console.log(line);
        });
  } catch (e) {
    console.log('-- Welcome to Co.Koa --');
  }
}
