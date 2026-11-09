const T=__dirname+'/';const B_=JSON.parse(require('fs').readFileSync(T+'../../customer/web/version.json','utf8')).build;
const H=require(T+'h.js');const fs=require('fs');(async()=>{let fails=0;for(const round of [1,2,3])for(const [W,mob] of [[1366,false],[390,true]]){const [b,p]=await H(W,900,mob);await p.waitForTimeout(700);
await p.addScriptTag({content:fs.readFileSync(T+'sbmock.js','utf8')});
await p.evaluate(()=>{loginHide();SB=__mockSB();ME={email:'tparamesh0@gmail.com',role:'owner',perms:{}};roleApply();
 S.set.hist=[{id:'h1',cust:1,name:'MAGIC MEMORIES SPECIAL PACKAGE',pkgName:'MAGIC MEMORIES SPECIAL PACKAGE',dur:'3',date:'07 Nov 2026',nums:{},total:30000,snap:{persons:2,meta:{},picks:{1:{name:'CORBYN',place:'City',stops:['Airport To Hotel','Cellular Jail','Corbyn Cove Beach','Cellular Jail Light & Sound Show','Return To Hotel']},2:{name:'HAVELOCK',place:'Havelock',stops:['Port Blair To Havelock','Radhanagar Beach','Kala Pathar','Return To Hotel']},3:{name:'HAVELOCK',place:'Havelock',stops:['Elephant Beach','Havelock To Port Blair','Chidiyatapu','Return To Hotel']}},ferry:[{name:'Port Blair To Havelock',boat:'MAKRUZZ',time:'6:00 AM'},{name:'Havelock To Port Blair',boat:'MAKRUZZ',time:'4:00 PM'}],act:[],hotels:[{hotel:'Sea Shell',nights:1}],comp:[{name:'Candle dinner'}]}}];
 S.set.pkgDays={};go('home');go('bookings')});await p.waitForTimeout(300);
const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',round,W,m)}};
await p.evaluate(()=>A.bkNew());await p.waitForTimeout(150);await p.selectOption('#bk_hist','h1');await p.waitForTimeout(100);await p.fill('#bk_name','Client '+Date.now()%1000);await p.fill('#bk_phone','98765'+String(10000+Math.floor(Math.random()*89999)));
await p.click('[data-a="bkCreate"]');await p.waitForTimeout(1100);await p.evaluate(()=>closeModal());await p.waitForTimeout(200);
const r=await p.evaluate(()=>{const C=BK().cur;return {d1:C.items.filter(i=>i.day===1).sort((a,b)=>a.sort-b.sort).map(i=>i.title),d2:C.items.filter(i=>i.day===2).sort((a,b)=>a.sort-b.sort).map(i=>i.title),inc:Object.values(C.days).reduce((a,d)=>a+(d.included||[]).length+(d.excluded||[]).length,0)}});
ok(JSON.stringify(r.d1)===JSON.stringify(['Airport To Hotel','Cellular Jail','Corbyn Cove Beach','Cellular Jail Light & Sound Show','Return To Hotel']),'day1 order '+r.d1);
ok(r.d2[0]==='Port Blair To Havelock'&&!r.d2.includes('Havelock To Port Blair'),'day2 ferry first '+r.d2);ok(r.inc===0,'included empty '+r.inc);
if(round===1&&W===1366)await p.screenshot({path:T+'out/r4_ed.png',fullPage:true});
// set times inline: Airport 9:00, Cellular Jail 13:00
const setT=async(title,v)=>{const id=await p.evaluate(t=>BK().cur.items.find(i=>i.day===1&&i.title===t).id,title);const sel=`.bk-ti[data-id="${id}"]`;await p.fill(sel,v);await p.locator(sel).blur();await p.waitForTimeout(400)};
await setT('Airport To Hotel','09:00');await setT('Cellular Jail','13:00');await setT('Corbyn Cove Beach','15:00');
// quick add a cab at 12:30 on day 1 using Enter
await p.fill('.bk-qa[data-d="1"] .bk-qt','Cab to Cellular Jail');await p.fill('.bk-qa[data-d="1"] .bk-qm','12:30');await p.press('.bk-qa[data-d="1"] .bk-qt','Enter');await p.waitForTimeout(700);ok(await p.evaluate(()=>document.activeElement&&document.activeElement.classList.contains('bk-qt')),'focus back in quick add');
const d1=await p.evaluate(()=>[...document.querySelectorAll('.bk-tl2[data-day="1"] .bk-it2 b')].map(x=>x.textContent.trim()));
const ic=d1.findIndex(x=>/^cab to cellular jail$/i.test(x)),ij=d1.indexOf('Cellular Jail');ok(ic<0?false:ic===ij-1,'cab before Cellular Jail: '+d1.join(' | '));
// quick add a place with time 10:00 -> between airport (9) and cab (12:30)
await p.fill('.bk-qa[data-d="1"] .bk-qt','Flag Point');await p.fill('.bk-qa[data-d="1"] .bk-qm','10:00');await p.click('[data-a="bkQuick"][data-d="1"]');await p.waitForTimeout(700);
const d1b=await p.evaluate(()=>[...document.querySelectorAll('.bk-tl2[data-day="1"] .bk-it2 b')].map(x=>x.textContent.trim()));ok(d1b.indexOf('Flag Point')===1,'flag point second: '+d1b.join(' | '));
// day lock select
await p.selectOption('select[data-lock="2"]','open');await p.waitForTimeout(300);ok(await p.evaluate(()=>BK().cur.days[2].lock_mode)==='open','lock day2');

if(round===1&&W===1366)await p.screenshot({path:T+'out/r4_ed2.png',fullPage:true});if(round===1&&W===390)await p.screenshot({path:T+'out/r4_ed_m.png',fullPage:true});
// back arrow -> list, not dashboard
await p.evaluate(()=>A.back());await p.waitForTimeout(200);ok(await p.evaluate(()=>UI.page==='bookings'&&!BK().open),'back -> list');
console.log(round,W,'errs',JSON.stringify(p.errs));if(p.errs.length)fails++;await b.close()}console.log('TOTAL FAILS',fails)})();
