const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));const ok=(n,v)=>console.log(v?'PASS':'FAIL',n);
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const sl='abcd';Object.assign(SEC(),{type:'pin',salt:sl,hash:kdf(sl,'2468'),len:4});save();UI.unlocked=false;const out={on:secOn()};UI.brD={name:'X Soft'};A.brSave();out.lockBrand=!!document.querySelector('[data-secin]');closeModal();A.clrStart();out.lockWipe=!!document.querySelector('[data-secin]');closeModal();return out});console.log(r);ok('password asked',r.on&&r.lockBrand&&r.lockWipe);
// unlock and clear data
await p.evaluate(()=>{UI.unlocked=true;S.set.logo='data:image/png;base64,AAAA';S.set.company.name='MY CO';S.set.company.phone='999';save()});
await p.evaluate(()=>{A.clrStart()});await p.waitForTimeout(200);await p.evaluate(()=>{UI.clr.n=0});await p.fill('#clrIn','DELETE');await p.evaluate(()=>A.clrDo());await p.waitForTimeout(1500);
const st=await p.evaluate(()=>({h:S.hotels.length,name:S.set.company.name,phone:S.set.company.phone,logo:S.set.logo,hist:(S.set.hist||[]).length,sec:secOn(),pro:S.set.pro}));console.log(st);ok('clear keeps name/logo',st.h===0&&st.name==='MY CO'&&st.logo&&!st.phone);
console.log('errs',errs);await b.close()})();
