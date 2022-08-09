// zipFolder.js
// create a backup of sharkbot's code (or some subset) as-is and write to a zip file

const JSZip = require('jszip');
const fs = require('fs'); const path = require('path');

function getDirContent(zip, dir) {
  fs.readdirSync(dir, {withFileTypes: true})
    .filter(item => item.name != 'node_modules' && item.name != '.git')
    .forEach(item => {
      if (item.isDirectory()) {
        getDirContent(zip.folder(item.name), path.resolve(dir,item.name))
      }
      else {
        zip.file(item.name, fs.readFileSync(path.resolve(dir, item.name)))
      }
    })
  return zip;
}

module.exports = (filepath='../../',outputName='sbBackup') => {
  let zip = new JSZip();
  zip = getDirContent(zip,path.resolve(__dirname, filepath));

  zip
    .generateNodeStream({type:'nodebuffer',streamFiles:true})
    .pipe(fs.createWriteStream(`${outputName}.zip`, {encoding: 'binary'}))
    .on('finish', function () {
        // JSZip generates a readable stream with a "end" event,
        // but is piped here in a writable stream which emits a "finish" event.
        console.log(`${outputName}.zip written.`);
    });
  console.log(path.resolve(__dirname, filepath, outputName+'.zip'))
  return path.resolve(__dirname, filepath, outputName+'.zip');
}
