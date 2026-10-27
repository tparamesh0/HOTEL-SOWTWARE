const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>{errs.push(e.message);console.log('ERR',e.message)});p.on('dialog',d=>d.dismiss());
const ok=(n,v)=>console.log(v?'PASS':'FAIL',n);
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
// ---------- designs
ok('11 designs',await p.evaluate(()=>DSTYLES.length===14));
await p.evaluate(()=>{const mk=n=>({name:n,trip:2000,ticket:500,stops:['Cellular Jail','Corbyn Cove'],notes:''});UI.pkgDur='2';S.set.pkgPicks['2']={1:mk('Port Blair'),2:mk('Havelock')};S.set.pkgComp['2']=[{id:'c',name:'Welcome drink'}];S.set.docMeta.name='Ravi Kumar';S.set.docMeta.phone='9876543210';S.set.pkgPersons['2']=2;save()});
for(const st of ['royal','ocean','minimal','sunset','emerald']){await p.evaluate(s=>{document.getElementById('modal').innerHTML='<div style="position:fixed;inset:0;background:#ddd;overflow:auto;z-index:99;padding:10px">'+docHTML('2','agent',s)+'</div>'},st);await p.waitForTimeout(150);await p.screenshot({path:`/tmp/claude-0/s170/d_${st}.png`});const w=await p.evaluate(()=>{const d=document.querySelector('.dv');return d.scrollWidth<=d.clientWidth+1});if(!w)console.log('FAIL overflow',st)}
await p.evaluate(()=>closeModal());
await p.evaluate(()=>{UI.pkgTab='docs';go('pkgset')});await p.waitForTimeout(100);
ok('delete buttons',await p.locator('[data-a="dsDel"]').count()===15);
await p.click('[data-a="dsDel"][data-k="tally"]');await p.click('[data-a="dsDel"][data-k="tally"]');await p.waitForTimeout(100);
ok('tally hidden, default moved',await p.evaluate(()=>S.set.dsHidden.includes('tally')&&S.set.docStyle!=='tally'&&dStyle()!=='tally'&&!dsList().some(x=>x[0]==='tally')));
ok('restore box',await p.locator('[data-a="dsRestore"]').count()===2);
await p.screenshot({path:'/tmp/claude-0/s170/ds_grid.png',fullPage:false});
await p.evaluate(()=>A.billPrev({dataset:{m:'agent'}}));await p.waitForTimeout(150);
ok('preview strip excludes tally',await p.evaluate(()=>!document.querySelector('[data-a="pvSt"][data-k="tally"]')&&document.querySelectorAll('[data-a="pvSt"]').length===14));
const cur=await p.evaluate(()=>UI.pv.st);await p.click('#modal [data-a="dsDel"]');await p.click('#modal [data-a="dsDel"]');await p.waitForTimeout(100);
ok('delete from preview',await p.evaluate(c=>S.set.dsHidden.includes(c)&&UI.pv.st!==c&&!!document.querySelector('#modal .docmd'),cur));
await p.evaluate(()=>closeModal());await p.click('[data-a="dsRestore"][data-k=""]');ok('restore all',await p.evaluate(()=>S.set.dsHidden.length===0));
// ---------- security
await p.evaluate(()=>{UI.sset='pin';go('settings')});await p.waitForTimeout(100);
ok('not protected tag',await p.evaluate(()=>document.body.innerText.includes('NOT PROTECTED')));
await p.click('[data-a="secSetup"]');await p.click('[data-a="swType"][data-k="pin"]');
await p.fill('[data-secin="new1"]','1234');await p.click('[data-a="swNext"]');ok('weak pin rejected',await p.evaluate(()=>$('#secErr').textContent.includes('easy')));
await p.fill('[data-secin="new1"]','');for(const k of '4826')await p.click(`[data-a="kp"][data-k="${k}"]`);await p.click('[data-a="swNext"]');
await p.fill('[data-secin="new2"]','4827');await p.click('[data-a="swNext"]');ok('mismatch',await p.evaluate(()=>$('#secErr').textContent.includes('match')));
await p.fill('[data-secin="new2"]','4826');await p.click('[data-a="swNext"]');
await p.selectOption('#swQ',{index:1});await p.fill('#swA','Havelock Beach');await p.click('[data-a="swQGo"]');
const code=await p.evaluate(()=>UI.sw.code);console.log('code',code);
await p.click('[data-a="swDone"]');ok('need tick',await p.evaluate(()=>$('#secErr').textContent.includes('Tick')));
await p.check('#swOk');await p.click('[data-a="swDone"]');
const sec=await p.evaluate(()=>S.set.sec);ok('stored hashed (no plain pin)',sec.hash&&sec.hash.length===64&&!JSON.stringify(sec).includes('4826')&&!JSON.stringify(sec).toLowerCase().includes('havelock beach')&&sec.rHash&&sec.aHash&&!(await p.evaluate(()=>localStorage.getItem(KEY))).includes('4826'));
ok('lock now button',await p.locator('.nav [data-a="lockNow"]').count()===1);
// reload -> lock screen
await p.reload();await p.waitForTimeout(400);
ok('locked on open',await p.evaluate(()=>document.body.classList.contains('locked')&&!!document.querySelector('#lock .lockmd')&&getComputedStyle(document.getElementById('root')).display==='none'));
await p.screenshot({path:'/tmp/claude-0/s170/lock.png'});
for(let i=0;i<5;i++){await p.fill('[data-secin="unlock"]','9999');await p.keyboard.press('Enter');await p.waitForTimeout(80)}
ok('lockout after 5',await p.evaluate(()=>secWait()>0&&!!document.querySelector('.lockwait')));
await p.reload();await p.waitForTimeout(300);ok('lockout survives restart',await p.evaluate(()=>secWait()>0));
// forgot with answer
await p.click('[data-a="secForgot"]');await p.waitForTimeout(80);
await p.evaluate(()=>{S.set.sec.until=0;save()});await p.click('[data-a="fgMode"][data-k="q"]');
await p.fill('#fgIn','wrong');await p.click('[data-a="fgGo"]');ok('wrong answer',await p.evaluate(()=>$('#fgErr').textContent.length>0));
await p.fill('#fgIn','  havelock   BEACH ');await p.click('[data-a="fgGo"]');await p.waitForTimeout(100);
ok('answer accepted -> unlocked + wizard',await p.evaluate(()=>!document.body.classList.contains('locked')&&UI.unlocked&&UI.sw&&UI.sw.step==='type'));
// set password via wizard
await p.click('[data-a="swType"][data-k="password"]');await p.fill('[data-secin="new1"]','abc');await p.click('[data-a="swNext"]');ok('short pw rejected',await p.evaluate(()=>$('#secErr').textContent.includes('8')));
await p.fill('[data-secin="new1"]','Magic2026!');await p.waitForTimeout(50);ok('meter strong',await p.evaluate(()=>$('#pwTxt').innerText.includes('Strong')));
await p.click('[data-a="swNext"]');await p.fill('[data-secin="new2"]','Magic2026!');await p.click('[data-a="swNext"]');await p.fill('#swA','port blair');await p.click('[data-a="swQGo"]');const code2=await p.evaluate(()=>UI.sw.code);await p.check('#swOk');await p.click('[data-a="swDone"]');
ok('password set',await p.evaluate(()=>S.set.sec.type==='password'));
// lock now + unlock with password
await p.click('.nav [data-a="lockNow"]');ok('lock now',await p.evaluate(()=>document.body.classList.contains('locked')));
await p.fill('[data-secin="unlock"]','Magic2026!');await p.click('[data-a="secUnlock"]');await p.waitForTimeout(100);ok('unlock with password',await p.evaluate(()=>!document.body.classList.contains('locked')));
// recovery code path
await p.click('.nav [data-a="lockNow"]');await p.click('[data-a="secForgot"]');await p.click('[data-a="fgMode"][data-k="r"]');await p.fill('#fgIn',code2.toLowerCase().replace(/-/g,' '));await p.click('[data-a="fgGo"]');await p.waitForTimeout(100);
ok('recovery code works',await p.evaluate(()=>!document.body.classList.contains('locked')&&UI.sw&&UI.sw.step==='type'));
// pattern
await p.click('[data-a="swType"][data-k="pattern"]');
const drag=async(seq)=>{const pts=[];for(const i of seq){const bb=await p.locator(`.pd[data-pd="${i}"]`).boundingBox();pts.push([bb.x+bb.width/2,bb.y+bb.height/2])}await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1)){await p.mouse.move(q[0],q[1],{steps:6})}await p.mouse.up();await p.waitForTimeout(150)};
await drag([0,1,2]);ok('pattern too short',await p.evaluate(()=>$('#secErr').textContent.includes('4')));
await drag([0,3,6,7,8]);ok('pattern step 2',await p.evaluate(()=>UI.sw.step==='new2'));await p.screenshot({path:'/tmp/claude-0/s170/pat.png'});
await drag([0,3,6,7,8]);await p.fill('#swA','port blair');await p.click('[data-a="swQGo"]');await p.check('#swOk');await p.click('[data-a="swDone"]');
ok('pattern set',await p.evaluate(()=>S.set.sec.type==='pattern'));
await p.click('.nav [data-a="lockNow"]');await drag([0,1,2,5]);ok('wrong pattern',await p.evaluate(()=>document.body.classList.contains('locked')&&$('#secErr').textContent.includes('Wrong')));
// tap mode
for(const i of [0,3,6,7,8])await p.click(`.pd[data-pd="${i}"]`);await p.click('[data-a="patOk"]');await p.waitForTimeout(100);ok('pattern tap unlock',await p.evaluate(()=>!document.body.classList.contains('locked')));
// protections: settings + delete guard when locked (open off)
await p.evaluate(()=>{S.set.sec.on.open=false;save();UI.unlocked=false;go('home')});
await p.evaluate(()=>go('settings'));ok('settings guarded',await p.evaluate(()=>UI.page!=='settings'&&!!document.querySelector('#modal .pat')));
await p.click('[data-a="secCancel"]');
await p.evaluate(()=>{S.set.sec.on.settings=false;save()});await p.evaluate(()=>go('settings'));ok('settings unguarded when off',await p.evaluate(()=>UI.page==='settings'));
// auto lock
await p.evaluate(()=>{UI.unlocked=true;S.set.sec.auto=1;S.set.sec.on.open=true;UI.lastAct=Date.now()-61000;save()});await p.waitForTimeout(16000);ok('auto lock',await p.evaluate(()=>document.body.classList.contains('locked')));
for(const i of [0,3,6,7,8])await p.click(`.pd[data-pd="${i}"]`);await p.click('[data-a="patOk"]');
// remove lock
await p.evaluate(()=>{UI.sset='pin';go('settings')});await p.click('[data-a="secRemove"]');for(const i of [0,3,6,7,8])await p.click(`.pd[data-pd="${i}"]`);await p.click('[data-a="patOk"]');await p.waitForTimeout(100);
ok('removed',await p.evaluate(()=>!secOn()&&document.body.innerText.includes('NOT PROTECTED')));
// legacy migration
await p.evaluate(()=>{S.set.sec={};S.set.pin='5555';localStorage.setItem(KEY,JSON.stringify(S))});await p.reload();await p.waitForTimeout(300);
ok('legacy PIN migrated & hashed',await p.evaluate(()=>secOn()&&S.set.pin===''&&S.set.sec.type==='pin'&&secVerify('5555')&&!document.body.classList.contains('locked')));
await p.evaluate(()=>go('settings'));await p.fill('[data-secin="unlock"]','5555');await p.waitForTimeout(150);ok('legacy pin auto-unlocks',await p.evaluate(()=>UI.page==='settings'));
await p.screenshot({path:'/tmp/claude-0/s170/sec.png',fullPage:true});
console.log('errors',errs.length);await b.close()})();
