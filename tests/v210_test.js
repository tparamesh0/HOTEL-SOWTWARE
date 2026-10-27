const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>{errs.push(e.message);console.log('ERR',e.message)});p.on('dialog',d=>d.dismiss());
const ok=(n,v)=>console.log(v?'PASS':'FAIL',n);
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
await p.evaluate(()=>{UI.pkgTab='dur';go('pkgset')});
const tabs=await p.evaluate(()=>[...document.querySelectorAll('[data-a="pkgTabSet"]')].map(b=>b.textContent));console.log(tabs);
ok('tab after Activities',tabs.indexOf('Extras & Add-ons')===tabs.indexOf('Activities')+1);
await p.click('[data-a="pkgTabSet"][data-k="ext"]');
for(const [n,r] of [['Extra Bed',1500],['Candle Light Dinner',4000],['Celebration Cake',1200]]){await p.click('[data-a="extNew"]');await p.waitForTimeout(60);const i=await p.evaluate(()=>S.set.ext.length-1);await p.fill(`[data-s="ext.${i}.name"]`,n);await p.locator(`[data-s="ext.${i}.name"]`).dispatchEvent('change');await p.fill(`[data-s="ext.${i}.rate"]`,String(r));await p.locator(`[data-s="ext.${i}.rate"]`).dispatchEvent('change');await p.click(`[data-a="extEdit"]:has-text("Done")`)}
ok('3 add-ons',await p.evaluate(()=>S.set.ext.length===3));
await p.screenshot({path:'/tmp/claude-0/s210/1_tab.png'});
await p.evaluate(()=>{const mk=(n,st)=>({name:n,trip:3000,ticket:500,stops:st,notes:''});UI.pkgDur='2';S.set.pkgPicks['2']={1:mk('Port Blair City Tour',['Airport pickup','Cellular Jail','Light & Sound Show']),2:mk('Havelock',['Radhanagar Beach','Kala Pathar']),3:mk('Neil Island',['Laxmanpur Beach','Natural Bridge'])};S.set.pkgHotels['2']=[{id:'h1',hotel:'SEA SHELL',island:'Port Blair',room:'Deluxe',plan:'CP',rate:4000,nights:2}];S.set.pkgPersons['2']=3;S.set.docMeta.name='Ravi Kumar';S.set.docMeta.phone='9876543210';save();go('packages')});
await p.click('[data-a="pkgExtGo"]');await p.waitForTimeout(80);
const ids=await p.evaluate(()=>S.set.ext.map(x=>x.id));await p.click(`[data-a="extTick"][data-k="${ids[0]}"]`);await p.click(`[data-a="extTick"][data-k="${ids[1]}"]`);await p.click('[data-a="extDone"]');await p.waitForTimeout(80);
ok('placed right after hotels',await p.evaluate(()=>{const h=[...document.querySelectorAll('.pksum h2')].map(x=>x.textContent);return h.indexOf('Extras & add-ons')===h.indexOf('Hotels for this tour')+1}));
const g=await p.evaluate(()=>({parts:pkParts('2'),tot:docTotal('2')}));console.log(g);ok('totals include add-ons',g.parts.XT===5500&&g.tot===3*(10500+8000+5500));
const el=p.locator('[data-a="pkgExtGo"]').locator('xpath=ancestor::div[contains(@class,"pksum")][1]');await el.screenshot({path:'/tmp/claude-0/s210/2_section.png'});
// equal per person
let h=await p.evaluate(()=>docHTML('2','customer','tally'));ok('customer tally hides add-ons',!h.includes('Add-on – Extra Bed')&&h.includes('<span>Per person</span>')&&h.includes('24,000.00'));
h=await p.evaluate(()=>docHTML('2','agent','tally'));ok('agent tally shows add-ons',h.includes('Add-on – Extra Bed'));
const w=await p.evaluate(()=>waText('2','customer'));ok('whatsapp per person',w.includes('Per person: ₹24,000')&&!w.includes('Extra Bed'));console.log(w.split('\n').slice(-6).join(' | '));
for(const [st,f] of [['tally','3_customer_tally'],['ocean','4_customer_ocean'],['poster','5_customer_poster']]){await p.evaluate(s=>{const t=S.set.docMeta.type;document.getElementById('modal').innerHTML='<div style="position:fixed;inset:0;background:#ddd;overflow:auto;z-index:99;padding:10px" id="shot">'+docHTML('2','customer',s)+'</div>'},st);await p.waitForTimeout(200);await p.locator('#shot > *').first().screenshot({path:`/tmp/claude-0/s210/${f}.png`})}
await p.evaluate(()=>{document.getElementById('modal').innerHTML='<div style="position:fixed;inset:0;background:#ddd;overflow:auto;z-index:99;padding:10px" id="shot">'+docHTML('2','agent','ocean')+'</div>'});await p.locator('#shot > *').first().screenshot({path:'/tmp/claude-0/s210/6_agent_ocean.png'});
await p.evaluate(()=>closeModal());
// coverage person 3 without dinner
await p.click('[data-a="covOpen"][data-k="3"]');ok('coverage group',await p.evaluate(()=>document.querySelector('#modal').innerText.includes('🧩 Extras & add-ons')));
const k=await p.evaluate(()=>'e:'+pkE('2')[1].id);await p.click(`[data-a="covTog"][data-k="${k}"]`);await p.screenshot({path:'/tmp/claude-0/s210/7_person.png'});await p.click('[data-a="covClose"] >> nth=0');
const t3=await p.evaluate(()=>[personTot('2',1),personTot('2',3),docTotal('2')]);console.log(t3);ok('person 3 without dinner',t3[1]===24000-4000&&t3[2]===68000);
h=await p.evaluate(()=>docHTML('2','customer','tally'));ok('single average rate',h.includes('22,667.00')&&!h.includes('Person 3'));
await p.evaluate(()=>{document.getElementById('modal').innerHTML='<div style="position:fixed;inset:0;background:#ddd;overflow:auto;z-index:99;padding:10px" id="shot">'+docHTML('2','customer','royal')+'</div>'});await p.locator('#shot > *').first().screenshot({path:'/tmp/claude-0/s210/8_customer_royal_diff.png'});await p.evaluate(()=>closeModal());
// toggle per-person off
await p.evaluate(()=>{S.set.docCfg.customer.perperson=0});ok('perperson toggle off',!(await p.evaluate(()=>docHTML('2','customer','tally'))).includes('Per person'));await p.evaluate(()=>{S.set.docCfg.customer.perperson=1});
// single person: no per-person
await p.evaluate(()=>{S.set.pkgPersons['1']=1;S.set.pkgPicks['1']={1:{name:'X',trip:1000,ticket:0,stops:[],notes:''}}});ok('1 person no line',!(await p.evaluate(()=>docHTML('1','customer','tally'))).includes('Per person'));
// toggle customer ext on via pill
await p.click('[data-a="docCfgTog"][data-k="customer.ext"]');ok('customer ext on',(await p.evaluate(()=>docHTML('2','customer','tally'))).includes('Add-on – Extra Bed'));await p.click('[data-a="docCfgTog"][data-k="customer.ext"]');
// history
await p.evaluate(()=>{S.set.saveBy='customer'});await p.click('[data-a="histSave"]');await p.waitForTimeout(200);
ok('history snap ext',await p.evaluate(()=>S.set.hist[S.set.hist.length-1].snap.ext.length===2));
ok('history card per person',await p.evaluate(()=>!!document.querySelector('.hgt .hpp')));
await p.locator('.hcard2').first().screenshot({path:'/tmp/claude-0/s210/9_history.png'});
await p.evaluate(()=>{const e=S.set.hist[S.set.hist.length-1];openModal(histViewHTML(e))});ok('history view ext',await p.evaluate(()=>document.querySelector('#modal').innerText.includes('Extras & add-ons')));await p.evaluate(()=>closeModal());
ok('excel rows',await p.evaluate(()=>{const r=histRows(S.set.hist[S.set.hist.length-1]);return r.sum.length===14&&r.sum[9].includes('Extra Bed')}));
// undo/clear
await p.evaluate(()=>{UI.histId=null;go('packages')});await p.click('[data-a="pkgClear"]');ok('clear',await p.evaluate(()=>pkE('2').length===0));await p.click('[data-a="pkgUndo"]');ok('undo',await p.evaluate(()=>pkE('2').length===2));
await p.setViewportSize({width:400,height:850});await p.waitForTimeout(100);ok('mobile no overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
console.log('errors',errs.length);await b.close()})();
