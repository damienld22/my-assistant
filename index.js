const program = require('commander');
const { handleProcedureCommand } = require('./lib/procedure');

program.version(require('./package.json').version);

program
  .option('-p, --procedure <mode>', 'Manage procedure (add, remove, update, list)');

program.parse(process.argv);

if (program.procedure) {
  handleProcedureCommand(program.procedure);
}
