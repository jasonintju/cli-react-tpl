#!/usr/bin/env node

var commander = require('commander');

commander
  .version(require('../package.json').version, '-v, --version')
  .description('a test cli program')
  .command('init', 'create a new project');

commander.parse(process.argv);
