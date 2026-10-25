const {chromium}=require('playwright');const fs=require('fs');
const URL='file:///home/claude/app/andaman_hotel_rates.html';
const PAGES=['home','packages','hotels','detail','find','range','star','rank','fac','classify','new','update','company','hist','settings','pkgset'];
const SSET=['colors','fonts','name','plans','rooms','addons','text','facs','classes','islands','stars','ranges','ranks','company','backup','csv','pin','sound'];
const TABS=['dur','day','ferry','comp','docs'];
const DENY=new Set(['resetAll','delDo','docGo','bkFile','bkDelta','xlGo','waPdf','waTxt','teamGo','exportCsv','histDel','pkgDel','delPlan','delContactDo','delAsk','importDo','bkImportDo','deltaDo','navToggle','pinOk','sset','go','back','island','histEdit','pkgOpenDay','open','pkgDay','pkgDayBack','pkgTabSet','closeModal','noop','logoPick','goLogo']);
(async()=>{const b=await chromium.launch();const issues=[];
for(const [W,H,dark] of [[1366,860,false],[400,860,false],[1366,860,true]]){
 const ctx=await b.newContext({viewport:{width:W,height:H},colorScheme:dark?'dark':'light',acceptDownloads:true});const p=await ctx.newPage();
 let cur='';p.on('pageerror',e=>issues.push(`[${W}${dark?' dark':''}] ERR ${cur}: ${e.message}`));p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|Failed to load resource/.test(m.text()))issues.push(`[${W}] CONSOLE ${cur}: ${m.text()}`)});p.on('dialog',d=>{issues.push('DIALOG '+cur+' '+d.message());d.dismiss()});
 await p.goto(URL);await p.waitForTimeout(400);
 await p.evaluate(()=>{window.print=()=>{};const d=S.set.pkgDays;d[1][0].place='Aberdeen';UI.pkgDur='2';S.set.pkgPicks['2']={1:J(d[1][0]),2:J(d[2][0]),3:J(d[3][0])};S.set.pkgHotels['2']=[{id:'h',hotel:'SEA SHELL',island:'Port Blair',room:'Deluxe',plan:'CP',rate:4500,nights:2}];S.set.pkgFerry['2']=[{id:'f',fid:S.set.ferry[0].id,name:'PB to Havelock',rate:1300,qty:2,time:'6:00 AM'}];S.set.pkgComp['2']=[{id:'c',name:'Welcome drink'}];S.set.pkgPersons['2']=2;S.set.docMeta.name='Ravi Kumar';S.set.docMeta.phone='9876543210';S.set.company.team=[{name:'Pandi',phone:'9876500000',role:'Sales',photo:''}];A.histSave();UI.histId=null;S.set.docMeta.name='Priya';A.histSave();S.set.cart=[{id:'k',hid:S.hotels[0].id,hotel:S.hotels[0].name,island:'Port Blair',room:'Deluxe',plan:'CP',rate:3000}];save()});
 const views=[];PAGES.forEach(pg=>views.push({pg}));SSET.forEach(k=>views.push({pg:'settings',sset:k}));TABS.forEach(t=>views.push({pg:'pkgset',tab:t}));views.push({pg:'pkgset',tab:'day',day:1});['Havelock','Neil'].forEach(i=>['hotels','find','range','star','rank','fac'].forEach(pg=>views.push({pg,isl:i})));
 for(const v of views){cur=JSON.stringify(v);
  const set=async()=>{await p.evaluate(v=>{closeModal();UI.pkgDur='2';go(v.pg);if(v.isl){A.island({dataset:{k:v.isl}})}if(v.sset){UI.sset=v.sset}if(v.tab){UI.pkgTab=v.tab;UI.pkgDay=v.day||null}if(v.pg==='detail'||v.pg==='update')UI.sel=UI.sel||scope()[0]&&scope()[0].id;render()},v)};
  await set();await p.waitForTimeout(60);
  const r=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:innerWidth,wrong:document.body.innerText.includes('Something went wrong'),und:/\bundefined\b|\bNaN\b|\[object Object\]/.test(document.querySelector('#root').innerText),txt:(document.querySelector('#root').innerText.match(/.{0,40}(undefined|NaN|\[object Object\]).{0,20}/)||[''])[0]}));
  if(r.sw>r.iw+1)issues.push(`[${W}${dark?' dark':''}] OVERFLOW ${cur} scrollWidth ${r.sw} > ${r.iw}`);if(r.wrong)issues.push(`[${W}] BROKEN ${cur}`);if(r.und)issues.push(`[${W}] TEXT ${cur}: ${r.txt}`);
  if(W===1366&&!dark){fs.mkdirSync('/tmp/claude-0/audit',{recursive:true});await p.screenshot({path:`/tmp/claude-0/audit/${(v.pg+'_'+(v.sset||v.tab||v.isl||'')+(v.day||''))}.png`,fullPage:true})}
  // click fuzz (desktop light only)
  if(W===1366&&!dark){const acts=await p.evaluate(D=>[...document.querySelectorAll('#root [data-a]')].map((e,i)=>({a:e.dataset.a,i})).filter(x=>!D.includes(x.a)),[...DENY]);
   const seen=new Set();for(const x of acts){if(seen.has(x.a))continue;seen.add(x.a);cur=JSON.stringify(v)+' click '+x.a;
    try{await set();const el=p.locator('#root [data-a="'+x.a+'"]').first();if(!(await el.isVisible()))continue;await el.click({timeout:2000});await p.waitForTimeout(80);
     const mm=await p.evaluate(()=>{const m=document.querySelector('#modal');return {wrong:document.body.innerText.includes('Something went wrong'),und:/\bundefined\b|\bNaN\b|\[object Object\]/.test((m?m.innerText:'')+document.querySelector('#root').innerText),txt:(((m?m.innerText:'')+document.querySelector('#root').innerText).match(/.{0,40}(undefined|NaN|\[object Object\]).{0,20}/)||[''])[0],sw:document.documentElement.scrollWidth,iw:innerWidth}});
     if(mm.wrong)issues.push('BROKEN '+cur);if(mm.und)issues.push('TEXT '+cur+': '+mm.txt);if(mm.sw>mm.iw+1)issues.push('OVERFLOW '+cur);
     // modal buttons
     const ma=await p.evaluate(D=>[...document.querySelectorAll('#modal [data-a]')].map(e=>e.dataset.a).filter(a=>!D.includes(a)),[...DENY]);for(const a of [...new Set(ma)].slice(0,8)){cur=JSON.stringify(v)+' click '+x.a+' > modal '+a;try{const me=p.locator('#modal [data-a="'+a+'"]').first();if(await me.isVisible()){await me.click({timeout:1500});await p.waitForTimeout(60)}}catch(e){}}
    }catch(e){}}}
 }
 await ctx.close()}
await b.close();fs.writeFileSync('/tmp/claude-0/audit/issues.txt',[...new Set(issues)].join('\n'));console.log([...new Set(issues)].length,'issues');console.log([...new Set(issues)].slice(0,80).join('\n'))})();
