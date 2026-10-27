const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:850}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.dismiss());
const ok=(n,v)=>console.log(v?'PASS':'FAIL',n);
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
await p.evaluate(async()=>{S.set.hist.push({id:'x1',name:'Test',dur:'1',snap:{picks:{},persons:1,meta:{}},date:todayS(),nums:{}});S.set.cal=[{id:'c',date:'2026-11-01',type:'arr',title:'X'}];S.set.logo='data:image/png;base64,AAA';save();await docAdd(new Blob(['hi'],{type:'application/pdf'}),'t.pdf','saved')});
const before=await p.evaluate(()=>S.hotels.length);console.log('hotels before',before);
await p.evaluate(()=>{UI.sset='backup';go('settings')});await p.waitForTimeout(200);
ok('clear card under backup',await p.locator('.clrcard [data-a="clrStart"]').count()===1);
await p.click('[data-a="clrStart"]');await p.waitForTimeout(1300);
await p.screenshot({path:'/tmp/claude-0/s170/cd8.png'});
// cancel works
await p.click('[data-a="clrCancel"]');ok('cancel keeps data',await p.evaluate(()=>S.hotels.length>0&&!document.querySelector('.cdw')));
await p.click('[data-a="clrStart"]');await p.waitForTimeout(500);
// outside click shouldn't close
await p.mouse.click(5,5);ok('outside click does not close',await p.locator('.cdw').count()===1);
ok('no confirm during countdown',await p.locator('#clrIn').count()===0);
await p.waitForTimeout(4600);await p.screenshot({path:'/tmp/claude-0/s170/cd5.png'});
await p.waitForTimeout(5200);
ok('confirm after 10s',await p.locator('#clrIn').count()===1);
ok('button disabled until DELETE',await p.locator('#clrGo').isDisabled());
await p.fill('#clrIn','delet');ok('still disabled',await p.locator('#clrGo').isDisabled());
await p.fill('#clrIn','DELETE');ok('enabled',!(await p.locator('#clrGo').isDisabled()));
await p.screenshot({path:'/tmp/claude-0/s170/cdconf.png'});
await Promise.all([p.waitForNavigation(),p.click('#clrGo')]);await p.waitForTimeout(500);
const st=await p.evaluate(async()=>({h:S.hotels.length,hist:S.set.hist.length,cal:S.set.cal.length,logo:S.set.logo,co:S.set.company.name,team:S.set.company.team.length,ferry:S.set.ferry.length,comp:S.set.comp.length,days:Object.keys(S.set.pkgDays).length,docs:(await docAll()).length,app:S.set.appName}));console.log(st);
ok('all cleared',st.h===0&&st.hist===0&&st.cal===0&&!st.logo&&!st.co&&!st.team&&!st.ferry&&!st.comp&&!st.days&&st.docs===0);
await p.reload();await p.waitForTimeout(300);ok('stays empty after reload',await p.evaluate(()=>S.hotels.length===0));
for(const pg of ['home','packages','hotels','find','hist','cal','company','pkgset','range','star','rank','fac','classify','new','update']){await p.evaluate(g=>go(g),pg);await p.waitForTimeout(80);const bad=await p.evaluate(()=>document.body.innerText.includes('Something went wrong'));if(bad)console.log('FAIL page',pg)}
await p.evaluate(()=>go('home'));await p.screenshot({path:'/tmp/claude-0/s170/empty.png'});
// fresh build
const p2=await b.newPage({viewport:{width:1200,height:850}});p2.on('pageerror',e=>errs.push('fresh:'+e.message));
await p2.goto('file:///home/claude/app/fresh_hotel_rates.html');await p2.waitForTimeout(300);
ok('fresh build empty',await p2.evaluate(()=>S.hotels.length===0&&!S.set.company.name&&S.set.ferry.length===0&&!document.body.innerText.toUpperCase().includes('MAGIC MEMORIES')));
await p2.evaluate(()=>{UI.pkgDur='1';S.set.pkgPicks['1']={1:{name:'Day',trip:100,ticket:0,stops:['A'],notes:''}};render();A.billPrev({dataset:{m:'customer',st:'poster'}})});await p2.waitForTimeout(200);
ok('poster no MM logo',await p2.evaluate(()=>!document.querySelector('.pqlogo img')));
await p2.evaluate(()=>closeModal());
for(const pg of ['home','packages','hotels','find','hist','cal','company','pkgset','settings']){await p2.evaluate(g=>go(g),pg);await p2.waitForTimeout(80);if(await p2.evaluate(()=>document.body.innerText.includes('Something went wrong')))console.log('FAIL fresh page',pg)}
await p2.evaluate(()=>go('home'));await p2.screenshot({path:'/tmp/claude-0/s170/fresh.png'});
console.log('errors',errs);await b.close()})();
