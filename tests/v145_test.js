const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:1000}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
await p.evaluate(()=>{go('packages');UI.pkgDur='2';const d=S.set.pkgDays;S.set.pkgPicks['2']={1:J(d[1][0]),2:J(d[1][1])};S.set.pkgHotels['2']=[{id:'h1',hotel:'SEA SHELL',island:'Port Blair',room:'Deluxe',plan:'CP',rate:4000,nights:1}];S.set.pkgFerry['2']=[{id:'f1',name:'PB to Havelock',rate:1300,qty:1}];S.set.pkgComm['2']={mode:'amt',v:500};S.set.pkgPersons['2']=2;save();render()});
const t0=await p.evaluate(()=>docTotal('2'));await p.click('[data-a=covOpen][data-k="2"]');
console.log('groups',await p.evaluate(()=>[...document.querySelectorAll('.covh b')].map(x=>x.innerText)));
console.log('grp btns',await p.evaluate(()=>[...document.querySelectorAll('[data-a=covGrp]')].map(x=>x.dataset.g)));await p.locator('[data-a=covGrp]').nth(1).click();await p.locator('.tsw').first().click();await p.screenshot({path:'/tmp/claude-0/cov2.png'});
const t1=await p.evaluate(()=>docTotal('2'));console.log('total',t0,'→',t1,'(hotel 4000 + day1 trip 2650 =',6650,')');
await p.click('[data-a=covTrip]');console.log('all trips off',await p.evaluate(()=>docTotal('2')));await b.close()})();
