import { contextBridge, ipcRenderer } from "electron";
import { readFile } from "fs";

const files = {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  getTempPath: () => ipcRenderer.invoke("app:getTempPath"),
  getFileByteBlob: (filePath: string) =>
    ipcRenderer.invoke("app:getFileByteBlob", filePath),
};

const browserWindow = {
  getSize: () => ipcRenderer.invoke("browserWindow:getSize"),
};
export const API = {
  files: files,
  browserWindow: browserWindow,
};

contextBridge.exposeInMainWorld("api", API);
