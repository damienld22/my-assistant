const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const { save, getList, getByName, deleteByName } = require('./storage');

/**
 * Handle a procedure command from the CLI
 * @param {String} mode What we do (add, remove, update, list, get)
 */
function handleProcedureCommand (mode) {
  switch (mode) {
    case 'add':
      handleAddProcedure();
      break;
    case 'find':
      handleFindProcedure();
      break;
    case 'del':
    case 'delete':
      handleDeleteProcedure();
      break;
    case 'update':
    case 'edit':
      handleUpdateProcedure();
      break;
    default:
      handleFindProcedure();
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
    await save(procedureName, procedureContent, 'procedure');
    console.log(`Procedure named "${procedureName}" is saved !`);
  } catch (err) {
    console.error('Failed to add procedure', err);
  }
}

/**
 * Find a procedure from his name with autocompletion
 */
async function handleFindProcedure () {
  const procedures = getList('procedure');
  const { findProcedure } = await inquirer
    .prompt([{
      type: 'autocomplete',
      name: 'findProcedure',
      message: 'Search you procedure',
      source: function (answsers, input) {
        return new Promise(resolve => {
          const fuzzyResult = fuzzy.filter(input, procedures);
          resolve(
            fuzzyResult.map(function (el) {
              return el.original || el;
            })
          );
        });
      }
    }]);
  displayProcedure(findProcedure, getByName(findProcedure, 'procedure'));
}

/**
 * Update a procedure from his name with autocompletion
 */
async function handleUpdateProcedure () {
  const procedures = getList('procedure');
  const { findProcedure } = await inquirer
    .prompt([{
      type: 'autocomplete',
      name: 'findProcedure',
      message: 'Search you procedure',
      source: function (answsers, input) {
        return new Promise(resolve => {
          const fuzzyResult = fuzzy.filter(input, procedures);
          resolve(
            fuzzyResult.map(function (el) {
              return el.original || el;
            })
          );
        });
      }
    }]);

  const { procedureContent } = await inquirer
    .prompt({ name: 'procedureContent', message: 'Please update your procedure', type: 'editor', default: getByName(findProcedure, 'procedure') });
  await save(findProcedure, procedureContent, 'procedure');
  console.log(`Procedure named "${findProcedure}" is udpated !`);
}

/**
 * Delete a procedure from his name with autocompletion
 */
async function handleDeleteProcedure () {
  const procedures = getList('procedure');
  const { toDeleteProcedure } = await inquirer
    .prompt([{
      type: 'autocomplete',
      name: 'toDeleteProcedure',
      message: 'Search you procedure',
      source: function (answsers, input) {
        return new Promise(resolve => {
          const fuzzyResult = fuzzy.filter(input, procedures);
          resolve(
            fuzzyResult.map(function (el) {
              return el.original || el;
            })
          );
        });
      }
    }]);

  const { confirmationDeleteProcedure } = await inquirer
    .prompt([{
      type: 'confirm',
      name: 'confirmationDeleteProcedure',
      message: `Do you want to delete the "${toDeleteProcedure}" procedure`
    }]);

  if (confirmationDeleteProcedure) {
    deleteByName(toDeleteProcedure, 'procedure');
    console.log(`The "${toDeleteProcedure}" procedure has been deleted!`);
  }
}

/**
 * Display the procedure in the standard output
 * @param {String} name Name of the procedure
 * @param {String} content Content of the procedure
 */
function displayProcedure (name, content) {
  console.log(`Procedure : ${name}\n`);
  console.log(content);
}

module.exports = {
  handleProcedureCommand
};
