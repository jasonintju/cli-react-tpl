const commander = require('commander');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
// const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const download = require('../lib/download');

commander.usage('<project-name>').parse(process.argv);

let projectName = commander.args[0];
if (!projectName) {
  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  commander.help();
  return;
}

// inquirer
//   .prompt([
//     {
//       name: 'projectName',
//       message: '请输入项目名称',
//       default: 'aaaa'
//     }
//   ])
//   .then(answers => {
//     console.log(chalk.yellow(answers.projectName));
//   });

// 在当前目录下创建以 project-name 为名称的工程
// 如果当前目录下已存在同名工程，则提示 “项目已存在”
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

createNewProject();

function createNewProject() {
  const cwd = process.cwd();
  const rootDir = path.join(cwd, projectName);
  download(cwd)
    .then(target => {
      fs.copy(target, rootDir, err => {
        if (err) {
          console.log(logSymbols.error, chalk.red(err));
          return;
        }
        fs.remove(target);
        console.log(logSymbols.success, chalk.green('项目创建成功:)'));
        console.log(chalk.yellow(`cd ${projectName}\nnpm install\nnpm run dev`));
      });
    })
    .catch(err => console.log(logSymbols.error, chalk.red(err)));
}
