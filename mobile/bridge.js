/* ---------- Android app bridge: save files on the phone + share them (WhatsApp, Drive, etc.) ---------- */
(function(){const C=window.Capacitor;if(!(C&&C.isNativePlatform&&C.isNativePlatform()))return;const P=C.Plugins||{},FS=P.Filesystem,SH=P.Share;if(!FS)return;
 document.body.classList.add('android');
 const b64=blob=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.onerror=rej;r.readAsDataURL(blob)});
 async function saveBlob(name,blob,share){const safe=String(name||'file').replace(/[\\/:*?"<>|]+/g,'-');const data=await b64(blob);const path='Magic Memories/'+safe;
  let r;try{r=await FS.writeFile({path,data,directory:'DOCUMENTS',recursive:true})}catch(e){r=await FS.writeFile({path:safe,data,directory:'CACHE'})}
  if(share&&SH){try{await SH.share({title:safe,url:r.uri,dialogTitle:'Share '+safe})}catch(e){}}return r.uri}
 window.dlFile=function(name,blob){saveBlob(name,blob,true).then(()=>toast('📄 Saved in Documents › Magic Memories')).catch(e=>{console.error(e);toast('Could not save the file')});return true};
 window.sendFileWA=async function(blob,name,phone,msg){try{if(window.docAdd)docAdd(blob,name,'sent');await saveBlob(name,blob,true)}catch(e){toast('Could not share the file')}};
 const AP=P.App;if(AP&&AP.addListener)AP.addListener('backButton',()=>{try{const m=document.querySelector('#modal .ov');if(m){if(window.A&&A.pickClose&&document.querySelector('.pick'))A.pickClose();closeModal();return}if(UI.navOpen){UI.navOpen=false;render();return}if(UI.page!=='home'&&UI.hist&&UI.hist.length){A.back();return}if(UI.page!=='home'){go('home');return}AP.minimizeApp?AP.minimizeApp():AP.exitApp()}catch(e){AP.exitApp()}});
 window.openWADesktop=function(num,msg){location.href='https://wa.me/'+(num||'')+(msg?'?text='+encodeURIComponent(msg):'')};
})();
