# SEO Implementation Notes — Revive Thrift Co.

Student: Lesedi Reabetsoe Tsutsubi (ST10519854) · Module: WEDE5020 · Part 3

## 1. Page titles
Every page now has a unique, keyword-led title under ~60 characters, in the format
`Primary keyword | Brand`. Example: `Store Location & Trading Hours | Revive Thrift Co. Braamfontein`.

## 2. Meta tags (all five pages)
Tag | Purpose 
`description` Revive Thrift Co. brings quality vintage and second-hand fashion back to Braamfontein — affordable, sustainable, and full of character. Every rack is different, every find is one-of-one.
`keywords`  ("Tees", "Hoodies", "Denims", "Knitwear", "Caps", "Jewlery", "Footwear")
`author`   Lesedi Tsutsubi ST10519854
`robots` (`index, follow`)  Explicitly allows indexing 
`theme-color`  Brand green for mobile browser UI 
`link rel="canonical"` | Declares the preferred URL, prevents duplicate-content issues 
`link rel="icon"` Site favicon (store logo) 

## 3. Social sharing (Open Graph + Twitter/X cards)
`og:type`, `og:site_name`, `og:locale` (`en_ZA`), `og:title`, `og:description`, `og:url`,
`og:image`, `og:image:alt`, plus `twitter:card="summary_large_image"` and matching
title/description/image — so a shared link previews with a picture instead of a bare URL.

## 4. Structured data
`Home.html` includes a JSON-LD `ClothingStore` block (name, address, geo coordinates,
phone, email, opening hours, price range). This is what lets search engines display the
store as a local business result with hours and a map pin.

## 5. Alt text audit
Every `<img>` has descriptive alt text written for a user who cannot see the image
(e.g. `alt="Rail of vintage graphic and band T-shirts for sale"` instead of
`alt="All Vintage Tees"`). The only empty alt is the lightbox overlay image, which is
populated by JavaScript from the clicked thumbnail — correct behaviour.

## 6. robots.txt
Allows all crawlers, blocks `/Documents/` (assignment PDFs shouldn't be indexed),
and points to the sitemap.

## 7. sitemap.xml
XML sitemap listing all five pages with `lastmod`, `changefreq` and `priority`
(home = 1.0, location = 0.8, enquiry/contact = 0.7, about = 0.6).

## 8. Technical fixes made in the same pass
- **JavaScript was never loading:** every page referenced `JS/script.js` but the folder
  is `JavaScript/`. Fixed — the lightbox, accordion and form validation now actually run.
- Removed an obsolete draft `Images/index.html` and a stray Word temp file.

# Catalogue Search &amp; Category Filtering

## Catalogue expanded
The Shop section on `Home.html` now holds **13 items** (was 5), each built from the
store photos and tagged with a category, a "New In"/"Rare Find" label and a from-price —
enough variety for searching and filtering to be meaningful.

Categories: Tees, Denim, Hoodies, Knitwear, Caps, Jewellery, Footwear.

## How it works
Each card carries data attributes the JavaScript reads:

```html
<div class="catalogue-item" data-category="denim"
     data-name="Levi's &amp; Lee Jeans"
     data-keywords="denim jeans levis lee tommy hilfiger blue wash">
```

- **Search box** (`#catalogue-search`) — filters as you type, matching the item name,
  its category and its hidden keyword list. So "levi" finds two pairs of jeans, and
  "sneaker" finds the footwear even though the card is named "Retro Runner Sneakers".
  Pressing Escape clears the box.
- **Category chips** — one active category at a time, with `aria-pressed` kept in sync
  for screen readers.
- **The two combine.** A search term narrows whatever category is active, rather than
  overriding it.
- **Live result count** — "Showing 4 pieces of 13", inside an `aria-live="polite"`
  region so assistive tech announces the change.
- **Empty state** — when nothing matches, the grid is replaced by a message that links
  to the enquiry page instead of leaving a blank gap.

Filtering hides cards with a `.is-hidden` class rather than removing them from the DOM,
so nothing has to be rebuilt and the lightbox bindings stay intact.

## Tested in a real browser
- Search "levi" → 2 results; "jewel" → 1; "sneaker" → 1 (keyword-only match)
- Denim chip → 4 results; Tees chip → 3 results
- Caps chip + "levi" search → 0 results, empty state shown
- Nonsense term → 0 results, empty state shown, count reads "Showing 0 pieces of 13"
- Clearing both → "Showing all 13 pieces"
- Lightbox still opens on the new cards, with the correct alt text

---

# AJAX Form Submission

## What changed
Both forms are now submitted with `fetch()` instead of a normal HTML POST, so the page
never reloads. The `action` attribute was removed from `contact.html`; the endpoint now
lives in one constant in `script.js`:

 from the js
const FORM_ENDPOINT = "https://httpbin.org/post";
const REQUEST_TIMEOUT_MS = 10000;


## The submission flow
1. `e.preventDefault()` stops the browser's own page-reload submission.
2. Client-side validation runs first — if anything fails, no request is sent at all.
3. A hidden honeypot field (`name="_honey"`) is checked. Only a bot fills it in, so a
   filled honeypot silently drops the submission.
4. The submit button is disabled and relabelled "Sending..." so the form can't be
   double-submitted.
5. The data is sent as JSON with `Content-Type: application/json`, wrapped in an
   `AbortController` that cancels the request after 10 seconds.
6. **Success** (any 2xx) → a green-bordered message appears in place and the form resets.
   **Failure** → a red-bordered message with a `mailto:` fallback, and the user's input is
   kept so nothing has to be retyped.
7. Either way the button is restored in a `.finally()` block.

Both response boxes use `role="status" aria-live="polite"` so screen readers announce
the outcome without the page changing.

## The endpoint
Submissions go to **FormSubmit**, which forwards each one to the store inbox:

From the js
const FORM_ENDPOINT = "https://formsubmit.co/ajax/leseditsutsubi@gmail.com";

Three FormSubmit reserved fields are sent with the data: `_subject` (so each email has a
useful subject line), `_template: "table"` (readable layout) and `_captcha: "false"`.

**Activation:** the first real submission triggers a one-off confirmation email from
FormSubmit that has to be accepted before messages start arriving.

**Privacy:** after activating, FormSubmit issues a hashed alias. Swapping the email for
`https://formsubmit.co/ajax/<alias-hash>` keeps the address out of the public repo.

The AJAX round trip was verified against `https://httpbin.org/post` before switching to
the live endpoint, so the code path itself is proven.

## Tested in a real browser
- Empty contact form → 4 inline validation errors, **no** network request, no response box
- Valid contact form → button shows "Sending..." and disables → success message appears,
  URL unchanged (no reload), fields cleared, button restored
- Valid enquiry form → success message includes the dynamic per-type text, e.g. the
  bulk/wholesale reply quotes the item name back
- Simulated failure → red error message with the mailto fallback, input preserved
- Honeypot filled → submission silently dropped, no response shown
