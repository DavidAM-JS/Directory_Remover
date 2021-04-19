const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var filesRemoved = 0;
var directoriesRemoved = 0;
var pathsFiles = [];
const directory = process.argv[2];

(async function removeDirectory(directory) {
  try {
    const files = await inspectDirectory(directory);
    if (files.length > 0) {
      const conf = await confirm(directory);
      if (conf) {
        await remove(files);
      }
    } else {
      await remove(directory);
    }
  } catch (error) {
    console.log(error);
  }
  console.log(`You removed: ${directoriesRemoved} directories, AND ${filesRemoved} files)`);
})(directory);

async function remove(files) {
  for (file of files) {
    const dirStatus = await fs.lstat(file);
    if (dirStatus.isDirectory()) {
      await fs.rmdir(file);
      directoriesRemoved++;
    } else {
      await fs.rm(file)
      filesRemoved++
    }
  }
}

async function inspectDirectory(directory) {
  const files = await fs.readdir(directory);
  if (files.length > 0) {
      for(const element of files) {
      const file = path.join(directory, element);
      const fileStatus = await fs.stat(file);
      if (fileStatus.isDirectory()) {
        await inspectDirectory(file);
      } else {
        pathsFiles.push(file);
      }
    }
  }
  pathsFiles.push(directory);
  return pathsFiles;
}

function confirm(directory) {
  return new Promise((resolve, reject) => {
    rl.question(`Directory ${directory} is not empty. Do you want to delete all content? Yes/No: `, (answer) => {
      if (answer === 'Yes' || answer === 'yes') {
        rl.close();
        resolve(true);
      } else {
        reject("Remove operation canceled");
      }
    })
  });
}
