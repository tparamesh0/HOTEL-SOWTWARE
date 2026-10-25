import json, html, asyncio, sys, re
sys.path.insert(0,'/home/claude/mock')
e=html.escape
src=open('/home/claude/mock/build.py',encoding='utf8').read()
exec(src[:src.index('pages = {}')].split("from data import *")[0])  # imports only
exec(src[src.index('CSS = """'):src.index('def page(')])                # CSS, NAV
exec(src[src.index('# helpers'):src.index('# 04 FIND (with customize + edit)')])  # tog, seg, fld
ALL=json.load(open('/home/claude/work/hotel_dataset.json'))
CSS+="""
.isl{display:flex;align-items:center;gap:6px;background:#fff;border-radius:30px;padding:6px 8px 6px 18px;margin-bottom:20px;box-shadow:0 1px 2px rgba(60,64,67,.15),0 2px 8px rgba(60,64,67,.08)}
.isl .t{font-size:11.5px;letter-spacing:1.2px;font-weight:700;color:#5f6368;margin-right:8px}
.isl .tab{padding:9px 20px;border-radius:24px;font-size:14px;font-weight:600;color:#5f6368}
.isl .tab b{font-weight:600;font-size:12px;margin-left:6px;padding:2px 8px;border-radius:12px;background:#f1f3f4}
.isl .tab.on{background:#1a73e8;color:#fff}.isl .tab.on b{background:rgba(255,255,255,.25)}
.isl .sp{flex:1}.cls{display:flex;gap:6px;align-items:center}
.cls .c{padding:7px 14px;border-radius:20px;font-size:12.5px;font-weight:600;border:1.5px solid #dadce0;color:#5f6368}
.cls .c.on{background:#e8f0fe;border-color:#e8f0fe;color:#1967d2}
.k-High{background:#fef7e0;color:#b06000}.k-Mid{background:#e8f0fe;color:#1967d2}.k-Low{background:#e6f4ea;color:#137333}.k-None{background:#fff;color:#80868b;border:1.5px dashed #bdc1c6}
"""
NAV=[("Dashboard","🏠","home"),("All Hotels","🏨","hotels"),("Hotel Details","📄","detail"),("Find / Search","🔎","find"),("SEP","BROWSE",""),("Price Range","₹","range"),("Star Category","★","star"),("Top Rankings","🏆","rank"),("Sea View & Pool","🌊","addon"),("SEP","ADMIN",""),("Classify Hotels","🏷️","classify"),("New Hotel Entry","➕","new"),("Update All Hotels","🔄","update"),("Company Info","ℹ️","company")]
ISL=["Port Blair","Havelock","Neil"]; CLS=["High","Mid","Low"]
def kt(h): return h['tier'] or 'None'
def tag(t): return f'<span class="tag k-{t or "None"}">{t.upper() if t else "CHOOSE CLASS"}</span>'
def money(v): return f'<td class="num">₹{v:,}</td>' if v else '<td class="na">—</td>'
def yn(b): return f'<span class="tag {"t-y" if b else "t-n"}">{"Yes" if b else "No"}</span>'
def ein(v,w="100%",al="left"): return f'<div class=inp style="min-height:36px;padding:7px 12px;width:{w};text-align:{al};font-weight:600;border-color:#a8c7fa;background:#f8fbff">{v}</div>'
def page(active,title,sub,body,ctx,chip=None):
    isl,flt=ctx['island'],ctx['cls']; hs=[h for h in ALL if h['island']==isl]
    nav="".join(f'<div class=sep>{ic}</div>' if n=="SEP" else f'<div class="{"on" if k==active else ""}"><i>{ic}</i>{n}</div>' for n,ic,k in NAV)
    tabs="".join(f'<div class="tab {"on" if i==isl else ""}">{"🏝️ " if i==isl else ""}{i if i!="Neil" else "Neil Island"}{" Island" if i=="Havelock" else ""}<b>{sum(1 for h in ALL if h["island"]==i)}</b></div>' for i in ISL)
    cnt=lambda c: sum(1 for h in hs if (h['tier']==c if c!='Unassigned' else h['tier'] is None))
    chips="".join(f'<div class="c {"on" if c==flt else ""}">{c}{"" if c=="All" else " "+str(cnt(c))}</div>' for c in ["All","High","Mid","Low","Unassigned"])
    n=sum(1 for h in hs if flt=='All' or (h['tier']==flt if flt!='Unassigned' else h['tier'] is None))
    chip=chip or f"{isl.upper()} · {n} Hotels"
    return f"""<html><head><meta charset=utf8><style>{CSS}</style></head><body><div class=app>
<div class=side><div class=brand>Magic Memories<small>HOTEL RATE SOFTWARE · ANDAMAN</small></div><div class=nav>{nav}</div></div>
<div class=main><div class=isl><div class=t>ISLAND</div>{tabs}<div class=sp></div><div class=t style="margin:0">CLASS</div><div class=cls>{chips}</div></div>
<div class=top><div><h1>{title}</h1><p>{sub}</p></div><div class=chip>{chip}</div></div>{body}
<div class=foot>Magic Memories Tours and Travels · Macca Pahad, Teylarabad · 7063877217 · DEMO SCREEN DESIGN</div></div></div></body></html>"""
def scope(ctx):
    hs=[h for h in ALL if h['island']==ctx['island']]
    f=ctx['cls']
    return [h for h in hs if f=='All' or (h['tier']==f if f!='Unassigned' else h['tier'] is None)]
