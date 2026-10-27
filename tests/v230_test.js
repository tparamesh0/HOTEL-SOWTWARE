const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));const ok=(n,v)=>console.log(v?'PASS':'FAIL',n);
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
await p.evaluate(()=>{S.set.pkgDays[1][0].stops=['Airport To Hotel','Cellular Jail','Corbyn Cove','Shivan Statue','Flag Point'];UI.pkgTab='day';UI.pkgDay=1;UI.pkgEdit='1:0';go('pkgset')});await p.waitForTimeout(200);
const st=()=>p.evaluate(()=>S.set.pkgDays[1][0].stops.join('|'));
ok('handles',await p.locator('.sdh').count()>=5);
// drag stop 4 (index 3) to top
const src=p.locator('.sdh[data-sdrag="3"]').first(),dst=p.locator('[data-srow="0"]').first();const bb=await dst.boundingBox();
await src.dragTo(dst,{targetPosition:{x:20,y:4}});await p.waitForTimeout(200);console.log(await st());ok('drag stop 4 to first',(await st()).startsWith('Shivan Statue|Airport To Hotel'));
ok('labels renumbered',await p.evaluate(()=>{const r=document.querySelector('[data-srow="0"] td.l');return r.textContent.includes('Stop 1')&&document.querySelector('[data-srow="0"] input').value==='Shivan Statue'}));
const src2=p.locator('.sdh[data-sdrag="0"]').first(),dst2=p.locator('[data-srow="4"]').first();const b2=await dst2.boundingBox();await src2.dragTo(dst2,{targetPosition:{x:20,y:b2.height-3}});await p.waitForTimeout(200);console.log(await st());ok('drag first to last',(await st()).endsWith('Flag Point|Shivan Statue'));
await p.screenshot({path:'/tmp/claude-0/s220/stops.png'});
console.log('errs',errs);await b.close()})();
