"""customer/mobile/www: loader (index.html) + app (app.html) with local Poppins font so it works offline."""
import os,re,shutil,json
R=os.path.dirname(os.path.abspath(__file__));W=os.path.join(R,'www');N=os.path.join(R,'node_modules')
os.makedirs(os.path.join(W,'fonts'),exist_ok=True)
css=[]
for w in [400,500,600,700,800]:
  src=os.path.join(N,'@fontsource','poppins','files',f'poppins-latin-{w}-normal.woff2');shutil.copy(src,os.path.join(W,'fonts'))
  css.append(f"@font-face{{font-family:'Poppins';font-style:normal;font-weight:{w};font-display:swap;src:url(fonts/{os.path.basename(src)}) format('woff2')}}")
open(os.path.join(W,'fonts.css'),'w').write('\n'.join(css))
s=open(os.path.join(R,'..','web','index.html'),encoding='utf-8').read()
s=re.sub(r'<link[^>]*fonts\.googleapis\.com/css2[^>]*>','<link rel="stylesheet" href="fonts.css">',s,count=1)
s=re.sub(r'<link[^>]*(?:gstatic|googleapis)[^>]*>','',s)
open(os.path.join(W,'app.html'),'w',encoding='utf-8').write(s)
b=json.load(open(os.path.join(R,'..','web','version.json')))['build']
open(os.path.join(W,'index.html'),'w',encoding='utf-8').write(open(os.path.join(R,'loader.html'),encoding='utf-8').read().replace('__CB__',str(b)))
print('customer www ready, build',b)
