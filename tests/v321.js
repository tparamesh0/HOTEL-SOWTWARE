const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/app/preview_extras_perperson.html');await p.waitForTimeout(800);
await p.evaluate(()=>{UI.pkgDur='3';const h=S.hotels[0],r=h.rooms.find(r=>r.category);S.set.pkgHotels['3']=[h.id,h.id,h.id].map(id=>({id}));go('packages')});await p.waitForTimeout(300);
const btn=p.locator('.sxds button').nth(6);await btn.scrollIntoViewIfNeeded();const k=await btn.getAttribute('data-k');
await btn.dblclick();await p.waitForTimeout(600);
console.log('want',k,'preview',await p.evaluate(()=>UI.pv&&UI.pv.st),'modal',await p.evaluate(()=>!!document.querySelector('.docmd')));
await p.screenshot({path:'/tmp/claude-0/s300/dbl2.png'});console.log(errs);await b.close()})();
