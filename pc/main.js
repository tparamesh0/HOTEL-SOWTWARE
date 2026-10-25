const {app,BrowserWindow,shell,Menu,dialog,session}=require('electron');
const path=require('path');
const APP_NAME='Magic Memories';
if(!app.requestSingleInstanceLock()){app.quit()}
let win;
function create(){
  win=new BrowserWindow({width:1440,height:900,minWidth:1000,minHeight:640,title:APP_NAME+' — Hotel & Tour Software',icon:path.join(__dirname,'app','icon.png'),backgroundColor:'#f8f9fa',show:false,autoHideMenuBar:true,
    webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,spellcheck:false}});
  win.loadFile(path.join(__dirname,'app','index.html'));
  win.once('ready-to-show',()=>{win.maximize();win.show()});
  // WhatsApp and other web links open in the normal browser / WhatsApp app
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:|^mailto:|^tel:|^whatsapp:/.test(url))shell.openExternal(url);return{action:'deny'}});
  win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith('file:')){e.preventDefault();shell.openExternal(url)}});
  win.on('page-title-updated',e=>e.preventDefault());
}
app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus()}});
app.whenReady().then(()=>{
  app.setAppUserModelId('com.magicmemories.hotelrates');
  // every download (backup, Excel, PDF) asks where to save
  session.defaultSession.on('will-download',(e,item)=>{item.setSaveDialogOptions({title:'Save '+item.getFilename(),defaultPath:path.join(app.getPath('documents'),item.getFilename())})});
  const tpl=[{label:'File',submenu:[{label:'Print…',accelerator:'CmdOrCtrl+P',click:()=>win&&win.webContents.print()},{type:'separator'},{role:'reload',label:'Reload'},{type:'separator'},{role:'quit',label:'Exit'}]},
    {label:'View',submenu:[{role:'zoomIn'},{role:'zoomOut'},{role:'resetZoom'},{type:'separator'},{role:'togglefullscreen',label:'Full screen'}]},
    {label:'Help',submenu:[{label:'Where is my data?',click:()=>dialog.showMessageBox(win,{type:'info',title:APP_NAME,message:'Your data is saved on this computer automatically.',detail:'Location:\n'+app.getPath('userData')+'\n\nTo move it to another computer or keep a safe copy, use Settings → Backup & Restore → Export all data.'})},{label:'About',click:()=>dialog.showMessageBox(win,{type:'info',title:APP_NAME,icon:path.join(__dirname,'app','icon.png'),message:'Magic Memories Tours and Travels',detail:'Hotel Rate & Tour Package Software\nVersion '+app.getVersion()+'\nPort Blair, Andaman & Nicobar Islands'})}]}];
  Menu.setApplicationMenu(Menu.buildFromTemplate(tpl));
  create();
});
app.on('window-all-closed',()=>app.quit());
