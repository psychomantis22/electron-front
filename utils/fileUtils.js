var fs = require("fs");

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

class FileUtils {
  folderExists(path) {
    return fs.existsSync(path);
  }

  deleteFolder(path) {
    deleteFolderRecursive(path);
  }

  createFolder(path) {
    fs.mkdirSync(path);
  }
}

module.exports = new FileUtils();
