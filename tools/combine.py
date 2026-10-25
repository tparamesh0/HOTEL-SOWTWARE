import json, re, statistics
from extract import norm
raw=json.load(open('raw.json'))
ALIAS={'6IX':'6IX HOTEL','BAYLEAF':'BEYLEAF INN','MANSHA':'HOTEL MANSHA PALACE','DRAWIN CITY':'DARWIN CITY','HOTEL DARWIN CITY':'DARWIN CITY',
 'DRIFTWOOD HOTEL & RESORT':'DRIFT WOOD','GKM GRAND':'ANDAMAN GKM GRAND','HOTEL BELL ELITE':'BELL ELITE','HOTEL N K INTERNATIONAL':'NK INTERNATIONAL',
 'HOTEL RAIN BIRD':'RAIN BIRD','HOTEL URBAN HEAVEN':'URBAN HEAVEN','KPN HOTEL':'SRI KPN HOTEL','THE HARRIET VIEW':'THE HARRIET SEA VIEW','HOTEL SHREESH':'HOTEL SHREES'}
SLUG=lambda s: re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
allh={}   # norm name -> hotel (global)
for key,v in raw.items():
    for h in v['hotels']: allh.setdefault(norm(h['name']),h)
def find(n):
    n2=ALIAS.get(n.strip(),n)
    return allh.get(norm(n2))
def minrate(h):
    p=[x for r in h['rooms'] for x in (r['ep'],r['cp'],r['map'],r['ap']) if x]
    return min(p) if p else None
hotels=[]; issues=[]
for key,v in raw.items():
    isl,cls=key.split('|'); L=v['lists']
    star={}
    for n,s in L['star'].items():
        h=find(n)
        if h: star[norm(h['name'])]=int(s)
        else: issues.append(('Unmatched star-list name',key,n))
    sea={norm(find(n)['name']) for n in L['sea'] if find(n)}; pool={norm(find(n)['name']) for n in L['pool'] if find(n)}
    best={norm(find(n)['name']):i+1 for i,n in enumerate(L['best']) if find(n)}
    near={}
    for i,(n,km) in enumerate(L['near']):
        h=find(n)
        if h: near[norm(h['name'])]=km
    low={norm(find(n)['name']):(i+1,p) for i,(n,p) in enumerate(L['low']) if find(n)}
    for h in v['hotels']:
        k=norm(h['name']); mr=minrate(h)
        rec=dict(id=f"{SLUG(isl)}-{SLUG(h['name'])}",island={'PORT BLAIR':'Port Blair','HAVELOCK':'Havelock','NEIL':'Neil'}[isl],
            source_file=key, tier=None if cls=='?' else cls.title(), tier_by='file' if cls!='?' else None,
            name=h['name'],mobile=h['mobile'],email=h['email'],address=h['address'],star=star.get(k),
            sea_view=k in sea,pool=k in pool,best_rank=best.get(k),near_label=('Jetty' if 'JETTY' in L['neartitle'] else 'Airport'),near_km=near.get(k),
            low_rank=low.get(k,(None,None))[0],start_rate=mr,addon_label=h['addon_label'],rooms=h['rooms'],addons=h['addons'])
        hotels.append(rec)
        if low.get(k) and mr and low[k][1]!=mr: issues.append(('Low-price list shows a different rate than the hotel sheet',key,f"{h['name']}: list says {low[k][1]}, hotel sheet starts at {mr}"))
        if not h['rooms']: issues.append(('Hotel has no room rates entered',key,h['name']))
        if not h['email']: issues.append(('Email missing',key,h['name']))
        if h['rooms'] and not any(x for r in h['rooms'] for x in (r['ep'],r['cp'],r['map'],r['ap'])): issues.append(('Rooms have no price',key,h['name']))
    for n in L['low']:
        pass
# cross-file reference e.g. Islands Tourister in Low airport list
for key,v in raw.items():
    for n,km in v['lists']['near']:
        h=find(n)
        if h and h['name'] not in [x['name'] for x in v['hotels']]: issues.append(('Airport list names a hotel that lives in another file',key,f"{n} (belongs to another class file)"))
# auto tier suggestion for islands, thresholds from Port Blair
pb={t:[x['start_rate'] for x in hotels if x['island']=='Port Blair' and x['tier']==t and x['start_rate']] for t in ('High','Mid','Low')}
med={t:statistics.median(v) for t,v in pb.items()}
print('PB start-rate medians',med, {t:(min(v),max(v),len(v)) for t,v in pb.items()})
json.dump(dict(hotels=hotels,issues=issues,medians=med),open('combined.json','w'),ensure_ascii=False,indent=1)
print(len(hotels),'hotels'); 
from collections import Counter
print(Counter((h['island'],h['tier']) for h in hotels))
for i in issues: print(i)
