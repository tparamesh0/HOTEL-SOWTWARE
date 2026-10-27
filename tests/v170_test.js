const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>{errs.push(e.message);console.log('ERR',e.message)});p.on('dialog',d=>d.dismiss());
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
const ok=(n,v)=>console.log(v?'PASS':'FAIL',n);
await p.evaluate(()=>{const mk=(n,st,pl)=>({name:n,trip:3000,ticket:500,stops:st,notes:'',place:pl||''});UI.pkgDur='4';S.set.pkgPicks['4']={1:mk('Chidiyatapu',['Cellular Jail']),2:mk('Havelock',['Radhanagar Beach']),3:mk('Neil Island',['Bharatpur Beach']),4:mk("Corbyn's Cove",['Baratang']),5:mk('Airport',['Drop'])};S.set.docMeta.name='Chandra';S.set.docMeta.travel='2026-11-23';S.set.docMeta.phone='9876543210';save();go('packages')});
await p.waitForTimeout(200);
ok('pkgName field above customer',await p.evaluate(()=>{const a=document.querySelector('[data-s="docMeta.pkgName"]'),b=document.querySelector('[data-s="docMeta.name"]');return !!a&&!!b&&(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING)}));
await p.fill('[data-s="docMeta.pkgName"]','Honeymoon Special');await p.locator('[data-s="docMeta.pkgName"]').dispatchEvent('change');
ok('saveBy pills',await p.locator('[data-a="saveBy"]').count()===3);
await p.click('[data-a="histSave"]');await p.waitForTimeout(200);
ok('ask modal shown',await p.locator('[data-a="histSaveDo"]').count()===2);
await p.screenshot({path:'/tmp/claude-0/s170/ask.png'});
await p.click('[data-a="histSaveDo"][data-k="package"]');await p.waitForTimeout(300);
ok('saved by package',await p.evaluate(()=>{const e=S.set.hist[S.set.hist.length-1];return e.by==='package'&&e.pkgName==='Honeymoon Special'&&e.name==='Chandra'&&UI.page==='hist'}));
ok('history shows package name',await p.evaluate(()=>document.querySelector('.hcard2 h3').textContent.includes('Honeymoon Special')&&document.querySelector('.hsub').textContent.includes('Chandra')));
// second: customer only
await p.evaluate(()=>{UI.histId=null;S.set.docMeta.pkgName='';S.set.docMeta.name='Ravi Kumar';S.set.docMeta.travel='2026-11-05';go('packages')});
await p.click('[data-a="histSave"]');await p.waitForTimeout(300);
ok('auto saved by customer (only one name)',await p.evaluate(()=>{const e=S.set.hist[S.set.hist.length-1];return e.by==='customer'&&e.name==='Ravi Kumar'}));
// third via saveBy=customer with both
await p.evaluate(()=>{UI.histId=null;S.set.saveBy='customer';S.set.docMeta.pkgName='Family Fun';S.set.docMeta.name='Meena';S.set.docMeta.travel='';go('packages')});
await p.click('[data-a="histSave"]');await p.waitForTimeout(300);
ok('saveBy customer setting skips prompt',await p.evaluate(()=>{const e=S.set.hist[S.set.hist.length-1];return e.by==='customer'&&e.name==='Meena'&&e.pkgName==='Family Fun'&&!document.querySelector('[data-a="histSaveDo"]')}));
// pins
const H=await p.evaluate(()=>S.set.hist.map(e=>e.id));
await p.click(`.hcard2 [data-a="histPin"][data-k="${H[2]}"]`);await p.waitForTimeout(50);
await p.click(`.hcard2 [data-a="histPin"][data-k="${H[1]}"]`);await p.waitForTimeout(50);
const ord=await p.evaluate(()=>[...document.querySelectorAll('.hcard2')].map(c=>c.querySelector('h3').textContent.trim().split(' ')[0]+'|'+(c.querySelector('.pinb')?c.querySelector('.pinb').textContent:'')));
console.log(ord);ok('pin order',ord[0].startsWith('Meena|📌 1st')&&ord[1].startsWith('Ravi|📌 2nd')&&ord[2].startsWith('Honeymoon|'));
await p.screenshot({path:'/tmp/claude-0/s170/hist.png',fullPage:true});
await p.click(`.hcard2 [data-a="histPin"][data-k="${H[2]}"]`);await p.waitForTimeout(50);
ok('unpin',await p.evaluate(id=>!S.set.hist.find(e=>e.id===id).pin&&document.querySelector('.hcard2 .pinb').textContent.includes('1st'),H[2]));
// dup
await p.evaluate(id=>A.histDup({dataset:{k:id}}),H[0]);
ok('dup copies title, not pin',await p.evaluate(()=>S.set.hist.some(e=>e.pkgName==='Honeymoon Special (copy)'&&!e.pin)));
// view
await p.evaluate(id=>A.histView({dataset:{k:id}}),H[0]);await p.waitForTimeout(100);
ok('history view title',await p.evaluate(()=>document.querySelector('.md h2').textContent.includes('Honeymoon')));
await p.evaluate(()=>closeModal());
// dashboard
await p.evaluate(()=>go('home'));await p.waitForTimeout(200);
ok('no dash calendar',await p.locator('.cmini').count()===0);
ok('dash recent title',await p.evaluate(()=>[...document.querySelectorAll('.drn b')].some(b=>b.textContent.includes('Honeymoon'))));
await p.screenshot({path:'/tmp/claude-0/s170/dash.png',fullPage:true});
// calendar
await p.click('.nav [data-a="go"][data-k="cal"]');await p.waitForTimeout(200);
ok('calendar full screen',await p.evaluate(()=>UI.page==='cal'&&document.querySelector('.app.full')&&getComputedStyle(document.querySelector('.side')).display==='none'));
await p.evaluate(()=>{UI.calM='2026-11-01';render()});
ok('package arrival highlighted 23 Nov',await p.evaluate(()=>{const c=document.querySelector('[data-a="calDay"][data-k="2026-11-23"]');return c.classList.contains('has')}));
ok('departure 27 Nov',await p.evaluate(()=>document.querySelector('[data-a="calDay"][data-k="2026-11-27"]').classList.contains('has')));
await p.click('[data-a="calDay"][data-k="2026-11-10"]');await p.click('.cal-sh [data-a="calAdd"]');await p.waitForTimeout(100);
await p.fill('[data-cale="title"]','Sharma family arrival');await p.fill('[data-cale="phone"]','9000000001');await p.fill('[data-cale="persons"]','4');await p.fill('[data-cale="endDate"]','2026-11-12');
await p.click('[data-a="calType"][data-k="book"]');console.log('title',await p.inputValue('[data-cale="title"]'));
await p.click('[data-a="calSave"]');await p.waitForTimeout(150);
ok('event saved + multi-day highlight',await p.evaluate(()=>S.set.cal.length===1&&['2026-11-10','2026-11-11','2026-11-12'].every(k=>document.querySelector(`[data-a="calDay"][data-k="${k}"]`).classList.contains('has'))));
await p.screenshot({path:'/tmp/claude-0/s170/cal.png'});
await p.fill('#calQ','sharma');await p.waitForTimeout(150);
ok('search filters',await p.evaluate(()=>!document.querySelector('[data-a="calDay"][data-k="2026-11-23"]').classList.contains('has')&&document.querySelector('[data-a="calDay"][data-k="2026-11-10"]').classList.contains('has')));
await p.fill('#calQ','');await p.waitForTimeout(100);
await p.click('[data-a="calF"][data-k="arr"]');ok('type filter',await p.evaluate(()=>!document.querySelector('[data-a="calDay"][data-k="2026-11-10"]').classList.contains('has')));
await p.click('[data-a="calF"][data-k=""]');
await p.click('[data-a="calNav"][data-v="1"]');ok('next month',await p.evaluate(()=>UI.calM==='2026-12-01'));
await p.click('[data-a="calNav"][data-v="-1"]');
// edit+delete
await p.click('[data-a="calDay"][data-k="2026-11-10"]');await p.click('.cal-side [data-a="calEdit"]');await p.waitForTimeout(100);
console.log('edit',await p.inputValue('[data-cale="title"]'));
await p.click('[data-a="calDel"]');await p.click('[data-a="calDel"]');ok('deleted',await p.evaluate(()=>S.set.cal.length===0));
await p.setViewportSize({width:420,height:850});await p.waitForTimeout(100);
ok('no horizontal scroll mobile',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
await p.screenshot({path:'/tmp/claude-0/s170/cal_m.png',fullPage:true});
await p.setViewportSize({width:1300,height:900});
await p.click('[data-a="calSet"]');await p.waitForTimeout(150);
ok('settings cal tab',await p.evaluate(()=>UI.page==='settings'&&UI.sset==='cal'&&!!document.querySelector('[data-a="calTAdd"]')));
await p.click('[data-a="calTAdd"]');ok('type added',await p.evaluate(()=>S.set.calTypes.length===6));
await p.click('[data-a="calOpt"][data-k="showDep"]');ok('toggle showDep',await p.evaluate(()=>S.set.calSet.showDep===false));
await p.click('[data-a="calClose"]').catch(()=>{});
// packages header button
await p.evaluate(()=>go('packages'));ok('packages calendar btn',await p.locator('.top [data-a="go"][data-k="cal"]').count()===1);
// close calendar returns
await p.click('.top [data-a="go"][data-k="cal"]');await p.click('[data-a="calClose"]');await p.waitForTimeout(100);ok('close returns to packages',await p.evaluate(()=>UI.page==='packages'));
// poster preview change photo (live)
await p.evaluate(()=>{UI.pkgDur='4';A.billPrev({dataset:{m:'customer',st:'poster'}})});await p.waitForTimeout(200);
ok('change buttons on 5 days',await p.locator('.pqchg').count()===5);
const png=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=200;c.height=160;const x=c.getContext('2d');x.fillStyle='#e11d48';x.fillRect(0,0,200,160);return c.toDataURL('image/png')});
await p.evaluate(async u=>{const b=await (await fetch(u)).blob();photoIn('pqPhoto','2',new File([b],'r.png',{type:'image/png'}))},png);await p.waitForTimeout(300);
await p.click('[data-a="cropOk"]');await p.waitForTimeout(300);
ok('live day 2 photo changed + preview kept',await p.evaluate(()=>!!S.set.pkgPicks['4'][2].photo&&document.querySelector('.pqd[data-d="2"] .pqph').style.backgroundImage.includes(S.set.pkgPicks['4'][2].photo.slice(0,40))&&!!document.querySelector('.pqchg')));
await p.screenshot({path:'/tmp/claude-0/s170/pv.png'});
await p.click('[data-a="pqPhReset"][data-k="2"]');ok('reset',await p.evaluate(()=>!S.set.pkgPicks['4'][2].photo));
await p.evaluate(()=>closeModal());
// history preview change
await p.evaluate(id=>{const e=S.set.hist.find(h=>h.id===id);showDoc(st=>withSnap(e,{},()=>docHTML(e.dur,'customer',st)),'poster','test')},H[0]);await p.waitForTimeout(200);
await p.evaluate(async u=>{const b=await (await fetch(u)).blob();photoIn('pqPhoto','3',new File([b],'r.png',{type:'image/png'}))},png);await p.waitForTimeout(300);await p.click('[data-a="cropOk"]');await p.waitForTimeout(300);
ok('history day 3 photo saved into snapshot only',await p.evaluate(id=>{const e=S.set.hist.find(h=>h.id===id);return !!e.snap.picks[3].photo&&!S.set.pkgPicks['4'][3].photo},H[0]));
await p.evaluate(()=>closeModal());
// settings poster photos
await p.evaluate(()=>{UI.sset='pqph';go('settings')});await p.waitForTimeout(150);
ok('poster photos tab',await p.locator('.pqs').count()===5);
await p.evaluate(async u=>{const b=await (await fetch(u)).blob();photoIn('posterDef','0',new File([b],'r.png',{type:'image/png'}))},png);await p.waitForTimeout(300);await p.click('[data-a="cropOk"]');await p.waitForTimeout(200);
ok('default slot saved',await p.evaluate(()=>!!S.set.poster.photos[0]&&pqDefaults()[0]===S.set.poster.photos[0]));
await p.evaluate(()=>{S.set.pkgDays=S.set.pkgDays||{};S.set.pkgDays[1]=(S.set.pkgDays[1]||[]).concat([{name:'Havelock',trip:1,ticket:1,stops:[]}]);render()});
await p.evaluate(async u=>{const b=await (await fetch(u)).blob();photoIn('placePh','havelock',new File([b],'r.png',{type:'image/png'}))},png);await p.waitForTimeout(300);await p.click('[data-a="cropOk"]');await p.waitForTimeout(200);
ok('place photo used in poster',await p.evaluate(()=>docPoster('4','customer').includes(S.set.placePh.havelock.slice(0,60))));
await p.screenshot({path:'/tmp/claude-0/s170/pqset.png',fullPage:true});
await p.click('[data-a="placePhDel"]');ok('place photo removed',await p.evaluate(()=>!S.set.placePh.havelock));
// reload persistence
await p.reload();await p.waitForTimeout(300);ok('persist',await p.evaluate(()=>S.set.hist.some(e=>e.by==='package')&&S.set.hist.some(e=>e.pin)&&S.set.calTypes.length===6));
console.log('errors',errs.length);await b.close()})();
