"""Builds mobile/www from ../dist/andaman_hotel_rates.html: local fonts + libraries (offline),
plus a small bridge so Save PDF / Excel / backup files are saved on the phone and can be shared (WhatsApp etc.)."""
import os,re,shutil,json,urllib.request
R=os.path.dirname(os.path.abspath(__file__));W=os.path.join(R,'www');N=os.path.join(R,'node_modules')
os.makedirs(os.path.join(W,'libs'),exist_ok=True);os.makedirs(os.path.join(W,'fonts'),exist_ok=True)
for f in ['xlsx/dist/xlsx.full.min.js','html2canvas/dist/html2canvas.min.js','jspdf/dist/jspdf.umd.min.js','@supabase/supabase-js/dist/umd/supabase.js']:shutil.copy(os.path.join(N,f),os.path.join(W,'libs'))
F={'dm-sans':('DM Sans',[400,500,600,700]),'poppins':('Poppins',[500,600,700]),'oswald':('Oswald',[600,700]),'bebas-neue':('Bebas Neue',[400]),'anton':('Anton',[400]),'righteous':('Righteous',[400]),'teko':('Teko',[600]),'dancing-script':('Dancing Script',[700])}
css=[]
for k,(fam,ws) in F.items():
  for w in ws:
    src=os.path.join(N,'@fontsource',k,'files',f'{k}-latin-{w}-normal.woff2');shutil.copy(src,os.path.join(W,'fonts'))
    css.append(f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{w};font-display:swap;src:url(fonts/{os.path.basename(src)}) format('woff2')}}")
open(os.path.join(W,'fonts.css'),'w').write('\n'.join(css))
s=open(os.path.join(R,'..','dist','andaman_hotel_rates.html'),encoding='utf-8').read()
s=re.sub(r'<link[^>]*fonts\.googleapis\.com/css2[^>]*>','<link rel="stylesheet" href="fonts.css">',s,count=1)
s=re.sub(r'<link[^>]*(?:gstatic|googleapis)[^>]*>','',s)
for a,b in [('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js','libs/xlsx.full.min.js'),('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js','libs/html2canvas.min.js'),('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','libs/jspdf.umd.min.js')]:s=s.replace(a,b)
for a,b in [("PDF needs an internet connection — please connect and try again","PDF tool could not load — please restart the app"),("Excel export needs an internet connection — please connect and try again","Excel tool could not load — please restart the app")]:s=s.replace(a,b)
bridge=open(os.path.join(R,'bridge.js'),encoding='utf-8').read()
i=s.rfind('</script>');assert i>0
s=s[:i]+'\n'+bridge+'\n'+s[i:]
s=re.sub(r'^\s*<meta charset=[^>]*>\s*','',s)
s='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+s
open(os.path.join(W,'index.html'),'w',encoding='utf-8').write(s);print('mobile/www ready',len(s)//1024,'KB')
