const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));const ok=(n,v)=>console.log(v?'PASS':'FAIL',n);
let printed=0;await p.exposeFunction('__pr',()=>printed++);
await p.goto('file:///home/claude/app/preview_extras_perperson.html');await p.waitForTimeout(400);
await p.evaluate(()=>{window.print=()=>__pr()});
ok('pro on',await p.evaluate(()=>document.body.classList.contains('pro')));
const shot=async n=>{await p.waitForTimeout(150);await p.screenshot({path:'/tmp/claude-0/s300/'+n+'.png'})};
await shot('home');
for(const k of ['colors','backup','plans']){await p.evaluate(k=>{UI.sset=k;go('settings')},k);await shot('set_'+k)}
ok('csv/company/pprate gone',await p.evaluate(()=>!document.querySelector('[data-a="sset"][data-k="csv"],[data-a="sset"][data-k="company"]')));
await p.fill('[data-ssq]','meal');await p.waitForTimeout(400);ok('settings search',await p.evaluate(()=>document.querySelectorAll('.sgi').length>=1&&document.querySelectorAll('.sgi').length<5));
await p.evaluate(()=>go('find'));await shot('find');
// time history page
const t=await p.evaluate(()=>{const a=performance.now();go('hist');return performance.now()-a});console.log('hist ms',t.toFixed(0));await shot('hist');
const pages=await p.evaluate(()=>Object.keys(PAGES));
for(const pg of pages){await p.evaluate(g=>{try{go(g)}catch(e){console.log(e)}},pg);await p.waitForTimeout(60)}
ok('all pages render',errs.length===0);
await p.evaluate(()=>{UI.pkgTab='day';go('pkgset')});await shot('pkgset');
for(const k of ['docs','dshow','pprate','layout']){await p.evaluate(k=>{UI.pkgTab=k;go('pkgset')},k);await shot('pkg_'+k)}
await p.evaluate(()=>go('pkgs'));await shot('pkgs');
const nm=await p.evaluate(()=>{UI.pkgDur='3';S.set.docMeta.pkgName='Premium Package';S.set.docMeta.type='quotation';return pdfName('3')});console.log(nm);ok('pdf name',/^3N 4D - Premium Package - Quotation /.test(nm));
const nm2=await p.evaluate(()=>{S.set.docMeta.type='invoice';const r=pdfName('3');S.set.docMeta.type='quotation';return r});console.log(nm2);
const btn=await p.locator('[data-a="docPrint"][data-pdf], [data-a="docPrint"]').count();console.log('docPrint btns',btn);
console.log('printed',printed,'errs',errs);await b.close()})();
