import html, asyncio
from data import *
e = html.escape

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#f8f9fa;color:#202124;width:1440px}
h1,h2,h3,.brand{font-family:'Poppins',sans-serif}
.app{display:flex;min-height:900px}
.side{width:260px;background:#fff;color:#5f6368;padding:24px 14px;flex-shrink:0;border-right:1px solid #e8eaed}
.brand{font-weight:600;font-size:20px;color:#202124;line-height:1.2;padding:4px 12px}
.brand small{display:block;font-weight:500;font-size:11px;color:#1a73e8;margin-top:4px;letter-spacing:.6px}
.nav{margin-top:26px;display:flex;flex-direction:column;gap:3px}
.nav div{padding:12px 16px;border-radius:28px;font-size:14px;display:flex;gap:13px;align-items:center;font-weight:500}
.nav div.on{background:#e8f0fe;color:#1967d2;font-weight:600}
.nav i{font-style:normal;width:20px;text-align:center}
.nav .sep{font-size:10.5px;letter-spacing:1.2px;color:#9aa0a6;padding:18px 16px 4px;text-transform:uppercase;font-weight:600}
.main{flex:1;padding:28px 36px 40px}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}
.top h1{font-size:26px;color:#202124;font-weight:600}
.top p{font-size:13.5px;color:#5f6368;margin-top:3px}
.chip{background:#e8f0fe;border-radius:30px;padding:9px 18px;font-size:13px;color:#1967d2;font-weight:600}
.card{background:#fff;border-radius:24px;box-shadow:0 1px 2px rgba(60,64,67,.15),0 2px 8px rgba(60,64,67,.08);padding:22px}
.grid{display:grid;gap:18px}
.btn{display:inline-block;background:#1a73e8;color:#fff;border-radius:24px;padding:11px 24px;font-size:14px;font-weight:600}
.btn.gold{background:#fff;color:#1a73e8}.btn.ghost{background:#fff;color:#1a73e8;border:1.5px solid #dadce0}
.btn.red{background:#fff;color:#d93025;border:1.5px solid #f5c6c2}
.inp{background:#fff;border:1.5px solid #dadce0;border-radius:14px;padding:11px 16px;font-size:14px;color:#202124;min-height:44px}
.lbl{font-size:11.5px;letter-spacing:.8px;text-transform:uppercase;color:#5f6368;margin-bottom:6px;font-weight:600}
table{border-collapse:collapse;width:100%;font-size:14px}
th{background:#e8f0fe;color:#1967d2;text-align:left;padding:11px 14px;font-weight:600;font-size:12.5px;letter-spacing:.5px}
th:first-child{border-radius:14px 0 0 14px}th:last-child{border-radius:0 14px 14px 0}
td{padding:11px 14px;border-bottom:1px solid #f1f3f4}
tr:last-child td{border-bottom:0}
.num{text-align:right;font-variant-numeric:tabular-nums;font-weight:600}
.na{color:#bdc1c6;text-align:right}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
.t-y{background:#e6f4ea;color:#137333}.t-n{background:#f1f3f4;color:#80868b}
.t-g{background:#fef7e0;color:#b06000}.t-b{background:#e8f0fe;color:#1967d2}
.hname{font-weight:600;color:#202124}
.mini{font-size:12.5px;color:#5f6368}
.badge{width:34px;height:34px;border-radius:50%;background:#1a73e8;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;font-family:Poppins}
.badge.g{background:#fbbc04;color:#202124}
.foot{margin-top:26px;text-align:center;font-size:12px;color:#9aa0a6}
"""

NAV = [("Dashboard", "🏠", "home"), ("All Hotels", "🏨", "hotels"), ("Hotel Details", "📄", "detail"), ("Find / Search", "🔎", "find"),
       ("SEP", "BROWSE", ""), ("Price Range", "₹", "range"), ("Star Category", "★", "star"), ("Top Rankings", "🏆", "rank"), ("Sea View & Pool", "🌊", "addon"),
       ("SEP", "ADMIN", ""), ("Manage Hotels", "✏️", "manage"), ("New Hotel Entry", "➕", "new"), ("Update All Hotels", "🔄", "update"), ("Company Info", "ℹ️", "company")]

def page(active, title, sub, body, chip="HIGH CLASS · 17 Hotels"):
    nav = ""
    for n, ic, k in NAV:
        if n == "SEP":
            nav += f'<div class="sep">{ic}</div>'
        else:
            nav += f'<div class="{"on" if k==active else ""}"><i>{ic}</i>{n}</div>'
    return f"""<html><head><meta charset=utf8><style>{CSS}</style></head><body><div class=app>
<div class=side><div class=brand>Magic Memories<small>HOTEL RATE SOFTWARE · ANDAMAN</small></div><div class=nav>{nav}</div></div>
<div class=main><div class=top><div><h1>{title}</h1><p>{sub}</p></div><div class=chip>{chip}</div></div>{body}
<div class=foot>Magic Memories Tours and Travels · Macca Pahad, Teylarabad · 7063877217 · DEMO SCREEN DESIGN</div></div></div></body></html>"""

def money(v):
    return f'<td class="num">₹{v:,}</td>' if v else '<td class="na">—</td>'

def rate_table(h, extra=""):
    rows = "".join(f'<tr><td class=hname>{e(c)}</td>{money(a)}{money(b)}{money(m)}{money(p)}</tr>' for c, a, b, m, p in H[h]["rooms"])
    return f'<table><tr><th>ROOM CATEGORY</th><th style="text-align:right">EP</th><th style="text-align:right">CP</th><th style="text-align:right">MAP</th><th style="text-align:right">AP</th></tr>{rows}</table>'

def yn(b): return f'<span class="tag {"t-y" if b else "t-n"}">{"Yes" if b else "No"}</span>'

def rng_of(h):
    v = lo(h)
    for n, a, b in RANGES:
        if a <= v <= b: return n
    return "5100 TO 10000"

pages = {}

# 01 HOME
tiles = [("🏨", "All Hotels", "17 hotels with full rate cards", "#1a73e8"), ("🔎", "Find / Search", "Pick a hotel — rates, contact, star, sea view, pool", "#ea4335"),
         ("₹", "Price Range", "Hotels grouped from ₹1,500 to ₹20,000", "#fbbc04"), ("★", "Star Category", "3 star · 4 star · 5 star lists", "#34a853"),
         ("🏆", "Top Rankings", "Best hotels · Low price · Near airport", "#1a73e8"), ("🌊", "Sea View & Pool", "Hotels with sea view or swimming pool", "#ea4335")]
t = "".join(f'<div class=card style="border-top:0;border-left:6px solid {c};height:150px"><div style="font-size:30px">{i}</div><h3 style="margin:8px 0 4px;font-size:18px">{n}</h3><div class=mini>{d}</div></div>' for i, n, d, c in tiles)
stats = "".join(f'<div class=card style="padding:16px 20px"><div class=lbl>{a}</div><div style="font-family:Poppins;font-size:28px;font-weight:700;color:#1a73e8">{b}</div></div>' for a, b in
                [("Total hotels", "17"), ("Lowest rate", "₹2,000"), ("Highest rate", "₹18,200"), ("5-star hotels", "14")])
body = f"""<div class=card style="background:linear-gradient(120deg,#1a73e8,#4285f4);color:#fff;display:flex;justify-content:space-between;align-items:center;padding:30px 34px;margin-bottom:18px">
<div><div style="font-size:12.5px;letter-spacing:1.5px;color:#d2e3fc">HOTEL CATEGORY</div><h2 style="font-size:34px;margin:4px 0 6px">HIGH CLASS</h2><div style="color:#e8f0fe;font-size:14px">Search a hotel, check rates and send details to your customer.</div></div>
<div style="width:470px"><div style="font-size:12px;letter-spacing:1px;color:#d2e3fc;margin-bottom:6px">SEARCH HOTEL</div>
<div class=inp style="color:#12313f;display:flex;justify-content:space-between;font-weight:600">HOTEL MANSHA PALACE <span>▾</span></div>
<div style="margin-top:10px"><span class="btn gold">Go to Hotel →</span></div></div></div>
<div class=grid style="grid-template-columns:repeat(4,1fr);margin-bottom:18px">{stats}</div>
<div class=grid style="grid-template-columns:repeat(3,1fr)">{t}</div>"""
pages["01_home_dashboard"] = page("home", "Dashboard", "Welcome — choose what you want to do", body)

# 02 ALL HOTELS
cards = ""
for n in HOTEL_ORDER:
    s = H[n]["star"]
    cards += f"""<div class=card style="padding:16px 18px"><div style="display:flex;justify-content:space-between"><div class=hname style="font-size:15px">{e(n)}</div><span class="tag t-g">{s+'★' if s!='-' else '—'}</span></div>
<div class=mini style="margin:4px 0 10px">📍 {e(H[n]['addr'])}</div>
<div style="font-size:12.5px;color:#5f6368">Starting from</div><div style="font-family:Poppins;font-size:22px;font-weight:700;color:#1a73e8">₹{lo(n):,}</div>
<div style="margin-top:8px;display:flex;gap:6px">{'<span class="tag t-b">Sea view</span>' if H[n]['sea'] else ''}{'<span class="tag t-b">Pool</span>' if H[n]['pool'] else ''}</div></div>"""
body = f"""<div style="display:flex;gap:12px;margin-bottom:18px"><div class=inp style="flex:1;color:#80868b">🔎  Search hotel name or area…</div><div class=inp>All stars ▾</div><div class=inp>All price ranges ▾</div><div class=inp>Sea view / Pool ▾</div></div>
<div class=grid style="grid-template-columns:repeat(4,1fr)">{cards}</div>"""
pages["02_all_hotels"] = page("hotels", "All Hotels", "17 hotels — click any card to open the full rate card", body)

# 03 DETAIL (Mansha)
h = "HOTEL MANSHA PALACE"; d = H[h]
add_rows = "".join(f'<tr><td>{e(a)}</td><td class=num>₹{p:,}</td></tr>' for a, p in d["addons"])
body = f"""<div class=grid style="grid-template-columns:1.55fr 1fr">
<div class=grid style="align-content:start"><div class=card><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><h3>Room Rates (per night)</h3><span class="tag t-g">5 ★</span></div>{rate_table(h)}</div>
<div class=card><h3 style="margin-bottom:10px">{d['label']}</h3><table><tr><th>ITEM</th><th style="text-align:right">RATE</th></tr>{add_rows}</table></div></div>
<div class=grid style="align-content:start"><div class=card><div class=lbl>Hotel</div><h2 style="font-size:22px;margin-bottom:14px">{h}</h2>
<div class=lbl>Mobile No</div><div style="margin-bottom:12px;font-weight:600">{e(d['mobile'])}</div><div class=lbl>Email ID</div><div style="margin-bottom:12px;font-weight:600">{d['email']}</div>
<div class=lbl>Address</div><div style="margin-bottom:6px;font-weight:600">{d['addr']}</div></div>
<div class=card><div class=lbl style="margin-bottom:10px">Quick facts</div><table><tr><td>Star category</td><td class=num>5 ★</td></tr><tr><td>Sea view</td><td class=num>{yn(d['sea'])}</td></tr><tr><td>Swimming pool</td><td class=num>{yn(d['pool'])}</td></tr>
<tr><td>Price range</td><td class=num>5100 – 20000</td></tr><tr><td>Top-5 Best Hotel</td><td class=num>{yn(True)}</td></tr><tr><td>Near airport</td><td class=num>2 KM</td></tr></table></div>
<div class=card style="display:flex;gap:10px;flex-wrap:wrap"><span class="btn">📤 Share rate card</span><span class="btn ghost">🖨 Print</span><span class="btn ghost">← Back</span></div></div></div>"""
pages["03_hotel_details"] = page("detail", "HOTEL MANSHA PALACE", "Complete rate card — EP / CP / MAP / AP, add-ons, contact", body)

# helpers
def tog(label, on=True, sub=""):
    bg = "#1a73e8" if on else "#dadce0"; x = "20px" if on else "2px"
    return f'<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #f1f3f4"><div><div style="font-size:14px;font-weight:500">{label}</div>{f"<div class=mini>{sub}</div>" if sub else ""}</div><div style="width:40px;height:22px;border-radius:11px;background:{bg};position:relative;flex-shrink:0"><div style="position:absolute;top:2px;left:{x};width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div></div></div>'

def seg(items, active):
    return '<div style="display:flex;background:#f1f3f4;border-radius:24px;padding:4px;gap:2px">' + "".join(
        f'<div style="flex:1;text-align:center;padding:8px 6px;border-radius:20px;font-size:12.5px;font-weight:600;{"background:#fff;color:#1967d2;box-shadow:0 1px 3px rgba(60,64,67,.25)" if i==active else "color:#5f6368"}">{t}</div>' for i, t in enumerate(items)) + '</div>'

def fld(label, val, ph=False, w=""):
    return f'<div style="{w}"><div class=lbl>{label}</div><div class=inp style="{"color:#9aa0a6" if ph else "font-weight:500"}">{val}</div></div>'

# 04 FIND (with customize + edit)
h = "SEA SHELL"; d = H[h]
cust = f"""<div class=card><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><h3>⚙️ Customize</h3><span class="tag t-b">Saved for me</span></div>
<div class=lbl style="margin:10px 0 8px">Search by</div>{seg(["Name","Price","Star","Facility"],0)}
<div class=lbl style="margin:16px 0 0">Show on screen</div>
{tog("Rates table",True)}{tog("Contact details",True)}{tog("Add-on / extra rates",True)}{tog("Hotel information",True)}{tog("Ranking lists",False,"Top 5 Rank · Low Price · Airport")}
<div class=lbl style="margin:16px 0 0">Plan columns</div>
{tog("EP",False,"Hide empty plans automatically")}{tog("CP",True)}{tog("MAP",False)}{tog("AP",False)}
<div class=lbl style="margin:16px 0 8px">Sort rooms</div>{seg(["Low → High","High → Low","As entered"],0)}
<div style="display:flex;gap:10px;margin-top:16px"><span class="btn" style="flex:1;text-align:center">Apply</span><span class="btn ghost">Reset</span></div></div>"""
body = f"""<div class=card style="margin-bottom:18px;display:flex;gap:14px;align-items:end"><div style="flex:1"><div class=lbl>Find hotel (type or choose)</div><div class=inp style="font-weight:600;display:flex;justify-content:space-between">SEA SHELL <span>▾</span></div></div>
<span class="btn">🔎 Search</span><span class="btn ghost">Clear</span><span class="btn ghost" style="background:#e8f0fe;border-color:#e8f0fe">⚙️ Customize</span><span class="btn gold" style="background:#fbbc04;color:#202124">✏️ Edit this hotel</span></div>
<div class=grid style="grid-template-columns:1.5fr 1fr"><div class=grid style="align-content:start"><div class=card><h3 style="margin-bottom:12px">Rates</h3>{rate_table(h)}</div>
<div class=card><h3 style="margin-bottom:10px">Contact</h3><table><tr><td class=lbl style="width:120px">MOBILE NO</td><td>{d['mobile']}</td></tr><tr><td class=lbl>EMAIL ID</td><td>{d['email']}</td></tr><tr><td class=lbl>ADDRESS</td><td>{d['addr']}</td></tr></table></div>
<div class=card><h3 style="margin-bottom:10px">Add-on benefits</h3><div class=mini>No add-on rates entered for this hotel yet. Use “Edit this hotel” to add them.</div></div>
<div class=card><h3 style="margin-bottom:12px">Hotel Information</h3><table><tr><td>Star</td><td class=num><span class="tag t-g">5 ★</span></td></tr><tr><td>Sea view</td><td class=num>{yn(True)}</td></tr><tr><td>Pool</td><td class=num>{yn(False)}</td></tr><tr><td>Price range</td><td class=num>5100 TO 10000</td></tr></table></div></div>
{cust}</div>"""
pages["04_find_search"] = page("find", "Find / Search", "Choose a hotel, customize what you see, or edit it right here", body)

# 04b FIND - EDIT MODE
def ein(v, w="100%", align="left"):
    return f'<div class=inp style="min-height:36px;padding:7px 12px;width:{w};text-align:{align};font-weight:600;border-color:#a8c7fa;background:#f8fbff">{v}</div>'
rows = "".join(f'<tr><td>{ein(c,"270px")}</td><td>{ein("—","90px","right")}</td><td>{ein(f"{b:,}","110px","right")}</td><td>{ein("—","90px","right")}</td><td>{ein("—","90px","right")}</td><td style="text-align:right"><span class="tag t-n">🗑</span></td></tr>' for c, a, b, m, p in d["rooms"])
body = f"""<div class=card style="background:#fef7e0;margin-bottom:18px;display:flex;align-items:center;gap:14px;padding:16px 24px"><span style="font-size:22px">✏️</span><div style="flex:1"><div class=hname>Editing: SEA SHELL</div><div class=mini style="color:#7a5a00">Change anything below. Nothing is saved until you press Save.</div></div><span class="btn ghost">Cancel</span><span class="btn">💾 Save changes</span></div>
<div class=grid style="grid-template-columns:1.5fr 1fr"><div class=grid style="align-content:start">
<div class=card><div style="display:flex;justify-content:space-between;margin-bottom:12px"><h3>Rates</h3><span class="btn ghost" style="padding:7px 16px">+ Add room</span></div>
<table><tr><th>CATEGORY</th><th style="text-align:right">EP</th><th style="text-align:right">CP</th><th style="text-align:right">MAP</th><th style="text-align:right">AP</th><th></th></tr>{rows}</table></div>
<div class=card><h3 style="margin-bottom:12px">Contact</h3><div class=grid style="gap:12px">{fld("Mobile no", d["mobile"])}{fld("Email ID", d["email"])}{fld("Address", d["addr"])}</div></div>
<div class=card><div style="display:flex;justify-content:space-between;margin-bottom:10px"><h3>Add-on benefits</h3><span class="btn ghost" style="padding:7px 16px">+ Add item</span></div>
<div style="display:grid;grid-template-columns:1fr 160px 40px;gap:10px;align-items:center">{ein("<span style=color:#9aa0a6;font-weight:400>Item name (e.g. Candle light dinner)</span>","100%")}{ein("<span style=color:#9aa0a6;font-weight:400>₹ rate</span>","100%","right")}<span class="tag t-n">🗑</span></div></div></div>
<div class=grid style="align-content:start"><div class=card><h3 style="margin-bottom:12px">Hotel information</h3><div class=grid style="gap:12px">
{fld("Star", "5 ★ ▾")}{fld("Sea view", "Yes ▾")}{fld("Pool", "No ▾")}{fld("Price range", "5100 TO 10000 (auto from rates)")}</div></div>
<div class=card><h3 style="margin-bottom:8px">After saving</h3>{tog("Update all lists for this hotel",True,"Price range, star, sea view, pool, rankings")}{tog("Keep a copy of old rates",False,"History of rate changes")}</div>
<div class=card style="display:flex;gap:10px;flex-wrap:wrap"><span class="btn">💾 Save changes</span><span class="btn ghost">Cancel</span><span class="btn red">🗑 Delete hotel</span></div></div></div>"""
pages["04b_find_edit_mode"] = page("find", "Find / Search · Edit", "Edit the selected hotel without leaving this page", body)

# 05 PRICE RANGE
tabs = "".join(f'<span class="btn {"" if n=="5100 TO 10000" else "ghost"}" style="padding:9px 18px">₹{a:,} – ₹{b if b<20000 else 20000:,}</span>' for n, a, b in RANGES)
rows = ""
for n in HOTEL_ORDER:
    for i, (c, a, b, m, p) in enumerate(H[n]["rooms"]):
        if any(5100 <= x <= 20000 for x in (a, b, m, p) if x) and not (n in ("ISLANDS TOURISTER", "DA BAY INN", "BEYLEAF INN") ):
            rows += f'<tr><td class=hname>{e(n) if i==0 else ""}</td><td>{e(c)}</td>{money(a)}{money(b)}{money(m)}{money(p)}</tr>'
body = f"""<div style="display:flex;gap:10px;margin-bottom:18px">{tabs}</div><div class=card><table><tr><th>HOTEL</th><th>CATEGORY</th><th style="text-align:right">EP</th><th style="text-align:right">CP</th><th style="text-align:right">MAP</th><th style="text-align:right">AP</th></tr>{rows}</table></div>"""
pages["05_price_range"] = page("range", "Price Range", "Hotels grouped by room price — click a range", body)

# 06 STAR
cols = ""
for s, names in [("3", []), ("4", ["HORNBILL NEST RESORT", "DA BAY INN"]), ("5", [n for n in HOTEL_ORDER if H[n]["star"] == "5"])]:
    items = "".join(f'<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1f3f4"><span class=hname>{e(n)}</span><span style="font-weight:600;color:#1a73e8">from ₹{lo(n):,}</span></div>' for n in names) or '<div class=mini style="padding:20px 0">No hotels added in 3 star yet.</div>'
    cols += f'<div class=card><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><h3>{s} STAR HOTELS</h3><span class="tag t-g">{len(names)}</span></div>{items}</div>'
body = f'<div style="display:flex;gap:10px;margin-bottom:18px"><span class="btn ghost">3 ★</span><span class="btn ghost">4 ★</span><span class="btn">5 ★</span><span class="mini" style="align-self:center;margin-left:8px">(or see all three side by side below)</span></div><div class=grid style="grid-template-columns:1fr 1fr 1.4fr;align-items:start">{cols}</div>'
pages["06_star_category"] = page("star", "Star Category", "3 star, 4 star and 5 star hotels", body)

# 07 RANK
def lst(items, fn):
    return "".join(f'<div style="display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid #f1f3f4"><span class="badge {"g" if i==0 else ""}">{i+1}</span>{fn(x)}</div>' for i, x in enumerate(items))
c1 = lst(BEST, lambda x: f'<span class=hname style="flex:1">{e(x)}</span><span class="tag t-g">TOP</span>')
c2 = lst(LOWP, lambda x: f'<span class=hname style="flex:1">{e(x[0])}</span><span style="font-weight:700;color:#1a73e8">₹{x[1]:,}</span>')
c3 = lst(AIRPORT, lambda x: f'<span class=hname style="flex:1">{e(x[0])}</span><span class="tag t-b">{x[1]}</span>')
body = f'<div class=grid style="grid-template-columns:repeat(3,1fr);align-items:start"><div class=card><h3 style="margin-bottom:6px">🏆 Best Hotels</h3><div class=mini style="margin-bottom:6px">Top 5 by rank</div>{c1}</div><div class=card><h3 style="margin-bottom:6px">💰 Low Price</h3><div class=mini style="margin-bottom:6px">Top 5 starting rates</div>{c2}</div><div class=card><h3 style="margin-bottom:6px">✈️ Near Airport</h3><div class=mini style="margin-bottom:6px">Closest to Veer Savarkar airport</div>{c3}</div></div><div class=card style="margin-top:18px;text-align:center" ><span class="btn ghost">✏️ Edit rankings</span></div>'
pages["07_top_rankings"] = page("rank", "Top Rankings", "Top 5 best hotels · Top 5 low price · Top 5 near airport", body)

# 08 ADDON
def tl(names, tone):
    return "".join(f'<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1f3f4"><span class=hname>{e(n)}</span><span class="tag {tone}">from ₹{lo(n):,}</span></div>' for n in names)
body = f'<div class=card style="margin-bottom:18px;display:flex;gap:12px"><span class="btn">All extra benefits</span><span class="btn ghost">🌊 Sea view</span><span class="btn ghost">🏊 Pool</span><span class="btn ghost">Both</span></div><div class=grid style="grid-template-columns:1fr 1fr;align-items:start"><div class=card><div style="display:flex;justify-content:space-between;margin-bottom:6px"><h3>🌊 SEA VIEW</h3><span class="tag t-b">{len(SEA)}</span></div>{tl(SEA,"t-b")}</div><div class=card><div style="display:flex;justify-content:space-between;margin-bottom:6px"><h3>🏊 POOL</h3><span class="tag t-b">{len(POOL)}</span></div>{tl(POOL,"t-g")}</div></div>'
pages["08_sea_view_pool"] = page("addon", "Sea View & Pool", "Extra benefits search — find hotels by facility", body)

# 09 MANAGE
rows = "".join(f'<tr><td>{e(c)}</td><td class=num>{a or "—"}</td><td class=num>{b or "—"}</td><td class=num>{m or "—"}</td><td class=num>{p or "—"}</td><td style="text-align:right"><span class="tag t-n">✏️</span> <span class="tag t-n">🗑</span></td></tr>' for c, a, b, m, p in H["SYMPHONY"]["rooms"])
body = f"""<div class=card style="margin-bottom:18px;display:flex;gap:12px;align-items:center"><div class=lbl style="margin:0">Editing</div><div class=inp style="width:340px;font-weight:600">SYMPHONY ▾</div><span class="btn ghost">+ Add new hotel</span><span style="flex:1"></span><span class="btn">💾 Save changes</span><span class="btn red">Delete hotel</span></div>
<div class=grid style="grid-template-columns:1fr 1.5fr;align-items:start"><div class=card><h3 style="margin-bottom:14px">Hotel details</h3>
<div class=lbl>Hotel name</div><div class=inp style="margin-bottom:12px">SYMPHONY</div><div class=lbl>Mobile no</div><div class=inp style="margin-bottom:12px">{H['SYMPHONY']['mobile']}</div>
<div class=lbl>Email ID</div><div class=inp style="margin-bottom:12px">{H['SYMPHONY']['email']}</div><div class=lbl>Address</div><div class=inp style="margin-bottom:12px">{H['SYMPHONY']['addr']}</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px"><div><div class=lbl>Star</div><div class=inp>5 ★</div></div><div><div class=lbl>Sea view</div><div class=inp>Yes</div></div><div><div class=lbl>Pool</div><div class=inp>Yes</div></div></div></div>
<div class=grid style="align-content:start"><div class=card><div style="display:flex;justify-content:space-between;margin-bottom:10px"><h3>Room categories</h3><span class="btn gold" style="padding:7px 14px">+ Add room</span></div>
<table><tr><th>CATEGORY</th><th style="text-align:right">EP</th><th style="text-align:right">CP</th><th style="text-align:right">MAP</th><th style="text-align:right">AP</th><th></th></tr>{rows}</table></div>
<div class=card><div style="display:flex;justify-content:space-between;margin-bottom:10px"><h3>Extra rates / add-ons</h3><span class="btn gold" style="padding:7px 14px">+ Add item</span></div>
<table>{"".join(f'<tr><td>{e(a)}</td><td class=num>₹{p:,}</td><td style="text-align:right"><span class="tag t-n">✏️</span> <span class="tag t-n">🗑</span></td></tr>' for a,p in H["SYMPHONY"]["addons"][:6])}</table><div class=mini style="margin-top:8px">+ 4 more items…</div></div></div></div>"""
pages["09_manage_hotels"] = page("manage", "Manage Hotels", "Add a new hotel or change rates — replaces the empty NEW1–NEW4 sheets", body)

# 10 COMPANY
people = [("PANDI SELVAM", "7679972443"), ("PARAMESHWARAN", "7063904232"), ("P SNEHA", "9679547217"), ("VAITHISWARI", "9531841566")]
pc = "".join(f'<div class=card style="padding:18px;text-align:center"><div class=badge style="width:56px;height:56px;font-size:20px;margin-bottom:10px">{n[0]}</div><div class=hname>{n}</div><div class=mini style="margin-top:4px">📞 {p}</div></div>' for n, p in people)
body = f"""<div class=card style="background:linear-gradient(120deg,#1a73e8,#4285f4);color:#fff;padding:30px 34px;margin-bottom:18px"><div style="font-size:12px;letter-spacing:1.5px;color:#d2e3fc">SHOP NAME</div><h2 style="font-size:30px;margin:4px 0 16px">MAGIC MEMORIES TOURS AND TRAVELS</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px"><div><div style="color:#d2e3fc;font-size:12px">ADDRESS</div>Macca Pahad, Teylarabad</div><div><div style="color:#d2e3fc;font-size:12px">OFFICE CONTACT NO</div>7063877217</div><div><div style="color:#d2e3fc;font-size:12px">EMAIL ID</div>magicmemoriestoursandtravels@gmail.com</div></div></div>
<h3 style="margin-bottom:12px">Team</h3><div class=grid style="grid-template-columns:repeat(4,1fr)">{pc}</div>"""
pages["10_company_info"] = page("company", "Company Info", "Shop details and team contacts (shown on every shared rate card)", body)


# 11 NEW HOTEL ENTRY
def stepper(active):
    st = ["Hotel & Contact", "Room Rates", "Add-ons / Extra", "Classification", "Review"]
    out = '<div class=card style="display:flex;padding:16px 24px;margin-bottom:18px;align-items:center">'
    for i, t in enumerate(st):
        done = i < active; cur = i == active
        col = "#34a853" if done else ("#1a73e8" if cur else "#dadce0")
        out += f'<div style="display:flex;align-items:center;gap:10px;{"flex:1" if i<len(st)-1 else ""}"><div class=badge style="background:{col};color:#fff;width:30px;height:30px;font-size:13px">{"✓" if done else i+1}</div><div style="font-size:13.5px;font-weight:{600 if cur else 500};color:{"#202124" if (cur or done) else "#9aa0a6"};white-space:nowrap">{t}</div>{"<div style=flex:1;height:2px;background:"+("#34a853" if done else "#e8eaed")+";margin:0 12px></div>" if i<len(st)-1 else ""}</div>'
    return out + '</div>'

def eroom(c, tr, ep, cp, mp, ap):
    return f'<tr><td>{ein(c,"270px")}</td><td>{ein(tr,"80px","right")}</td><td>{ein(ep,"90px","right")}</td><td>{ein(cp,"100px","right")}</td><td>{ein(mp,"90px","right")}</td><td>{ein(ap,"90px","right")}</td><td><span class="tag t-n">🗑</span></td></tr>'
rooms = eroom("DELUXE ROOM","10","—","4,800","—","—") + eroom("SUPER DELUXE ROOM","8","—","5,600","7,100","8,600") + eroom("SUITE ROOM","4","—","7,200","—","—")
chk = lambda t, ok: f'<div style="display:flex;gap:10px;padding:8px 0;align-items:center;font-size:14px"><span class=badge style="width:22px;height:22px;font-size:12px;background:{"#34a853" if ok else "#dadce0"}">{"✓" if ok else ""}</span><span style="{"" if ok else "color:#80868b"}">{t}</span></div>'
body = stepper(1) + f"""<div class=grid style="grid-template-columns:1.6fr 1fr;align-items:start"><div class=grid style="align-content:start">
<div class=card><div style="display:flex;justify-content:space-between;margin-bottom:14px"><h3>HOTEL NAME &amp; PERSONAL ID</h3><span class="tag t-g">Sample data</span></div>
{fld("Hotel name", "SAMPLE BAY RESORT")}<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">{fld("Mobile no", "9999900000, 03192-000000")}{fld("Email ID", "reservations@samplebay.com")}</div><div style="margin-top:12px">{fld("Address", "Corbyn's Cove")}</div></div>
<div class=card><div style="display:flex;justify-content:space-between;margin-bottom:12px"><h3>CATEGORY · ROOM RATES</h3><span class="btn ghost" style="padding:7px 16px">+ Add room category</span></div>
<table><tr><th>CATEGORY</th><th style="text-align:right">TOTAL ROOMS</th><th style="text-align:right">EP</th><th style="text-align:right">CP</th><th style="text-align:right">MAP</th><th style="text-align:right">AP</th><th></th></tr>{rooms}</table>
<div class=mini style="margin-top:10px">Leave a plan empty if the hotel does not offer it — it will show “—”, same as the Excel sheets.</div></div>
<div class=card><div style="display:flex;justify-content:space-between;margin-bottom:12px"><div style="display:flex;gap:12px;align-items:center"><h3>Add-on / Extra</h3>{seg(["ADD ON BENEFITS","EXTRA RATE"],0)}</div><span class="btn ghost" style="padding:7px 16px">+ Add item</span></div>
<div style="display:grid;grid-template-columns:1fr 160px 40px;gap:10px;align-items:center">{ein("Extra mattress per person")}{ein("₹ 1,500","100%","right")}<span class="tag t-n">🗑</span>{ein("Flower bed decoration")}{ein("₹ 3,000","100%","right")}<span class="tag t-n">🗑</span>{ein("Candle light dinner")}{ein("₹ 4,500","100%","right")}<span class="tag t-n">🗑</span></div></div>
<div class=card><h3 style="margin-bottom:12px">Classification <span class=mini style="font-weight:400">(decides which lists the hotel appears in)</span></h3>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">{fld("Star","4 ★ ▾")}{fld("Sea view","Yes ▾")}{fld("Pool","No ▾")}{fld("Price range","4100 TO 5000 + 5100 TO 10000 (auto)")}{fld("Near airport (km)","6 KM")}{fld("Top-5 Best Hotel","No ▾")}</div></div></div>
<div class=grid style="align-content:start;position:sticky"><div class=card><h3 style="margin-bottom:6px">Entry progress</h3><div style="display:flex;align-items:center;gap:12px;margin:8px 0 12px"><div style="flex:1;height:10px;background:#e8eaed;border-radius:6px"><div style="width:86%;height:10px;background:#34a853;border-radius:6px"></div></div><b>86%</b></div>
{chk("Hotel name",True)}{chk("Mobile, email, address",True)}{chk("At least 1 room category with a rate",True)}{chk("Add-on / extra rates",True)}{chk("Star, sea view, pool",True)}{chk("Near-airport distance (optional)",True)}{chk("Review & confirm",False)}</div>
<div class=card style="background:#e8f0fe"><h3 style="color:#1967d2;margin-bottom:6px">Entry complete?</h3><div class=mini style="margin-bottom:14px;color:#1967d2">Press the button to add this hotel everywhere — dropdowns, price range, star, sea view, pool and counts.</div>
<span class="btn" style="display:block;text-align:center">🔄 Review &amp; Update All Hotels →</span><div style="height:10px"></div><span class="btn ghost" style="display:block;text-align:center">💾 Save as draft</span></div></div></div>"""
pages["11_new_hotel_entry"] = page("new", "New Hotel Entry", "Same format as every hotel sheet — fill it once, it appears everywhere", body, "Step 2 of 5")

# 12 UPDATE ALL HOTELS
def upd(title, desc, before, after, on=True):
    return f'<div style="display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid #f1f3f4"><div style="width:22px;height:22px;border-radius:6px;background:{"#1a73e8" if on else "#fff"};border:2px solid {"#1a73e8" if on else "#dadce0"};color:#fff;font-size:14px;text-align:center;line-height:18px">{"✓" if on else ""}</div><div style="flex:1"><div class=hname>{title}</div><div class=mini>{desc}</div></div><div style="text-align:right;font-size:13px;white-space:nowrap"><span style="color:#80868b">{before}</span> <b style="color:#34a853">→ {after}</b></div></div>'
ups = (upd("Hotel list (Home &amp; Find dropdown)", "SAMPLE BAY RESORT added to the hotel name list", "17 hotels", "18 hotels") +
       upd("Hotel rate card page", "New page created with rates, contact and add-ons", "—", "1 new page") +
       upd("All Hotels page &amp; Dashboard counts", "Card added · total hotels and 4★ count updated", "17 · 2 (4★)", "18 · 3 (4★)") +
       upd("Price range: ₹4,100 – ₹5,000", "DELUXE ROOM ₹4,800 added", "7 rows", "8 rows") +
       upd("Price range: ₹5,100 – ₹20,000", "SUPER DELUXE ₹5,600 · SUITE ₹7,200 added", "44 rows", "46 rows") +
       upd("Star category: 4 STAR", "Added under 4 STAR HOTELS", "2 hotels", "3 hotels") +
       upd("Sea view list", "Facility = Yes", "9 hotels", "10 hotels") +
       upd("Pool list", "Facility = No — nothing to add", "6 hotels", "6 hotels", False) +
       upd("Top rankings", "Low-price Top 5 recalculated from rates · airport list 6 KM (not in top 5)", "no change", "no change"))
body = stepper(4) + f"""<div class=grid style="grid-template-columns:1.6fr 1fr;align-items:start"><div class=card><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><h3>These pages will be updated</h3><span class="mini">Untick anything you do not want to change</span></div>{ups}</div>
<div class=grid style="align-content:start"><div class=card><div class=lbl>New hotel</div><h2 style="font-size:20px;margin-bottom:12px">SAMPLE BAY RESORT</h2><table><tr><td>Star</td><td class=num>4 ★</td></tr><tr><td>Starting rate</td><td class=num>₹4,800</td></tr><tr><td>Rooms</td><td class=num>3 categories</td></tr><tr><td>Add-ons</td><td class=num>3 items</td></tr><tr><td>Sea view / Pool</td><td class=num>Yes / No</td></tr></table></div>
<div class=card style="background:#e6f4ea"><div style="display:flex;gap:12px;align-items:center"><span style="font-size:26px">✅</span><div><div class=hname style="color:#137333">No problems found</div><div class=mini style="color:#137333">Name is new · all rates are numbers · contact filled</div></div></div></div>
<div class=card><span class="btn" style="display:block;text-align:center;font-size:15px;padding:14px">🔄 Update All Hotels</span><div style="height:10px"></div><span class="btn ghost" style="display:block;text-align:center">← Back to edit</span>
<div class=mini style="margin-top:12px;text-align:center">A backup of the current data is taken before updating, so you can undo.</div></div></div></div>"""
pages["12_update_all_hotels"] = page("update", "Update All Hotels", "Final check — add the new hotel to every list in one click", body, "Step 5 of 5")

async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        pg = await b.new_page(viewport={"width": 1440, "height": 900})
        for k, v in pages.items():
            await pg.set_content(v)
            await pg.wait_for_timeout(250)
            await pg.screenshot(path=f"{k}.jpg", type="jpeg", quality=92, full_page=True)
            print("ok", k)
        await b.close()
asyncio.run(main())
