import { contextBridge, ipcRenderer} from 'electron';

const files={
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  getTempPath: () => ipcRenderer.invoke('app:getTempPath')
}
const browserWindow={
  getSize: () => ipcRenderer.invoke('browserWindow:getSize')
}
export const API = {
  files:files,
  browserWindow:browserWindow
}

contextBridge.exposeInMainWorld('api', API)