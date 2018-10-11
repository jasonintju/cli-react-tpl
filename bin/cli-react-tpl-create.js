const commander = require('commander');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const download = require('../lib/download');
const generate = require('../lib/generate');
const tplGitUrl = 'jasonintju/react-template';

commander.usage('<project-name>').parse(process.argv);

let projectName = commander.args[0];
if (!projectName) {
  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  commander.help();
  return;
}

// 在当前目录下创建以 project-name 为名称的工程，如果当前目录下已存在同名工程，则提示 “项目已存在”
const list = glob.sync('*'); // 遍历当前目录
const sameNameDir = list.filter(file => {
  const filePath = path.join(process.cwd(), file);
  const isDir = fs.statSync(filePath).isDirectory();
  return isDir && projectName === file;
});
if (sameNameDir.length !== 0) {
  console.log(chalk.red(`项目${projectName}已经存在`));
  return;
}

inquirer
  .prompt([
    {
      name: 'projectVersion',
      message: 'version',
      default: '1.0.0'
    },
    {
      name: 'projectDescription',
      message: 'description',
      default: 'a new React project'
    }
  ])
  .then(metadata => {
    metadata.projectName = projectName;
    createNewProject(metadata);
  });

function createNewProject(metadata) {
  const cwd = process.cwd();
  const rootDir = path.join(cwd, projectName);
  download(tplGitUrl, rootDir)
    .then(tplDir => {
      return generate(metadata, tplDir, rootDir);
    })
    .then(() => {
      console.log(logSymbols.success, chalk.green('项目创建成功:)'));
      console.log(chalk.yellow(`cd ${projectName}\nnpm install\nnpm run dev`));
    })
    .catch(err => console.error(err));
}
