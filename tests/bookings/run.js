// Runs every Customer Bookings test (admin software + MM TravelMate customer app).
// First build:  python build.py   and   python customer/build.py   (from the repo root)
// Then:         cd tests/bookings && npm install && npx playwright install chromium && node run.js
// One file only: node run.js ferry
const {spawn}=require('child_process'),http=require('http'),fs=require('fs'),path=require('path');
const WEB=path.join(__dirname,'..','..','customer','web');
const TYPES={'.html':'text/html','.json':'application/json','.png':'image/png','.js':'text/javascript','.webmanifest':'application/manifest+json'};
fs.mkdirSync(path.join(__dirname,'out'),{recursive:true});
const srv=http.createServer((q,r)=>{let f=path.join(WEB,decodeURIComponent(q.url.split('?')[0]));
 if(!f.startsWith(WEB)||!fs.existsSync(f)||fs.statSync(f).isDirectory())f=path.join(WEB,'index.html');
 r.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)});
const runOne=f=>new Promise(res=>{const c=spawn(process.execPath,[path.join(__dirname,f)]);let out='';c.stdout.on('data',d=>out+=d);c.stderr.on('data',d=>out+=d);const k=setTimeout(()=>c.kill(),900000);c.on('close',()=>{clearTimeout(k);res(out)})});
srv.listen(8765,async()=>{
 const only=process.argv[2];let bad=0;
 const list=fs.readdirSync(__dirname).filter(f=>/^(admin|cust)-.*\.js$/.test(f)&&(!only||f.includes(only)));
 for(const t of list){process.stdout.write(t.padEnd(30));
  const out=await runOne(t),m=/TOTAL FAILS (\d+)/.exec(out);
  if(!m||+m[1]){bad++;console.log('FAILED\n'+out.split('\n').filter(l=>/FAIL|Error|rror:/.test(l)).slice(0,12).join('\n'))}else console.log('ok')}
 srv.close();console.log(bad?bad+' test file(s) failed':'ALL PASSED');process.exit(bad?1:0)});
