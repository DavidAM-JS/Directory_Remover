const fs = require('fs');
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

(function removeDirectory(directory) {
    try {
        const files = inspectDirectory(directory);
        if (files.length > 1) {
            rl.question(`Directory ${directory} is not empty. Do you want to delete all content? Yes/No: `, (answer) => {
                if (answer === 'Yes' || answer === 'yes') {
                    removeAll(files);
                    finishProcess();
                } else {
                    console.log("Remove operation canceled")
                    finishProcess();
                }
            });
        } else {
            fs.rmdirSync(directory);
            directoriesRemoved++
            finishProcess();
        }
    } catch (error) {
        console.log(error.message);
        finishProcess();
    }
})(directory);

function inspectDirectory(directory) {
    const files = fs.readdirSync(directory);
    if (files.length > 0) {
        files.forEach((element) => {
            const file = path.join(directory, element);
            const fileStatus = fs.statSync(file);
            if (fileStatus.isDirectory()) {
                inspectDirectory(file);
            } else {
                pathsFiles.push(file);
            }
        });
    }
    pathsFiles.push(directory);
    return pathsFiles;
}

function removeAll(files) {
    files.forEach((file) => {
        const dirStatus = fs.lstatSync(file);
        if (dirStatus.isDirectory()) {
            fs.rmdirSync(file);
            directoriesRemoved++;
        } else {
            fs.unlinkSync(file)
            filesRemoved++;
        }
    });
}

function finishProcess() {
    console.log(`You removed: ${directoriesRemoved} directories, AND ${filesRemoved} files)`);
    process.exit();
}
