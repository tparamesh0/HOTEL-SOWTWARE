const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('mmpc',{
  saveDoc:(name,bytes)=>ipcRenderer.invoke('mm:saveDoc',name,bytes),
  copyFile:p=>ipcRenderer.invoke('mm:copyFile',p),
  openWA:(phone,text)=>ipcRenderer.invoke('mm:openWA',phone,text),
  show:p=>ipcRenderer.invoke('mm:show',p),
  open:p=>ipcRenderer.invoke('mm:open',p),
  openFolder:()=>ipcRenderer.invoke('mm:openFolder'),
  printToPdf:()=>ipcRenderer.invoke('mm:printToPdf')
});
