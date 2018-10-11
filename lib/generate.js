const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars');
const path = require('path');
const fs = require('fs-extra');

module.exports = (metadata = {}, src, dest) =>
  new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(path.join(src, 'template'))
      .destination(dest)
      .use((files, metalsmith, cb) => {
        const meta = metalsmith.metadata();
        const fileContent = files['package.json'].contents.toString();
        files['package.json'].contents = new Buffer(Handlebars.compile(fileContent)(meta));

        // 可以遍历所有文件进行处理，但是react语法{{}}与handlebars解析有兼容问题
        // Object.keys(files).forEach(fileName => {
        //   const fileContent = files[fileName].contents.toString();
        //   files[fileName].contents = new Buffer(Handlebars.compile(fileContent)(meta));
        // });

        cb();
      })
      .build(err => {
        fs.remove(src);
        err ? reject(err) : resolve();
      });
  });
