const {_electron:electron}=require('playwright');
(async()=>{const app=await electron.launch({args:['/home/claude/pc','--no-sandbox'],executablePath:'/home/claude/pc/node_modules/electron/dist/electron'});const w=await app.firstWindow();await w.waitForTimeout(1500);
for(const [W,H] of [[1093,614],[1280,720],[1366,768],[1920,1080],[800,500]]){await app.evaluate(({BrowserWindow},[W,H])=>{const b=BrowserWindow.getAllWindows()[0];b.unmaximize();b.setContentSize(W,H)},[W,H]);await w.waitForTimeout(700);
const r=await w.evaluate(()=>({inner:[innerWidth,innerHeight],z:ZCUR,base:zBase(),sw:document.documentElement.scrollWidth,iw:innerWidth}));const zf=await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].webContents.getZoomFactor());console.log(W,H,JSON.stringify(r),'native',zf);
await w.screenshot({path:`/tmp/claude-0/s170/elz2_${W}.png`})}
await app.close()})();
