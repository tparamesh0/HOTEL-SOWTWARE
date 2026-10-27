const {contextBridge,ipcRenderer,webFrame}=require('electron');
contextBridge.exposeInMainWorld('mmpc',{
  saveDoc:(name,bytes)=>ipcRenderer.invoke('mm:saveDoc',name,bytes),
  copyFile:p=>ipcRenderer.invoke('mm:copyFile',p),
  copyImage:p=>ipcRenderer.invoke('mm:copyImage',p),
  savePdf:(n,b,sub,ask)=>ipcRenderer.invoke('mm:savePdf',n,b,sub,ask),
  getPdfDir:()=>ipcRenderer.invoke('mm:getPdfDir'),
  pickPdfDir:()=>ipcRenderer.invoke('mm:pickPdfDir'),
  openPath:p=>ipcRenderer.invoke('mm:openPath',p),
  listPdfs:()=>ipcRenderer.invoke('mm:listPdfs'),
  waAutoSend:(w,m)=>ipcRenderer.invoke('mm:waAutoSend',w,m),
  setPdfDir:p=>ipcRenderer.invoke('mm:setPdfDir',p),
  resetPdfDir:()=>ipcRenderer.invoke('mm:resetPdfDir'),
  openWA:(phone,text)=>ipcRenderer.invoke('mm:openWA',phone,text),
  show:p=>ipcRenderer.invoke('mm:show',p),
  open:p=>ipcRenderer.invoke('mm:open',p),
  openFolder:()=>ipcRenderer.invoke('mm:openFolder'),
  printToPdf:()=>ipcRenderer.invoke('mm:printToPdf'),
  setZoom:f=>{webFrame.setZoomFactor(Math.max(.25,Math.min(3,+f||1)));return true},
  getZoom:()=>webFrame.getZoomFactor(),
  setBrand:o=>ipcRenderer.invoke('mm:setBrand',o),
  getBrand:()=>ipcRenderer.invoke('mm:getBrand'),
  onZoomKey:cb=>ipcRenderer.on('mm:zoomKey',(e,d)=>cb(d))
});
