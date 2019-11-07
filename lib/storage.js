const fs = require('fs');
const path = require('path');
const config = require('../config');
const filenamify = require('filenamify');

/**
 * Save a procedure in the system
 */
async function save (title, content, type) {
  try {
    createRootDirectoryIfNecessary();

    if (type === 'procedure') {
      createProcedureDirectoryIfNecessary();
      const filePath = path.join(config.ROOT_DIRECTORY, config.PROCEDURES_DIR, filenamify(title));
      fs.writeFileSync(filePath, content);
    } else if (type === 'command') {
      createCommandDirectoryIfNecessary();
      const filePath = path.join(config.ROOT_DIRECTORY, config.COMMANDS_DIR, filenamify(title));
      fs.writeFileSync(filePath, content);
    }
  } catch (err) {
    console.error('Failed to save the element', err);
    process.exit(0);
  }
}

/**
 * Check if the ".my-assistant" folder is created, also create it
 */
function createRootDirectoryIfNecessary () {
  if (!fs.existsSync(config.ROOT_DIRECTORY)) {
    fs.mkdirSync(config.ROOT_DIRECTORY);
  }
}

/**
 * Check if "procedures" folder exists, also create it
 */
function createProcedureDirectoryIfNecessary () {
  const dirName = path.join(config.ROOT_DIRECTORY, config.PROCEDURES_DIR);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
}

/**
 * Check if "commands" folder exists, also create it
 */
function createCommandDirectoryIfNecessary () {
  const dirName = path.join(config.ROOT_DIRECTORY, config.COMMANDS_DIR);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
}

/**
 * Return list of elements
 */
function getList (type) {
  if (type === 'procedure') {
    return fs.readdirSync(path.join(config.ROOT_DIRECTORY, config.PROCEDURES_DIR));
  } else if (type === 'command') {
    return fs.readdirSync(path.join(config.ROOT_DIRECTORY, config.COMMANDS_DIR));
  }
}

function getByName (name, type) {
  try {
    if (type === 'procedure') {
      return fs.readFileSync(path.join(config.ROOT_DIRECTORY, config.PROCEDURES_DIR, name)).toString();
    } else if (type === 'command') {
      return fs.readFileSync(path.join(config.ROOT_DIRECTORY, config.COMMANDS_DIR, name)).toString();
    }
  } catch (err) {
    console.error('Failed to read the element', err);
  }
}

function deleteByName (name, type) {
  try {
    if (type === 'procedure') {
      return fs.unlinkSync(path.join(config.ROOT_DIRECTORY, config.PROCEDURES_DIR, name));
    } else if (type === 'command') {
      return fs.unlinkSync(path.join(config.ROOT_DIRECTORY, config.COMMANDS_DIR, name));
    }
  } catch (err) {
    console.error('Failed to delete the element', err);
  }
}

module.exports = {
  save,
  getList,
  getByName,
  deleteByName
};
