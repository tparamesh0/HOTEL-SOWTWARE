const {_electron:electron}=require('playwright');
(async()=>{const app=await electron.launch({args:['/home/claude/pc','--no-sandbox'],executablePath:'/home/claude/pc/node_modules/electron/dist/electron'});const w=await app.firstWindow();await w.waitForTimeout(1500);
const errs=[];w.on('pageerror',e=>errs.push(e.message));
await app.evaluate(({shell,ipcMain})=>{shell.openExternal=async u=>{global.__u=u};ipcMain.removeHandler('mm:waAutoSend');ipcMain.handle('mm:waAutoSend',(e,w,m)=>{global.__wa=[w,m];return 'sent'})});
await w.evaluate(()=>{UI.sset='wa';go('settings')});await w.waitForTimeout(300);await w.screenshot({path:'/tmp/claude-0/s300/wa_set.png'});
// fake a template record
await w.evaluate(async()=>{const c=document.createElement('canvas');c.width=40;c.height=40;const b=await new Promise(r=>c.toBlob(r,'image/png'));await tplSendWA({id:'x',name:'Offer',type:'image/png',blob:b,size:b.size},'9876543210','Hello')});
await w.waitForTimeout(500);
console.log('url',await app.evaluate(()=>global.__u),'auto',await app.evaluate(()=>global.__wa),'toast',await w.evaluate(()=>[...document.querySelectorAll('.toast,#toast')].map(t=>t.textContent).join('|')));
console.log('errs',errs);await app.close()})();
