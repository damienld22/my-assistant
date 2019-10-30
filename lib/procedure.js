const inquirer = require('inquirer');

/**
 * Handle a procedure command from the CLI
 * @param {String} mode What we do (add, remove, update, list, get)
 */
function handleProcedureCommand (mode) {
  switch(mode) {
    case 'add':
      handleAddProcedure();
      break;
    default:
      console.error('Bad procedure mode');
      process.exit(0);
  }
}

/**
 * Ask the user to type the procedure and save it
 */
function handleAddProcedure() {
  inquirer
    .prompt({
      name: 'procedureContent',
      message: 'Please type your procedure',
      type: 'editor'
    })
    .then(content => {
      console.log('==> ', content.procedureContent);
    })
    .catch(err => {
      console.error(err);
      process.exit(0);
    });
}


module.exports = {
  handleProcedureCommand
}