const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>{errs.push(e.message);console.log('ERR',e.message)});p.on('dialog',d=>d.dismiss());
const ok=(n,v)=>console.log(v?'PASS':'FAIL',n);
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
await p.evaluate(()=>{UI.pkgTab='dur';go('pkgset')});
const tabs=await p.evaluate(()=>[...document.querySelectorAll('[data-a="pkgTabSet"]')].map(b=>b.textContent));console.log(tabs);
ok('Activities tab after Complimentary',tabs.indexOf('Activities')===tabs.indexOf('Complimentary')+1);
await p.click('[data-a="pkgTabSet"][data-k="act"]');await p.waitForTimeout(100);
ok('empty tab has add box',await p.locator('[data-a="actNew"]').count()===1);
for(const [n,r] of [['scuba diving',3500],['Sea Walk',3000],['Parasailing',1500]]){await p.click('[data-a="actNew"]');await p.waitForTimeout(80);const i=await p.evaluate(()=>S.set.act.length-1);await p.fill(`[data-s="act.${i}.name"]`,n);await p.locator(`[data-s="act.${i}.name"]`).dispatchEvent('change');await p.fill(`[data-s="act.${i}.rate"]`,String(r));await p.locator(`[data-s="act.${i}.rate"]`).dispatchEvent('change');await p.click(`[data-a="actEdit"]:has-text("Done")`);await p.waitForTimeout(80)}
ok('3 activities saved',await p.evaluate(()=>S.set.act.length===3&&S.set.act[0].rate===3500&&S.set.act[0].name==='Scuba Diving'));
// photo via photoIn
const png=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=320;c.height=180;const x=c.getContext('2d');x.fillStyle='#0ea5e9';x.fillRect(0,0,320,180);return c.toDataURL('image/png')});
ok('photo space shown',await p.locator('.actph').count()===3);
await p.evaluate(async u=>{const b=await (await fetch(u)).blob();photoIn('act',S.set.act[0].id,new File([b],'s.png',{type:'image/png'}))},png);await p.waitForTimeout(300);await p.click('[data-a="cropOk"]');await p.waitForTimeout(200);
ok('photo saved',await p.evaluate(()=>!!S.set.act[0].photo&&document.querySelectorAll('.actph').length===2));
// sort + search
await p.click('[data-a="afSort"][data-k="asc"]');ok('sort low→high',await p.evaluate(()=>document.querySelector('.fgrid .hn').textContent==='Parasailing'));
await p.click('[data-a="afClear"]');
await p.fill('[data-afq]','sea');await p.waitForTimeout(400);ok('search',await p.evaluate(()=>document.querySelectorAll('.fgrid .fcard').length===1));
await p.evaluate(()=>{UI.af=null;render()});
// move
await p.evaluate(()=>A.actEdit({dataset:{k:S.set.act[2].id}}));await p.click('[data-a="actMv"][data-v="-1"]');ok('move',await p.evaluate(()=>S.set.act[1].name==='Parasailing'));
await p.evaluate(()=>{UI.actEdit=null;render()});
await p.screenshot({path:'/tmp/claude-0/s170/act_tab.png',fullPage:true});
// package
await p.evaluate(()=>{const mk=(n)=>({name:n,trip:2000,ticket:500,stops:['A'],notes:''});UI.pkgDur='2';S.set.pkgPicks['2']={1:mk('Day1'),2:mk('Day2')};S.set.pkgPersons['2']=2;save();go('packages')});await p.waitForTimeout(100);
ok('activities section on Packages',await p.locator('[data-a="pkgActGo"]').count()===1);
await p.click('[data-a="pkgActGo"]');await p.waitForTimeout(100);
ok('pick mode',await p.evaluate(()=>UI.page==='pkgset'&&UI.pkgTab==='act'&&!!document.querySelector('[data-a="actDone"]')));
await p.click(`[data-a="actTick"][data-k="${await p.evaluate(()=>S.set.act[0].id)}"]`);await p.click(`[data-a="actTick"][data-k="${await p.evaluate(()=>S.set.act[2].id)}"]`);
ok('2 ticked',await p.evaluate(()=>pkA('2').length===2&&document.querySelectorAll('.fcard.on').length===2));
await p.click('[data-a="actDone"]');await p.waitForTimeout(100);
ok('back on packages with 2 cards',await p.evaluate(()=>UI.page==='packages'&&document.querySelectorAll('[data-a="pkgActDel"]').length===2));
const before=await p.evaluate(()=>docTotal('2'));
await p.click(`[data-a="pkgActQty"][data-v="1"] >> nth=0`);
const g=await p.evaluate(()=>({parts:pkParts('2'),tot:docTotal('2')}));console.log(g);
ok('totals include activities (2 persons)',g.parts.AT===3500*2+3000&&g.tot===2*(5000+10000));
ok('grand total row',await p.evaluate(()=>document.querySelector('#pkGrand').innerText.includes('Activities')));
await p.screenshot({path:'/tmp/claude-0/s170/act_pkg.png',fullPage:true});
// coverage person 2
await p.click('[data-a="covOpen"][data-k="2"]');await p.waitForTimeout(100);
ok('coverage shows activities group',await p.evaluate(()=>document.querySelector('#modal').innerText.includes('🎯 Activities')));
const key=await p.evaluate(()=>'a:'+pkA('2')[0].id);
await p.click(`[data-a="covTog"][data-k="${key}"]`);await p.waitForTimeout(100);
await p.screenshot({path:'/tmp/claude-0/s170/act_cov.png'});
const t2=await p.evaluate(()=>({p1:personTot('2',1),p2:personTot('2',2),tot:docTotal('2')}));console.log(t2);
ok('person 2 without scuba',t2.p1===15000&&t2.p2===15000-7000&&t2.tot===23000);
await p.click('[data-a="covClose"] >> nth=0');
// bill lines
const L=await p.evaluate(()=>docLines('2',{prices:1}).filter(l=>l.k==='act').map(l=>[l.d,l.qty,l.rate,l.amt]));console.log(L);
ok('bill lines',L.length===2&&L[0][3]===7000&&L[1][3]===6000);
ok('bill total = sum of lines',await p.evaluate(()=>docLines('2',{prices:1}).reduce((a,l)=>a+l.amt,0)===docTotal('2')));
for(const st of ['tally','navy','sunrise','teal','green']){const h=await p.evaluate(s=>docHTML('2','agent',s),st);if(!h.includes('Activity – Scuba Diving'))console.log('FAIL bill',st)}
ok('customer bill shows activity',await p.evaluate(()=>docHTML('2','customer','tally').includes('Activity – Scuba Diving')));
ok('whatsapp text',await p.evaluate(()=>waText('2','agent').includes('Activity – Scuba Diving')));
// save to history & view
await p.evaluate(()=>{S.set.docMeta.name='Ravi';S.set.saveBy='customer';});await p.click('[data-a="histSave"]');await p.waitForTimeout(200);
const e=await p.evaluate(()=>{const e=S.set.hist[S.set.hist.length-1];return {act:e.snap.act.length,tot:e.total}});console.log(e);ok('history snapshot',e.act===2&&e.tot===23000);
await p.evaluate(()=>{const e=S.set.hist[S.set.hist.length-1];openModal(histViewHTML(e))});ok('history view shows activities',await p.evaluate(()=>document.querySelector('#modal').innerText.includes('Activities')));await p.evaluate(()=>closeModal());
// clear + undo
await p.evaluate(()=>{UI.histId=null;go('packages')});await p.click('[data-a="pkgClear"]');ok('clear removes',await p.evaluate(()=>pkA('2').length===0));
await p.click('[data-a="pkgUndo"]');ok('undo restores',await p.evaluate(()=>pkA('2').length===2));
// edit from history restores
await p.evaluate(()=>{delete S.set.pkgAct['2'];A.histEdit({dataset:{k:S.set.hist[S.set.hist.length-1].id}})});ok('histEdit restores activities',await p.evaluate(()=>pkA('2').length===2));
// add day keeps
await p.evaluate(()=>A.pkgAddDay({dataset:{}}));ok('add day carries activities',await p.evaluate(()=>UI.pkgDur==='3'&&pkA('3').length===2));
// excel rows
ok('excel rows',await p.evaluate(()=>{const r=histRows(S.set.hist[S.set.hist.length-1]);return r.sum.length===13&&r.sum[10].includes('Scuba')}));
// card size + fix
await p.evaluate(()=>{UI.pkgTab='dur';go('pkgset')});ok('card size row',await p.evaluate(()=>!!document.querySelector('[data-a="czSet"][data-k="act"]')));
await p.evaluate(()=>{S.set.act[1].name='jet ski';UI.pkgTab='act';render()});await p.click('[data-a="fixAll"][data-k="act"]');ok('1 fix',await p.evaluate(()=>S.set.act[1].name==='Jet Ski'));
// bill details toggle
await p.evaluate(()=>{UI.pkgTab='docs';render()});ok('bill toggle Activities',await p.evaluate(()=>[...document.querySelectorAll('[data-a="docCfgTog"]')].some(b=>(b.dataset.k||'').endsWith('.act'))));
// delete activity in master keeps package
await p.evaluate(()=>{UI.pkgTab='act';render()});const id0=await p.evaluate(()=>S.set.act[0].id);await p.click(`[data-a="actDel"][data-k="${id0}"]`);await p.click(`[data-a="actDel"][data-k="${id0}"]`);ok('delete',await p.evaluate(()=>S.set.act.length===2));
// mobile overflow
await p.setViewportSize({width:400,height:850});await p.evaluate(()=>go('packages'));await p.waitForTimeout(100);ok('mobile no overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
await p.evaluate(()=>{UI.pkgTab='act';go('pkgset')});ok('mobile tab no overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
await p.reload();await p.waitForTimeout(300);ok('persist',await p.evaluate(()=>S.set.act.length===2&&pkA('3').length===2));
console.log('errors',errs.length);await b.close()})();
