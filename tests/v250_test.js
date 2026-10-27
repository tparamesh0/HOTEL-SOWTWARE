const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:950}});const errs=[];p.on('pageerror',e=>errs.push(e.message));const ok=(n,v)=>console.log(v?'PASS':'FAIL',n);
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
const hid=await p.evaluate(()=>{const h=S.hotels.find(x=>x.name==='ISLANDS TOURISTER')||S.hotels.find(x=>(x.addons||[]).length>2);h.addons=[{item:'MAP PER PERSON',rate:500},{item:'AP PER PERSON',rate:1000},{item:'FLOWER BED DECORATION',rate:3000},{item:'CANDLE LIGHT DINNER',rate:4000}];UI.pkgDur='2';S.set.pkgPersons['2']=2;S.set.pkgPicks['2']={1:{name:'A',trip:1000,ticket:0,stops:[],notes:''}};save();openModal(cartAddHTML(h));return h.id});
ok('choice shown',await p.locator('[data-a="haoMode"]').count()===2);
await p.click('[data-a="haoMode"][data-k="addon"]');ok('all ticked by default',await p.locator('.haot.on').count()===4);
await p.click('.haot >> nth=0');await p.click('.haot >> nth=1');ok('untick 2',await p.locator('.haot.on').count()===2);
await p.locator('#modal .md').screenshot({path:'/tmp/claude-0/s220/hao_modal.png'});
await p.click('.planpill >> nth=0');ok('cart item has add-ons',await p.evaluate(()=>S.set.cart[0].addons.length===2&&S.set.cart[0].addons[0].item==='FLOWER BED DECORATION'));
await p.click('[data-a="haoTick"][data-k="0"]');ok('change updates cart',await p.evaluate(()=>S.set.cart[0].addons.length===3));
await p.evaluate(()=>{closeModal();go('packages');A.pkgAddHotels()});await p.waitForTimeout(150);
const x=await p.evaluate(()=>{const h=pkH('2')[0];return {amt:hAmt(h),rate:h.rate,n:h.nights}});console.log(x);ok('hAmt includes add-ons',x.amt===x.rate*(x.n||1)+7500);
ok('agent bill shows add-ons',await p.evaluate(()=>docHTML('2','agent','tally').includes('Add-ons: MAP PER PERSON @ ₹500')));
ok('total includes',await p.evaluate(()=>docTotal('2')===2*(1000+hAmt(pkH('2')[0]))));
const card=p.locator('[data-a="pkgAddHotels"]').locator('xpath=ancestor::div[contains(@class,"pksum")][1]');await card.screenshot({path:'/tmp/claude-0/s220/hao_pkg.png'});
await p.click('[data-a="pkgHAoDel"] >> nth=0');ok('remove add-on',await p.evaluate(()=>pkH('2')[0].addons.length===2));
// hotel only
await p.evaluate(h=>{const ho=S.hotels.find(x=>x.id===h);openModal(cartAddHTML(ho))},hid);await p.click('[data-a="haoMode"][data-k="hotel"]');await p.click('.planpill >> nth=1');ok('hotel only no add-ons',await p.evaluate(()=>S.set.cart[0].addons.length===0));
console.log('errs',errs);await b.close()})();
