const download = require('download-git-repo');
const ora = require('ora');
const path = require('path');

module.exports = (url, dest) => {
  dest = path.join(dest, '.download-temp');
  return new Promise((resolve, reject) => {
    const spinner = ora(`Downloading template from https://github.com/${url}`);
    spinner.start();
    download(url, dest, err => {
      if (err) {
        spinner.fail();
        reject(err);
      } else {
        spinner.succeed();
        resolve(dest);
      }
    });
  });
};
