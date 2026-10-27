const {app,BrowserWindow,shell,Menu,dialog,session,ipcMain,clipboard,nativeImage}=require('electron');
const fs=require('fs');
const path=require('path');
const APP_NAME='Magic Memories';
if(!app.requestSingleInstanceLock()){app.quit()}
let win;
const BRF=()=>path.join(app.getPath('userData'),'branding.json');
function brandLoad(){try{return JSON.parse(fs.readFileSync(BRF(),'utf8'))}catch(e){return {}}}
const brandIcon=()=>{const p=path.join(app.getPath('userData'),'brand.png');return fs.existsSync(p)?p:path.join(__dirname,'app','icon.png')};
const brandTitle=()=>{const b=brandLoad();return b.name||(APP_NAME+' — Hotel & Tour Software')};
function icoFromPng(buf){const h=Buffer.alloc(22);h.writeUInt16LE(0,0);h.writeUInt16LE(1,2);h.writeUInt16LE(1,4);h.writeUInt8(0,6);h.writeUInt8(0,7);h.writeUInt8(0,8);h.writeUInt8(0,9);h.writeUInt16LE(1,10);h.writeUInt16LE(32,12);h.writeUInt32LE(buf.length,14);h.writeUInt32LE(22,18);return Buffer.concat([h,buf])}
const zk=d=>{if(win&&!win.isDestroyed())win.webContents.send('mm:zoomKey',d)};
function create(){
  win=new BrowserWindow({width:1440,height:900,minWidth:760,minHeight:480,title:brandTitle(),icon:brandIcon(),backgroundColor:'#f8f9fa',show:false,autoHideMenuBar:true,
    webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,spellcheck:false,preload:path.join(__dirname,'preload.js')}});
  win.loadFile(path.join(__dirname,'app','index.html'));
  win.once('ready-to-show',()=>{win.maximize();win.show()});
  // WhatsApp and other web links open in the normal browser / WhatsApp app
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:|^mailto:|^tel:|^whatsapp:/.test(url)){const m=/^https:\/\/wa\.me\/(\d*)\??(.*)$/.exec(url);if(m&&process.platform==='win32'){const q=new URLSearchParams(m[2]);openWA(m[1],q.get('text')||'')}else shell.openExternal(url)}else if(/^blob:|^file:/.test(url))return{action:'allow'};return{action:'deny'}});
  win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith('file:')){e.preventDefault();shell.openExternal(url)}});
  win.on('page-title-updated',e=>e.preventDefault());
  win.webContents.on('zoom-changed',(e,dir)=>zk(dir==='in'?1:-1));
}
const PRF=()=>path.join(app.getPath('userData'),'prefs.json');const prefs=()=>{try{return JSON.parse(fs.readFileSync(PRF(),'utf8'))}catch(e){return {}}};
const docsDir=()=>{const d=path.join(app.getPath('documents'),APP_NAME,'Documents');fs.mkdirSync(d,{recursive:true});return d};
const pdfDir=()=>{const p=prefs().pdfDir;try{if(p&&fs.existsSync(p))return p}catch(e){}const d=path.join(app.getPath('documents'),APP_NAME,'Quotations & Invoices');fs.mkdirSync(d,{recursive:true});return d};
async function openWA(phone,text){const q='phone='+encodeURIComponent(phone||'')+'&text='+encodeURIComponent(text||'');try{await shell.openExternal('whatsapp://send?'+q);return 'app'}catch(e){dialog.showMessageBox(win,{type:'warning',title:'WhatsApp',message:'WhatsApp desktop app was not found on this PC.',detail:'Install WhatsApp from the Microsoft Store (or whatsapp.com/download), sign in once, then press Send again.'});return 'none'}}
ipcMain.handle('mm:saveDoc',(e,name,bytes)=>{const safe=String(name||'Document.pdf').replace(/[<>:"/\\|?*]+/g,'-');let p=path.join(docsDir(),safe),k=2;const ext=path.extname(safe),base=safe.slice(0,safe.length-ext.length);while(fs.existsSync(p))p=path.join(docsDir(),base+' ('+(k++)+')'+ext);fs.writeFileSync(p,Buffer.from(bytes));return p});
ipcMain.handle('mm:savePdf',async(e,name,bytes,sub,ask)=>{const safe=String(name||'Bill.pdf').replace(/[<>:"/\\|?*]+/g,'-').trim();const parts=(Array.isArray(sub)?sub:[]).map(x=>String(x||'').replace(/[<>:"/\\|?*]+/g,'-').replace(/^\.+/,'').trim()).filter(Boolean);const dir=path.join(pdfDir(),...parts);fs.mkdirSync(dir,{recursive:true});let p=path.join(dir,safe),k=2;const ext=path.extname(safe),base=safe.slice(0,safe.length-ext.length);while(fs.existsSync(p))p=path.join(dir,base+' ('+(k++)+')'+ext);if(ask){const r=await dialog.showSaveDialog(win,{title:'Save PDF',defaultPath:p,filters:[{name:'PDF',extensions:['pdf']}]});if(r.canceled||!r.filePath)return null;p=r.filePath}fs.writeFileSync(p,Buffer.from(bytes));return p});
ipcMain.handle('mm:getPdfDir',()=>pdfDir());
ipcMain.handle('mm:listPdfs',()=>{const dir=pdfDir(),files=[];const walk=(d,depth)=>{let L=[];try{L=fs.readdirSync(d,{withFileTypes:true})}catch(e){return}for(const f of L){const p=path.join(d,f.name);if(f.isDirectory()){if(depth<3)walk(p,depth+1)}else if(/\.pdf$/i.test(f.name)){try{const st=fs.statSync(p);files.push({name:f.name,path:p,size:st.size,mtime:st.mtimeMs,sub:path.relative(dir,d)})}catch(e){}}}};walk(dir,0);files.sort((a,b)=>b.mtime-a.mtime);return{dir,files:files.slice(0,2000)}});
ipcMain.handle('mm:setPdfDir',(e,p)=>{p=String(p||'').trim();if(!p||!path.isAbsolute(p))return{ok:false,msg:'Type a full folder path, e.g. D:\\Quotations'};try{fs.mkdirSync(p,{recursive:true});fs.accessSync(p,fs.constants.W_OK)}catch(x){return{ok:false,msg:'Cannot use this folder: '+x.message}}const o=prefs();o.pdfDir=p;fs.writeFileSync(PRF(),JSON.stringify(o));return{ok:true,dir:p}});
ipcMain.handle('mm:resetPdfDir',()=>{const o=prefs();delete o.pdfDir;fs.writeFileSync(PRF(),JSON.stringify(o));return pdfDir()});
ipcMain.handle('mm:pickPdfDir',async()=>{const r=await dialog.showOpenDialog(win,{title:'Choose the folder for saved quotations & invoices',defaultPath:pdfDir(),properties:['openDirectory','createDirectory']});if(r.canceled||!r.filePaths[0])return null;const o=prefs();o.pdfDir=r.filePaths[0];fs.writeFileSync(PRF(),JSON.stringify(o));return o.pdfDir});
ipcMain.handle('mm:openPath',(e,p)=>shell.openPath(p));
ipcMain.handle('mm:copyImage',(e,p)=>{try{const im=nativeImage.createFromPath(p);if(im.isEmpty())return false;clipboard.clear();clipboard.writeImage(im);return true}catch(x){return false}});
ipcMain.handle('mm:copyFile',(e,p)=>{if(process.platform==='win32'){clipboard.writeBuffer('FileNameW',Buffer.from(p+'\0','ucs2'))}else clipboard.writeText(p);return true});
ipcMain.handle('mm:openWA',(e,phone,text)=>openWA(phone,text));
const WA_PS='$ErrorActionPreference=\'SilentlyContinue\'\nAdd-Type -TypeDefinition \'using System;using System.Runtime.InteropServices;using System.Text;public class MMW{[DllImport("user32.dll")]public static extern IntPtr GetForegroundWindow();[DllImport("user32.dll")]public static extern int GetWindowText(IntPtr h,StringBuilder s,int n);[DllImport("user32.dll")]public static extern bool SetForegroundWindow(IntPtr h);[DllImport("user32.dll")]public static extern bool ShowWindow(IntPtr h,int c);}\'\nAdd-Type -AssemblyName System.Windows.Forms\nfunction T(){$h=[MMW]::GetForegroundWindow();$sb=New-Object System.Text.StringBuilder 512;[void][MMW]::GetWindowText($h,$sb,512);return $sb.ToString()}\n$ok=$false\nfor($i=0;$i -lt 48;$i++){Start-Sleep -Milliseconds 250;if((T) -like \'*WhatsApp*\'){$ok=$true;break};if($i -eq 16 -or $i -eq 32){$p=Get-Process | Where-Object {$_.MainWindowTitle -like \'*WhatsApp*\'} | Select-Object -First 1;if($p){[void][MMW]::ShowWindow($p.MainWindowHandle,9);[void][MMW]::SetForegroundWindow($p.MainWindowHandle)}}}\nif(-not $ok){\'nofocus\';exit}\nStart-Sleep -Milliseconds __WAIT__\nif((T) -notlike \'*WhatsApp*\'){\'nofocus\';exit}\nif(__TEXT__ -eq 1){[System.Windows.Forms.SendKeys]::SendWait(\'{ENTER}\');\'sent\';exit}\n[System.Windows.Forms.SendKeys]::SendWait(\'^v\')\nStart-Sleep -Milliseconds 2200\nif((T) -notlike \'*WhatsApp*\'){\'pasted\';exit}\n[System.Windows.Forms.SendKeys]::SendWait(\'{ENTER}\')\nif(__MSG__ -eq 1){Start-Sleep -Milliseconds 1500;if((T) -like \'*WhatsApp*\'){[System.Windows.Forms.SendKeys]::SendWait(\'{ENTER}\')}}\n\'sent\'';
ipcMain.handle('mm:waAutoSend',(e,waitMs,hasMsg,kind)=>new Promise(res=>{if(process.platform!=='win32'){res('unsupported');return}const w=Math.max(500,Math.min(10000,+waitMs||2000));const script=WA_PS.replace('__WAIT__',String(w)).replace('__MSG__',hasMsg?'1':'0').replace('__TEXT__',kind==='text'?'1':'0');let out='';try{const cp=require('child_process').spawn('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-EncodedCommand',Buffer.from(script,'utf16le').toString('base64')],{windowsHide:true});cp.stdout.on('data',d=>out+=d);cp.on('close',()=>res((out.trim().split(/\s+/).pop())||'nofocus'));cp.on('error',()=>res('error'));setTimeout(()=>{try{cp.kill()}catch(x){}res('timeout')},30000)}catch(x){res('error')}}));
ipcMain.handle('mm:show',(e,p)=>{shell.showItemInFolder(p);return true});
ipcMain.handle('mm:open',(e,p)=>shell.openPath(p));
ipcMain.handle('mm:openFolder',()=>shell.openPath(docsDir()));
ipcMain.handle('mm:printToPdf',async e=>{const wc=e.sender,z=wc.getZoomFactor();if(z!==1)wc.setZoomFactor(1);try{return await wc.printToPDF({pageSize:'A4',printBackground:true,margins:{marginType:'custom',top:0.3,bottom:0.3,left:0.3,right:0.3}})}finally{if(z!==1)wc.setZoomFactor(z)}});
ipcMain.handle('mm:setBrand',async(e,o)=>{const ud=app.getPath('userData'),b=brandLoad(),name=String(o&&o.name||'').replace(/[<>:"/\\|?*]+/g,'').trim().slice(0,60)||APP_NAME,res={ok:true,shortcuts:0};
  try{if(o.png512){fs.writeFileSync(path.join(ud,'brand.png'),Buffer.from(o.png512.split(',')[1],'base64'))}if(o.png256){fs.writeFileSync(path.join(ud,'brand.ico'),icoFromPng(Buffer.from(o.png256.split(',')[1],'base64')))}
   if(win&&!win.isDestroyed()){win.setTitle(name);win.setIcon(nativeImage.createFromPath(brandIcon()))}
   if(process.platform==='win32'){const ico=fs.existsSync(path.join(ud,'brand.ico'))?path.join(ud,'brand.ico'):process.execPath,old=b.shortcut||APP_NAME,dirs=[app.getPath('desktop'),path.join(process.env.APPDATA||'','Microsoft','Windows','Start Menu','Programs')];
    for(const dir of dirs){try{const op=path.join(dir,old+'.lnk'),np=path.join(dir,name+'.lnk');let opts={target:process.execPath,cwd:path.dirname(process.execPath)};if(fs.existsSync(op)){try{opts={...shell.readShortcutLink(op)}}catch(x){}}else if(dir!==dirs[0])continue;opts.icon=ico;opts.iconIndex=0;opts.appUserModelId=opts.appUserModelId||'com.magicmemories.hotelrates';if(shell.writeShortcutLink(np,fs.existsSync(np)?'replace':'create',opts)){res.shortcuts++;if(np.toLowerCase()!==op.toLowerCase()&&fs.existsSync(op))fs.unlinkSync(op)}}catch(x){}}
    try{require('child_process').exec('ie4uinit.exe -show')}catch(x){}}
   fs.writeFileSync(BRF(),JSON.stringify({name,shortcut:name}))}catch(err){res.ok=false;res.err=String(err&&err.message||err)}return res});
ipcMain.handle('mm:getBrand',()=>brandLoad());
ipcMain.handle('mm:zoom',(e,f)=>{e.sender.setZoomFactor(Math.max(.25,Math.min(3,+f||1)));return true});
app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus()}});
app.whenReady().then(()=>{
  app.setAppUserModelId('com.magicmemories.hotelrates');
  // every download (backup, Excel, PDF) asks where to save
  session.defaultSession.on('will-download',(e,item)=>{item.setSaveDialogOptions({title:'Save '+item.getFilename(),defaultPath:path.join(app.getPath('documents'),item.getFilename())})});
  const tpl=[{label:'File',submenu:[{label:'Print…',accelerator:'CmdOrCtrl+P',click:()=>win&&win.webContents.print()},{type:'separator'},{role:'reload',label:'Reload'},{type:'separator'},{role:'quit',label:'Exit'}]},
    {label:'View',submenu:[{label:'Bigger',accelerator:'CmdOrCtrl+=',click:()=>zk(1)},{label:'Bigger ',accelerator:'CmdOrCtrl+Plus',visible:false,click:()=>zk(1)},{label:'Bigger  ',accelerator:'CmdOrCtrl+numadd',visible:false,click:()=>zk(1)},{label:'Smaller',accelerator:'CmdOrCtrl+-',click:()=>zk(-1)},{label:'Smaller ',accelerator:'CmdOrCtrl+numsub',visible:false,click:()=>zk(-1)},{label:'Auto size (fit screen)',accelerator:'CmdOrCtrl+0',click:()=>zk(0)},{type:'separator'},{role:'togglefullscreen',label:'Full screen'}]},
    {label:'Help',submenu:[{label:'Where is my data?',click:()=>dialog.showMessageBox(win,{type:'info',title:APP_NAME,message:'Your data is saved on this computer automatically.',detail:'Location:\n'+app.getPath('userData')+'\n\nTo move it to another computer or keep a safe copy, use Settings → Backup & Restore → Export all data.'})},{label:'About',click:()=>dialog.showMessageBox(win,{type:'info',title:APP_NAME,icon:path.join(__dirname,'app','icon.png'),message:'Magic Memories Tours and Travels',detail:'Hotel Rate & Tour Package Software\nVersion '+app.getVersion()+'\nPort Blair, Andaman & Nicobar Islands'})}]}];
  Menu.setApplicationMenu(Menu.buildFromTemplate(tpl));
  create();
});
app.on('window-all-closed',()=>app.quit());
