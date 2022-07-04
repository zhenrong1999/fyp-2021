import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  protocol,
  shell,
  Menu,
  ipcRenderer,
} from "electron";
import * as fs from "fs";
import path from "path";
import { ReactNode } from "react";

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
protocol.registerSchemesAsPrivileged([
  {
    scheme: "http",
    privileges: {
      standard: true,
      bypassCSP: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
  {
    scheme: "https",
    privileges: {
      standard: true,
      bypassCSP: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
  {
    scheme: "file",
    privileges: {
      standard: true,
      bypassCSP: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
  { scheme: "mailto", privileges: { standard: true } },
]);

let mainwindow: BrowserWindow = null;

const createWindow = (): void => {
  // Create the browser window.
  mainwindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainwindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainwindow.webContents.openDevTools();
};

async function getSize() {
  const windowBounds = mainwindow.getSize();
  return windowBounds;
}

async function handleEbookFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "PDFs", extensions: ["pdf"] }],
  });
  if (canceled) {
    return;
  } else {
    return {
      filePath: filePaths[0],
      blob: fs.readFileSync(filePaths[0], { encoding: "base64" }),
    };
  }
}

async function handleMindMapFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Mind Map Save Files", extensions: ["mp"] }],
  });
  if (canceled) {
    return;
  } else {
    return fs.readFileSync(filePaths[0], "utf8");
  }
}

async function handleMindMapFileSave() {
  const { canceled, filePath } = await dialog.showSaveDialog({
    properties: ["createDirectory", "showOverwriteConfirmation"],
    filters: [{ name: "Mind Map Save Files", extensions: ["mp"] }],
  });
  if (canceled) {
    return;
  } else {
    return filePath;
  }
}

async function getTempPath() {
  console.log("Temp Dir: " + app.getPath("temp"));
  return app.getPath("temp");
}

async function writeFile(filePath: string, data?: string) {
  if (!data) {
    data = "";
    console.log("No data");
  }
  if (!filePath) {
    filePath = path.join(await getTempPath(), "test.txt");
    console.log("No file path");
  }
  return new Promise<void>((resolve, reject) => {
    console.log("File saved to ", filePath);
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
        console.log("File written successfully");
      }
    });
  });
}

async function infoDialog(messageBoxOptions: Electron.MessageBoxOptions) {
  const { response } = await dialog.showMessageBox(messageBoxOptions);
  return response;
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openEbookFile", handleEbookFileOpen);
  ipcMain.handle("dialog:openMindMapFile", handleMindMapFileOpen);
  ipcMain.handle("dialog:saveMindMapFile", handleMindMapFileSave);
  ipcMain.handle("browserWindow:getSize", getSize);
  ipcMain.handle("app:getTempPath", getTempPath);
  ipcMain.handle("app:infoDialog", (_event, messageBoxOptions) =>
    infoDialog(messageBoxOptions)
  );
  ipcMain.handle("app:writeFile", (_event, args, args2) => {
    writeFile(args, args2);
  });
  ipcMain.handle("app:writeFile2", (_event, args) => {
    writeFile(args);
  });

  const isMac = process.platform === "darwin";

  const template = [
    // // { role: 'appMenu' }
    // ...(isMac
    //   ? [
    //       {
    //         label: app.name,
    //         submenu: [
    //           { role: "about" },
    //           { type: "separator" },
    //           { role: "services" },
    //           { type: "separator" },
    //           { role: "hide" },
    //           { role: "hideOthers" },
    //           { role: "unhide" },
    //           { type: "separator" },
    //           { role: "quit" },
    //         ],
    //       },
    //     ]
    //   : []),
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [
        {
          label: "Open Mind Map",
          click: async () => {
            const savedFileContent = await handleMindMapFileOpen();
            mainwindow.webContents.send("LoadMindMap", savedFileContent);
          },
        },
        {
          label: "Save Mind Map",
          click: async () => {
            ipcMain.once(
              "saveMindMap-reply",
              (event, filePath, savedFileContent) => {
                console.log("Saved to ", filePath);
                console.log("Saved content: ", savedFileContent);
                writeFile(filePath, savedFileContent);
              }
            );
            const filePath = await handleMindMapFileSave();
            mainwindow.webContents.send("SaveMindMap", filePath);
            // writeFile(filePath, savedFileContent);
            // mainwindow.webContents.send("SaveMindMap");
          },
        },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    // // { role: 'editMenu' }
    // {
    //   label: "Edit",
    //   submenu: [
    //     { role: "undo" },
    //     { role: "redo" },
    //     { type: "separator" },
    //     { role: "cut" },
    //     { role: "copy" },
    //     { role: "paste" },
    //     ...(isMac
    //       ? [
    //           { role: "pasteAndMatchStyle" },
    //           { role: "delete" },
    //           { role: "selectAll" },
    //           { type: "separator" },
    //           {
    //             label: "Speech",
    //             submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
    //           },
    //         ]
    //       : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    //   ],
    // },
    // // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    // // { role: 'windowMenu' }
    // {
    //   label: "Window",
    //   submenu: [
    //     { role: "minimize" },
    //     { role: "zoom" },
    //     ...(isMac
    //       ? [
    //           { type: "separator" },
    //           { role: "front" },
    //           { type: "separator" },
    //           { role: "window" },
    //         ]
    //       : [{ role: "close" }]),
    //   ],
    // },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            await shell.openExternal("https://electronjs.org");
          },
        },
      ],
    },
  ];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-next-line
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
