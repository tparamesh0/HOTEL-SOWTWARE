# Builds the Magic Memories customer app -> customer/web/index.html
import re,os
R=os.path.dirname(os.path.abspath(__file__))
s=open(os.path.join(R,'src','app.src.html'),encoding='utf-8').read()
logo=open(os.path.join(R,'src','logo.txt')).read().strip()
key=re.search(r"SB_KEY='([^']+)'",open(os.path.join(R,'..','src','app.src.html'),encoding='utf-8').read()).group(1)
s=s.replace("''/*__LOGO__*/","'"+logo+"'",1).replace("__SB_KEY__",key,1)
os.makedirs(os.path.join(R,'web'),exist_ok=True)
open(os.path.join(R,'web','index.html'),'w',encoding='utf-8').write(s)
print('built',len(s)//1024,'KB')
