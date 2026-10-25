import zipfile, re, json, sys
import xml.etree.ElementTree as ET
NS={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
def col2n(c):
    n=0
    for ch in c: n=n*26+ord(ch)-64
    return n
def load(path):
    z=zipfile.ZipFile(path)
    ss=[]
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',NS):
            ss.append(''.join(t.text or '' for t in si.iter('{%s}t'%NS['m'])))
    wb=ET.fromstring(z.read('xl/workbook.xml'))
    rels=ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rmap={r.get('Id'):r.get('Target') for r in rels}
    out={}
    for s in wb.find('m:sheets',NS):
        name=s.get('name'); st=s.get('state','visible')
        t=rmap[s.get('{%s}id'%NS['r'])]
        p=('xl/'+t) if not t.startswith('/') else t[1:]
        root=ET.fromstring(z.read(p))
        rows={}
        for c in root.iter('{%s}c'%NS['m']):
            ref=c.get('r'); m=re.match(r'([A-Z]+)(\d+)',ref)
            v=c.find('m:v',NS); f=c.find('m:f',NS)
            if c.get('t')=='s' and v is not None: val=ss[int(v.text)]
            elif c.get('t')=='inlineStr': val=''.join(x.text or '' for x in c.iter('{%s}t'%NS['m']))
            elif v is not None: val=v.text
            else: val=None
            if val in (None,''): continue
            rows.setdefault(int(m.group(2)),{})[col2n(m.group(1))]=val.strip() if isinstance(val,str) else val
        out[name]={'state':st,'rows':rows,'nf':len(root.findall('.//m:f',NS))}
    return out
if __name__=='__main__':
    d=load(sys.argv[1])
    for n,s in d.items():
        print(f"## {n} [{s['state']}] rows={len(s['rows'])} formulas={s['nf']}")
