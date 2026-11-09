const T=__dirname+'/';const B_=JSON.parse(require('fs').readFileSync(T+'../../customer/web/version.json','utf8')).build;
// unit test of bkTimeOrder with many scenarios
const H=require(T+'h.js');(async()=>{const [b,p]=await H(1366,900,false);await p.waitForTimeout(500);let fails=0;
const run=async(items,moved,expect,label)=>{const r=await p.evaluate(([items,moved])=>{UI.BK=UI.BK||{};const B=BK();B.cur={items:items.map((x,i)=>({id:x[0],day:1,sort:(i+1)*10,time:x[1]||'',data:x[2]?{cab:x[2]}:{}}))};return bkTimeOrder(1,moved)},[items,moved]);const ok=r.join(',')===expect;if(!ok){fails++;console.log('FAIL',label,r.join(','),'expected',expect)}};
const pk=[['A','8:00 AM'],['CJ',''],['CO',''],['LS',''],['RT','']];
await run([['A','8:00 AM'],['CJ','9:30 AM'],['CO',''],['LS',''],['RT','']],'CJ','A,CJ,CO,LS,RT','time 2nd, others empty');
await run([['A','8:00 AM'],['CJ','9:30 AM'],['CO','11:30 AM'],['LS',''],['RT','']],'CO','A,CJ,CO,LS,RT','time 3rd');
await run([['A','8:00 AM'],['CJ','9:30 AM'],['CO','11:30 AM'],['LS','6:00 PM'],['RT','7:30 PM']],'RT','A,CJ,CO,LS,RT','all timed');
await run([['A','8:00 AM'],['CJ','9:30 AM'],['CO','11:30 AM'],['LS','6:00 PM'],['RT','']],'CO','A,CJ,CO,LS,RT','no change');
await run([['A','8:00 AM'],['CJ','9:30 AM'],['CO','5:00 PM'],['LS','4:00 PM'],['RT','7:30 PM']],'CO','A,CJ,LS,CO,RT','later time moves down');
await run([['A','8:00 AM'],['CJ','9:30 AM'],['CO','11:30 AM'],['LS','6:00 PM'],['RT','9:00 AM']],'RT','A,RT,CJ,CO,LS','earlier time moves up');
await run([['A','8:00 AM'],['CJ','',  '9:00 AM'],['CO','11:30 AM'],['LS',''],['RT','']],'CJ','A,CJ,CO,LS,RT','cab time only');
await run([['A',''],['CJ',''],['CO','10:00 AM'],['LS',''],['RT','']],'CO','A,CJ,CO,LS,RT','first timed is third');
await run([['A','8:00 AM'],['NEW','1:00 PM'],['CJ','9:30 AM'],['CO','11:30 AM'],['LS','6:00 PM']],'NEW','A,CJ,CO,NEW,LS','new event slots by time');
await run([['A','8:00 AM'],['CJ','9:30 AM'],['F','1:30 PM'],['RB',''],['LS','6:00 PM']],'F','A,CJ,F,RB,LS','ferry then untimed');
await run([['A','8:00 AM'],['CJ','9:30 AM'],['CO','1:00 PM'],['X','12:30 PM'],['LS','6:00 PM']],'X','A,CJ,X,CO,LS','12:30 before 1:00');
console.log('TOTAL FAILS',fails);await b.close()})();
