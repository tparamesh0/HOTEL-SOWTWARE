"""Builds pc/app from dist/andaman_hotel_rates.html: local fonts + libraries so the PC software works offline.
Run after `npm install` in pc/:  python3 prepare_app.py  then  npm run dist"""
import os,re,shutil
R=os.path.dirname(os.path.abspath(__file__));N=os.path.join(R,'node_modules');A=os.path.join(R,'app')
os.makedirs(os.path.join(A,'libs'),exist_ok=True);os.makedirs(os.path.join(A,'fonts'),exist_ok=True)
for f in ['xlsx/dist/xlsx.full.min.js','html2canvas/dist/html2canvas.min.js','jspdf/dist/jspdf.umd.min.js']:shutil.copy(os.path.join(N,f),os.path.join(A,'libs'))
F={'dm-sans':('DM Sans',[400,500,600,700]),'poppins':('Poppins',[500,600,700]),'oswald':('Oswald',[600,700]),'bebas-neue':('Bebas Neue',[400]),'anton':('Anton',[400]),'righteous':('Righteous',[400]),'teko':('Teko',[600])}
css=[]
for k,(fam,ws) in F.items():
  for w in ws:
    src=os.path.join(N,'@fontsource',k,'files',f'{k}-latin-{w}-normal.woff2');shutil.copy(src,os.path.join(A,'fonts'))
    css.append(f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{w};font-display:swap;src:url(fonts/{os.path.basename(src)}) format('woff2')}}")
open(os.path.join(A,'fonts.css'),'w').write('\n'.join(css))
shutil.copy(os.path.join(R,'build','icon.png'),os.path.join(A,'icon.png'))
s=open(os.path.join(R,'..','dist','andaman_hotel_rates.html')).read()
s=re.sub(r'<link[^>]*fonts\.googleapis\.com[^>]*>','<link rel="stylesheet" href="fonts.css">',s,count=1)
s=re.sub(r'<link[^>]*(?:gstatic|googleapis)[^>]*>','',s)
for a,b in [('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js','libs/xlsx.full.min.js'),('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js','libs/html2canvas.min.js'),('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','libs/jspdf.umd.min.js')]:s=s.replace(a,b)
for a,b in [("Export and Excel download only work in the downloaded app file opened in a browser. Inside the preview, use “Show my backup” and copy the text instead.","Files are saved where you choose in the Save window. Keep a backup on a pen drive or Google Drive now and then."),("Could not create the Excel file here — open the downloaded app file in a browser","Could not create the Excel file — please try again"),("Could not make the PDF here — open the downloaded app file in a browser","Could not make the PDF — please try again"),("Excel export needs an internet connection — please connect and try again","Excel tool could not load — please restart the software"),("PDF needs an internet connection — please connect and try again","PDF tool could not load — please restart the software")]:s=s.replace(a,b)
open(os.path.join(A,'index.html'),'w').write(s);print('pc/app ready')
