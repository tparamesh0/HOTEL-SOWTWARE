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
