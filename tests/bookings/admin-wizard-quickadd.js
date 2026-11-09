const T=__dirname+'/';const B_=JSON.parse(require('fs').readFileSync(T+'../../customer/web/version.json','utf8')).build;
const H=require(T+'h.js');const fs=require('fs');(async()=>{let fails=0;for(const round of [1,2,3])for(const [W,mob] of [[1366,false],[390,true]]){const [b,p]=await H(W,900,mob);await p.waitForTimeout(700);const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',round,W,m)}};
await p.addScriptTag({content:fs.readFileSync(T+'sbmock.js','utf8')});
await p.evaluate(()=>{loginHide();SB=__mockSB();ME={email:'tparamesh0@gmail.com',role:'owner',perms:{}};roleApply();S.set.ferry=[{name:'Port Blair To Havelock'},{name:'Havelock To Port Blair'}];
 S.set.hist=[{id:'h1',cust:1,name:'SPECIAL',pkgName:'SPECIAL',dur:'2',date:'07 Nov 2026',nums:{},snap:{persons:2,meta:{},picks:{1:{name:'CORBYN',place:'City',stops:['Airport To Hotel','Cellular Jail','Corbyn Cove Beach']},2:{name:'HAVELOCK',place:'Havelock',stops:['Port Blair To Havelock','Radhanagar Beach']}},ferry:[{name:'Port Blair To Havelock',boat:'MAKRUZZ',time:'6:00 AM'}],act:[],hotels:[],comp:[]}}];go('home');go('bookings')});await p.waitForTimeout(300);
await p.evaluate(()=>A.bkNew());await p.waitForTimeout(150);await p.selectOption('#bk_hist','h1');await p.fill('#bk_name','Client '+round);await p.fill('#bk_phone','98765'+String(10000+Math.floor(Math.random()*89999)));
await p.click('[data-a="bkCreate"]');await p.waitForTimeout(1200);
ok(!!(await p.$('.bk-wiz')),'wizard opens after create');
const t1=await p.textContent('.bk-wiz h3');ok(/Airport To Hotel/.test(t1),'wizard first = Airport: '+t1);ok(!(await p.$('#bw_cab')),'pickup asks only one time');
await p.fill('#bw_t','09:00');await p.click('[data-a="bkWizSave"]:not([data-ferry])');await p.waitForTimeout(500);
const t2=await p.textContent('.bk-wiz h3');ok(/Cellular Jail/.test(t2),'wizard second = Cellular Jail: '+t2);
await p.fill('#bw_cab','12:30');await p.fill('#bw_at','Hotel lobby');await p.fill('#bw_t','13:00');if(round===1&&W===1366)await p.screenshot({path:T+'out/r5_wiz.png'});await p.click('[data-a="bkWizSave"]:not([data-ferry])');await p.waitForTimeout(500);
await p.evaluate(()=>closeModal());await p.waitForTimeout(200);
const cj=await p.evaluate(()=>{const it=BK().cur.items.find(i=>i.title==='Cellular Jail');return {t:it.time,cab:it.data.cab,at:it.data.cabAt}});ok(cj.t==='1:00 PM'&&cj.cab==='12:30 PM'&&/hotel lobby/i.test(cj.at),'saved cab+event '+JSON.stringify(cj));
const rowCab=await p.evaluate(()=>{const it=BK().cur.items.find(i=>i.title==='Cellular Jail');return document.querySelector(`.bk-ct[data-cab="${it.id}"]`).value});ok(rowCab==='12:30','row shows cab time '+rowCab);
// quick add with cab + event time on day 1
await p.fill('.bk-qa[data-d="1"] .bk-qt','Light & Sound Show');await p.fill('.bk-qa[data-d="1"] .bk-qc','17:15');await p.fill('.bk-qa[data-d="1"] .bk-qm','17:45');await p.press('.bk-qa[data-d="1"] .bk-qt','Enter');await p.waitForTimeout(700);
const ls=await p.evaluate(()=>{const it=BK().cur.items.find(i=>/light & sound/i.test(i.title));return it&&{t:it.time,cab:it.data.cab,k:it.kind}});ok(ls&&ls.t==='5:45 PM'&&ls.cab==='5:15 PM'&&ls.k==='activity','quick add cab+event '+JSON.stringify(ls));
// ferry detected automatically
await p.fill('.bk-qa[data-d="2"] .bk-qt','Havelock To Port Blair');await p.fill('.bk-qa[data-d="2"] .bk-qm','16:00');await p.press('.bk-qa[data-d="2"] .bk-qt','Enter');await p.waitForTimeout(400);ok(await p.inputValue('#bi_time')==='16:00','ferry form prefilled time');await p.click('[data-a="bkItemSave"]:not([data-ferry])');await p.waitForTimeout(600);
ok(await p.evaluate(()=>BK().cur.items.find(i=>i.title==='Havelock To Port Blair').kind)==='ferry','ferry detected');
// inline cab time change
const id=await p.evaluate(()=>BK().cur.items.find(i=>i.title==='Corbyn Cove Beach').id);await p.fill(`.bk-ct[data-cab="${id}"]`,'14:30');await p.locator(`.bk-ct[data-cab="${id}"]`).blur();await p.waitForTimeout(500);
ok(await p.evaluate(i=>BK().cur.items.find(x=>x.id===i).data.cab,id)==='2:30 PM','inline cab saved');
// edit form: no "Quick fill from my Activities"; has cab section
await p.click(`[data-a="bkItem"][data-k="${id}"]`);await p.waitForTimeout(200);ok(!(await p.$('#bi_from')),'no activities quick fill');ok(!!(await p.$('.bk-cabsec #bd_cab')),'cab section in edit');if(round===1&&W===1366)await p.screenshot({path:T+'out/r5_edit.png'});await p.evaluate(()=>closeModal());
if(round===1)await p.screenshot({path:T+`out/r5_ed_${W}.png`,fullPage:true});
console.log(round,W,'errs',JSON.stringify(p.errs));if(p.errs.length)fails++;await b.close()}console.log('TOTAL FAILS',fails)})();
