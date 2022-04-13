import { app,  BrowserWindow, dialog, ipcMain ,protocol} from 'electron';
import * as fs from "fs" ;
import * as path from "path";
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';


// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}
protocol.registerSchemesAsPrivileged([
  { scheme: 'http', privileges: { standard: true, bypassCSP: true, allowServiceWorkers: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
  { scheme: 'https', privileges: { standard: true, bypassCSP: true, allowServiceWorkers: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
  { scheme: 'file', privileges: { standard: true, bypassCSP: true, allowServiceWorkers: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
  { scheme: 'mailto', privileges: { standard: true } },
]);


let mainwindow2:BrowserWindow = null;



const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences:{
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      allowRunningInsecureContent:true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });
  mainwindow2=mainWindow;
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};



async function getSize () {
  const windowBounds =  mainwindow2.getSize();
  return windowBounds;
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({properties: ['openFile'],filters: [ { name: "PDFs", extensions: ['pdf'] } ]});
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}
app.whenReady().then(() => {

  ipcMain.handle('dialog:openFile', handleFileOpen);
  ipcMain.handle('browserWindow:getSize', getSize);
  // installExtension(REACT_DEVELOPER_TOOLS)
  //     .then((name) => console.log(`Added Extension:  ${name}`))
  //     .catch((err) => console.log('An error occurred: ', err));


});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