def lo(h): return h['start_rate']
def hi(h):
    p=[x for r in h['rooms'] for x in (r['ep'],r['cp'],r['map'],r['ap']) if x]; return max(p) if p else None
def rate_table(h):
    rs=[r for r in h['rooms']]
    rows="".join(f'<tr><td class=hname>{e(r["category"])}</td>{money(r["ep"])}{money(r["cp"])}{money(r["map"])}{money(r["ap"])}</tr>' for r in rs) or '<tr><td colspan=5 class=mini style="padding:18px">No room rates entered for this hotel yet.</td></tr>'
    return f'<table><tr><th>ROOM CATEGORY</th><th style="text-align:right">EP</th><th style="text-align:right">CP</th><th style="text-align:right">MAP</th><th style="text-align:right">AP</th></tr>{rows}</table>'
RANGES=[("1000 TO 2000",1000,2000),("2100 TO 3000",2100,3000),("3100 TO 4000",3100,4000),("4100 TO 5000",4100,5000),("5100 TO 20000",5100,10**6)]
def stepper(active):
    st=["Hotel & Contact","Room Rates","Add-ons / Extra","Classification","Review"]; out='<div class=card style="display:flex;padding:16px 24px;margin-bottom:18px;align-items:center">'
    for i,t in enumerate(st):
        d=i<active; c=i==active; col="#34a853" if d else ("#1a73e8" if c else "#dadce0")
        out+=f'<div style="display:flex;align-items:center;gap:10px;{"flex:1" if i<len(st)-1 else ""}"><div class=badge style="background:{col};color:#fff;width:30px;height:30px;font-size:13px">{"✓" if d else i+1}</div><div style="font-size:13.5px;font-weight:{600 if c else 500};color:{"#202124" if (c or d) else "#9aa0a6"};white-space:nowrap">{t}</div>{"<div style=flex:1;height:2px;background:"+("#34a853" if d else "#e8eaed")+";margin:0 12px></div>" if i<len(st)-1 else ""}</div>'
    return out+'</div>'
def pick(ctx,name):
    return next(h for h in ALL if h['island']==ctx['island'] and h['name']==name)

