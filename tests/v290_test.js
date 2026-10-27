const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));const ok=(n,v)=>console.log(v?'PASS':'FAIL',n);
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
// depth
await p.evaluate(()=>{S.set.colors.main='#e11d48';applyTheme();UI.sset='colors';go('settings')});await p.waitForTimeout(100);
const set=async v=>{await p.locator('[data-dpth]').fill(String(v));await p.locator('[data-dpth]').dispatchEvent('change');await p.waitForTimeout(80);return p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--main').trim())};
const c100=await set(100),c50=await set(50),c0=await set(0);console.log(c0,c50,c100);ok('depth 50 = original',c50==='#e11d48');ok('100 very dark',parseInt(c100.slice(1,3),16)<70);ok('0 very light',parseInt(c0.slice(5,7),16)>200);
await set(75);await p.locator('.card:has(h3:has-text("Colour depth"))').screenshot({path:'/tmp/claude-0/s220/depth.png'});await set(50);
// templates
const lab=await p.evaluate(()=>[...document.querySelectorAll('.nav button')].map(b=>b.textContent.trim()).slice(0,5));console.log(lab);ok('menu under Calendar',lab[3].includes('Templates'));
await p.evaluate(()=>go('tpl'));await p.waitForTimeout(200);
await p.setInputFiles('#tplIn',['/tmp/claude-0/poster_fhd.jpg','/tmp/claude-0/tpl_fhd.png']);await p.waitForTimeout(1200);
const L=await p.evaluate(()=>UI.tplC&&UI.tplC.map(r=>[r.name,r.w,r.h,r.size,qTag(r)]));console.log(L);ok('2 saved, original size',L&&L.length===2&&L.some(x=>x[1]===1920&&x[4]==='Full HD'));
const orig=require('fs').statSync('/tmp/claude-0/tpl_fhd.png').size;ok('exact bytes kept',L.some(x=>x[3]===orig));
await p.screenshot({path:'/tmp/claude-0/s220/tpl.png'});
const id=await p.evaluate(()=>UI.tplC.find(r=>r.w===1080).id);await p.click(`[data-a="tplSetCat"][data-k="${id}"][data-v="poster"]`);await p.click('[data-a="tplCat"][data-k="poster"]');ok('poster filter',await p.locator('.tplc').count()===1);
await p.click(`.tplc [data-a="tplWa"]`);await p.fill('#tplPh','9876543210');await p.locator('#modal .md').screenshot({path:'/tmp/claude-0/s220/tpl_send.png'});
await p.reload();await p.waitForTimeout(300);await p.evaluate(()=>go('tpl'));await p.waitForTimeout(500);ok('persist after reload',await p.evaluate(()=>UI.tplC.length===2));
await p.click('[data-a="tplView"] >> nth=0');await p.waitForTimeout(200);ok('full view',await p.evaluate(()=>!!document.querySelector('.tplfull')));await p.evaluate(()=>closeModal());
await p.click('[data-a="tplDel"] >> nth=0');await p.click('[data-a="tplDel"] >> nth=0');await p.waitForTimeout(200);ok('delete',await p.evaluate(()=>UI.tplC.length===1));
await p.setViewportSize({width:420,height:850});ok('mobile ok',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
console.log('errs',errs);await b.close()})();
