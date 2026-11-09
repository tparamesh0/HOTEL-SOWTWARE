const T=__dirname+'/';const B_=JSON.parse(require('fs').readFileSync(T+'../../customer/web/version.json','utf8')).build;
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',m)}};
for(const round of [1,2,3]){const D=JSON.parse(fs.readFileSync(T+'mmcdata.json','utf8'));const ph='data:image/jpeg;base64,'+fs.readFileSync(T+'ph.jpg').toString('base64');
D.days.forEach(d=>d.items.forEach(i=>{if(i.photo==='PH')i.photo=ph}));D.notifs.forEach(n=>n.read_at='x');D.done=['i1','i2','i3','i4','i5'];
const cj=D.days[1].items.find(i=>i.id==='i7');cj.title='Cellular Jail';cj.time='01:00 PM';cj.data={cab:'12:30 PM',cabAt:'Hotel lobby',cabPhoto:ph,vehicle:'Innova',reg:'AN 01 A 1234',driver:'Ravi (sample)'};
D.now='2026-11-08T06:47:00+00:00'; // 12:17 PM IST
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,timezoneId:'Asia/Kolkata'});
await ctx.route('**/version.json*',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({build:B_})}));
await ctx.route('**/rest/v1/rpc/*',async r=>{const fn=r.request().url().split('/').pop();let res={ok:true};if(fn==='mmc_data')res=D;if(fn==='mmc_ver')res='v1';r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(res)})});
await ctx.addInitScript(()=>{localStorage.setItem('mmc.tok','"tok"')});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:8765/index.html');await p.waitForSelector('#home:not([hidden])');await p.evaluate(()=>document.querySelectorAll('.ov').forEach(o=>o.remove()));
await p.waitForSelector('.mpop.cab',{timeout:6000}).catch(()=>{});ok(!!(await p.$('.mpop.cab')),'cab pop-up shows');ok(!!(await p.$('.mpop.cab img.wimg')),'wait-here photo in pop-up');
const h=await p.textContent('.mpop.cab h4').catch(()=>'');ok(/13 min/.test(h),'pop-up says 13 min: '+h);if(round===1)await p.screenshot({path:T+'out/k1_pop.png'});
await p.click('.mpop .btn');await p.waitForTimeout(300);
ok(!!(await p.$('.cabsoon')),'banner at top');const key=await p.evaluate(()=>[...document.querySelectorAll('.it')].map(x=>x.querySelector('.key')&&x.querySelector('.key').textContent).filter(Boolean).join(' | '));ok(/🚕 Cab 12:30 PM→📍 Cellular Jail 01:00 PM/.test(key),'cab beside event: '+key);
ok(!!(await p.$('.it.open .wait img')),'row auto-opened with wait photo');if(round===1){await p.evaluate(()=>$('#home').scrollTo(0,250));await p.waitForTimeout(200);await p.screenshot({path:T+'out/k2_home.png'})}
await p.waitForTimeout(1000);await p.reload();await p.waitForTimeout(3500);ok(!(await p.$('.mpop.cab')),'cab pop-up not repeated');
console.log('round',round,'errs',JSON.stringify(errs));if(errs.length)fails++;await b.close()}console.log('TOTAL FAILS',fails)})();
