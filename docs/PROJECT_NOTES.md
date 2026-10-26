# Project notes — Andaman Hotel Rate Software

Owner: Parameshwaran, Magic Memories Tours and Travels, Port Blair.

## Source data
Excel workbooks HIGH_CLASS (Port Blair), MID_CLASS, LOW_CLASS, HAVELOCK, NIEL. Combined into one dataset; the user chooses
High / Mid / Low himself (Havelock and Neil start unclassified).

## Features built (current)
* Island tabs (Port Blair, Havelock, Neil) + Class filter (All / High / Mid / Low / Unassigned): the whole app is scoped to the choice.
* Dashboard (round company logo, class bars, stats), All Hotels, Hotel Details (share text, Customize view, Edit in place).
* Find / Search: filters for name, price, plan (EP/CP/MAP/AP/BP/custom, any/all), star, facilities; cards open the hotel.
* Price Range: band cards + plan/star/facility/sort filters, cards or table view.
* Star Category, Facility Lists, Classify Hotels (bulk + suggest by price).
* Top Rankings: Auto (analysis of star, facilities, rooms, add-ons, class, price, distance) or Manual (add/remove/reorder).
* New Hotel Entry: one page, rooms with EP/CP/MAP/AP/BP (+custom) rates, add-ons (custom dropdown, no auto-rate),
  multiple mobile numbers/emails, facility checkboxes, live "Ready to submit?" checklist, validation messages.
  Submit saves immediately; Update All Hotels page shows where the hotel now appears.
* Settings: colours/theme/dark mode, fonts, name & logo, plan types (add/delete), room categories, add-on items,
  text format (CAPITAL/small/Title/As typed), facilities (emoji picker), classes, islands, star, price ranges,
  rankings mode, backup/restore, CSV export, PIN.
* Company Info: edit details inline, extra contacts with photos, tap contact opens WhatsApp (wa.me).
* Back button on every page; responsive (phone/tablet/desktop).

## Decisions
* Website (single HTML file), data in localStorage. Port Blair is a third island tab.
* SP = special plan types added by the user. Low-price ranking computed from rates.

## Workflow
Edit `src/app.src.html` → `python3 build.py` → commit `src/` and `dist/`.

## Change log
* v1 sample → back button, edit-save fix with error messages, edit stays on details page, multi mobile/email,
  BP plan, filter-based Find, Auto/Manual rankings, price-range redesign, text-format setting, emoji picker,
  plan delete, logo, immediate submit, Company Info editor with WhatsApp.
* Packages page (under Dashboard in the menu): "Tour Packages" heading + small duration dropdown
  (1 Night 2 Days … 7 Nights 8 Days). Settings → Package settings: longest package (days), rebuild list,
  add/remove duration options. Rest of the page intentionally empty until the next instructions.
