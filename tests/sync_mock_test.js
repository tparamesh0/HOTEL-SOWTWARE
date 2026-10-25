const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const store=new Map();const pages=[];
const srv=src=>async(op,rows)=>{if(op==='select')return [...store.values()];rows.forEach(r=>store.set(r.k,{...r}));for(const p of pages)if(p!==src)await p.evaluate(rs=>window.__rt&&window.__rt(rs),rows).catch(()=>{});return true};
const mk=async()=>{const c=await b.newContext({viewport:{width:1300,height:900}});const p=await c.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.route('**/supabase-js@2.45.4/dist/umd/supabase.js',r=>r.fulfill({body:fs.readFileSync('/tmp/claude-0/mocksb.js'),contentType:'text/javascript'}));await p.exposeFunction('__mockSrv',srv(p));pages.push(p);await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);return p};
const PC=await mk(),PH=await mk();
// PC setup + login
await PC.evaluate(()=>{go('settings');UI.sset='cloud';render()});
await PC.fill('[data-sbc=url]','https://abc.supabase.co');await PC.fill('[data-sbc=key]','anonkey');await PC.fill('[data-sbc=email]','me@gmail.com');await PC.fill('#sbPw','wrong1');
await PC.click('[data-a=sbIn]');await PC.waitForTimeout(400);console.log('wrong pw msg:',await PC.locator('.sbstep p.mini').last().innerText().catch(()=>'-'));
await PC.fill('#sbPw','secret1');await PC.click('[data-a=sbIn]');await PC.waitForTimeout(1200);console.log('PC rows in cloud',store.size,'chip',await PC.locator('#sbChip').innerText());
// PC edits before phone joins
await PC.evaluate(()=>{S.hotels[0].name='PC EDIT 1';save()});await PC.waitForTimeout(1600);
// phone login
await PH.evaluate(()=>{go('settings');UI.sset='cloud';render()});await PH.fill('[data-sbc=url]','https://abc.supabase.co');await PH.fill('[data-sbc=key]','anonkey');await PH.fill('[data-sbc=email]','me@gmail.com');await PH.fill('#sbPw','secret1');await PH.click('[data-a=sbIn]');await PH.waitForTimeout(1500);
console.log('phone got PC edit:',await PH.evaluate(()=>S.hotels[0].name));
// phone edit → PC live
await PH.evaluate(()=>{S.set.ferry[0].rate=1555;S.set.company.gstin='35PHONE';const d=S.set.pkgDays;UI.pkgDur='1';S.set.pkgPicks['1']={1:J(d[1][0])};S.set.docMeta.name='Phone Customer';A.histSave()});await PH.waitForTimeout(1800);
console.log('PC live:',await PC.evaluate(()=>[S.set.ferry[0].rate,S.set.company.gstin,S.set.hist.map(e=>e.name)]));
// PC delete hotel → phone
await PC.evaluate(()=>{S.hotels.splice(3,1);save()});await PC.waitForTimeout(1800);console.log('hotels PC/phone',await PC.evaluate(()=>S.hotels.length),await PH.evaluate(()=>S.hotels.length));
// offline queue
await PH.context().setOffline(true);await PH.evaluate(()=>{S.hotels[1].name='OFFLINE EDIT';save()});await PH.waitForTimeout(1200);console.log('phone chip offline:',await PH.locator('#sbChip').innerText());
await PH.context().setOffline(false);await PH.evaluate(()=>dispatchEvent(new Event('online')));await PH.waitForTimeout(1800);console.log('PC after reconnect:',await PC.evaluate(()=>S.hotels[1].name));
// reload phone: session persists and syncs
await PH.reload();await PH.waitForTimeout(1500);console.log('phone reload chip',await PH.locator('#sbChip').innerText(),await PH.evaluate(()=>S.hotels[1].name));
// no echo loops: count upserts quiet
const n0=store.size;await PC.waitForTimeout(2500);console.log('stable rows',n0===store.size);
await PC.evaluate(()=>{go('settings');UI.sset='cloud';render()});await PC.screenshot({path:'/tmp/claude-0/cloud.png'});
await PH.evaluate(()=>{A.sbOut()});await PH.waitForTimeout(300);console.log('logout chip',JSON.stringify(await PH.locator('#sbChip').innerText()));
await b.close()})();
