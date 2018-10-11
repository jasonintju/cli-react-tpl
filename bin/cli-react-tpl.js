#!/usr/bin/env node

var commander = require('commander');

commander
  .version(require('../package.json').version, '-v, --version')
  .description('Create a React Project boilerplate')
  .command('create', 'create a new project');

commander.parse(process.argv);
