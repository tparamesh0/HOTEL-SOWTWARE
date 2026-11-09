# Magic Memories — project guide for Claude Code

Owner: **Parameshwaran** (Magic Memories Tours and Travels, Port Blair, Andaman). He writes in simple English,
often from a phone, sometimes with screenshots. Reply in short, plain words; no jargon.

This repo holds **two apps** that share one Supabase database:

| App | What it is | Source | Built file | Live at |
|---|---|---|---|---|
| **Magic Memories software** (admin) | Hotel rates, packages, bills, PDFs, WhatsApp, **Customer Bookings** module. Runs as Windows PC app (Electron), Android app and web page. | `src/app.src.html` (one file: HTML+CSS+JS) | `dist/andaman_hotel_rates.html` (with hotel data), `fresh/dist/…` (empty) | Online update package on Vercel project `magic-memories-updates` (folder `ota/`) |
| **MM TravelMate** (customer app) | What travellers open with their Booking ID: day-by-day plan, cab/ferry times, messages, Done buttons, reviews. | `customer/src/app.src.html` (+ `BUILD`, `NOTES`, `logo.txt`) | `customer/web/index.html` + `version.json` | https://magic-memories-customer.vercel.app (APK: `/Magic-Memories-Customer.apk`) |

**Related repo:** the company website www.magicmemoriestour.com is `tparamesh0/Magic-Memories-Tours-and-Travels` (Next.js on Vercel, its own Supabase project `irjtdscxteefrppgsiaw`; it has its own CLAUDE.md).
The dashboard tiles 🌐 Website and 🔐 Admin Website open it.

## Owner's standing rules (always follow)
1. **Show a demo/mock-up first for new features; build after he says OK.** For corrections/bug reports he sends, just fix and publish.
2. **Never remove existing features.** Never remove the logo, company name, software name or icon.
3. **Data is never deleted for real.** Deletes are soft (`deleted_at`, `purged_at`); keep it that way.
4. **Zero bugs: test 2–3 times** (PC width 1366 and phone width 390). Run the tests below before every publish.
5. Must work on **mobile, PC and tablet** (no sideways scroll at 390 px).
6. **Never invent** credentials, phone numbers, contacts or ferry details. Placeholders like "e.g. Makruzz" are fine.
7. Every change goes to GitHub `tparamesh0/HOTEL-SOWTWARE` (branch `main`). The repo is public for now — never commit secrets/keys.
8. After publishing, tell him what changed in a few bullets and show screenshots.

## Where things are
- `src/app.src.html` — the whole admin app. The **Customer Bookings** module is the block between `/*BK-START*/` and `/*BK-END*/` (functions `bk…`, actions `A.bk…`, CSS classes `.bk-…`).
  - Editor: every day on one screen, rows `.bk-it2` = 🚕 cab time → event time; quick-add row per day + ⛴️ Ferry button.
  - `bkTimeOrder(day,id)` puts a day in time order (events without a time stay after the event before them); `bkPlaceByTime`, `bkReorder` (saves sort numbers in parallel).
  - Step-by-step timings wizard: `bkWizStart / bkWizForm / bkWizSave`, AM/PM check `bkWizCheck` (runs after typing stops).
  - Event form `bkItemForm` (kinds: `activity`, `pickup`, `ferry`); `data.nocab` = no cab; `data.cab`, `cabAt`, `cabPhoto`, vehicle, driver…; ferry: `harbour,to,name,number,arrive,report,reportAt,class,ticket,seat,status`.
  - ⋯ menu = centred popup (`bkMore` + `<template id="bk_more_t">`).
- `customer/src/app.src.html` — customer app. Key parts: `itemRow` (event card), `stateOf`, `mark` (Done is instant/optimistic, `ST.pend` keeps it during refresh), done events hidden behind the "✅ N completed · Show" bar, `.it.cur` = next event highlighted, `.it.cur.now` = happening now (glow), `cabOf/cabWatch/cabAlert` (cab-near pop-up), phone alarms, message pop-up `.mpop`.
- `build.py` → `dist/` and `fresh/dist/`. `customer/build.py` → `customer/web/`.
- `fresh/pc/` — Windows PC app (Electron). `prepare_app.py` makes `fresh/pc/app/` (needs `npm install` in `fresh/pc` once).
- `tools/make_ota.py` → `ota/android.html`, `ota/pc.html`, `ota/version.json` (online update the installed apps download).
- `tools/publish.py` — one command for a release (see Publish).
- `tests/bookings/` — Playwright tests for Customer Bookings + customer app (`node run.js`). Older tests for other pages are in `tests/`.
- `docs/PROJECT_NOTES.md` — long change log. `BUILD_GUIDE.md` — how to build installers by hand.
- `.github/workflows/` — `pc.yml` (Windows installer, on `fresh/pc/**` or `data/PC_BUILD`), `android.yml` (admin APK), `customer-android.yml` (customer APK; it pushes a commit "Customer APK build N", so `git pull --rebase` before pushing if a push is rejected).

