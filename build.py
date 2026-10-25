"""Build dist/andaman_hotel_rates.html from src/app.src.html + data/seed.json"""
import pathlib
r=pathlib.Path(__file__).parent
src=(r/'src/app.src.html').read_text()
seed=(r/'data/seed.json').read_text().strip()
assert '/*__DATA__*/[]' in src
(r/'dist').mkdir(exist_ok=True)
(r/'dist/andaman_hotel_rates.html').write_text(src.replace('/*__DATA__*/[]',seed,1))
print('built dist/andaman_hotel_rates.html')
