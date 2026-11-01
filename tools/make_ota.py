"""Makes ota/android.html + ota/pc.html + ota/version.json — the online update the apps download
(Settings → Software update). Run after build.py and fresh/pc/prepare_app.py. Bump data/OTA_BUILD for every update."""
import os,re,json,sys,shutil,datetime
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));O=os.path.join(R,'ota');os.makedirs(O,exist_ok=True)
build=int(open(os.path.join(R,'data','OTA_BUILD')).read().strip())
# android: same page as mobile/prepare_www.py makes (libs + fonts are already inside the installed app)
s=open(os.path.join(R,'dist','andaman_hotel_rates.html'),encoding='utf-8').read()
s=re.sub(r'<link[^>]*fonts\.googleapis\.com/css2[^>]*>','<link rel="stylesheet" href="fonts.css">',s,count=1)
s=re.sub(r'<link[^>]*(?:gstatic|googleapis)[^>]*>','',s)
for a,b in [('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js','libs/xlsx.full.min.js'),('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js','libs/html2canvas.min.js'),('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','libs/jspdf.umd.min.js')]:s=s.replace(a,b)
for a,b in [("PDF needs an internet connection — please connect and try again","PDF tool could not load — please restart the app"),("Excel export needs an internet connection — please connect and try again","Excel tool could not load — please restart the app")]:s=s.replace(a,b)
bridge=open(os.path.join(R,'mobile','bridge.js'),encoding='utf-8').read()
i=s.rfind('</script>');s=s[:i]+'\n'+bridge+'\n'+s[i:]
s=re.sub(r'^\s*<meta charset=[^>]*>\s*','',s)
s='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+s
open(os.path.join(O,'android.html'),'w',encoding='utf-8').write(s)
pc=sys.argv[1] if len(sys.argv)>1 else '/home/claude/fresh/pc/app/index.html'
shutil.copy(pc,os.path.join(O,'pc.html'))
for f in ['android.html','pc.html']:
    t=open(os.path.join(O,f),encoding='utf-8').read();assert f"var B=+'{build}'" in t,(f,'build mark missing')
notes=open(os.path.join(R,'ota','NOTES.txt'),encoding='utf-8').read().strip() if os.path.exists(os.path.join(R,'ota','NOTES.txt')) else ''
ver=re.search(r"const ABOUT=Object\.freeze\(\{ver:'([\d.]+)'",s).group(1)
json.dump({'build':build,'ver':ver,'notes':notes,'date':datetime.date.today().isoformat()},open(os.path.join(O,'version.json'),'w'),ensure_ascii=False)
print('ota ready: build',build,'ver',ver)