## Backend (Supabase project `cyjaueyafftscpgviflm`)
- Admin data: `mmt_*` tables (store, members, perms, backups, devices…), `mm_data`, `mm_items`.
- Customer Bookings: `mmc_bookings` (`deleted_at`, `closed_at`, `purged_at`, `notif_cleared_at`, `active`), `mmc_days` (`lock_mode` auto/open/locked), `mmc_items` (`data` jsonb), `mmc_done`, `mmc_docs`, `mmc_feedback`, `mmc_notifs`, `mmc_settings`, `mmc_sessions`, `mmc_attempts`, `mmc_audit`.
- Customer app RPCs: `mmc_login` (Booking ID only; 60 days before → 7 days after the tour), `mmc_data`, `mmc_ver`, `mmc_mark`, `mmc_feedback_save`, `mmc_notif_read`, `mmc_notif_clear`, `mmc_logout`. Admin: `mmc_create_booking` (atomic, 3-minute duplicate guard), `mmc_autoclose`, `mmc_chan`.
- Realtime: trigger `mmc_push` sends to `mmc-<hash>` / `mmc-all`; admin software listens on channel `mmt` for `upd` (update now).
- Change the database only with migrations (Supabase MCP `apply_migration`), never destructive.

## Build & test
```
python build.py                      # admin -> dist/, fresh/dist/
python customer/build.py             # customer app -> customer/web/
cd tests/bookings && npm install && npx playwright install chromium && node run.js     # ALL PASSED expected
```
`node run.js ferry` runs only files whose name contains "ferry". Screenshots land in `tests/bookings/out/` — look at them.
Quick syntax check of the built admin file: extract each `<script>` and run `node --check`.

## Publish (every release)
1. Run the tests (above). 
2. `python tools/publish.py --ver X.Y.Z --notes "plain-words notes for the owner"` (add `--customer "notes"` if the customer app changed).
   It bumps `ABOUT ver` + `data/OTA_BUILD`, builds, prepares the PC app, makes the OTA package, commits and pushes.
3. **Deploy on Vercel** (a git push does NOT deploy): team `team_A1USqqZFyv2g6xIbc3YJY1Ws`, from GitHub `tparamesh0/HOTEL-SOWTWARE` `main`, target production:
   - `magic-memories-updates` (root `ota`) — always
   - `magic-memories-customer` (root `customer/web`) — when the customer app changed
   With the Vercel connector: `create_deployment` with `gitSource {type:github, org:tparamesh0, repo:HOTEL-SOWTWARE, ref:main}`, then check `get_deployment` = READY.
4. **Tell installed apps to update now** (Supabase SQL): `select realtime.send('{"build":N}'::jsonb,'upd','mmt',false)` with the new build number.
5. Customer app updates itself from `version.json`; the customer APK is rebuilt by GitHub Actions automatically.

## Version history (latest)
- 2.9.0 (318) / customer 11: whole-day time order, AM/PM check after typing, instant saves; customer: done events tuck away, next event pops up, current event glows, instant Done.
- 2.8.9 (317) / customer 10: ferries (per day, after an event, from ferry list, full details, cab to the jetty).
- 2.8.8 (316): ⋯ menu popup on phones, timings asked in package order, cab on/off per event, Undo fixed.
Older: see `docs/PROJECT_NOTES.md` and `git log`.

## Open ideas the owner was offered (not started)
- Alerts when the customer app is fully closed (Firebase; he must provide `google-services.json` + a service-account key).
- Security hardening (rate-limit the owner setup code, leaked-password protection), strip rates from the downloadable build, make the GitHub repo private again once all devices are on ≥ 2.8.0.
