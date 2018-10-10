const download = require('download-git-repo');
const ora = require('ora');
const path = require('path');

module.exports = target => {
  target = path.join(target || '.', '.download-temp');
  return new Promise((resolve, reject) => {
    const url = 'https://github.com/ali-emas/default-template';
    const spinner = ora(`Downloading template from ${url}`);
    spinner.start();
    download('ali-emas/default-template', target, err => {
      if (err) {
        spinner.fail();
        reject(err);
      } else {
        spinner.succeed();
        resolve(target);
      }
    });
  });
};
