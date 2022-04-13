import { contextBridge, ipcRenderer} from 'electron';

const files={
  openFile: () => ipcRenderer.invoke('dialog:openFile')
}
const browserWindow={
  getSize: () => ipcRenderer.invoke('browserWindow:getSize')
}
export const API = {
  files:files,
  browserWindow:browserWindow
}

contextBridge.exposeInMainWorld('api', API)