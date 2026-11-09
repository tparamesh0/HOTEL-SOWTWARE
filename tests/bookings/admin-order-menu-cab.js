const T=__dirname+'/';const B_=JSON.parse(require('fs').readFileSync(T+'../../customer/web/version.json','utf8')).build;
const H=require(T+'h.js');const fs=require('fs');(async()=>{let fails=0;for(const round of [1,2,3])for(const [W,mob] of [[1366,false],[390,true]]){const [b,p]=await H(W,900,mob);await p.waitForTimeout(700);const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',round,W,m)}};
await p.addScriptTag({content:fs.readFileSync(T+'sbmock.js','utf8')});
await p.evaluate(()=>{loginHide();SB=__mockSB();ME={email:'x@y.z',role:'owner',perms:{}};roleApply();S.set.ferry=[{name:'Port Blair To Havelock'}];
 S.set.hist=[{id:'h1',cust:1,name:'SPECIAL',pkgName:'SPECIAL',dur:'1',date:'',nums:{},snap:{persons:2,meta:{},picks:{1:{name:'CORBYN',place:'City',stops:['Airport To Hotel','Cellular Jail','Corbyn Cove Beach','Cellular Jail Light & Sound Show','Return To Hotel']},2:{name:'HAVELOCK',place:'Havelock',stops:['Port Blair To Havelock','Radhanagar Beach']}},ferry:[{name:'Port Blair To Havelock',boat:'MAKRUZZ',time:'6:00 AM'}],act:[],hotels:[],comp:[]}}];go('home');go('bookings')});await p.waitForTimeout(300);
await p.evaluate(()=>A.bkNew());await p.waitForTimeout(150);await p.selectOption('#bk_hist','h1');await p.fill('#bk_name','P Sneha');await p.fill('#bk_phone','96795'+String(10000+Math.floor(Math.random()*89999)));
await p.click('[data-a="bkCreate"]');await p.waitForTimeout(1200);
const asked=[];const step=async(o)=>{const h=(await p.textContent('.bk-wiz h3')).replace(/^\S+\s/,'').trim();asked.push(h);
 if(o.nocab){await p.check('#bw_nocab')}if(o.cab)await p.fill('#bw_cab',o.cab);if(o.at)await p.fill('#bw_at',o.at);if(o.t){await p.fill('#bw_t',o.t);await p.locator('#bw_t').dispatchEvent('change')}
 if(o.pm){ok(!(await p.isVisible("#bw_warn")),"no warning while still typing");await p.waitForTimeout(1400);ok(await p.isVisible('#bw_warn'),'AM/PM warning for '+h);await p.click('[data-a="bkWizPM"]');ok(await p.inputValue('#bw_t')==='18:00','changed to PM')}
 if(round===1&&W===390&&o.shot)await p.screenshot({path:T+'out/r6_wiz.png'});
 await p.click('[data-a="bkWizSave"]:not([data-ferry])');await p.waitForTimeout(450)};
await step({t:'08:00'});await step({cab:'09:00',at:'Hotel lobby',t:'09:30'});await step({cab:'11:00',t:'11:30'});await step({nocab:1,t:'06:00',pm:1,shot:1});await step({t:'19:30'});await step({cab:'05:15',t:'06:00'});await step({cab:'09:00',t:'10:00'});
ok(!(await p.$('.bk-wiz')),'wizard finished');
ok(JSON.stringify(asked)===JSON.stringify(['Airport To Hotel','Cellular Jail','Corbyn Cove Beach','Cellular Jail Light & Sound Show','Return To Hotel','Port Blair To Havelock','Radhanagar Beach']),'asked in package order: '+asked.join(' | '));
const d1=await p.evaluate(()=>[...document.querySelectorAll('.bk-tl2[data-day="1"] .bk-it2 .bk-tx b')].map(x=>x.textContent.replace(/^\S+\s/,'').trim()));
ok(JSON.stringify(d1)===JSON.stringify(['Airport To Hotel','Cellular Jail','Corbyn Cove Beach','Cellular Jail Light & Sound Show','Return To Hotel']),'day1 order: '+d1.join(' | '));
const ls=await p.evaluate(()=>BK().cur.items.find(i=>/light/i.test(i.title)));ok(ls.time==='6:00 PM'&&ls.data.nocab&&!ls.data.cab,'L&S 6 PM no cab '+JSON.stringify([ls.time,ls.data]));
ok(!!(await p.$(`[data-a="bkCabOn"][data-k="${ls.id}"]`)),'row shows No cab button');
// turn cab back on, then off from the row
await p.click(`[data-a="bkCabOn"][data-k="${ls.id}"]`);await p.waitForTimeout(300);ok(!(await p.evaluate(i=>BK().cur.items.find(x=>x.id===i).data.nocab,ls.id)),'cab on again');
await p.click(`[data-a="bkCabOff"][data-k="${ls.id}"]`);await p.waitForTimeout(300);ok(await p.evaluate(i=>BK().cur.items.find(x=>x.id===i).data.nocab,ls.id)===true,'cab off from row');
// ⋯ menu inside the screen
await p.click('[data-a="bkMore"]');await p.waitForTimeout(250);const bx=await p.evaluate(()=>{const e=document.querySelector('.bk-moremenu');const r=e.getBoundingClientRect();return [r.left,r.right,innerWidth,!!e.querySelector('[data-a="bkDel"]')]});ok(bx[0]>=0&&bx[1]<=bx[2]&&bx[3],'menu on screen with Delete '+bx);
if(round===1&&W===390)await p.screenshot({path:T+'out/r6_menu.png'});await p.evaluate(()=>closeModal());
if(round===1){await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:T+`out/r6_ed_${W}.png`,fullPage:true})}
const sw=await p.evaluate(()=>document.documentElement.scrollWidth);ok(sw<=W+1,'no sideways scroll '+sw);
console.log(round,W,'errs',JSON.stringify(p.errs));if(p.errs.length)fails++;await b.close()}console.log('TOTAL FAILS',fails)})();
