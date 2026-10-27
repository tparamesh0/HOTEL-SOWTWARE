"""Build dist/andaman_hotel_rates.html (Magic Memories, with data) and fresh/dist (Hotel Rate Software, empty)
from src/app.src.html + data/seed.json + data/icons3d.json (Microsoft Fluent 3D icons, MIT licence)"""
import pathlib
r=pathlib.Path(__file__).parent
src=(r/'src/app.src.html').read_text(encoding='utf-8')
seed=(r/'data/seed.json').read_text(encoding='utf-8').strip()
icons=(r/'data/icons3d.json').read_text(encoding='utf-8').strip()
assert '/*__DATA__*/[]' in src and '/*__ICONS__*/{}' in src
src=src.replace('/*__ICONS__*/{}',icons,1)
(r/'dist').mkdir(exist_ok=True)
(r/'dist/andaman_hotel_rates.html').write_text(src.replace('/*__DATA__*/[]',seed,1),encoding='utf-8')
f=src
for a,b in [('Andaman Hotel Rates</title>','Hotel Rate Software</title>'),("(o.file||'Magic-Memories')","(o.file||'Hotel-Rates')"),('Documents › Magic Memories › Documents','Documents › Hotel Rate Software › Documents'),("dlFile('Magic-Memories-backup-'","dlFile('Hotel-Rates-backup-'"),("dlFile('Magic-Memories-'+(d===1","dlFile('Hotel-Rates-'+(d===1"),('e.g. D:\\\\Magic Memories\\\\Bills','e.g. D:\\\\Hotel Rates\\\\Bills')]:
    assert a in f,a
    f=f.replace(a,b)
(r/'fresh/dist').mkdir(parents=True,exist_ok=True)
(r/'fresh/dist/andaman_hotel_rates.html').write_text(f,encoding='utf-8')
print('built dist/ and fresh/dist/')
