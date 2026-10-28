# Magic Memories — complete source code and how to build it

This folder is the **whole software**, start to end. Everything can be rebuilt from it.

## What is inside

| Path | What it is |
|---|---|
| `src/app.src.html` | **The entire application** — all HTML, CSS and JavaScript in one file (pages, settings, packages, bills, PDF, WhatsApp, security…). Edit this file to change the software. |
| `data/seed.json` | The hotel data (106 hotels, rooms, rates, add-ons) put into the "with data" version. |
| `data/icons3d.json` | The 3D colour icons (Microsoft Fluent 3D, MIT licence). |
| `data/logo.txt` | Your Magic Memories logo (built in, can never be removed). |
| `build.py` | Joins the source + data into finished single HTML files. |
| `dist/andaman_hotel_rates.html` | Finished software **with** hotel data (Magic Memories). |
| `fresh/dist/andaman_hotel_rates.html` | Finished software, **empty** (Magic Memories Tours and Travels). |
| `pc/` | Windows PC app (Electron) for **Magic Memories** — `main.js` (saving files, PDF, WhatsApp auto-send, software name/icon, zoom), `preload.js`, `package.json`, `prepare_app.py`, `build/icon.ico` + `icon.png`. |
| `fresh/pc/` | Windows PC app for **Magic Memories Tours and Travels** (empty version). |
| `tools/` | Scripts that read the original Excel workbooks. |
| `tests/` | Automatic tests (Playwright). |
| `docs/PROJECT_NOTES.md` | Full change log of every version. |

## 1. Build the HTML software (any computer with Python 3)

```
python3 build.py
```
This writes `dist/andaman_hotel_rates.html` (with data) and `fresh/dist/andaman_hotel_rates.html` (empty).
Double-click either file to use it in Chrome / Edge.

## 2. Build the Windows installer (.exe)

Needs **Node.js 18 or newer** (https://nodejs.org) and Python 3.

```
python3 build.py

cd pc
npm install
python3 prepare_app.py
npx electron-builder --win nsis --x64
```
The installer appears in `pc/dist/` → `Magic-Memories-Setup-<version>.exe`.

For the empty "Magic Memories Tours and Travels" version use `fresh/pc` instead of `pc`
(first copy `fresh/dist/andaman_hotel_rates.html` into a folder named `dist` next to `fresh/pc`,
because `prepare_app.py` reads `../dist/andaman_hotel_rates.html`):

```
cd fresh/pc
npm install
python3 prepare_app.py
npx electron-builder --win nsis --x64
```

On Windows run the same commands in Command Prompt (use `python` instead of `python3`).
On Linux/Mac, building a Windows .exe also needs Wine.

## 3. Change the version number
`pc/package.json` → `"version"` (and `ABOUT … ver:` inside `src/app.src.html` for the About page).

## 4. Use it in another software
* The finished `dist/andaman_hotel_rates.html` is fully self-contained — copy it anywhere (website, another app's web view).
* All data is stored in the browser / app under the key `andaman-hotel-rates-v1`; move data with Settings → Backup & restore.
* Inside the PC app, `window.mmpc` (from `preload.js`) gives the extra PC features; without it the software still works as a normal web page.
