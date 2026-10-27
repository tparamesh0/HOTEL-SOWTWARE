const {contextBridge,ipcRenderer,webFrame}=require('electron');
contextBridge.exposeInMainWorld('mmpc',{
  saveDoc:(name,bytes)=>ipcRenderer.invoke('mm:saveDoc',name,bytes),
  copyFile:p=>ipcRenderer.invoke('mm:copyFile',p),
  openWA:(phone,text)=>ipcRenderer.invoke('mm:openWA',phone,text),
  show:p=>ipcRenderer.invoke('mm:show',p),
  open:p=>ipcRenderer.invoke('mm:open',p),
  openFolder:()=>ipcRenderer.invoke('mm:openFolder'),
  printToPdf:()=>ipcRenderer.invoke('mm:printToPdf'),
  setZoom:f=>{webFrame.setZoomFactor(Math.max(.25,Math.min(3,+f||1)));return true},
  getZoom:()=>webFrame.getZoomFactor(),
  onZoomKey:cb=>ipcRenderer.on('mm:zoomKey',(e,d)=>cb(d))
});
