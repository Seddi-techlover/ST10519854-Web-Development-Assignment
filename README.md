# Revive Thrift Co. — Website

A multi-page website for **Revive Thrift Co.**, a fictional thrift store in Braamfontein,
Johannesburg, selling affordable vintage and second-hand clothing.

Built for the **Web Development (WEDE5020)** module, Group 2, at Rosebank International (The IIE).

| | |
|---|---|
| **Student** | Lesedi Reabetsoe Tsutsubi |
| **Student number** | ST10519854 |
| **Module** | WEDE5020 — Web Development |
| **Live site (Netlify)** | https://thrift-revive-co.netlify.app/ |
| **Repository** | https://github.com/Seddi-techlover/ST10519854-Web-Development-Assignment |

---

## The store

Braamfontein previously had a well-known thrift store that has since closed. This project
imagines a new business stepping into that gap and gives it the online presence the old
store never had — a browsable catalogue, a photo gallery, a findable location, and a way to
ask about stock before travelling in.

**Audience:** students and young professionals in Braamfontein looking for affordable,
quality second-hand and vintage fashion.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, searchable/filterable catalogue, story, location and contact teasers |
| `about page.html` | About the store and the project: who built it, who it's for, why it exists |
| `gallery page.html` | Photo gallery of all 13 catalogue pieces with a lightbox slideshow |
| `location page.html` | Address, trading hours, contact details and an interactive Leaflet map |
| `enquiry page.html` | Stock/sizing/custom/bulk enquiry form with a dynamic response per enquiry type |
| `contact page.html` | General contact form, Google Map, in-store photos and an FAQ accordion |

---

## Features

**Catalogue**
- 13 items across 7 categories, each tagged New In or Rare Find with a from-price
- Keyword search matching item name, category and hidden keywords (so "sneaker" finds the footwear)
- Category filter chips that combine with the search term rather than overriding it
- Live result count in an `aria-live` region, plus an empty state that links to the enquiry page

**Gallery, lightbox and slideshow**
- Dedicated gallery page with all 13 photos in a responsive grid
- Clicking any image opens it full-size in a lightbox overlay
- Previous/next buttons, left/right arrow keys and touch swipe move through the images,
  wrapping around at both ends, with a caption and an "n / total" counter
- On the home page the slideshow only includes the pieces left visible by the search/filter
- Closes with the × button, a click outside the image, or Escape

**Interactive**
- Live date and time in the footer of every page, updated every second
- FAQ accordion on the contact page, one item open at a time, animated height transition
- Leaflet map on the location page with a marker and popup (OpenStreetMap tiles, no API key)
- Google Map embed on the contact page (iframe from Google Maps)
- Hover and click transitions on buttons and product cards

**Forms**
- JavaScript validation with inline error messages: name, email format, SA phone format,
  subject, message length, enquiry type and item
- Submitted with `fetch()` to **Netlify Forms** — no page reload, a "Sending..." state on the
  button, success and error messages in place, a 10-second timeout and a honeypot field
  against bots
- Every submission is stored in the Netlify dashboard and emailed to the site owner as a
  notification, so no email address appears in the public code
- Dynamic enquiry response tailored to the selected enquiry type

**SEO**
- Unique keyword-led titles, meta descriptions, keywords, author, robots and canonical tags
- Open Graph and Twitter/X card tags for link previews
- JSON-LD `ClothingStore` structured data on the home page
- Descriptive alt text on every image
- `robots.txt` and `sitemap.xml`

---

## Tech stack

- **HTML5** — semantic structure, one `<h1>` per page
- **CSS3** — external stylesheet, CSS custom properties for the colour palette, flexbox
  layouts, media queries for mobile
- **Vanilla JavaScript** — no frameworks; DOM APIs, `fetch()`, `AbortController`, `Intl` date formatting
- **Leaflet 1.9.4** (CDN) — interactive map
- **Google Maps embed** — map on the contact page
- **Netlify Forms** — form storage and email notifications
- **Netlify** — free hosting

Palette: mustard `#d9a441`, forest green `#2f4a2c` / `#22361f`, cream `#f5f0e6`.
Display type: Bebas Neue (Google Fonts).

---

## Project structure

