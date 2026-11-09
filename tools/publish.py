"""One command to package a new release of the admin software (and optionally the customer app).

    python tools/publish.py --ver 2.9.1 --notes "What changed, in plain words for the owner"
    python tools/publish.py --ver 2.9.1 --notes "..." --customer "What changed in MM TravelMate"
    add --no-push to stop before git push

It does, in order:
  1. sets the version in src/app.src.html (ABOUT ver) and adds 1 to data/OTA_BUILD
  2. python build.py                       -> dist/ and fresh/dist/
  3. fresh/pc/prepare_app.py               -> fresh/pc/app/index.html (needs `npm install` in fresh/pc once)
  4. (--customer) adds 1 to customer/src/BUILD, writes customer/src/NOTES, runs customer/build.py -> customer/web/
  5. writes ota/NOTES.txt and runs tools/make_ota.py -> ota/ (what installed apps download)
  6. git add + commit + push

After it finishes, two things still have to happen (see CLAUDE.md, "Publish"):
  - deploy the Vercel projects  magic-memories-updates (root: ota)  and, if the customer app changed,
    magic-memories-customer (root: customer/web). A git push does NOT deploy them by itself.
  - send the "update now" signal:  select realtime.send('{"build":N}'::jsonb,'upd','mmt',false)
"""
import argparse,os,re,subprocess,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P=argparse.ArgumentParser();P.add_argument('--ver',required=True);P.add_argument('--notes',required=True);P.add_argument('--customer');P.add_argument('--no-push',action='store_true')
a=P.parse_args()
if not re.fullmatch(r'\d+\.\d+\.\d+',a.ver):sys.exit('--ver must look like 2.9.1')
def run(cmd,cwd=R):
    print('>',' '.join(cmd));r=subprocess.run(cmd,cwd=cwd)
    if r.returncode:sys.exit('stopped: '+' '.join(cmd)+' failed')
py=sys.executable
# 1. version + build number
src=os.path.join(R,'src','app.src.html');s=open(src,encoding='utf-8').read()
s2,n=re.subn(r"(const ABOUT=Object\.freeze\(\{ver:')[\d.]+(')",r"\g<1>"+a.ver+r"\2",s)
if n!=1:sys.exit('ABOUT ver not found in src/app.src.html')
open(src,'w',encoding='utf-8').write(s2)
bf=os.path.join(R,'data','OTA_BUILD');build=int(open(bf).read().strip())+1;open(bf,'w').write(str(build))
print('version',a.ver,'build',build)
# 2-3. admin software
run([py,'build.py'])
if not os.path.isdir(os.path.join(R,'fresh','pc','node_modules')):sys.exit('run `npm install` inside fresh/pc once, then try again')
run([py,'prepare_app.py'],cwd=os.path.join(R,'fresh','pc'))
# 4. customer app
cmsg=''
if a.customer:
    cb=os.path.join(R,'customer','src','BUILD');cbuild=int(open(cb).read().strip())+1;open(cb,'w').write(str(cbuild))
    open(os.path.join(R,'customer','src','NOTES'),'w',encoding='utf-8').write(a.customer.strip()+'\n')
    run([py,os.path.join('customer','build.py')]);cmsg='; customer build %d: %s'%(cbuild,a.customer.strip())
# 5. online update package
open(os.path.join(R,'ota','NOTES.txt'),'w',encoding='utf-8').write(a.notes.strip()+'\n')
run([py,os.path.join('tools','make_ota.py')])
# 6. git
run(['git','add','src','data','dist','fresh','ota','customer'])
run(['git','commit','-m','%s (%d): %s%s'%(a.ver,build,a.notes.strip(),cmsg)])
if not a.no_push:
    # one repo: origin = tparamesh0/Management-software (APK/PC builds run there and old installs download from it)
    run(['git','pull','--rebase','origin','main'])   # bring in "APK build" commits made by GitHub Actions
    r=subprocess.run(['git','push','origin','HEAD:main'],cwd=R)
    if r.returncode:
        print('push was rejected - pulling and retrying');run(['git','pull','--rebase','origin','main']);run(['git','push','origin','HEAD:main'])
print('\nDONE. Now deploy Vercel (magic-memories-updates%s) and send {"build":%d}. See CLAUDE.md -> Publish.'%(', magic-memories-customer' if a.customer else '',build))
