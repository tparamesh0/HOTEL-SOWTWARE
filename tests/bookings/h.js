const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),os=require('os');
// Opens the built admin software (dist/andaman_hotel_rates.html) in a headless browser.
module.exports=async function(w=1366,h=800,mob=false){
 const src=fs.readFileSync(path.join(__dirname,'..','..','dist','andaman_hotel_rates.html'),'utf8');
 const f=path.join(os.tmpdir(),'mm-admin-test.html');
 fs.writeFileSync(f,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'+src);
 const b=await chromium.launch();
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:mob?2:1,isMobile:mob,hasTouch:mob});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.errs=errs;
 await p.goto('file:///'+f.replace(/\\/g,'/').replace(/^\//,''));await p.waitForTimeout(900);
 await p.evaluate(()=>{try{loginHide()}catch(e){}});
 return [b,p]};