* Package Settings moved out of the Settings submenu to its own item under Settings in the left menu.
* Packages page: choosing a duration shows one large empty box per day (nights + 1), labelled "Day N" (content to come).
* Package Settings has two tabs: "Duration options" and "Day tab". Day tab = 10 buttons (Day 1 … Day 10), each opens an empty page.
* Packages page: each Day box has a large + in the middle; tapping it opens Package Settings → Day tab → that Day's page.
* Package Settings → Day tab → Day 1 holds "PACKAGE 1" (Trip Price ₹2,650, Entry & ticket ₹410, Total auto = ₹3,060,
  Stops 1-6: Airport Pickup, Cellular Jail, Corbyn's Cove Beach, Shivan Statue, Flag Point, Light & Sound Show).
  Everything editable (Edit/Done, add/remove stops, total recalculates). Other days still empty.
* Cart "+" icon on the package box: pastes it into the matching Day box on the Packages page (for the duration selected there)
  and jumps to that page. The Day box shows the package live (edits flow through); "Change" / "✕" on the box.
  Data keys: settings.pkgDays[day][i], settings.pkgPicks[nights][day] = package index.
- Packages page: compact 3-column grid so 6 days fit on one screen without scrolling (1366×768, 1440×900, 1920×1080).
- Package Settings Day tab: loaded packages from Andaman_Tour_Ideas.xlsx (Day 1: 11, Day 2: 8, Day 3: 6; empty template packages skipped), added Notes field, cards in a grid. Days 4-5 have data in the Excel but are not loaded yet.
- Fixed: Excel packages not showing for browsers with old saved data (migration now checks seed flag before merging defaults). Added Day 4 (8 packages).
- Day tab: ＋ box on every Day page (1-10) adds a new empty package in edit mode (live total); Delete button (tap twice) in edit mode.
- Packages page: boxes auto-fit content (no empty space); Change edits the package in place; packages added via cart are independent copies (edits don't touch Day tab; old saved picks migrated to copies).
- Packages page: big Tour cost summary card under the day boxes (per-day trip/tickets/total + grand total, live). Package price fields now update totals as you type.
- Find/Search: Add-to-cart on every hotel card (pick room + plan rate), Cart button top-right (all islands kept, removable). Packages: 'Hotels for this tour' card with Add hotels from cart (moves cart items, grouped by island, Remove each).
- Packages hotels: per-hotel nights stepper (−/＋), amount = rate × nights; hotels total added into Tour cost summary grand total (all islands).
- Tour cost summary now packages only (Package total); hotel total shown only in the Hotels card.
- Packages page: Grand total card at bottom (package total + hotel total), live.
- Package Settings: Ferry tab (12 tickets as cards, edit/delete/add). Packages page: Ferry tickets card (＋ opens Ferry tab in pick mode, tick cards to add, ticket qty stepper, remove); Grand total now packages + hotels + ferry. Assumed #1 = Port Blair to Havelock 1300 and #4 = 700.
- Packages page: Commission card (₹ or %) above Grand total (added to total); Clear + Undo buttons (undo stack for clear and removes); labelled Remove on day packages and in summary rows.
- Packages: Save to PDF / Send to WhatsApp / Print (A4) / Preview; Quotation vs Invoice (Tally-style A4 layout, amount in words, GSTIN + bank in Company Info); persons stepper (+1 person multiplies total); commission shown to customers as 'Tax amount + GST included'.
- Share card now has two sets: Agent (itemised prices) and Customer (itinerary/hotels/ferry, no prices, only overall total package amount), each with Save to PDF / WhatsApp / Print A4 / Preview.
- Package Settings: new 'Bill details' tab — on/off switches (company header, document info, tour details, prices, footer) separately for Agent and Customer bills; docs and WhatsApp text follow the settings. Customer defaults: logo, hotel, ferry, prices OFF.
- Bills: itinerary stops now bullet points one below another (preview/PDF/print/WhatsApp); Bill details switch 'Show stops as bullet points' (off = one line with arrows).
- Package Settings: Complimentary tab (10 sample free items, add/edit/delete). Packages page: Complimentary card (＋ opens tab in pick mode), shown at bottom of Agent/Customer bills and WhatsApp as free from our side; switch in Bill details.
- Packages: Save package button at bottom -> Admin > Package History page (customer name, nights/days tag highlighted for 2/3-day, persons, total; Edit reopens exact saved tour, Quick print, Invoice, Delete). Quick Agent/Customer 'show complimentary on bill' pills on the Complimentary card.
- Hotels pick-mode (empty cart → Find → Done back to Packages); travel-date on/off toggle; editable GSTIN, company, bank, terms, validity, declaration, signature, logo in Bill details; collapsible pinnable Hotels sidebar group; big Packages button on Dashboard.
- Day tab count follows longest duration (nights+1); optional ferry/complimentary photos (Package Settings switches); Packages page remembers scroll position when leaving/returning.
- Dashboard: removed 'no class' alert; tiles under collapsible Hotels heading with pin.
- Ferry departure time with circular 12-hour clock picker (hour → minute → AM/PM); shown on card and on Packages ferry rows.
- Bill fix: logo now on by default for Customer bill (one-time migration turns it on); closed bottom border of terms/signature box.
- Bill: logo size −/＋ (30–140px), digital signature image upload, payment QR upload (prints beside bank details); switches in Footer group.
- 4 new bill designs (Navy & Amber, Sunrise Blue, Tour Quote Teal, Green & Yellow) + Classic Tally; default chooser and previews in Bill details; per-bill design select on Packages; ⚙️ Settings shortcut next to Clear.
- Packages: 1 Night 2 Days selected by default when nothing chosen; smaller Clear/Undo/Settings/History buttons, History shortcut.
- Settings → Backup: export/import all data as a file (with confirm), Excel export (Hotels, Package History summary, optional sheet per package, Day packages, Ferry & Complimentary) via SheetJS; History entry 📊 Excel; trip total colour pill (green/yellow/red) with font/size/threshold settings in Day tab; smaller Dashboard Tour Packages button.
- Change tracking (S.mt per hotel/history/ferry/comp/day/setting, deletions as negative time); 1-day (or 2/3/7-day) changes export; import compares and only adds new/changed, skips identical, keeps newer local edits, applies deletions; summary before import.
- Day page filter bar: sort by rate, colour (low/medium/high), name chips built from current package names, search.
- New Dashboard (hero with big animated logo ring, greeting/clock, quick actions, count-up KPIs, recent packages, popular durations, hotels by island); no hotel selector/island bar on Dashboard. Island always resets to Port Blair when leaving hotel pages, on back to non-hotel pages and on reload.
- Live 12h clock with seconds; Company Info team 📤 Send package (WhatsApp, agent/customer, multi-select); sounds (WebAudio, 4 styles, volume, per-event toggles in Settings → Sounds); customer profile per history entry (photo, contact, status, source, notes); design switcher strip in every preview/print (packages, history quick print/invoice, bill preview); quotation/invoice number settings (prefix, separator, digits, FY toggle, next number).
- History: ⚡ Quick edit (duplicate package for a new customer) and 💬 WhatsApp (send as text via wa.me, or as PDF via html2canvas+jsPDF with Web Share on phones / download + open chat on desktop). Package boxes: new 'Hotel Place' row above Trip Price everywhere; Hotel place filter chips on Day pages; Excel Day Packages column.
- Team 📤 Send package: choose Text/PDF, Quotation/Invoice, Agent/Customer, design; multi-package PDF (one bill per page) shared/downloaded + chat opened.
- ⧉ Duplicate on Day package boxes (exact copy inserted after) and on History cards (copy with '(copy)' name, new bill number).
- History cards: Edit + WhatsApp + '⋯ Options ▾' dropdown (profile, quick edit, duplicate, WhatsApp, print/PDF, invoice, Excel, delete). Modal closes on outside tap only when the press started outside (fixes forms closing on drag/select); profile & quick edit forms never close on outside tap. Quick edit travel-date on/off switch.
- Tap a History card → full agent-view detail window (customer, days with place/trip/tickets/stops, hotels, ferry, tax, complimentary, notes, per-person and total) with ✕ / Close and Edit.
- Full audit (tests/audit.js): every page, settings section, package-settings tab and island at 1366px, 400px and dark mode, plus click-through of every safe button and pop-up — 0 errors, 0 overflow. Fixed: trip price pill size in compact Packages grid.
- PC software (pc/): Electron 31 wrapper, offline fonts + Excel/PDF libraries, Magic Memories icon, NSIS Windows installer (Magic-Memories-Setup-1.0.0.exe, desktop + Start-menu shortcut). Build: cd pc && npm install && python3 prepare_app.py && npm run dist (Linux needs wine + wine32).
- Online sync (Supabase): table mm_data (user_id,k,v,t,del,dev) with RLS + realtime; per-item newest-wins using change tracking; offline queue; Settings → ☁️ Online sync (URL, anon key, email login, sync now, send all, log out); sidebar status chip. Phone web app in docs/ (GitHub Pages PWA, web/build_web.py). PC 1.1.0 bundles supabase-js locally.
- Online sync REMOVED at user's request (back to the pre-sync software). PC 1.2.0 = same as 1.0.0 features, installs over 1.1.0.
- v1.3.0: Ferry name field (card order: ferry name, photo, route, price, time); Ferry tab filter (search, ferry name, timing slot, sort price/time) + drag-and-drop order (◀▶ in edit for touch); Complimentary price + Free/Paid (free = struck price + FREE, paid = price + PAID; display only, not added to totals); Settings → Use photos library, photo chooser (PC or library) for every photo, auto-save uploads to library; ferry photo crop 16:9; Day page ‹ prev / next › buttons; new 'Add' tour button; Find/Search ⭐ bucket list (☆ on cards, add by name, add-to-cart) also on Packages Hotels card; Packages ferry & complimentary shown as cards; Card sizes (tour day cards, Day boxes, ferry, complimentary) in Package Settings → Duration options.
- v1.4.0: Customers section in Company Info (auto-saved from saved packages/quick edit by phone or name, edit/photo/delete/search, 📤 Send package with their packages pre-selected); Day tab edit opens one box only; ＋ Add day next to duration (moves all data to next duration, nothing lost); Dashboard 💾 Save button; per-person coverage (Person 2+ ⚙️ choose covered items; bill line quantities and totals follow); bucket list Done adds hotels straight to the tour; crop step for every photo (logo/team/customer/profile 1:1, signature 5:2, QR 1:1, ferry/complimentary 16:9).
- v1.4.1: − Remove day next to ＋ Add day (moves data to the shorter duration; asks a second tap if the last day has a package; disabled at 1 Night 2 Days).
- v1.4.2: Day tab 🧺 package bucket — tap 🧺 on any package box, then on another Day page Copy all / Move all here (bucket bar shows count, View, Empty). Duplicate button shown as ⧉ icon to keep buttons on one line.
- v1.4.3: Day page boxes redesigned — Select checkbox + 'Add to tour' on top, roomy footer (Edit · Duplicate · Bucket · Delete); selection bar with Select all, Put in bucket, Duplicate, Delete selected (two-tap), Clear.
- v1.4.4: Packages page — tap a day card (or Day link in the summary) to open a Day preview sheet (price, trip/ticket split, places, notes, per-person amounts, prev/next, Change). Per-person: main 'Remove trip charge' switch + per-day trip-charge toggles; bills split into 'entry & tickets only' lines.
- v1.4.5: Person coverage window back to full layout — Day packages, Hotels, Ferry tickets, Tax always shown; trip charge is an extra: one 'Trip charge for Person N' switch inside Day packages plus a small per-day trip-charge chip.
- v1.5.0: Auto capital first letter of every word while typing (all text boxes; skips email/phone/prices/codes/search) with on/off in Settings → Text format; ✨ 1 Fix buttons (Day tab filter, Ferry filter, Complimentary, Bill details text, All Hotels) capitalise first letters of saved text without lowering anything.
