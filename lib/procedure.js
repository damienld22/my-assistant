const inquirer = require('inquirer');

/**
 * Handle a procedure command from the CLI
 * @param {String} mode What we do (add, remove, update, list, get)
 */
function handleProcedureCommand (mode) {
  switch (mode) {
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
async function handleAddProcedure () {
  try {
    const { procedureName } = await inquirer
      .prompt({ name: 'procedureName', message: 'Please type the name of your procedure', type: 'input' });
    const { procedureContent } = await inquirer
      .prompt({ name: 'procedureContent', message: 'Please type your procedure', type: 'editor' });
    console.log('==> name : ', procedureName);
    console.log('==> content : ', procedureContent);
  } catch (err) {
    console.error('Failed to add procedure', err);
  }
}

module.exports = {
  handleProcedureCommand
};
