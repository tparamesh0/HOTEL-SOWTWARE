const T=__dirname+'/';const B_=JSON.parse(require('fs').readFileSync(T+'../../customer/web/version.json','utf8')).build;
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',m)}};
for(const round of [1,2,3]){const D=JSON.parse(fs.readFileSync(T+'mmcdata.json','utf8'));D.days.forEach(d=>d.items.forEach(i=>{if(i.photo==='PH')i.photo=''}));D.now='2026-11-08T05:00:00+00:00';D.notifs.forEach(n=>n.read_at='2026-11-08T05:00:00Z');
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,timezoneId:'Asia/Kolkata'});
let ver='v1';await ctx.route('**/version.json*',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({build:B_})}));
await ctx.route('**/rest/v1/rpc/*',async r=>{const fn=r.request().url().split('/').pop();let res={ok:true};if(fn==='mmc_login')res={ok:true,token:'tok',name:'Rahul'};if(fn==='mmc_data')res=D;if(fn==='mmc_ver')res=ver;if(fn==='mmc_notif_read')D.notifs.forEach(n=>n.read_at=n.read_at||new Date().toISOString());r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(res)})});
await ctx.addInitScript(()=>{if(!localStorage.getItem('mmc.tok'))localStorage.setItem('mmc.tok','"tok"')});
let p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:8765/index.html');await p.waitForSelector('#home:not([hidden])');await p.waitForTimeout(900);await p.evaluate(()=>document.querySelectorAll('.ov').forEach(o=>o.remove()));
ok(!(await p.$('.mpop')),'no popup for already-read messages');
// 1) message while app is open
D.notifs.unshift({id:'m'+round,title:'Pickup time changed',body:'Your cab will now come at 05:40 AM from the hotel lobby.',kind:'msg',created_at:new Date().toISOString(),read_at:null});ver='v2';
await p.waitForSelector('.mpop',{timeout:9000});await p.waitForTimeout(400);if(round===1)await p.screenshot({path:T+'out/m1_pop.png'});
ok((await p.textContent('.mpop h4'))==='Pickup time changed','popup title');
await p.waitForTimeout(8000);ok(!!(await p.$('.mpop')),'popup stays until closed');
await p.click('.mpop .mx');await p.waitForTimeout(400);ok(!(await p.$('.mpop')),'closed by X');ok(D.notifs[0].read_at,'marked read');
// 2) message sent while the app is closed -> pops up on next open
await p.close();D.notifs.unshift({id:'c'+round,title:'🌙 Good Night, Rahul!',body:'Hope you had a wonderful day!\nSee You Tomorrow!',kind:'night',created_at:new Date().toISOString(),read_at:null});ver='v3';
p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto('http://127.0.0.1:8765/index.html');await p.waitForSelector('.mpop.night',{timeout:9000});await p.waitForTimeout(400);if(round===1)await p.screenshot({path:T+'out/m2_night.png'});
await p.click('.mpop .btn');await p.waitForTimeout(400);ok(!(await p.$('.mpop')),'closed by OK');
// reopen again -> must NOT pop again
await p.reload();await p.waitForTimeout(1500);ok(!(await p.$('.mpop')),'no repeat after reopen');
console.log('round',round,'errs',JSON.stringify(errs));if(errs.length)fails++;await b.close()}console.log('TOTAL FAILS',fails)})();
