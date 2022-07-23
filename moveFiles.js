const fileManager = require('fs');
const pathManager = require('path');

const showCreated = false;
const showPercentage = true;
const deleteFileAfterCopy = true;
const extensions = ['jpg', 'jpeg', 'png'];
const getPath = (f) => pathManager.resolve(__dirname, f);

let filesToCopy = [];

function logCreated(path) {
    console.info(`Created '${path}' folder`);
}

function logPercentage(index) {
    console.info(Math.floor(index * 100) / filesToCopy.length + '%');
}

function getCurrentFilenames() {
    fileManager.readdirSync(__dirname).forEach((file) =>
        extensions.forEach(
            (ext) => file.endsWith(ext) && filesToCopy.push(file)
        )
    );

    if (filesToCopy.length) console.log(`Starting copy of ${filesToCopy.length} files...`);
}

function createPathAndCopyFiles() {
    getCurrentFilenames();

    filesToCopy.forEach((file, fileIndex) => {
        createPath(file);
        copyFileToPath(file);
        
        if (deleteFileAfterCopy) deleteFile(file);
        if (showPercentage) logPercentage(fileIndex);
    });
}

function createPath(fileName) {
    let pathFolder = fileName.split('.')[0];
    let pathFile = getPath(pathFolder);

    if (!fileManager.existsSync(pathFile)) {
        if (showCreated) logCreated(pathFolder);

        fileManager.mkdirSync(pathFile);
    }
}

function copyFileToPath(fileName) {
    let pathFile = getPath(fileName);
    let pathFolder = fileName.split('.')[0];
    let pathCopy = pathManager.resolve(__dirname, pathFolder, fileName);

    fileManager.copyFileSync(pathFile, pathCopy);
}

function deleteFile(fileName) {
    let pathFile = getPath(fileName);
    fileManager.unlinkSync(pathFile);
}

createPathAndCopyFiles();