def build(ctx,sel,only=None):
    P={}; hs=scope(ctx); S=pick(ctx,sel); isl=ctx['island']
    prices=[lo(h) for h in hs if lo(h)]; his=[hi(h) for h in hs if hi(h)]
    # 01 dashboard
    cnt={c:sum(1 for h in hs if h['tier']==c) for c in CLS}; cnt['Unassigned']=sum(1 for h in hs if h['tier'] is None)
    stats="".join(f'<div class=card style="padding:16px 20px"><div class=lbl>{a}</div><div style="font-family:Poppins;font-size:28px;font-weight:700;color:#1a73e8">{b}</div></div>' for a,b in [("Total hotels",len(hs)),("Lowest rate",f"₹{min(prices):,}"),("Highest rate",f"₹{max(his):,}"),("5-star hotels",sum(1 for h in hs if h['star']==5))])
    bars=""
    for c,col in [("High","#fbbc04"),("Mid","#1a73e8"),("Low","#34a853"),("Unassigned","#bdc1c6")]:
        w=int(100*cnt[c]/max(1,len(hs)))
        bars+=f'<div style="display:flex;align-items:center;gap:12px;padding:7px 0"><div style="width:90px;font-size:13.5px;font-weight:600">{c}</div><div style="flex:1;height:12px;background:#f1f3f4;border-radius:7px"><div style="width:{w}%;height:12px;background:{col};border-radius:7px"></div></div><div style="width:30px;text-align:right;font-weight:700">{cnt[c]}</div></div>'
    alert=""
    if cnt['Unassigned']:
        alert=f'<div class=card style="background:#fef7e0;display:flex;align-items:center;gap:16px;padding:16px 24px;margin-bottom:18px"><span style="font-size:24px">🏷️</span><div style="flex:1"><div class=hname>{cnt["Unassigned"]} hotels in {isl} have no class yet</div><div class=mini style="color:#7a5a00">Choose High, Mid or Low for each hotel so the class filter works.</div></div><span class="btn">Classify now →</span></div>'
    tiles=[("🏨","All Hotels",f"{len(hs)} hotels with full rate cards","#1a73e8"),("🔎","Find / Search","Pick a hotel — rates, contact, star, sea view, pool","#ea4335"),("₹","Price Range","Hotels grouped by room price","#fbbc04"),("★","Star Category","3 star · 4 star · 5 star lists","#34a853"),("🏆","Top Rankings",f"Best hotels · Low price · Near {S['near_label'].lower()}","#1a73e8"),("🌊","Sea View & Pool","Hotels with sea view or swimming pool","#ea4335")]
    t="".join(f'<div class=card style="border-left:6px solid {c};height:130px"><div style="font-size:28px">{i}</div><h3 style="margin:6px 0 4px;font-size:17px">{n}</h3><div class=mini>{d}</div></div>' for i,n,d,c in tiles)
    body=f"""{alert}<div style="display:grid;grid-template-columns:1.5fr 1fr;gap:18px;margin-bottom:18px"><div class=card style="background:linear-gradient(120deg,#1a73e8,#4285f4);color:#fff;display:flex;flex-direction:column;justify-content:center;padding:30px 34px"><div style="font-size:12.5px;letter-spacing:1.5px;color:#d2e3fc">SHOWING ONLY</div><h2 style="font-size:34px;margin:4px 0 14px">{isl.upper()}{" ISLAND" if isl!="Port Blair" else ""}</h2>
<div style="font-size:12px;letter-spacing:1px;color:#d2e3fc;margin-bottom:6px">SEARCH HOTEL</div><div class=inp style="font-weight:600;display:flex;justify-content:space-between">{e(S['name'])} <span>▾</span></div></div>
<div class=card><h3 style="margin-bottom:8px">Hotels by class</h3>{bars}</div></div>
<div class=grid style="grid-template-columns:repeat(4,1fr);margin-bottom:18px">{stats}</div><div class=grid style="grid-template-columns:repeat(3,1fr)">{t}</div>"""
    P['01_dashboard']=page('home','Dashboard',f'Everything below is only for {isl}',body,ctx)
    # 02 all hotels
    cards=""
    for h in hs:
        cards+=f'<div class=card style="padding:16px 18px"><div style="display:flex;justify-content:space-between;gap:6px"><div class=hname style="font-size:14.5px;line-height:1.25">{e(h["name"])}</div>{tag(h["tier"])}</div><div class=mini style="margin:5px 0 8px">📍 {e(h["address"] or "—")} · {f"{h['star']} ★" if h["star"] else "no star"}</div><div class=mini>Starting from</div><div style="font-family:Poppins;font-size:21px;font-weight:700;color:#1a73e8">{"₹"+format(lo(h),",") if lo(h) else "—"}</div><div style="margin-top:8px;display:flex;gap:6px">{"<span class=\"tag t-b\">Sea view</span>" if h["sea_view"] else ""}{"<span class=\"tag t-b\">Pool</span>" if h["pool"] else ""}</div></div>'
    body=f'<div style="display:flex;gap:12px;margin-bottom:18px"><div class=inp style="flex:1;color:#8aa3ad">🔎  Search hotel name or area…</div><div class=inp>All stars ▾</div><div class=inp>All price ranges ▾</div><div class=inp>Sea view / Pool ▾</div></div><div class=grid style="grid-template-columns:repeat(4,1fr)">{cards}</div>'
    P['02_all_hotels']=page('hotels','All Hotels',f'{len(hs)} hotels in {isl} — the tag shows the class you chose',body,ctx)
    # 03 detail
    D=S; rowsA="".join(f'<tr><td>{e(a["item"])}</td><td class=num>{"₹"+format(a["rate"],",") if a["rate"] else e(a["note"] or "—")}</td></tr>' for a in D['addons'])
    body=f"""<div class=grid style="grid-template-columns:1.55fr 1fr"><div class=grid style="align-content:start"><div class=card><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><h3>Room Rates (per night)</h3><div style="display:flex;gap:8px">{tag(D['tier'])}<span class="tag t-g">{str(D['star'])+" ★" if D['star'] else "no star"}</span></div></div>{rate_table(D)}</div>
<div class=card><h3 style="margin-bottom:10px">{D['addon_label'].replace('ADD ON','ADD ON BENEFITS')}</h3><table><tr><th>ITEM</th><th style="text-align:right">RATE</th></tr>{rowsA}</table></div></div>
<div class=grid style="align-content:start"><div class=card><div class=lbl>Hotel</div><h2 style="font-size:21px;margin-bottom:14px">{e(D['name'])}</h2><div class=lbl>Mobile No</div><div style="margin-bottom:12px;font-weight:600">{e(D['mobile'])}</div><div class=lbl>Email ID</div><div style="margin-bottom:12px;font-weight:600">{e(D['email'] or '—')}</div><div class=lbl>Address</div><div style="font-weight:600">{e(D['address'])}</div></div>
<div class=card><div class=lbl style="margin-bottom:10px">Quick facts</div><table><tr><td>Island</td><td class=num>{D['island']}</td></tr><tr><td>Class</td><td class=num>{tag(D['tier'])}</td></tr><tr><td>Sea view</td><td class=num>{yn(D['sea_view'])}</td></tr><tr><td>Swimming pool</td><td class=num>{yn(D['pool'])}</td></tr><tr><td>Near {D['near_label'].lower()}</td><td class=num>{D['near_km'] or '—'}</td></tr></table></div>
<div class=card style="display:flex;gap:10px;flex-wrap:wrap"><span class="btn">📤 Share rate card</span><span class="btn ghost">🖨 Print</span><span class="btn ghost">✏️ Edit</span></div></div></div>"""
    P['03_hotel_details']=page('detail',D['name'],'Complete rate card — EP / CP / MAP / AP, add-ons, contact',body,ctx)
    # 04 find
    cust=f"""<div class=card><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><h3>⚙️ Customize</h3><span class="tag t-b">Saved for me</span></div><div class=lbl style="margin:10px 0 8px">Search by</div>{seg(["Name","Price","Star","Facility"],0)}<div class=lbl style="margin:16px 0 0">Show on screen</div>{tog("Rates table")}{tog("Contact details")}{tog("Add-on / extra rates")}{tog("Hotel information")}{tog("Ranking lists",False,"Top 5 Rank · Low Price · Near "+S['near_label'])}<div class=lbl style="margin:16px 0 0">Plan columns</div>{tog("EP",False,"Hide empty plans automatically")}{tog("CP")}{tog("MAP",False)}{tog("AP",False)}<div class=lbl style="margin:16px 0 8px">Sort rooms</div>{seg(["Low → High","High → Low","As entered"],0)}<div style="display:flex;gap:10px;margin-top:16px"><span class="btn" style="flex:1;text-align:center">Apply</span><span class="btn ghost">Reset</span></div></div>"""
    body=f"""<div class=card style="margin-bottom:18px;display:flex;gap:14px;align-items:end"><div style="flex:1"><div class=lbl>Find hotel in {isl} (type or choose)</div><div class=inp style="font-weight:600;display:flex;justify-content:space-between">{e(S['name'])} <span>▾</span></div></div><span class="btn">🔎 Search</span><span class="btn ghost">Clear</span><span class="btn ghost" style="background:#e8f0fe;border-color:#e8f0fe">⚙️ Customize</span><span class="btn" style="background:#fbbc04;color:#202124">✏️ Edit this hotel</span></div>
<div class=grid style="grid-template-columns:1.5fr 1fr"><div class=grid style="align-content:start"><div class=card><h3 style="margin-bottom:12px">Rates</h3>{rate_table(S)}</div><div class=card><h3 style="margin-bottom:10px">Contact</h3><table><tr><td class=lbl style="width:120px">MOBILE NO</td><td>{e(S['mobile'])}</td></tr><tr><td class=lbl>EMAIL ID</td><td>{e(S['email'] or '—')}</td></tr><tr><td class=lbl>ADDRESS</td><td>{e(S['address'])}</td></tr></table></div>
<div class=card><h3 style="margin-bottom:12px">Hotel Information</h3><table><tr><td>Island</td><td class=num>{S['island']}</td></tr><tr><td>Class</td><td class=num>{tag(S['tier'])}</td></tr><tr><td>Star</td><td class=num><span class="tag t-g">{str(S['star'])+" ★" if S['star'] else "—"}</span></td></tr><tr><td>Sea view</td><td class=num>{yn(S['sea_view'])}</td></tr><tr><td>Pool</td><td class=num>{yn(S['pool'])}</td></tr></table></div></div>{cust}</div>"""
    P['04_find_search']=page('find','Find / Search',f'Search inside {isl} only — customize what you see, or edit it right here',body,ctx)
    # 04b edit
    rowsE="".join(f'<tr><td>{ein(e(r["category"]),"250px")}</td><td>{ein(format(r["ep"],",") if r["ep"] else "—","85px","right")}</td><td>{ein(format(r["cp"],",") if r["cp"] else "—","95px","right")}</td><td>{ein(format(r["map"],",") if r["map"] else "—","85px","right")}</td><td>{ein(format(r["ap"],",") if r["ap"] else "—","85px","right")}</td><td><span class="tag t-n">🗑</span></td></tr>' for r in S['rooms'])
    body=f"""<div class=card style="background:#fef7e0;margin-bottom:18px;display:flex;align-items:center;gap:14px;padding:16px 24px"><span style="font-size:22px">✏️</span><div style="flex:1"><div class=hname>Editing: {e(S['name'])}</div><div class=mini style="color:#7a5a00">Change anything below. Nothing is saved until you press Save.</div></div><span class="btn ghost">Cancel</span><span class="btn">💾 Save changes</span></div>
<div class=grid style="grid-template-columns:1.5fr 1fr"><div class=grid style="align-content:start"><div class=card><div style="display:flex;justify-content:space-between;margin-bottom:12px"><h3>Rates</h3><span class="btn ghost" style="padding:7px 16px">+ Add room</span></div><table><tr><th>CATEGORY</th><th style="text-align:right">EP</th><th style="text-align:right">CP</th><th style="text-align:right">MAP</th><th style="text-align:right">AP</th><th></th></tr>{rowsE}</table></div>
<div class=card><h3 style="margin-bottom:12px">Contact</h3><div class=grid style="gap:12px">{fld("Mobile no",e(S["mobile"]))}{fld("Email ID",e(S["email"] or "—"))}{fld("Address",e(S["address"]))}</div></div></div>
<div class=grid style="align-content:start"><div class=card><h3 style="margin-bottom:12px">Hotel information</h3><div class=grid style="gap:12px">{fld("Island",S["island"]+" ▾")}{fld("Class","Choose: High / Mid / Low ▾" if not S["tier"] else S["tier"]+" ▾")}{fld("Star",(str(S["star"])+" ★" if S["star"] else "—")+" ▾")}{fld("Sea view",("Yes" if S["sea_view"] else "No")+" ▾")}{fld("Pool",("Yes" if S["pool"] else "No")+" ▾")}</div></div>
<div class=card style="display:flex;gap:10px;flex-wrap:wrap"><span class="btn">💾 Save changes</span><span class="btn ghost">Cancel</span><span class="btn red">🗑 Delete hotel</span></div></div></div>"""
    P['04b_find_edit_mode']=page('find','Find / Search · Edit','Edit the selected hotel without leaving this page',body,ctx)
    # 05 range
    tabs="".join(f'<span class="btn {"" if n==RANGES[-1][0] else "ghost"}" style="padding:9px 18px">₹{a:,} – ₹{min(b,20000):,}</span>' for n,a,b in RANGES)
    rowsR=""
    for h in hs:
        first=True
        for r in h['rooms']:
            ps=[x for x in (r['ep'],r['cp'],r['map'],r['ap']) if x]
            if ps and min(ps)>=5100:
                rowsR+=f'<tr><td class=hname>{e(h["name"]) if first else ""}</td><td>{e(r["category"])}</td>{money(r["ep"])}{money(r["cp"])}{money(r["map"])}{money(r["ap"])}</tr>'; first=False
    body=f'<div style="display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap">{tabs}</div><div class=card><table><tr><th>HOTEL</th><th>CATEGORY</th><th style="text-align:right">EP</th><th style="text-align:right">CP</th><th style="text-align:right">MAP</th><th style="text-align:right">AP</th></tr>{rowsR}</table></div>'
    P['05_price_range']=page('range','Price Range',f'{isl} hotels grouped by room price — worked out automatically',body,ctx)
    # 06 star
    cols=""
    for s in (3,4,5):
        ns=[h for h in hs if h['star']==s]
        it="".join(f'<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1f3f4;gap:8px"><span class=hname style="font-size:13.5px">{e(h["name"])}</span><span style="font-weight:600;color:#1a73e8;white-space:nowrap">from ₹{lo(h):,}</span></div>' for h in ns if lo(h)) or '<div class=mini style="padding:20px 0">No hotels in this star group.</div>'
        cols+=f'<div class=card><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><h3>{s} STAR HOTELS</h3><span class="tag t-g">{len(ns)}</span></div>{it}</div>'
    P['06_star_category']=page('star','Star Category',f'3 star, 4 star and 5 star hotels in {isl}',f'<div class=grid style="grid-template-columns:1fr 1.2fr 1.2fr;align-items:start">{cols}</div>',ctx)
    # 07 rank
    def lst(items,fn): return "".join(f'<div style="display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid #f1f3f4"><span class="badge {"g" if i==0 else ""}">{i+1}</span>{fn(x)}</div>' for i,x in enumerate(items))
    best=sorted([h for h in hs if h['best_rank']],key=lambda h:h['best_rank'])[:5]
    low=sorted([h for h in hs if lo(h)],key=lo)[:5]
    near=sorted([h for h in hs if h['near_km']],key=lambda h:float(re.sub(r'[^0-9.]','',h['near_km']) or 99))[:5]
    c1=lst(best,lambda h:f'<span class=hname style="flex:1">{e(h["name"])}</span><span class="tag t-g">TOP</span>')
    c2=lst(low,lambda h:f'<span class=hname style="flex:1">{e(h["name"])}</span><span style="font-weight:700;color:#1a73e8">₹{lo(h):,}</span>')
    c3=lst(near,lambda h:f'<span class=hname style="flex:1">{e(h["name"])}</span><span class="tag t-b">{h["near_km"]}</span>')
    body=f'<div class=grid style="grid-template-columns:repeat(3,1fr);align-items:start"><div class=card><h3 style="margin-bottom:6px">🏆 Best Hotels</h3><div class=mini style="margin-bottom:6px">Top 5 by rank</div>{c1}</div><div class=card><h3 style="margin-bottom:6px">💰 Low Price</h3><div class=mini style="margin-bottom:6px">Top 5 starting rates · worked out automatically</div>{c2}</div><div class=card><h3 style="margin-bottom:6px">{"⛴️" if S["near_label"]=="Jetty" else "✈️"} Near {S["near_label"]}</h3><div class=mini style="margin-bottom:6px">Closest to the {S["near_label"].lower()}</div>{c3}</div></div>'
    P['07_top_rankings']=page('rank','Top Rankings',f'Top 5 best hotels · Top 5 low price · Top 5 near {S["near_label"].lower()} — {isl}',body,ctx)
    # 08 sea/pool
    def tl(ns,tone): return "".join(f'<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1f3f4"><span class=hname>{e(h["name"])}</span><span class="tag {tone}">from ₹{lo(h):,}</span></div>' for h in ns if lo(h))
    sea=[h for h in hs if h['sea_view']]; pool=[h for h in hs if h['pool']]
    body=f'<div class=card style="margin-bottom:18px;display:flex;gap:12px"><span class="btn">All extra benefits</span><span class="btn ghost">🌊 Sea view</span><span class="btn ghost">🏊 Pool</span><span class="btn ghost">Both</span></div><div class=grid style="grid-template-columns:1fr 1fr;align-items:start"><div class=card><div style="display:flex;justify-content:space-between;margin-bottom:6px"><h3>🌊 SEA VIEW</h3><span class="tag t-b">{len(sea)}</span></div>{tl(sea,"t-b")}</div><div class=card><div style="display:flex;justify-content:space-between;margin-bottom:6px"><h3>🏊 POOL</h3><span class="tag t-b">{len(pool)}</span></div>{tl(pool,"t-g")}</div></div>'
    P['08_sea_view_pool']=page('addon','Sea View & Pool',f'Extra benefits search — {isl}',body,ctx)
    # 09 classify
    allh=[h for h in ALL if h['island']==isl]
    def pill(h,c):
        on=h['tier']==c; col={"High":"#fbbc04","Mid":"#1a73e8","Low":"#34a853"}[c]
        return f'<span style="padding:7px 16px;border-radius:20px;font-size:13px;font-weight:700;{"background:"+col+";color:"+("#202124" if c=="High" else "#fff") if on else "border:1.5px solid #dadce0;color:#5f6368"}">{c}</span>'
    rowsC="".join(f'<tr><td style="width:36px"><div style="width:20px;height:20px;border-radius:6px;border:2px solid {"#1a73e8" if i<3 else "#dadce0"};background:{"#1a73e8" if i<3 else "#fff"};color:#fff;font-size:13px;text-align:center;line-height:16px">{"✓" if i<3 else ""}</div></td><td class=hname>{e(h["name"])}</td><td>{str(h["star"])+" ★" if h["star"] else "—"}</td><td class=num>{"₹"+format(lo(h),",") if lo(h) else "—"}</td><td><div style="display:flex;gap:6px">{pill(h,"High")}{pill(h,"Mid")}{pill(h,"Low")}</div></td><td>{"<span class=\"tag t-n\">from file</span>" if h["tier"] else "<span class=\"tag t-g\">not set</span>"}</td></tr>' for i,h in enumerate(allh))
    done=sum(1 for h in allh if h['tier'])
    body=f"""<div class=card style="margin-bottom:18px;display:flex;gap:14px;align-items:center"><div style="flex:1"><div class=hname>Choose High, Mid or Low for each {isl} hotel</div><div style="display:flex;align-items:center;gap:12px;margin-top:8px"><div style="width:260px;height:10px;background:#e8eaed;border-radius:6px"><div style="width:{int(100*done/len(allh))}%;height:10px;background:#34a853;border-radius:6px"></div></div><span class=mini><b>{done}</b> of {len(allh)} classified</span></div></div>
<div class=mini style="text-align:right">3 selected →</div><span class="btn" style="background:#fbbc04;color:#202124;padding:9px 20px">Set as High</span><span class="btn" style="padding:9px 20px">Set as Mid</span><span class="btn" style="background:#34a853;padding:9px 20px">Set as Low</span><span class="btn ghost" style="padding:9px 20px">✨ Suggest by price</span></div>
<div class=card><table><tr><th></th><th>HOTEL</th><th>STAR</th><th style="text-align:right">STARTING RATE</th><th>CLASS</th><th>SOURCE</th></tr>{rowsC}</table></div>"""
    P['09_classify_hotels']=page('classify','Classify Hotels',f'You decide which {isl} hotels are High, Mid or Low — change any time',body,ctx)
    # 10 company
    ppl=[("PANDI SELVAM","7679972443"),("PARAMESHWARAN","7063904232"),("P SNEHA","9679547217"),("VAITHISWARI","9531841566")]
    pc="".join(f'<div class=card style="padding:18px;text-align:center"><div class=badge style="width:56px;height:56px;font-size:20px;margin-bottom:10px">{n[0]}</div><div class=hname>{n}</div><div class=mini style="margin-top:4px">📞 {p}</div></div>' for n,p in ppl)
    body=f'<div class=card style="background:linear-gradient(120deg,#1a73e8,#4285f4);color:#fff;padding:30px 34px;margin-bottom:18px"><div style="font-size:12px;letter-spacing:1.5px;color:#d2e3fc">SHOP NAME</div><h2 style="font-size:30px;margin:4px 0 16px">MAGIC MEMORIES TOURS AND TRAVELS</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px"><div><div style="color:#d2e3fc;font-size:12px">ADDRESS</div>Macca Pahad, Teylarabad</div><div><div style="color:#d2e3fc;font-size:12px">OFFICE CONTACT NO</div>7063877217</div><div><div style="color:#d2e3fc;font-size:12px">EMAIL ID</div>magicmemoriestoursandtravels@gmail.com</div></div></div><h3 style="margin-bottom:12px">Team</h3><div class=grid style="grid-template-columns:repeat(4,1fr)">{pc}</div>'
    P['10_company_info']=page('company','Company Info','Same on every island — shown on every shared rate card',body,ctx,"All islands")
    # 11 new entry
    rooms="".join(f'<tr><td>{ein(c,"250px")}</td><td>{ein(t,"80px","right")}</td><td>{ein("—","80px","right")}</td><td>{ein(cp,"95px","right")}</td><td>{ein(mp,"85px","right")}</td><td>{ein(ap,"85px","right")}</td><td><span class="tag t-n">🗑</span></td></tr>' for c,t,cp,mp,ap in [("DELUXE ROOM","10","4,800","—","—"),("SUPER DELUXE ROOM","8","5,600","7,100","8,600"),("SUITE ROOM","4","7,200","—","—")])
    chk=lambda t,ok: f'<div style="display:flex;gap:10px;padding:8px 0;align-items:center;font-size:14px"><span class=badge style="width:22px;height:22px;font-size:12px;background:{"#34a853" if ok else "#dadce0"}">{"✓" if ok else ""}</span><span style="{"" if ok else "color:#80868b"}">{t}</span></div>'
    body=stepper(0)+f"""<div class=grid style="grid-template-columns:1.6fr 1fr;align-items:start"><div class=grid style="align-content:start"><div class=card><div style="display:flex;justify-content:space-between;margin-bottom:14px"><h3>HOTEL NAME &amp; PERSONAL ID</h3><span class="tag t-g">Sample data</span></div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px">{fld("Island",isl+" ▾")}{fld("Class","Mid ▾")}{fld("Star","4 ★ ▾")}</div>{fld("Hotel name","SAMPLE BAY RESORT")}<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">{fld("Mobile no","9999900000")}{fld("Email ID","reservations@samplebay.com")}</div><div style="margin-top:12px">{fld("Address",isl)}</div></div>
<div class=card><div style="display:flex;justify-content:space-between;margin-bottom:12px"><h3>CATEGORY · ROOM RATES</h3><span class="btn ghost" style="padding:7px 16px">+ Add room category</span></div><table><tr><th>CATEGORY</th><th style="text-align:right">TOTAL ROOMS</th><th style="text-align:right">EP</th><th style="text-align:right">CP</th><th style="text-align:right">MAP</th><th style="text-align:right">AP</th><th></th></tr>{rooms}</table></div>
<div class=card><div style="display:flex;justify-content:space-between;margin-bottom:12px"><div style="display:flex;gap:12px;align-items:center"><h3>Add-on / Extra</h3>{seg(["ADD ON BENEFITS","EXTRA RATE"],0)}</div><span class="btn ghost" style="padding:7px 16px">+ Add item</span></div><div style="display:grid;grid-template-columns:1fr 160px 40px;gap:10px;align-items:center">{ein("Extra mattress per person")}{ein("₹ 1,500","100%","right")}<span class="tag t-n">🗑</span>{ein("Flower bed decoration")}{ein("₹ 3,000","100%","right")}<span class="tag t-n">🗑</span></div></div></div>
<div class=grid style="align-content:start"><div class=card><h3 style="margin-bottom:6px">Entry progress</h3><div style="display:flex;align-items:center;gap:12px;margin:8px 0 12px"><div style="flex:1;height:10px;background:#e8eaed;border-radius:6px"><div style="width:86%;height:10px;background:#34a853;border-radius:6px"></div></div><b>86%</b></div>{chk("Island and class chosen",True)}{chk("Hotel name",True)}{chk("Mobile, email, address",True)}{chk("At least 1 room category with a rate",True)}{chk("Add-on / extra rates",True)}{chk("Review & confirm",False)}</div>
<div class=card style="background:#e8f0fe"><h3 style="color:#1967d2;margin-bottom:6px">Entry complete?</h3><div class=mini style="margin-bottom:14px;color:#1967d2">Adds this hotel to {isl} everywhere — dropdowns, price range, star, sea view, pool and counts.</div><span class="btn" style="display:block;text-align:center">🔄 Review &amp; Update All Hotels →</span><div style="height:10px"></div><span class="btn ghost" style="display:block;text-align:center">💾 Save as draft</span></div></div></div>"""
    P['11_new_hotel_entry']=page('new','New Hotel Entry','Same format as every hotel sheet — choose the island and class, fill once, it appears everywhere',body,ctx,"Step 1 of 5")
    # 12 update all
    n0=len(allh)
    def upd(t,d,b,a,on=True): return f'<div style="display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid #f1f3f4"><div style="width:22px;height:22px;border-radius:6px;background:{"#1a73e8" if on else "#fff"};border:2px solid {"#1a73e8" if on else "#dadce0"};color:#fff;font-size:14px;text-align:center;line-height:18px">{"✓" if on else ""}</div><div style="flex:1"><div class=hname>{t}</div><div class=mini>{d}</div></div><div style="text-align:right;font-size:13px;white-space:nowrap"><span style="color:#80868b">{b}</span> <b style="color:#34a853">→ {a}</b></div></div>'
    ups=(upd(f"{isl} hotel list (Home &amp; Find dropdown)","SAMPLE BAY RESORT added",f"{n0} hotels",f"{n0+1} hotels")+upd("Hotel rate card page","New page created with rates, contact and add-ons","—","1 new page")+upd("Class: Mid",f"Counted under Mid for {isl}",f"{sum(1 for h in allh if h['tier']=='Mid')} Mid",f"{sum(1 for h in allh if h['tier']=='Mid')+1} Mid")+upd("All Hotels page &amp; Dashboard counts","Card added · totals updated",f"{n0}",f"{n0+1}")+upd("Price range lists","₹4,100–5,000 and ₹5,100+ rows added","","+3 rows")+upd("Star category: 4 STAR","Added under 4 STAR HOTELS","",f"+1")+upd("Sea view list","Facility = Yes","","+1")+upd("Pool list","Facility = No — nothing to add","","no change",False)+upd("Top rankings","Low-price Top 5 recalculated from rates","","auto"))
    body=stepper(4)+f"""<div class=grid style="grid-template-columns:1.6fr 1fr;align-items:start"><div class=card><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><h3>These pages will be updated</h3><span class=mini>Untick anything you do not want to change</span></div>{ups}</div><div class=grid style="align-content:start"><div class=card><div class=lbl>New hotel</div><h2 style="font-size:20px;margin-bottom:12px">SAMPLE BAY RESORT</h2><table><tr><td>Island</td><td class=num>{isl}</td></tr><tr><td>Class</td><td class=num>{tag("Mid")}</td></tr><tr><td>Star</td><td class=num>4 ★</td></tr><tr><td>Starting rate</td><td class=num>₹4,800</td></tr></table></div>
<div class=card style="background:#e6f4ea"><div style="display:flex;gap:12px;align-items:center"><span style="font-size:26px">✅</span><div><div class=hname style="color:#137333">No problems found</div><div class=mini style="color:#137333">Name is new · rates are numbers · contact filled</div></div></div></div><div class=card><span class="btn" style="display:block;text-align:center;font-size:15px;padding:14px">🔄 Update All Hotels</span><div style="height:10px"></div><span class="btn ghost" style="display:block;text-align:center">← Back to edit</span><div class=mini style="margin-top:12px;text-align:center">A backup is taken before updating, so you can undo.</div></div></div></div>"""
    P['12_update_all_hotels']=page('update','Update All Hotels','Final check — add the new hotel to every list in one click',body,ctx,"Step 5 of 5")
    return P
async def main():
    from playwright.async_api import async_playwright
    jobs=[('havelock',dict(island='Havelock',cls='All'),'HAVELOCK EXOTIC',None),('port_blair',dict(island='Port Blair',cls='All'),'HOTEL MANSHA PALACE',['01_dashboard','02_all_hotels']),('neil',dict(island='Neil',cls='All'),'PEARL PARK BEACH RESORT',['01_dashboard'])]
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); pg=await b.new_page(viewport={"width":1440,"height":900})
        import os
        for nm,ctx,sel,only in jobs:
            os.makedirs(nm,exist_ok=True)
            for k,v in build(ctx,sel).items():
                if only and k not in only: continue
                await pg.set_content(v); await pg.wait_for_timeout(200)
                await pg.screenshot(path=f"{nm}/{k}.jpg",type="jpeg",quality=90,full_page=True); print(nm,k)
        await b.close()
asyncio.run(main())
