const program = require('commander');
const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
const { handleProcedureCommand } = require('./lib/procedure');
const { handleCommand } = require('./lib/command');

program.version(require('./package.json').version);

program
  .option('-p, --procedure [mode]', 'Manage procedures (add, remove, update, find)')
  .option('-c, --command [mode]', 'Manage commands (add, remove, update, display, exec)');

program.parse(process.argv);

if (program.procedure) {
  handleProcedureCommand(program.procedure);
} else if (program.command) {
  handleCommand(program.command);
}
