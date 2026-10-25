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
