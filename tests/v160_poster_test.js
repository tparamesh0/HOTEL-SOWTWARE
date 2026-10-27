const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:1300}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
await p.evaluate(()=>{S.set.company.team=[{name:'Sneha',phone:'9679547217'},{name:'Param',phone:'7063904232'}];const mk=(n,st,pl)=>({name:n,trip:3000,ticket:500,stops:st,notes:'',place:pl||''});UI.pkgDur='4';S.set.pkgPicks['4']={1:mk('Chidiyatapu',['Airport to Hotel','Cellular Jail','Chidiyatapu + sunset','Return to hotel']),2:mk('Havelock',['Radhanagar Beach','Kala pathar','Elephanta Beach','Return to hotel']),3:mk('Neil Island',['Bharatpur Beach','Natural Coral Bridge','Sitapur Beach','Ramnagar Beach','Neil to port blair'],'Port Blair'),4:mk("Corbyn's Cove",['Baratang',"Corbyn's Cove Beach",'Shopping','Return to hotel']),5:mk('Airport',['Shiva Statue','Flag Point','Airport Drop'])};S.set.pkgComp['4']=[{id:'c',name:'Welcome Drink'}];S.set.docMeta.name='Chandra';S.set.docMeta.type='quotation';save();
document.getElementById('modal').innerHTML='<div style="position:fixed;inset:0;background:#ddd;overflow:auto;z-index:99;padding:10px">'+docHTML('4','customer','poster')+'</div>'});
await p.waitForTimeout(500);await p.screenshot({path:'/tmp/claude-0/pq.png',fullPage:false});
console.log('invoice fallback is tally',await p.evaluate(()=>{S.set.docMeta.type='invoice';return docHTML('4','customer','poster').includes('docsheet')}));
await b.close()})();