```
ST10519854-Web-Development-Assignment/
├── index.html            Home
├── about page.html       About
├── gallery page.html     Gallery + lightbox slideshow
├── location page.html    Location + Leaflet map
├── enquiry page.html     Stock enquiry form
├── contact page.html     Contact form, Google Map, photos, FAQ
├── robots.txt
├── sitemap.xml
├── CSS/
│   └── style.css         All styling
├── JavaScript/
│   └── script.js         Lightbox/slideshow, accordion, validation, form sending, catalogue filter, footer clock
├── Images/               Store photography and logo
├── Documents/            Written project proposal
├── PART3-NOTES.md        Implementation notes for the Part 3 features
└── README.md             This file (includes the change log and references)
```

## Running it locally

No build step and no dependencies — it's static HTML, CSS and JavaScript. Open `index.html`
in a browser. The map and Google Fonts need an internet connection, and the forms only
deliver messages from the live Netlify site, not from a local file.

## Deployment

Hosted for free on **Netlify** at https://thrift-revive-co.netlify.app/. The project folder
was deployed with Netlify's drag-and-drop upload, and `index.html` sits at the root of the
folder so Netlify serves it as the home page. Form submissions arrive under **Forms** in the
Netlify dashboard and are emailed through a notification set up there.

---

## Change log

All notable changes to this project, newest first. Entries are grouped by assignment part,
and each line names the file that changed.

### Part 3 — Final POE: functionality and SEO — 2026-10-30

**Added**
- `gallery page.html` — new gallery page showing all 13 catalogue photos, with its own SEO
  metadata (title, description, keywords, canonical, Open Graph, Twitter card)
- Slideshow on top of the existing lightbox: previous/next buttons, arrow-key and swipe
  navigation, wrap-around, image caption and "n / total" counter (`script.js`, `style.css`)
- Live date and time in the footer of all six pages, refreshed every second with
  `setInterval` and `toLocaleString("en-ZA")` (`script.js`, every page)
- Google Map (iframe embed) on the contact page, alongside the existing Leaflet map on the
  location page (`contact page.html`)
- "Gallery" link added to the navigation bar on every page
- Website deployed to Netlify at https://thrift-revive-co.netlify.app/
- References section (below)

**Changed**
- Forms now send to **Netlify Forms** instead of FormSubmit. Both forms gained
  `data-netlify="true"`, a hidden `form-name` field and the existing honeypot, and
  `sendForm()` in `script.js` now posts url-encoded data to the site itself
  (`contact page.html`, `enquiry page.html`, `script.js`). This removes the need for an
  activation email and keeps the owner's email address out of the public code
- Form errors are now logged to the browser console, and a server rejection shows the red
  error message instead of being treated as a success (`script.js`)
- Lightbox rewritten from a single-image viewer into a slideshow that builds its image list
  from whatever triggers are currently visible, so a filtered catalogue only slides through
  its matches (`script.js`)
- Canonical, Open Graph, Twitter card, structured-data and sitemap addresses updated from the
  old GitHub Pages address to the live Netlify address (all pages, `sitemap.xml`)
- Home page file renamed from `Home.html` to `index.html` so Netlify serves it as the
  home page, and the navigation links on every page updated to match the file names
- README page table, project structure and deployment notes corrected to the real file
  names and Netlify hosting

**Fixed**
- README tables were missing their header rows and did not render; rebuilt as proper
  Markdown tables
- Navigation links that pointed to file names that do not exist

### Part 2 feedback — corrections made for the Part 3 submission

Part 2 result: **94 / 100**. The lecturer's comment on the change log (Knowledge criterion,
7 / 10, Level 3) was: *"Adequate updates or changes made based on feedback. Changelog is
detailed but could be improved."*

- **Feedback received:** The change log is detailed but could be improved.
  **Change made:** Rewrote the change log so every assignment part has its own dated entry,
  split into Added / Changed / Fixed / Removed, and each line names the file that changed
  (for example `gallery page.html`, `script.js`, `style.css`). Added this section to record
  the lecturer's feedback and the correction made for it. Added a References section.
  Corrected the README file names to match the real files and rebuilt the tables that were
  not displaying.
  **Why:** The lecturer can now trace every edit to a specific file and see why it was made,
  and the sources used are credited.

**Part 2 carry-overs implemented in Part 3**
- External stylesheet linked to every HTML page with
  `<link rel="stylesheet" href="CSS/style.css">`
