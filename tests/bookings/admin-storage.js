// 💽 Storage (Settings): owner-only meter, what uses space, clean old backups, red banner at 80%.
const T=__dirname+'/';const H=require(T+'h.js');const fs=require('fs');
(async()=>{let fails=0;for(const round of [1,2,3])for(const [W,mob] of [[1366,false],[390,true]]){const [b,p]=await H(W,900,mob);await p.waitForTimeout(700);
await p.addScriptTag({content:fs.readFileSync(T+'sbmock.js','utf8')});
const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',round,W,m)}};
// numbers shaped like the real project on 9 Nov 2026: 160 MB used, 25 backups
await p.evaluate(()=>{loginHide();SB=__mockSB();ME={email:'tparamesh0@gmail.com',role:'owner',perms:{}};roleApply();
 const MB=1048576,bk=[];let t=Date.parse('2026-11-02T15:00:00Z');
 for(let i=0;i<19;i++)bk.push({id:100+i,kind:'hourly',at:new Date(t-i*3600e3).toISOString(),bytes:Math.round(2.9*MB)});
 for(let i=0;i<5;i++)bk.push({id:200+i,kind:'daily',at:new Date(t-i*86400e3).toISOString(),bytes:Math.round(3.2*MB)});
 bk.push({id:300,kind:'manual',at:'2026-10-28T10:00:00Z',bytes:Math.round(2.4*MB)});
 window.__ST={total:167270067,limit:500*MB,files:0,files_limit:1024*MB,parts:{backups:133431296,history:4235264,bookings:1163264,data:15237120,system:13203123},backups:bk,at:new Date().toISOString()};
 window.__trim=null;const o=SB.rpc;SB.rpc=async(f,a)=>{if(f==='mmt_storage_info')return {data:JSON.parse(JSON.stringify(__ST)),error:null};
  if(f==='mmt_backup_trim'){__trim=a;const seen={},keep={hourly:a.p_hourly,daily:a.p_daily,manual:a.p_manual};const before=__ST.backups.length;__ST.backups=__ST.backups.filter(x=>(seen[x.kind]=(seen[x.kind]||0)+1)<=Math.max(1,keep[x.kind]));return {data:{deleted:before-__ST.backups.length,freed:1},error:null}}
  return o(f,a)};
 go('home')});
await p.waitForTimeout(300);

// 1. menu: Storage right after Backup & restore
await p.evaluate(()=>{UI.sset='backup';go('settings')});await p.waitForTimeout(300);
const sm=await p.evaluate(()=>[...document.querySelectorAll('[data-a="sset"][data-k]')].map(x=>x.dataset.k));
ok(sm.indexOf('storage')===sm.indexOf('backup')+1,'storage after backup: '+sm.join());
// 2. open Storage: real-like numbers
await p.evaluate(()=>{UI.sset='storage';render()});await p.waitForTimeout(500);
const tx=await p.evaluate(()=>document.querySelector('#root').innerText);
ok(tx.includes('32%'),'shows 32%');ok(tx.includes('160 MB of 500 MB'),'160 of 500');ok(tx.includes('Safe'),'safe level');
ok(tx.includes('127 MB'),'backups 127 MB');ok(tx.includes('25 copies'),'25 copies');ok(tx.includes('15 MB'),'data 15 MB');
ok(/Hourly\s*· 19 copies/.test(tx),'hourly 19');ok(/Daily\s*· 5 copies/.test(tx),'daily 5');ok(/Export\s*· 1 copy/.test(tx),'export 1');
ok(tx.includes('removes 13 copies'),'estimate removes 13');
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no sideways scroll');
if(round===1)await p.screenshot({path:T+'out/storage_'+W+'.png',fullPage:true});
// 3. clean dialog: estimate updates, Cancel changes nothing
await p.click('[data-a="stClean"]');await p.waitForTimeout(250);
ok(await p.evaluate(()=>document.getElementById('st_est').textContent.includes('Removes 13')),'dialog estimate 13');
await p.fill('#st_h','19');await p.waitForTimeout(150);ok(await p.evaluate(()=>document.getElementById('st_est').textContent.includes('Removes 0')),'keep 19 hourly -> 0');
await p.fill('#st_h','0');await p.waitForTimeout(150);ok(await p.evaluate(()=>document.getElementById('st_est').textContent.includes('Removes 18')),'0 means keep at least 1 -> 18');
if(round===1)await p.screenshot({path:T+'out/storage_clean_'+W+'.png'});
await p.click('.md [data-a="closeModal"]');await p.waitForTimeout(200);ok(await p.evaluate(()=>__trim===null&&__ST.backups.length===25),'cancel deletes nothing');
// 4. clean for real (mock): keeps 6/7/5
await p.click('[data-a="stClean"]');await p.waitForTimeout(250);await p.click('[data-a="stCleanGo"]');await p.waitForTimeout(600);
ok(await p.evaluate(()=>__trim&&__trim.p_hourly===6&&__trim.p_daily===7&&__trim.p_manual===5),'trim called with 6/7/5');
ok(await p.evaluate(()=>__ST.backups.length===12),'12 left');
ok(await p.evaluate(()=>/Hourly\s*· 6 copies/.test(document.querySelector('#root').innerText)),'page refreshed: hourly 6');
// 5. banner on Dashboard only at 80%+
await p.evaluate(()=>go('home'));await p.waitForTimeout(300);ok(await p.evaluate(()=>!document.querySelector('.st-ban')),'no banner at 32%');
await p.evaluate(()=>{__ST.total=430*1048576;UI.stInfo=null;return stLoad()});await p.waitForTimeout(300);
ok(await p.evaluate(()=>!!document.querySelector('.st-ban')&&document.querySelector('.st-ban').innerText.includes('86%')),'red banner at 86%');
if(round===1)await p.screenshot({path:T+'out/storage_banner_'+W+'.png'});
await p.click('.st-ban [data-a="stOpen"]');await p.waitForTimeout(300);ok(await p.evaluate(()=>UI.page==='settings'&&UI.sset==='storage'),'banner opens Storage');
ok(await p.evaluate(()=>document.querySelector('#root').innerText.includes('Clean now')),'red level text');
// 6. not for staff
await p.evaluate(()=>{ME.role='staff';ME.perms={view_settings:true,settings:true};roleApply();UI.sset='colors';go('home');go('settings')});await p.waitForTimeout(300);
ok(await p.evaluate(()=>![...document.querySelectorAll('[data-a="sset"][data-k]')].some(x=>x.dataset.k==='storage')),'staff: no Storage in menu');
await p.evaluate(()=>{UI.sset='storage';render()});await p.waitForTimeout(200);ok(await p.evaluate(()=>!document.querySelector('[data-a="stClean"]')),'staff: no clean button');
await p.evaluate(()=>go('home'));await p.waitForTimeout(200);ok(await p.evaluate(()=>!document.querySelector('.st-ban')),'staff: no banner');
console.log(round,W,'errs',JSON.stringify(p.errs));if(p.errs.length)fails++;await b.close()}console.log('TOTAL FAILS',fails)})();
