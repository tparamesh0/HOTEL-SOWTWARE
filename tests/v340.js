const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/app/preview_extras_perperson.html');await p.waitForTimeout(800);
await p.evaluate(()=>{go('hist')});await p.click('[data-a="histTab"][data-k="pdf"]');await p.waitForTimeout(500);await p.screenshot({path:'/tmp/claude-0/s300/web_hist_pdf.png'});
await p.click('[data-a="histTab"][data-k="pk"]');await p.waitForTimeout(200);
await p.evaluate(()=>{UI.sset='pdfdir';go('settings')});await p.waitForTimeout(200);await p.screenshot({path:'/tmp/claude-0/s300/web_set_pdf.png'});
console.log('errs',errs);await b.close()})();
