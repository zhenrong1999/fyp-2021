import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { contextBridge, ipcRenderer } from "electron";
import { readFile } from "fs";
import { db } from "../Database";
const files = {
  openEbookFileDialog: () => ipcRenderer.invoke("dialog:openEbookFile"),
  openMindMapFileDialog: () => ipcRenderer.invoke("dialog:openMindMapFile"),
  saveMindMapFileDialog: () => ipcRenderer.invoke("dialog:saveMindMapFile"),
  getTempPath: () => ipcRenderer.invoke("app:getTempPath"),
  writeFile: (filePath: string, data?: string) =>
    ipcRenderer.invoke("app:writeFile", filePath, data),
  writeFileTest: (filePath: string) =>
    ipcRenderer.invoke("app:writeFile", filePath),
};

const browserWindow = {
  infoDialog: (messageBoxOptions: Electron.MessageBoxOptions) =>
    ipcRenderer.invoke("app:infoDialog", messageBoxOptions),
  getSize: () => ipcRenderer.invoke("browserWindow:getSize"),
  getDb: () => {
    return db;
  },
};
const LoadSaveCallingToRenderer = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LoadMindMap: (
    callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on("LoadMindMap", callback),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SaveMindMap: (
    callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on("SaveMindMap", callback),
};

export const API = {
  files: files,
  browserWindow: browserWindow,
  LoadSave: LoadSaveCallingToRenderer,
};

contextBridge.exposeInMainWorld("api", API);
