# Pure Reflections Window Cleaning Service — website

A single-page site in plain HTML, Tailwind CSS v3 (compiled and committed) and a little vanilla JavaScript. It has no frameworks and loads nothing from a CDN.

Live draft: https://tobygregg.github.io/pure-reflections-window-cleaning/

## Folder layout

```
index.html              the whole site, one page, split into sections by comment banners
thanks.html             shown after the quote form is sent (FormSubmit _next)
404.html                GitHub Pages "not found" page (uses /pure-reflections-window-cleaning/ paths, see checklist)
assets/css/styles.css   compiled Tailwind – do not edit by hand, run npm run build
assets/js/main.js       menu, scroll reveals, header, services explorer, before/after, lightbox, form checks
assets/fonts/           self-hosted Gloock + Outfit (woff2) with their OFL licences
images/brand/           logo.svg (for dark backgrounds), logo-light.svg, mark.svg (PR monogram only)
images/work/            job photos, each as name.webp (large) + name-sm.webp (800px)
images/                 favicons, og-image.jpg (1200×630 share card), site.webmanifest
src/input.css           Tailwind source, @font-face, component classes and all animation keyframes
tailwind.config.js      brand colours, fonts and shadows
sitemap.xml, robots.txt
_fb-pack/               the Facebook research pack the site was built from (not published, see Source)
```

## Brand

| Name | Hex | Used for |
|---|---|---|
| ink | `#0B2545` | Text, dark buttons, contact section and footer. The deep navy from the Facebook banner. |
| aqua | `#19B5DC` | The "P" in the logo. Icons, highlights, the explorer pulse, illustration accents. |
| aqua-deep | `#0A7FB5` | Darker aqua for text links and the "Get a quote" buttons (passes contrast with white text). |
| glass | `#52DDE9` | The "R" in the logo. Window glass, droplets, footer line art. |
| sky | `#87D7F6` / `#EAF7FC` / `#F5FBFE` | Banner sky blue and its light tints for section backgrounds. |

- **Fonts:** Gloock for headings (its sharp serif echoes the PR monogram) and Outfit for body text. Both are self-hosted from @fontsource.
- **Logo:** the Facebook profile logo was only 500px, so I redrew it as SVG. The P and R are traced from the original, the "PURE REFLECTIONS" lettering is set in Outfit, and the droplet is redrawn. The colours match the original. `mark.svg` is the monogram with the text band filled in, used in the header and favicons.
- **Illustrations:** all hand-drawn inline SVG in one style (2–2.6px navy line, glass/aqua fills): the hero cottage with its rippling reflection, the services house, the Home Care ring and the footer skyline.

## Editing

- **Text:** everything is in `index.html`. Search for the words you want to change.
- **Colours:** change them in `tailwind.config.js`, then run `npm install` (first time only) and `npm run build`. A few illustration colours are written straight into the SVGs in `index.html` (search for the hex value).
- **Adding a work photo:** export two WebP files to `images/work/`, one around 1400px wide (`name.webp`) and one 800px wide (`name-sm.webp`). Then copy one of the `<button class="gal-item …">` blocks in the *RECENT WORK* section and change `data-full`, `data-caption`, `src`, `width`/`height` and `alt`. The gallery is a fixed grid, so add a `row-span-2` or `col-span-2` class to size the tile.
- **Services explorer:** each service has three linked parts. These are a tab button (`data-tab="roof"`), a panel (`data-panel="roof"`) and a part of the house drawing (`data-part="roof"`) with its hotspot (`data-pin="roof"`). Keep the key the same across all four. The panels with no photo show a zoomed part of the house drawing (`<use href="#house-art">` with its own `viewBox`). To use a photo there instead, swap that `<div>` for an `<img>`.
- **Before & after:** each slider is a `<div class="ba" data-ba>` holding two aligned images (after first, then before). The current pairs were lined up from the client's own photos (the pool surround from two separate shots, the roof from their side-by-side collage), so they match when you drag. A new pair needs the same framing in both photos.
- **"Get a quote for…" buttons** pre-select the form's service through `data-quote`, which must match an `<option>` exactly.

## Before going live — checklist

- [ ] Replace `https://tobygregg.github.io/pure-reflections-window-cleaning/` with the real domain in: canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD (`@id`, `url`, `image`, `logo`), `sitemap.xml`, `robots.txt` and the form's `_next` field.
- [ ] Change the `/pure-reflections-window-cleaning/` paths in `404.html` to `/` once the site is on its own domain.
- [ ] **When the client goes ahead, switch the form from Toby's email to the client's.** Change `action="https://formsubmit.co/toby1@greggs.org"` to the client's address, send one test enquiry and click FormSubmit's activation email. Remove "(website draft)" from `_subject`.
- [ ] Confirm the phone number (07781 414404), the WhatsApp number (+44 7781 414404) and the email (purereflections@yahoo.com).
- [ ] Get Jack to sign off the services wording, especially these points I took from the photos and the business's flyer rather than from posts:
  - "Upstairs windows from the ground with a water-fed pole" (from the photos)
  - conservatory roof, glass, UPVC frames and sills
  - solar panels for domestic and commercial customers
  - the Home Care Package benefits, including priority booking and discounts on additional services (from their own Home Care flyer)
- [ ] Check the business is happy with "Established 2014", "Free, no-obligation quotes" and the name "Jack Dyer" appearing on the site (all are from their Facebook page and flyer).
- [ ] Assumptions: Guernsey-wide coverage (the page only says "Guernsey"), and the pool surround photos (`img-007`/`img-008`) show the same job before and after.
- [ ] Left out on purpose: the review count and rating (one written review isn't enough for a testimonials section), the giveaway post graphic, and the two designed flyers (their content is used in the copy instead).
- [ ] Optional: get a few more job photos, especially windows, conservatories, gutters and solar panels, to replace the illustrated panels in the services explorer.

## Source

Built from the Facebook pack in `_fb-pack/` (BRIEF.md, data.json, images). The folder name starts with an underscore, so GitHub Pages doesn't publish it.

Build: `npm install && npm run build`
