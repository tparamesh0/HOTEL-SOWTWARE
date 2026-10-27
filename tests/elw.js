const {_electron:electron}=require('playwright');
(async()=>{const app=await electron.launch({args:['/home/claude/pc','--no-sandbox'],executablePath:'/home/claude/pc/node_modules/electron/dist/electron'});const w=await app.firstWindow();await w.waitForTimeout(1200);const errs=[];w.on('pageerror',e=>errs.push(e.message));
await app.evaluate(({shell})=>{shell.openExternal=async u=>{global.__opened=u}});
const b64=require('fs').readFileSync('/tmp/claude-0/poster_fhd.jpg').toString('base64');
await w.evaluate(async b=>{const bin=atob(b),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);const blob=new Blob([u],{type:'image/jpeg'});await tplSendWA({name:'Andaman Offer',type:'image/jpeg',blob},'9876543210','Hello')},b64);
await w.waitForTimeout(500);
const r=await app.evaluate(({clipboard})=>{const im=clipboard.readImage();return {size:im.getSize(),opened:global.__opened}});console.log(r);
console.log('errs',errs);await app.close()})();