- Website built with semantic HTML5 and styled using CSS
- JavaScript form validation added to the contact and enquiry forms
- Real-time date and time update added to every page

### Part 3 — Interactivity, forms and SEO (earlier build) — 2026-09-21

**Added**
- Catalogue search and category filtering: 13 items across 7 categories, keyword search,
  filter chips, live result count and an empty state
- AJAX form submission on both forms via `fetch()` — sending state, success/error messages,
  10-second timeout, honeypot spam trap, no page reload
- SEO metadata on all pages: meta description, keywords, author, robots, canonical,
  Open Graph, Twitter/X cards, favicon and JSON-LD `ClothingStore` structured data
- `robots.txt` and `sitemap.xml`
- Separate stock enquiry page with a dynamic response per enquiry type
- Lightbox gallery, FAQ accordion, and JavaScript form validation with inline errors
- Interactive Leaflet map replacing the static Google Maps iframe
- `README.md` and `PART3-NOTES.md`

**Changed**
- Alt text rewritten on every image to describe the actual content
- Contact form switched from a Formspree page-reload POST to an AJAX submission

**Fixed**
- JavaScript was never loading — every page referenced `JS/script.js` but the folder is `JavaScript/`
- Broken internal links to the About, Location and Home pages
- Catalogue cards staggering when a product name wrapped to two lines

**Removed**
- Obsolete draft `Images/index.html` and a stray Word temporary file

### Part 2 — Styling and layout — 2026-09-05 → 2026-09-18

**Added**
- External stylesheet with a reusable class-based approach
- About page

**Changed**
- Full layout restructure across the site, keeping the original colour palette
- Logo sizing adjusted in the header

### Part 1 — Structure and proposal — 2026-08-13

**Added**
- Home page, contact page and location page
- Written project proposal (`Documents/`)

---

## Git workflow

Work for each assignment part happens on its own branch and is merged into `main` once the
part is complete:

| Branch | Contents |
|---|---|
| `Part-1` | Initial pages and proposal |
| `Part-2` | Styling, layout restructure, about page |
| `Part-3` | Interactivity, forms, SEO, gallery slideshow, footer clock, Google Map, Netlify deployment |

Commit messages describe what changed and why, grouped so each commit is one logical
change rather than one large dump.

---

## References

Google (n.d.) *Add a map or directions to your website (Embed a map)*. Google Maps Help.
Available at: https://support.google.com/maps/answer/144361 (Accessed: 30 October 2026).

Google Fonts (n.d.) *Bebas Neue*. Available at: https://fonts.google.com/specimen/Bebas+Neue
(Accessed: 30 October 2026).

Leaflet (n.d.) *Leaflet — an open-source JavaScript library for interactive maps*.
Available at: https://leafletjs.com/ (Accessed: 30 October 2026).

Mozilla Developer Network (n.d.) *Date.prototype.toLocaleString()*. Available at:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
(Accessed: 30 October 2026).

Mozilla Developer Network (n.d.) *setInterval() global function*. Available at:
https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval (Accessed: 30 October 2026).

Netlify (n.d.) *Add a new project (deploy manually or from a Git repository)*. Netlify Docs.
Available at: https://docs.netlify.com/manage/projects/add-new-project/
(Accessed: 30 October 2026).

Netlify (n.d.) *Forms setup*. Netlify Docs. Available at:
https://docs.netlify.com/manage/forms/setup/ (Accessed: 30 October 2026).

Open Graph protocol (n.d.) *The Open Graph protocol*. Available at: https://ogp.me/
(Accessed: 30 October 2026).

Schema.org (n.d.) *ClothingStore*. Available at: https://schema.org/ClothingStore
(Accessed: 30 October 2026).

W3Schools (n.d.) *How TO — Lightbox*. Available at:
https://www.w3schools.com/howto/howto_js_lightbox.asp (Accessed: 30 October 2026).

W3Schools (n.d.) *How TO — Slideshow*. Available at:
https://www.w3schools.com/howto/howto_js_slideshow.asp (Accessed: 30 October 2026).

W3Schools (n.d.) *JavaScript Form Validation*. Available at:
https://www.w3schools.com/js/js_validation.asp (Accessed: 30 October 2026).
