const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const shell = require('shelljs');
const { save, getList, getByName, deleteByName } = require('./storage');

/**
 * Handle a command from the CLI
 * @param {String} mode What we do (add, remove, update, list, get)
 */
function handleCommand (mode) {
  switch (mode) {
    case 'add':
      handleAddCommand();
      break;
    case 'display':
      handleDisplayCommand();
      break;
    case 'del':
    case 'delete':
      handleDeleteCommand();
      break;
    case 'update':
    case 'edit':
      handleUpdateCommand();
      break;
    case 'exec':
    default:
      handleExecCommand();
      break;
  }
}

/**
 * Ask the user to type the command and save it
 */
async function handleAddCommand () {
  try {
    const { commandName } = await inquirer
      .prompt({ name: 'commandName', message: 'Please type the name of your command', type: 'input' });
    const { commandContent } = await inquirer
      .prompt({ name: 'commandContent', message: 'Please type your command', type: 'input' });
    await save(commandName, commandContent, 'command');
    console.log(`Command named "${commandName}" is saved !`);
  } catch (err) {
    console.error('Failed to add command', err);
  }
}

/**
 * Display a command from his name with autocompletion
 */
async function handleDisplayCommand () {
  const commands = getList('command');
  const { findCommand } = await inquirer
    .prompt([{
      type: 'autocomplete',
      name: 'findCommand',
      message: 'Search you command',
      source: function (answsers, input) {
        return new Promise(resolve => {
          const fuzzyResult = fuzzy.filter(input, commands);
          resolve(
            fuzzyResult.map(function (el) {
              return el.original || el;
            })
          );
        });
      }
    }]);
  display(findCommand, getByName(findCommand, 'command'));
}

/**
 * Update a command from his name with autocompletion
 */
async function handleUpdateCommand () {
  const commands = getList('command');
  const { findCommand } = await inquirer
    .prompt([{
      type: 'autocomplete',
      name: 'findCommand',
      message: 'Search you command',
      source: function (answsers, input) {
        return new Promise(resolve => {
          const fuzzyResult = fuzzy.filter(input, commands);
          resolve(
            fuzzyResult.map(function (el) {
              return el.original || el;
            })
          );
        });
      }
    }]);

  const { commandContent } = await inquirer
    .prompt({ name: 'commandContent', message: 'Please update your command', type: 'editor', default: getByName(findCommand, 'command') });
  await save(findCommand, commandContent, 'command');
  console.log(`Command named "${findCommand}" is udpated !`);
}

/**
 * Delete a command from his name with autocompletion
 */
async function handleDeleteCommand () {
  const commands = getList('command');
  const { toDeleteCommand } = await inquirer
    .prompt([{
      type: 'autocomplete',
      name: 'toDeleteCommand',
      message: 'Search you command',
      source: function (answsers, input) {
        return new Promise(resolve => {
          const fuzzyResult = fuzzy.filter(input, commands);
          resolve(
            fuzzyResult.map(function (el) {
              return el.original || el;
            })
          );
        });
      }
    }]);

  const { confirmationDeleteCommand } = await inquirer
    .prompt([{
      type: 'confirm',
      name: 'confirmationDeleteCommand',
      message: `Do you want to delete the "${toDeleteCommand}" command`
    }]);

  if (confirmationDeleteCommand) {
    deleteByName(toDeleteCommand, 'command');
    console.log(`The "${toDeleteCommand}" command has been deleted!`);
  }
}

/**
 * Execute a command from his name with autocompletion
 */
async function handleExecCommand () {
  const commands = getList('command');
  const { findCommand } = await inquirer
    .prompt([{
      type: 'autocomplete',
      name: 'findCommand',
      message: 'Search you command',
      source: function (answsers, input) {
        return new Promise(resolve => {
          const fuzzyResult = fuzzy.filter(input, commands);
          resolve(
            fuzzyResult.map(function (el) {
              return el.original || el;
            })
          );
        });
      }
    }]);
  execute(getByName(findCommand, 'command'));
}

/**
 * Display the element in the standard output
 * @param {String} name Name of the element
 * @param {String} content Content of the element
 */
function display (name, content) {
  console.log(`Command : ${name}\n`);
  console.log(content);
}

/**
 * Execute a command
 * @param {String} command Command to launch
 */
function execute (command) {
  shell.exec(command);
}

module.exports = {
  handleCommand
};
