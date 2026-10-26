const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:900}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///home/claude/app/andaman_hotel_rates.html');await p.waitForTimeout(300);
await p.evaluate(()=>{go('packages');UI.pkgDur='1';render()});
const nm=p.locator('[data-s="docMeta.name"]');await nm.click();await nm.pressSequentially('ravi kumar from chennai');console.log('name:',await nm.inputValue());
const ph=p.locator('[data-s="docMeta.phone"]');await ph.click();await ph.pressSequentially('98765abc');console.log('phone untouched:',await ph.inputValue());
await p.evaluate(()=>{go('pkgset');UI.pkgTab='docs';render()});const tr=p.locator('[data-s="docTxt.terms"]');await tr.click();await tr.press('End');await tr.pressSequentially('\nno refund after booking');console.log('terms last:',(await tr.inputValue()).split('\n').pop());
const em=p.locator('[data-s="company.email"]');await em.fill('');await em.pressSequentially('abc@gmail.com');console.log('email:',await em.inputValue());
// mid-word caret edit
await nm.isVisible().catch(()=>{});
// fix buttons
await p.evaluate(()=>{S.set.pkgDays[1][0].stops[0]='airport pickup';S.set.pkgDays[1][0].notes='lunch at own cost';S.set.ferry[0].name='port blair to havelock';S.set.comp[0].name='welcome drink';S.set.docTxt.sign='authorised signatory';S.hotels[0].address='near bus stand';save()});
for(const [pg,set,sc] of [['pkgset',"UI.pkgTab='day';UI.pkgDay=1",'day'],['pkgset',"UI.pkgTab='ferry'",'ferry'],['pkgset',"UI.pkgTab='comp'",'comp'],['pkgset',"UI.pkgTab='docs'",'bill'],['hotels','','hotels']]){await p.evaluate(([pg,set])=>{go(pg);eval(set);render()},[pg,set]);await p.click(`[data-a=fixAll][data-k=${sc}]`)}
console.log(await p.evaluate(()=>[S.set.pkgDays[1][0].stops[0],S.set.pkgDays[1][0].notes,S.set.ferry[0].name,S.set.comp[0].name,S.set.docTxt.sign,S.hotels[0].address]));
// toggle off
await p.evaluate(()=>{go('settings');UI.sset='text';render()});await p.click('[data-a=capTog]');await p.evaluate(()=>{go('packages');render()});const nm2=p.locator('[data-s="docMeta.addr"]');await nm2.click();await nm2.pressSequentially('port blair');console.log('off:',await nm2.inputValue());
await p.evaluate(()=>{go('settings');UI.sset='text';render()});await p.screenshot({path:'/tmp/claude-0/cap.png',clip:{x:270,y:0,width:1096,height:420}});
await b.close()})();
