const { glob } = require('glob');
const { promisify } = require('util');

const globPromise = promisify(glob);

async function loadFiles(dirName) {
    // gets all files in the directory
    const files = await globPromise(`${process.cwd()}/${dirName}/**/*.js`);
    // removes every cached version of this file
    files.forEach((file) => delete require.cache[require.resolve(file)]);
    return files;
}

module.exports = { loadFiles }