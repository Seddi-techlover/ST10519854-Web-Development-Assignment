 Revive Thrift Co. — Website

A multi-page website for **Revive Thrift Co.**, a fictional thrift store in Braamfontein,
Johannesburg, selling affordable vintage and second-hand clothing.

Built for the **Web Development (WEDE5020)** module, Group 2, at Rosebank International (The IIE).

 **Student**  Lesedi Reabetsoe Tsutsubi 
 **Student number**  ST10519854 
 **Module**  WEDE5020 — Web Development 
 **Live site**  https://github.com/Seddi-techlover/ST10519854-Web-Development-Assignment


## The store

Braamfontein previously had a well-known thrift store that has since closed. This project
imagines a new business stepping into that gap and gives it the online presence the old
store never had — a browsable catalogue, a findable location, and a way to ask about stock
before travelling in.

**Audience:** students and young professionals in Braamfontein looking for affordable,
quality second-hand and vintage fashion.



## Pages

File | Purpose 
 `Home.html` Home — hero, searchable/filterable catalogue, story, location and contact teasers 
 `About page.html`  About the store and the project: who built it, who it's for, why it exists 
 `Location page.html`  Address, trading hours, contact details and an interactive Leaflet map |
 `Enquiry page.html`  Stock/sizing/custom/bulk enquiry form with a dynamic response per enquiry type 
 `Contact page.html`  General contact form, in-store gallery and an FAQ accordion |

---

## Features

**Catalogue**
- 13 items across 7 categories, each tagged New In or Rare Find with a from-price
- Keyword search matching item name, category and hidden keywords (so "sneaker" finds the footwear)
- Category filter chips that combine with the search term rather than overriding it
- Live result count in an `aria-live` region, plus an empty state that links to the enquiry page

**Interactive**
- Lightbox gallery — any catalogue image opens full-size in an overlay (closes on click or Escape)
- FAQ accordion on the contact page, one item open at a time, animated height transition
- Leaflet map on the location page with a marker and popup (OpenStreetMap tiles, no API key)
- Hover and click transitions on buttons and product cards

**Forms**
- JavaScript validation with inline error messages: name, email format, SA phone format,
  subject, message length, enquiry type and item
- AJAX submission via `fetch()` — no page reload, sending state on the button, success and
  error messages in place, 10-second timeout, honeypot field against bots
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
- **Vanilla JavaScript** — no frameworks; DOM APIs, `fetch()`, `AbortController`
- **Leaflet 1.9.4** (CDN) — interactive map
- **FormSubmit** — form delivery endpoint
- **GitHub Pages** — hosting

Palette: mustard `#d9a441`, forest green `#2f4a2c` / `#22361f`, cream `#f5f0e6`.
Display type: Bebas Neue (Google Fonts).

---

## Project structure
ST10519854-Web-Development-Assignment/
Home.html                 Home
About page.html              About
Location page.html           Location + map
Enquiry page.html            Stock enquiry form
Contact page.html            Contact form, gallery, FAQ robots.txt  
CSS/
└── style.css           All styling
JavaScript/
  └── script.js           Lightbox, accordion, validation, AJAX, catalogue filter
Images/                 Store photography and logo
Documents/              Written project proposal
PART3-NOTES.md          Implementation notes for the Part 3 features
└── README.md               This file

## Running it locally

No build step and no dependencies — it's static HTML, CSS and JavaScript.

git clone https://github.com/Seddi-techlover/ST10519854-Web-Development-Assignment.git
cd ST10519854-Web-Development-Assignment

## Deployment

Hosted on **GitHub Pages** from this repository. `Home.html` sits at the repository root
so Pages serves it as the home page automatically.

---

## Changelog

All notable changes to this project, newest first.

### Part 3 — Interactivity, forms and SEO — 2026-09-21

**Added**
- Catalogue search and category filtering: 13 items across 7 categories, keyword search,
  filter chips, live result count and an empty state
- AJAX form submission on both forms via `fetch()` — sending state, success/error messages,
  10-second timeout, honeypot spam trap, no page reload
- SEO metadata on all five pages: meta description, keywords, author, robots, canonical,
  Open Graph, Twitter/X cards, favicon and JSON-LD `ClothingStore` structured data
- `robots.txt` and `sitemap.xml`
- `Enquiry page.html` — separate stock enquiry page with a dynamic response per enquiry type
- Lightbox gallery, FAQ accordion, and JavaScript form validation with inline errors
- Interactive Leaflet map replacing the static Google Maps iframe
- `README.md` and `PART3-NOTES.md`

**Changed**
- Alt text rewritten on every image to describe the actual content
- Contact form switched from a Formspree page-reload POST to an AJAX submission

**Fixed**
- JavaScript was never loading — every page referenced `JS/script.js` but the folder is `JavaScript/`
- Broken internal links to `About_page.html`, `Location_page.html` and `Home.html#shop`
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

## Git workflow

Work for each assignment part happens on its own branch and is merged into `main` once the
part is complete:

| Branch | Contents 
`Part-1`  Initial pages and proposal 
`Part-2-` Styling, layout restructure, about page 
`Part-3`  Interactivity, forms, AJAX and SEO 

Commit messages describe what changed and why, grouped so each commit is one logical
change rather than one large dump.
