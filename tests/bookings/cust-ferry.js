const T=__dirname+'/';const B_=JSON.parse(require('fs').readFileSync(T+'../../customer/web/version.json','utf8')).build;
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',m)}};
for(const round of [1,2,3]){const D=JSON.parse(fs.readFileSync(T+'mmcdata.json','utf8'));D.days.forEach(d=>d.items.forEach(i=>{if(i.photo==='PH')i.photo=''}));D.notifs.forEach(n=>n.read_at='x');
D.days[1].items.push({id:'fz',kind:'ferry',sort:999,title:'Port Blair To Havelock',time:'1:30 PM',place:'',photo:'',data:{name:'MAKRUZZ',harbour:'Haddo Wharf',to:'Havelock',arrive:'3:00 PM',report:'12:45 PM',ticket:'PNR123',seat:'A1, A2',class:'Premium',status:'Confirmed',cab:'12:00 PM',cabAt:'Cellular Jail gate'}});
D.now='2026-11-08T03:00:00+00:00';
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,timezoneId:'Asia/Kolkata'});
await ctx.route('**/version.json*',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({build:B_})}));
await ctx.route('**/rest/v1/rpc/*',async r=>{const fn=r.request().url().split('/').pop();let res={ok:true};if(fn==='mmc_data')res=D;if(fn==='mmc_ver')res='v1';r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(res)})});
await ctx.addInitScript(()=>{localStorage.setItem('mmc.tok','"tok"')});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:8765/index.html');await p.waitForSelector('#home:not([hidden])');await p.waitForTimeout(800);await p.evaluate(()=>document.querySelectorAll('.ov,.mpop').forEach(o=>o.remove()));
const html=await p.evaluate(()=>document.body.innerHTML);
ok(/⛴️ Ferry 1:30 PM/.test(html),'cab → ferry pair shown');['PNR123','A1, A2','3:00 PM','Haddo Wharf','Premium'].forEach(x=>ok(html.includes(x),'shows '+x));
ok(errs.length===0,'errors '+errs.join(';'));
if(round===1){const el=await p.$('[data-id="fz"], #it-fz');if(el){await el.scrollIntoViewIfNeeded();await el.click().catch(()=>{});await p.waitForTimeout(400)}else{await p.evaluate(()=>{const x=[...document.querySelectorAll('*')].find(e=>e.children.length<3&&/Port Blair To Havelock/.test(e.textContent));x&&x.scrollIntoView({block:'center'});x&&x.click()});await p.waitForTimeout(400)}await p.screenshot({path:T+'out/r7_cust.png'})}
await b.close()}console.log('TOTAL FAILS',fails)})();
