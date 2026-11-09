// ⭐ Customer Package: new tab above Package History, star button, same options, booking list shows only ⭐ packages.
const T=__dirname+'/';const H=require(T+'h.js');const fs=require('fs');
(async()=>{let fails=0;for(const round of [1,2,3])for(const [W,mob] of [[1366,false],[390,true]]){const [b,p]=await H(W,900,mob);await p.waitForTimeout(700);
await p.addScriptTag({content:fs.readFileSync(T+'sbmock.js','utf8')});
const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',round,W,m)}};
await p.evaluate(()=>{loginHide();SB=__mockSB();ME={email:'tparamesh0@gmail.com',role:'owner',perms:{}};roleApply();
 const mk=(id,name,dur,total)=>({id,name,pkgName:name,dur:String(dur),date:'07 Nov 2026',nums:{},total,snap:{persons:2,meta:{name},picks:{1:{name:'CORBYN',place:'City',stops:['Airport To Hotel','Cellular Jail']}},ferry:[],act:[],hotels:[],comp:[]}});
 S.set.hist=[mk('p1','SHARMA FAMILY',4,48500),mk('p2','DAS COUPLE',3,36200),mk('p3','HAVELOCK GROUP',5,71000)];go('home')});
await p.waitForTimeout(250);

// 1. menu + home tile: Customer Package sits right above Package History
const nav=await p.evaluate(()=>[...document.querySelectorAll('[data-a="go"]')].map(x=>x.dataset.k));
const iC=nav.indexOf('cpk'),iH=nav.indexOf('hist');ok(iC>=0&&iH>=0&&iC<iH,'cpk link before hist: '+iC+' '+iH);
ok(await p.evaluate(()=>{const L=[...document.querySelectorAll('nav [data-a="go"],.side [data-a="go"],[data-a="go"]')].map(x=>x.dataset.k);for(let i=0;i<L.length-1;i++)if(L[i]==='cpk'&&L[i+1]==='hist')return true;return false}),'cpk directly above hist somewhere');

// 2. empty Customer Package page
await p.evaluate(()=>go('cpk'));await p.waitForTimeout(250);
ok(await p.evaluate(()=>document.body.innerText.includes('No Customer Packages yet')),'empty message');
ok(await p.evaluate(()=>!document.querySelector('.hcard2')),'no cards when none marked');

// 3. mark from Package History -> shows in both
await p.evaluate(()=>go('hist'));await p.waitForTimeout(250);
ok(await p.evaluate(()=>document.querySelectorAll('.hcard2').length)===3,'hist has 3');
await p.click('.hcard2 button[data-a="histCust"][data-k="p2"]');await p.waitForTimeout(250);
await p.click('.hcard2 button[data-a="histCust"][data-k="p3"]');await p.waitForTimeout(250);
ok(await p.evaluate(()=>document.querySelectorAll('.hcard2').length)===3,'hist still 3 after marking');
ok(await p.evaluate(()=>document.querySelector('.hcard2 button[data-a="histCust"][data-k="p2"]').textContent.includes('Customer Package ✓')),'hist shows ✓');
if(round===1)await p.screenshot({path:T+'out/cpk_hist_'+W+'.png',fullPage:false});
await p.evaluate(()=>go('cpk'));await p.waitForTimeout(250);
const ids=await p.evaluate(()=>[...document.querySelectorAll('.hcard2')].map(c=>c.dataset.k));
ok(JSON.stringify(ids.sort())===JSON.stringify(['p2','p3']),'cpk shows only marked: '+ids);
// same options as Package History on every card
const acts=await p.evaluate(()=>[...document.querySelector('.hcard2').querySelectorAll('[data-a]')].map(x=>x.dataset.a));
['histEdit','histWa','histPin','histProf','histQe','histDup','histPrint','histInv','histXl','histDel','histCust'].forEach(a=>ok(acts.includes(a),'cpk card has '+a));
ok(await p.evaluate(()=>!!document.querySelector('[data-a="histView2"]')),'list/grid + filters on cpk');
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no sideways scroll on cpk');
if(round===1)await p.screenshot({path:T+'out/cpk_page_'+W+'.png',fullPage:false});
// grid view works too
await p.evaluate(()=>A.histView2({dataset:{k:'grid'}}));await p.waitForTimeout(200);ok(await p.evaluate(()=>document.querySelectorAll('.hcard2').length)===2,'grid shows 2');
await p.evaluate(()=>A.histView2({dataset:{k:'list'}}));await p.waitForTimeout(150);
// filter by duration inside cpk
ok(await p.evaluate(()=>{UI.hf=UI.hf||{};const f=HFL();f.dur=['3'];return histFiltered().map(e=>e.id).join()})==='p2','dur filter in cpk');
await p.evaluate(()=>{HFL().dur=[];render()});
// detail view opens from cpk
await p.evaluate(()=>A.histView({dataset:{k:'p2'}}));await p.waitForTimeout(200);ok(await p.evaluate(()=>!!document.querySelector('.md')),'detail opens');await p.evaluate(()=>closeModal());

// 4. edit from cpk keeps star and returns to cpk
await p.evaluate(()=>A.histEdit({dataset:{k:'p2'}}));await p.waitForTimeout(250);ok(await p.evaluate(()=>UI.page)==='packages','edit opens packages');
await p.evaluate(()=>histSaveDo('customer'));await p.waitForTimeout(250);
ok(await p.evaluate(()=>UI.page)==='cpk','after save back on cpk');
ok(await p.evaluate(()=>!!S.set.hist.find(e=>e.id==='p2').cust),'still ⭐ after edit');
ok(await p.evaluate(()=>S.set.hist.length)===3,'edit made no copy');

// 5. duplicate starts without star
await p.evaluate(()=>A.histDup({dataset:{k:'p2'}}));await p.waitForTimeout(200);
ok(await p.evaluate(()=>{const c=S.set.hist.find(e=>/\(copy\)/.test(e.name));return c&&!c.cust}),'copy has no star');
ok(await p.evaluate(()=>document.querySelectorAll('.hcard2').length)===2,'copy not in cpk');

// 6. booking form lists only ⭐ packages (+ No package)
await p.evaluate(()=>go('bookings'));await p.waitForTimeout(250);await p.evaluate(()=>A.bkNew());await p.waitForTimeout(200);
const opts=await p.evaluate(()=>[...document.querySelectorAll('#bk_hist option')].map(o=>o.value));
ok(JSON.stringify(opts.slice().sort())===JSON.stringify(['','p2','p3']),'booking list only ⭐: '+opts);
ok(await p.evaluate(()=>[...document.querySelectorAll('#bk_hist option')].filter(o=>o.value).every(o=>o.textContent.startsWith('⭐'))),'⭐ in option text');
await p.selectOption('#bk_hist','p2');await p.waitForTimeout(150);
ok(await p.evaluate(()=>document.getElementById('bk_name').value)==='DAS COUPLE','picking fills name');
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no sideways scroll on booking form');
if(round===1)await p.screenshot({path:T+'out/cpk_booking_'+W+'.png',fullPage:false});
await p.evaluate(()=>closeModal());

// 7. remove from cpk: gone there, still in Package History, nothing deleted
await p.evaluate(()=>go('cpk'));await p.waitForTimeout(250);
await p.click('.hcard2 button[data-a="histCust"][data-k="p3"]');await p.waitForTimeout(250);
ok(await p.evaluate(()=>[...document.querySelectorAll('.hcard2')].map(c=>c.dataset.k).join())==='p2','p3 removed from cpk');
ok(await p.evaluate(()=>S.set.hist.length)===4&&await p.evaluate(()=>!!S.set.hist.find(e=>e.id==='p3')),'p3 still saved');
await p.evaluate(()=>go('hist'));await p.waitForTimeout(200);ok(await p.evaluate(()=>document.querySelectorAll('.hcard2').length)===4,'hist shows all 4');
// ⋯ menu also has the star option
ok(await p.evaluate(()=>!!document.querySelector('.hmenu [data-a="histCust"]')),'menu has star option');
// no ⭐ at all -> booking form shows the hint, still can create with no package
await p.evaluate(()=>{S.set.hist.forEach(e=>delete e.cust);go('bookings');A.bkNew()});await p.waitForTimeout(200);
ok(await p.evaluate(()=>document.querySelectorAll('#bk_hist option').length)===1,'only No package when none ⭐');
ok(await p.evaluate(()=>document.querySelector('.md .bkw').innerText.includes('Customer Packages yet')),'hint shown');
await p.evaluate(()=>closeModal());
console.log(round,W,'errs',JSON.stringify(p.errs));if(p.errs.length)fails++;await b.close()}console.log('TOTAL FAILS',fails)})();
