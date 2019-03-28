const electron = require("electron");
const UsuarioService = require("./services/usuarioService");
const AppService = require("./services/appService");
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let downloadWindow;
let loggedUser;

app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadFile("./public/login.html");
  mainWindow.on("closed", () => (mainWindow = null));
});

ipcMain.on("form:login", (event, obj) => {
  const service = new UsuarioService();
  service.GetUserByLogin(obj.user, obj.password).then(usuarios => {
    if (usuarios.length > 0) {
      loggedUser = usuarios[0];

      downloadWindow = new BrowserWindow({
        width: 350,
        height: 100,
        frame: false,
        show: false
      });

      downloadWindow.loadFile("./public/download.html");
      downloadWindow.on("closed", () => (downloadWindow = null));

      mainWindow.close();
      downloadWindow.show();
    } else {
      event.sender.webContents.send("login:failure", null);
    }
  });
});

ipcMain.on("app:close", () => app.exit());

ipcMain.on("app:download", event => {
  console.log("starting app download");

  const service = new AppService();
  service
    .Download(
      loggedUser.appName,
      loggedUser.repositoryURL,
      loggedUser.commitSHA,
      loggedUser.indexFile
    )
    .then(appDetails => {
      console.log("download finished, starting app...");
      mainWindow = new BrowserWindow({
        show: false
      });

      mainWindow.loadFile(`./app/${appDetails.folder}/${appDetails.entryFile}`);
      mainWindow.on("closed", () => (mainWindow = null));

      downloadWindow.close();
      mainWindow.show();
    })
    .catch(err => {
      console.log(err);
      event.sender.webContents.send("app:error");
    });
});
