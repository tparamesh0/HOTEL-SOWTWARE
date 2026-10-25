import glob, re, json
from xl import load
SRC = {
 'PORT BLAIR|HIGH': glob.glob('/mnt/user-data/uploads/*HIGH_CLASS.xlsm')[0],
 'PORT BLAIR|MID' : glob.glob('/mnt/user-data/attachments/*/*-MID_CLASS.xlsm')[0],
 'PORT BLAIR|LOW' : glob.glob('/mnt/user-data/attachments/*/*-LOW_CLASS.xlsm')[0],
 'HAVELOCK|?'     : glob.glob('/mnt/user-data/attachments/*/*-HAVELOCK.xlsm')[0],
 'NEIL|?'         : glob.glob('/mnt/user-data/attachments/*/*-NIEL.xlsm')[0],
}
def norm(s): return re.sub(r'[^A-Z0-9]','',s.upper())
def num(v):
    if v is None: return None
    try:
        f=float(str(v).replace(',','')); return int(f) if f==int(f) else f
    except: return None
def parse_sheet(rows):
    name=None
    for r in sorted(rows):
        if rows[r].get(1,'').upper() in ('NAME','HOTEL NAME') and rows[r].get(2): name=rows[r][2]; break
    hdr=next((r for r in sorted(rows) if rows[r].get(1,'').upper()=='CATEGORY'),None)
    if not name or hdr is None: return None
    rooms=[]; contact={}; addons=[]; label=None; in_add=False; notes=[]
    for r in sorted(rows):
        if r<=hdr: continue
        c=rows[r]
        if c.get(1):
            vals=[num(c.get(i)) for i in (2,3,4,5,6)]
            rooms.append(dict(category=c[1],total_rooms=vals[0],ep=vals[1],cp=vals[2],map=vals[3],ap=vals[4]))
        k=(c.get(8) or '').upper()
        if k in ('MOBILE NO','EMAIL ID','ADDRESS'): contact[k]=c.get(9,'')
        elif k in ('ADD ON','EXTRA','EXTRA RATE'): in_add=True; label=k; 
        elif k and in_add:
            v=c.get(9); n=num(v)
            addons.append(dict(item=c[8],rate=n,note=None if n is not None else (v or '')))
    return dict(name=name.strip(),rooms=rooms,mobile=contact.get('MOBILE NO',''),email=contact.get('EMAIL ID',''),address=contact.get('ADDRESS',''),addon_label=label or 'ADD ON',addons=addons)
def names_list(d):
    rows=d['HOTEL NAME']['rows']; return [ (rows[r].get(2) or rows[r].get(1)) for r in sorted(rows) if r>=3 and (2 in rows[r] or 1 in rows[r])]
def ci(d,n):
    for k in d:
        if norm(k)==norm(n): return k
def parse_lists(d):
    star={}
    for k in d:
        m=re.match(r'(\d) STAR',k.strip().upper())
        if m:
            rows=d[k]['rows']
            for r in sorted(rows):
                if r>=3 and 1 in rows[r] and rows[r][1].upper()!='HOTEL': star.setdefault(rows[r][1],m.group(1))
    sea=[];pool=[]
    ao=d.get(ci(d,'ADD ON SEARCH'))
    if ao:
        for r in sorted(ao['rows']):
            if r>=7:
                if 2 in ao['rows'][r]: sea.append(ao['rows'][r][2])
                if 3 in ao['rows'][r]: pool.append(ao['rows'][r][3])
    rk=d.get(ci(d,'RANK'))['rows']; best=[];near=[];low=[];neartitle=''
    for r in sorted(rk):
        c=rk[r]
        if c.get(5,'').upper().startswith('NEAR'): neartitle=c[5]
    for r in sorted(rk):
        c=rk[r]
        if 10<=r<=14 and 2 in c: best.append(c[2])
        if 10<=r<=14 and 5 in c: near.append((c[5],c.get(6,'')))
        if 20<=r<=24 and 2 in c: low.append((c[2],num(c.get(3))))
    return dict(star=star,sea=sea,pool=pool,best=best,near=near,neartitle=neartitle,low=low)
if __name__=='__main__':
    out={}
    for key,p in SRC.items():
        d=load(p); isl,cls=key.split('|')
        L=parse_lists(d); hotels=[]
        listed=names_list(d)
        for sh in d:
            if sh in ('HOME','HOTEL NAME','MM') or re.match(r'\d+ TO \d+|\d STAR',sh.strip().upper()) or sh.upper().strip() in ('RANK','ADD ON SEARCH','FIND') : continue
            h=parse_sheet(d[sh]['rows'])
            if h: h['sheet']=sh; h['listed']=any(norm(x)==norm(h['name']) or norm(x)==norm(sh) for x in listed); hotels.append(h)
        out[key]=dict(hotels=hotels,lists=L,listed=listed)
        print(key,len(listed),'listed;',len(hotels),'parsed sheets;',len([h for h in hotels if h['listed']]),'listed&parsed')
    json.dump(out,open('raw.json','w'),ensure_ascii=False,indent=1)
