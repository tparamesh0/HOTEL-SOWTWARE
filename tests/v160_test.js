const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({acceptDownloads:true,viewport:{width:1366,height:900}});const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
for(const [u,f] of [['html2canvas.min.js','html2canvas/dist/html2canvas.min.js'],['jspdf.umd.min.js','jspdf/dist/jspdf.umd.min.js']])await p.route('**/'+u,r=>r.fulfill({body:fs.readFileSync('/tmp/claude-0/node_modules/'+f),contentType:'text/javascript'}));
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
// 6 bill lines hide customization
await p.evaluate(()=>{const d=S.set.pkgDays;UI.pkgDur='1';S.set.pkgPicks['1']={1:J(d[1][0]),2:J(d[1][1])};S.set.pkgHotels['1']=[{id:'h1',hotel:'SEA',island:'Port Blair',room:'D',plan:'CP',rate:4000,nights:1}];S.set.pkgPersons['1']=2;covSet('1',2,['h:h1','trip:1'],true);S.set.pkgComp['1']=[{id:'c',cid:'x',name:'Welcome Drink'}];S.set.docTxt.compTitle='Free Gifts From Magic Memories';S.set.docTxt.compTerms='Not exchangeable for cash';S.set.docMeta.name='Ravi';S.set.docMeta.phone='9876543210';save()});
console.log(await p.evaluate(()=>docLines('1',{prices:1}).map(l=>l.d.slice(0,22)+' q'+l.qty+' r'+l.rate+' a'+l.amt).join(' | ')),await p.evaluate(()=>[docLines('1',{prices:1}).reduce((a,l)=>a+l.amt,0),docTotal('1')]));
const h=await p.evaluate(()=>docHTML('1','agent','tally'));console.log('comp title',h.includes('Free Gifts From Magic Memories'),'terms',h.includes('Not exchangeable'),'no trip text',!h.includes('no trip charge'));
// tally header width
await p.evaluate(()=>{document.getElementById('modal').innerHTML='<div style="position:fixed;inset:0;background:#fff;overflow:auto;z-index:99">'+docHTML('1','agent','tally')+'</div>'});
console.log('dbox width vs dit',await p.evaluate(()=>[document.querySelector('.docsheet .dbox').getBoundingClientRect().width,document.querySelector('.docsheet .dit').getBoundingClientRect().width]));
await p.screenshot({path:'/tmp/claude-0/tfix.png',clip:{x:0,y:0,width:1366,height:600}});await p.evaluate(()=>closeModal());
// 7 zones
await p.evaluate(()=>{go('settings');UI.sset='zones';render()});await p.click('[data-a=zoneAdd]');await p.locator('[data-a=zoneHotel][data-k="Zone 1"]').first().click();await p.locator('[data-a=zoneHotel][data-k="Zone 3"]').nth(1).click();
console.log('zones',await p.evaluate(()=>[S.set.zones.map(z=>z.name),S.hotels.filter(h=>h.zone).map(h=>h.name+':'+h.zone)]));
await p.screenshot({path:'/tmp/claude-0/zones.png'});
await p.evaluate(()=>{go('hotels');UI.fzone='Zone 1';render()});console.log('all hotels zone1',await p.locator('.hc').count());await p.evaluate(()=>{UI.fzone='';render()});
await p.evaluate(()=>{go('find');render()});await p.click('[data-a=fchip][data-k="zones:Zone 3"]');console.log('find zone3',await p.locator('.hc').count());
await p.evaluate(()=>{go('new');render()});await p.click('[data-a=zoneDraft][data-k="Zone 2"]');console.log('draft zone',await p.evaluate(()=>D&&D.zone));
// rename zone
await p.evaluate(()=>{go('settings');UI.sset='zones';render()});await p.fill('[data-zn="0"]','North Zone');await p.locator('[data-zn="0"]').dispatchEvent('change');console.log('renamed',await p.evaluate(()=>S.hotels.filter(h=>h.zone==='North Zone').length));
// 2 docs
await p.evaluate(()=>{go('settings');UI.sset='docs';render()});await p.waitForTimeout(300);await p.setInputFiles('#docIn','/tmp/claude-0/tally.pdf');await p.waitForTimeout(600);console.log('docs',await p.locator('.dli').count());
await p.evaluate(()=>{A.histWa({dataset:{k:S.set.hist?.[0]?.id||''}})});
await p.evaluate(()=>{UI.histId=null;A.histSave();UI.wa=null;waAsk(S.set.hist[0].id)});const [dl]=await Promise.all([p.waitForEvent('download',{timeout:30000}),p.click('[data-a=waPdf]')]);await p.waitForTimeout(800);
await p.evaluate(()=>{UI.docCache=null;go('settings');UI.sset='docs';render()});await p.waitForTimeout(500);console.log('docs after WA pdf',await p.locator('.dli').count(),await p.evaluate(async()=>(await docAll()).map(d=>d.name)));await p.screenshot({path:'/tmp/claude-0/docs.png'});
// chooser
await p.evaluate(()=>{waAsk(S.set.hist[0].id)});await p.click('[data-a=waDocPick]');await p.click('[data-a=dpkLib]');await p.waitForTimeout(300);console.log('chooser items',await p.locator('[data-a=dpkOne]').count());
await b.close()})();
