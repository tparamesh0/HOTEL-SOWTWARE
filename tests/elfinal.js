const {_electron:electron}=require('playwright');
(async()=>{for(const dir of ['/home/claude/pc','/home/claude/fresh/pc']){const app=await electron.launch({args:[dir,'--no-sandbox'],executablePath:'/home/claude/pc/node_modules/electron/dist/electron'});const w=await app.firstWindow();await w.waitForTimeout(1800);const errs=[];w.on('pageerror',e=>errs.push(e.message));
const info=await w.evaluate(()=>({hotels:S.hotels.length,pro:document.body.classList.contains('pro'),ic3:document.querySelectorAll('img.e3').length,title:document.title,ver:ABOUT.ver,api:['savePdf','listPdfs','setPdfDir','waAutoSend','resetPdfDir'].every(k=>typeof mmpc[k]==='function')}));
for(const g of Object.keys(PAGES_LIST=['home','packages','find','hist','settings','pkgset','starsel','new','zonesel','tpl','about']))await w.evaluate(p=>go(p),PAGES_LIST[g]);
await w.evaluate(()=>{UI.histTab='pdf';go('hist')});await w.waitForTimeout(400);
console.log(dir,JSON.stringify(info),'errs',errs);await w.screenshot({path:'/tmp/claude-0/s300/final_'+(dir.includes('fresh')?'fresh':'mm')+'.png'});await app.close()}})();
