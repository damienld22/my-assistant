const fs = require('fs');
const path = require('path');
const config = require('../config');
const filenamify = require('filenamify');

/**
 * Save a procedure in the system
 */
async function saveProcedure (title, content) {
  try {
    createRootDirectoryIfNecessary();
    createProcedureDirectoryIfNecessary();

    const filePath = path.join(config.ROOT_DIRECTORY, config.PROCEDURES_DIR, filenamify(title));
    fs.writeFileSync(filePath, content);
  } catch (err) {
    console.error('Failed to save the procedure', err);
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
 * Return list of procedures
 */
function getListOfProcedures () {
  return fs.readdirSync(path.join(config.ROOT_DIRECTORY, config.PROCEDURES_DIR));
}

function getProcedureFromName (name) {
  try {
    const filePath = path.join(config.ROOT_DIRECTORY, config.PROCEDURES_DIR, name);
    return fs.readFileSync(filePath).toString();
  } catch (err) {
    console.error('Failed to read the procedure', err);
  }
}

function deleteProcedureFromName (name) {
  try {
    const filePath = path.join(config.ROOT_DIRECTORY, config.PROCEDURES_DIR, name);
    return fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Failed to delete the procedure', err);
  }
}

module.exports = {
  saveProcedure,
  getListOfProcedures,
  getProcedureFromName,
  deleteProcedureFromName
};
