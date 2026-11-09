const T=__dirname+'/';const B_=JSON.parse(require('fs').readFileSync(T+'../../customer/web/version.json','utf8')).build;
const H=require(T+'h.js');const fs=require('fs');(async()=>{let fails=0;for(const round of [1,2,3])for(const [W,mob] of [[1366,false],[390,true]]){const [b,p]=await H(W,900,mob);await p.waitForTimeout(700);const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',round,W,m)}};
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addScriptTag({content:fs.readFileSync(T+'sbmock.js','utf8')});
await p.evaluate(()=>{loginHide();SB=__mockSB();ME={email:'x@y.z',role:'owner',perms:{}};roleApply();S.set.ferry=[{id:'f1',name:'Port Blair To Havelock',boat:'MAKRUZZ',time:'1:30 PM'}];
 S.set.hist=[{id:'h1',cust:1,name:'SPECIAL',pkgName:'SPECIAL',dur:'1',date:'',nums:{},snap:{persons:2,meta:{},picks:{1:{name:'CITY',place:'City',stops:['Airport To Hotel','Cellular Jail','Radhanagar Beach']},2:{name:'HL',place:'Havelock',stops:['Kalapathar Beach']}},ferry:[],act:[],hotels:[],comp:[]}}];go('home');go('bookings')});await p.waitForTimeout(300);
await p.evaluate(()=>A.bkNew());await p.waitForTimeout(150);await p.selectOption('#bk_hist','h1');await p.fill('#bk_name','Ferry Test');await p.fill('#bk_phone','96795'+String(10000+Math.floor(Math.random()*89999)));
await p.click('[data-a="bkCreate"]');await p.waitForTimeout(1200);
const TL=async()=>p.evaluate(()=>[...document.querySelectorAll('.bk-tl2[data-day="1"] .bk-it2 b')].map(x=>x.textContent.trim()));
// wizard: event1 airport, event2 Cellular Jail -> add ferry after it
const save=async()=>{await p.click('.bk-wiz [data-a="bkWizSave"]:not([data-ferry])');await p.waitForTimeout(450)};
await p.fill('#bw_t','08:00');await save();
await p.fill('#bw_cab','09:00');await p.fill('#bw_t','09:30');
ok(await p.isVisible('.bk-wiz [data-ferry]'),'wizard offers add ferry');
await p.click('.bk-wiz [data-ferry]');await p.waitForTimeout(500);
ok(await p.isVisible('#bf_pick'),'ferry form opened from wizard');
await p.selectOption('#bf_pick','0');await p.waitForTimeout(150);
ok(await p.inputValue('#bi_title')==='Port Blair To Havelock','pick fills route');ok(await p.inputValue('#bd_name')==='MAKRUZZ','pick fills boat');ok(await p.inputValue('#bi_time')==='13:30','pick fills time');ok(await p.inputValue('#bd_to')==='Havelock','pick fills to');
await p.fill('#bd_harbour','Haddo Wharf');await p.fill('#bd_report','12:45');await p.fill('#bd_arrive','15:00');await p.fill('#bd_ticket','PNR123');await p.fill('#bd_seat','A1, A2');await p.fill('#bd_cab','12:00');await p.fill('#bd_cabAt','Cellular Jail gate');
if(round===1&&W===390)await p.screenshot({path:T+'out/r7_form.png',fullPage:false});
await p.click('[data-a="bkItemSave"]:not([data-ferry])');await p.waitForTimeout(700);
ok(await p.isVisible('.bk-wiz'),'wizard continues after ferry');
const h=(await p.textContent('.bk-wiz h3')).trim();ok(/Radhanagar/.test(h),'next step is the event after the ferry: '+h);
let t=await TL();ok(JSON.stringify(t)===JSON.stringify(['Airport To Hotel','Cellular Jail','Port Blair To Havelock','Radhanagar Beach']),'ferry placed after Cellular Jail: '+t.join(' | '));
const fr=await p.evaluate(()=>BK().cur.items.find(x=>x.kind==='ferry'));ok(fr&&fr.data.report==='12:45 PM'&&fr.data.arrive==='3:00 PM'&&fr.data.seat==='A1, A2'&&fr.data.cab==='12:00 PM'&&fr.data.ticket==='PNR123'&&fr.time==='1:30 PM','ferry details saved: '+JSON.stringify(fr&&fr.data));
await p.click('[data-a="bkWizEnd"]');await p.waitForTimeout(300);
// day 2 ferry button
await p.click('.bk-qa[data-d="2"] [data-k="new:ferry"]');await p.waitForTimeout(300);ok(/Day 2/.test(await p.textContent('#modal h3')),'day 2 ferry form');
await p.fill('#bi_title','Havelock To Port Blair');await p.fill('#bi_time','16:00');await p.click('[data-a="bkItemSave"]:not([data-ferry])');await p.waitForTimeout(600);
ok(await p.evaluate(()=>BK().cur.items.some(x=>x.kind==='ferry'&&x.day===2&&x.time==='4:00 PM')),'day 2 ferry added');
// quick add typed ferry opens the form
await p.fill('.bk-qa[data-d="2"] .bk-qt','Ferry to Neil');await p.click('.bk-qa[data-d="2"] [data-a="bkQuick"]');await p.waitForTimeout(300);
ok(/^ferry to neil$/i.test(await p.inputValue('#bi_title'))&&await p.inputValue('#bd_to')==='Neil','typed ferry opens prefilled form');await p.click('[data-a="closeModal"]');await p.waitForTimeout(200);
// activity edit: save + add ferry after (no time -> placed right after)
const kid=await p.evaluate(()=>BK().cur.items.find(x=>x.title==='Kalapathar Beach').id);
await p.click(`[data-a="bkItem"][data-k="${kid}"]`);await p.waitForTimeout(300);await p.click('[data-a="bkItemSave"][data-ferry]');await p.waitForTimeout(600);
ok(await p.isVisible('#bf_pick'),'save + add ferry after opens ferry form');await p.fill('#bi_title','Havelock To Neil');await p.click('[data-a="bkItemSave"]:not([data-ferry])');await p.waitForTimeout(700);
const d2=await p.evaluate(()=>[...document.querySelectorAll('.bk-tl2[data-day="2"] .bk-it2 b')].map(x=>x.textContent.trim()));const ik=d2.indexOf('Kalapathar Beach');ok(d2[ik+1]==='Havelock To Neil','untimed ferry right after Kalapathar: '+d2.join(' | '));
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no sideways scroll');
if(round===1&&W===390){await p.evaluate(()=>document.querySelector('.bk-tl2[data-day="1"]').scrollIntoView());await p.screenshot({path:T+'out/r7_rows.png'})}
ok(errs.length===0,'no page errors '+errs.join(';'));
await b.close()}console.log('TOTAL FAILS',fails)})();
