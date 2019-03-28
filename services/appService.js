const git = require("simple-git/promise");
const FileUtils = require("../utils/fileUtils");

class AppService {
  constructor() {}

  Download(appName, repositoryURL, commitSHA, indexFile) {
    const folderPrefix = __dirname + "/../app/";
    const folderName = `${appName}${commitSHA}`;

    if (FileUtils.folderExists(folderPrefix + folderName)) {
      FileUtils.deleteFolder(folderPrefix + folderName);
    }

    FileUtils.createFolder(folderPrefix + folderName);

    return git()
      .silent(true)
      .clone(repositoryURL, folderPrefix + folderName)
      .then(() => {
        return {
          folder: folderName,
          entryFile: indexFile
        };
      });

    //Teste
    /*
    return new Promise(function(resolve, reject) {
      const appDetails = {
        folder: "test",
        entryFile: "entry.html"
      };

      // Isto é apenas um exemplo para criar assincronismo
      setTimeout(function() {
        try {
          //throw "Error downloading";
          resolve(appDetails);
        } catch (e) {
          reject(e);
        }
      }, Math.random() * 2000 + 1000);
    });
    */
  }
}

module.exports = AppService;
