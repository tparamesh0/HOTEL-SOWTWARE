const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:900}});const errs=[];p.on('pageerror',e=>{errs.push(e.message);console.log('ERR',e.message)});
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
// 2 per-box edit
await p.evaluate(()=>{go('pkgset');UI.pkgTab='day';UI.pkgDay=1;render()});await p.locator('[data-a=pkgEditTog]').nth(1).click();
console.log('edit inputs (box2 only):',await p.locator('.dpgrid .card').nth(1).locator('input').count()>0,await p.locator('.dpgrid .card').nth(0).locator('input').count());
// 3 add day
await p.evaluate(()=>{go('packages');UI.pkgDur='1';const d=S.set.pkgDays;S.set.pkgPicks['1']={1:J(d[1][0]),2:J(d[2][0])};S.set.pkgHotels['1']=[{id:'h1',hotel:'SEA SHELL',island:'Port Blair',room:'Deluxe',plan:'CP',rate:4000,nights:1}];S.set.pkgFerry['1']=[{id:'f1',fid:S.set.ferry[0].id,name:'PB to Havelock',rate:1300,qty:1}];S.set.docMeta.name='Arun';S.set.docMeta.phone='9000011111';S.set.docMeta.addr='Chennai';save();render()});
await p.click('[data-a=pkgAddDay]');console.log('after add day',await p.evaluate(()=>[UI.pkgDur,Object.keys(S.set.pkgPicks['2']||{}),(S.set.pkgHotels['2']||[]).length,!!S.set.pkgPicks['1']]));
console.log('day boxes',await p.locator('.pkgrid > *').count());
// 5 coverage
await p.click('[data-a=pkPersons][data-v="1"]');const t2=await p.evaluate(()=>docTotal('2'));
await p.click('[data-a=covOpen][data-k="2"]');await p.click('[data-a=covGrp][data-g="🏨 Hotels"]');await p.click('[data-a=covClose] >> nth=-1');
const t3=await p.evaluate(()=>docTotal('2'));console.log('total full',t2,'person2 no hotel',t3,'diff',t2-t3);
console.log('lines',await p.evaluate(()=>docLines('2',{prices:1}).map(l=>l.d.slice(0,18)+' x'+l.qty+'='+l.amt).join(' | ')));
await p.screenshot({path:'/tmp/claude-0/v3cov.png',fullPage:true});
// 1 customer saved
await p.click('[data-a=histSave]');console.log('customers',await p.evaluate(()=>JSON.stringify(S.set.customers.map(c=>[c.name,c.phone,c.addr]))));
await p.evaluate(()=>A.histSave());console.log('no dup',await p.evaluate(()=>S.set.customers.length));
await p.evaluate(()=>go('company'));await p.click('[data-a=custSend]');console.log('send modal',await p.locator('[data-a=teamGo]').count(),await p.evaluate(()=>document.querySelector('#modal h3').innerText));
await p.evaluate(()=>closeModal());await p.screenshot({path:'/tmp/claude-0/v3cust.png',fullPage:true});
console.log('hist total with cov',await p.evaluate(()=>S.set.hist[0].total));
// 4 save button
await p.evaluate(()=>go('home'));await p.click('[data-a=saveAll]');console.log(await p.locator('#dSaved').innerText());
// 6 bucket direct
await p.evaluate(()=>{S.set.fav=[S.hotels[0].id];go('packages');UI.pkgDur='2';render()});const h0=await p.evaluate(()=>S.set.pkgHotels['2'].length);
await p.click('[data-a=bucketOpen]');await p.locator('.bki [data-a=cartOpen]').click();await p.locator('#modal [data-a=cartAdd]').first().click();await p.click('[data-a=cartDone]');
console.log('hotels',h0,'→',await p.evaluate(()=>S.set.pkgHotels['2'].length),'page',await p.evaluate(()=>UI.page),'cart',await p.evaluate(()=>S.set.cart.length));
// 7 crop for logo
await p.evaluate(()=>{go('settings');UI.sset='name';render()});await p.locator('label[for="logoFile"]').click();const [fc]=await Promise.all([p.waitForEvent('filechooser'),p.click('[data-a=pickPC]')]);await fc.setFiles('/tmp/claude-0/sig.png');await p.waitForTimeout(600);console.log('logo crop opens',await p.locator('#crBox.sq').count());await p.click('[data-a=cropOk]');await p.waitForTimeout(300);console.log('logo set',await p.evaluate(()=>S.set.logo.length>100));
console.log('errors',errs.length);await b.close()})();
