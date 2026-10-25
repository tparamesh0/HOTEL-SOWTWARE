"""Builds the phone web app into docs/ (served by GitHub Pages: Settings → Pages → main /docs)."""
import os,json,shutil
from PIL import Image
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));D=os.path.join(R,'docs')
s=open(os.path.join(R,'dist','andaman_hotel_rates.html')).read()
head='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#1a73e8"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">'''
s=head+s.replace('<meta name="claude:viewport-fit-sides" content="cover">','')
s+='''<script>if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));</script>'''
s=s.replace("Export and Excel download only work in the downloaded app file opened in a browser. Inside the preview, use “Show my backup” and copy the text instead.","On a phone, downloaded files go to your Downloads folder.")
open(os.path.join(D,'index.html'),'w').write(s)
src=Image.open(os.path.join(R,'pc','build','icon.png')).convert('RGB')
for n in (192,512):src.resize((n,n),Image.LANCZOS).save(os.path.join(D,f'icon-{n}.png'))
json.dump({"name":"Magic Memories — Hotel & Tour Software","short_name":"Magic Memories","start_url":"./","scope":"./","display":"standalone","background_color":"#ffffff","theme_color":"#1a73e8","icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png","purpose":"any maskable"}]},open(os.path.join(D,'manifest.webmanifest'),'w'),indent=1)
open(os.path.join(D,'sw.js'),'w').write("""const C='mm-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'])))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.hostname.endsWith('supabase.co'))return;
 if(u.origin===location.origin){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));return}
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}return res})))});""")
print('docs/ web app ready')
