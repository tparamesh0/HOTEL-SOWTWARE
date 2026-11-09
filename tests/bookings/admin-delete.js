const T=__dirname+'/';const B_=JSON.parse(require('fs').readFileSync(T+'../../customer/web/version.json','utf8')).build;
const H=require(T+'h.js');const fs=require('fs');(async()=>{let fails=0;for(const round of [1,2,3])for(const [W,mob] of [[1366,false],[390,true]]){const [b,p]=await H(W,900,mob);await p.waitForTimeout(700);const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',round,W,m)}};
await p.addScriptTag({content:fs.readFileSync(T+'sbmock.js','utf8')});
await p.evaluate(async()=>{loginHide();SB=__mockSB();ME={email:'x@y.z',role:'owner',perms:{}};roleApply();go('bookings');
 for(const n of ['Raja','Paramesh']){await SB.rpc('mmc_create_booking',{p_b:{passenger:n,phone:'9'+Math.floor(1e8+Math.random()*8e8),days:2,nights:1,start_date:'2026-11-20',adults:2,children:0},p_days:[],p_items:[{day:1,kind:'activity',sort:10,title:'Cellular Jail'},{day:1,kind:'activity',sort:20,title:'Corbyn Cove Beach'},{day:2,kind:'activity',sort:10,title:'Radhanagar Beach'}]})}
 BK().list=null;render()});await p.waitForTimeout(500);
const cards=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-a="bkOpen"]')].length);ok(await cards()===2,'2 bookings listed');
const id=await p.evaluate(()=>BK().list.find(b=>b.passenger==='Raja').id);await p.evaluate(i=>bkOpen(i),id);await p.waitForTimeout(400);
// one-tap event delete + undo
await p.click('.bk-it2 [data-a="bkItemDel"] >> nth=0');await p.waitForTimeout(400);ok(await p.evaluate(()=>BK().cur.items.length)===2,'one tap deletes event');ok(!!(await p.$('#bk_undo')),'undo bar shows');
await p.click('#bk_undo [data-a="bkUndoGo"]');await p.waitForTimeout(400);ok(await p.evaluate(()=>BK().cur.items.length)===3,'undo restores');
// clear day 1
await p.click('[data-a="bkClearDay"][data-d="1"]');await p.waitForTimeout(200);await p.click('[data-a="bkClearDayGo"]');await p.waitForTimeout(400);ok(await p.evaluate(()=>BK().cur.items.filter(i=>i.day===1).length)===0,'day 1 cleared');
// delete booking (not running -> no countdown)
await p.click('[data-a="bkMore"]');await p.waitForTimeout(200);await p.click('.bk-moremenu [data-a="bkDel"]');await p.waitForTimeout(200);await p.click('#bk_delgo');await p.waitForTimeout(500);
ok(await cards()===1,'deleted booking gone from list');
// deleted filter -> open -> delete permanently
await p.evaluate(()=>{BK().f='del';render()});await p.waitForTimeout(200);ok(await cards()===1,'shows in Deleted');await p.click('[data-a="bkOpen"]');await p.waitForTimeout(400);
ok(!(await p.evaluate(()=>(document.getElementById('bk_more_t')||{innerHTML:''}).innerHTML.includes('data-a="bkDel"'))),'no plain Delete on deleted booking');await p.click('.bk-warn [data-a="bkPurge"]');await p.waitForTimeout(200);await p.click('[data-a="bkPurgeGo"]');await p.waitForTimeout(500);
await p.evaluate(()=>{BK().f='del';render()});await p.waitForTimeout(300);ok(await cards()===0,'gone from Deleted after permanent delete');
await p.evaluate(()=>{BK().f='all';render()});await p.waitForTimeout(300);ok(await cards()===1,'other booking still there');
console.log(round,W,'errs',JSON.stringify(p.errs));if(p.errs.length)fails++;await b.close()}console.log('TOTAL FAILS',fails)})();
