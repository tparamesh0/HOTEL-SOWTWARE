# Andaman Hotel Rate Software (Magic Memories Tours and Travels, Port Blair)

A single-page website that turns the HIGH / MID / LOW class hotel rate Excel workbooks
(Port Blair, Havelock, Neil Island) into software. 106 hotels, 347 room categories, 665 add-on rates.

* `src/app.src.html` – the whole app (HTML + CSS + vanilla JS). **Edit this file.** It contains the placeholder `/*__DATA__*/[]`.
* `data/seed.json` – compact hotel data embedded into the app (generated from the Excel files).
* `build.py` – `python3 build.py` injects the seed into the source and writes `dist/andaman_hotel_rates.html` (open in any browser).
* `dist/andaman_hotel_rates.html` – the finished single file.
* `tools/` – scripts that read the .xlsm workbooks (`xl.py`, `extract.py`, `combine.py`).
* `data/` – combined dataset (xlsx/json) of all hotels.
* `mockups/` – scripts that generated the page mock-up images.
* `docs/PROJECT_NOTES.md` – what has been built, decisions, and the change log.

Data entered in the app is saved in the browser (localStorage key `andaman-hotel-rates-v1`);
use Settings → Backup & Restore to keep a copy.
