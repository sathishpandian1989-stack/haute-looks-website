# HAUTE LOOKS — Unisex Salon & Bridal Studio website

A cinematic, mobile-first website for **HAUTE LOOKS Unisex Salon & Bridal Studio, Karaikudi**, built with
**Angular 20 + TypeScript**. Every page is prerendered to static HTML and deployed to **GitHub Pages**. Enquiries are stored in
**Google Sheets** through a **Google Apps Script** web app, which also emails the owner.

Brand palette (strict two-colour UI): **Jet Black `#171717`** · **Luxury Gold `#D4AF37`**.
Fonts: Cormorant Garamond (headings) + Manrope (body).

---

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Cinematic hero, signature services bento, concerns → answers, bridal feature, before/after, about, reviews, FAQ, CTA |
| `/services/` | Hair, Skin, Makeup and Bridal categories, each with WhatsApp enquiry |
| `/bridal-studio/` | Bridal offer, 4-step process, bridal enquiry form, bridal FAQ |
| `/gallery/` | Masonry gallery with lightbox and 4 accessible before/after sliders |
| `/about/` | Story, leadership portrait, values, visit info |
| `/contact/` | Contact cards (WhatsApp, 2 phones, address, Instagram, email), enquiry form, map/directions |
| `/privacy-policy/` | What is collected, why, storage, retention, analytics |

## Cinematic and UX features

- Opening sequence: black screen, gold wordmark letter reveal, then a curtain split into the hero. It plays once per session, can be skipped with a click or key, and is off for reduced-motion users.
- Hero: clip-path mask reveal, letterbox bars, staggered headline, Ken Burns crossfade slideshow with manual controls.
- Reveal-on-scroll, image mask reveals, subtle parallax (desktop only), slow marquee bands, view-transition page fades.
- Mobile: sticky **Call / WhatsApp** bar. Desktop: WhatsApp floating button.
- Accessibility: skip link, semantic landmarks, one H1 per page, visible focus, keyboard and screen-reader before/after sliders (native range input), accessible FAQ accordion, `prefers-reduced-motion` support.
- SEO: unique title, description, canonical and Open Graph tags per page; `BeautySalon` JSON-LD; `sitemap.xml`; `robots.txt`; prerendered HTML.
- GA4 (optional): loads only after visitor consent. Events: `phone_click`, `whatsapp_click`, `form_start`, `generate_lead`.

## Project structure

```
src/app/core/site.config.ts     ← ALL business details (phones, address, hours, links, map)
src/app/core/content.ts         ← services, FAQ, images, before/after pairs
src/app/core/lead.service.ts    ← form → Apps Script (success only when the row is saved)
src/app/components/             ← header, footer, preloader, service-bento, before-after, faq,
                                  booking-form, contact-cards, reviews, cta-band, marquee, quick-contact
src/app/pages/                  ← home, services, bridal, gallery, about, contact, privacy, not-found
src/environments/environment.ts ← public runtime config (Apps Script URL, GA4 ID)
apps-script/Code.gs             ← Google Apps Script backend
.github/workflows/deploy.yml    ← build + deploy to GitHub Pages
```

## Run locally

```bash
npm ci
npm start            # http://localhost:4200
npm run build        # static site in dist/haute-looks/browser
```

---

## Google Sheets and Apps Script setup (about 10 minutes)

1. **Create the sheet.** In Google Drive, create a new Google Sheet, for example *HAUTE LOOKS – Website Leads*. Keep it shared **only** with authorised staff.
2. **Add the script.** In the sheet, go to **Extensions → Apps Script**.
   - Replace the contents of `Code.gs` with [`apps-script/Code.gs`](apps-script/Code.gs).
   - Turn on *Project Settings → Show "appsscript.json"*, then replace that file with [`apps-script/appsscript.json`](apps-script/appsscript.json).
3. **Set Script Properties.** Go to *Project Settings → Script Properties* and add:
   - `OWNER_EMAIL`: the address that receives new-lead emails (required)
   - `SHEET_NAME`: optional, defaults to `Leads`
   - `SPREADSHEET_ID`: optional, only if the script is *not* created from inside the sheet
4. **Run `setup()` once.** Pick `setup` in the function dropdown, click ▶ Run and approve the permissions. This creates the **Leads** tab with headers, a Status dropdown and a hidden Submission ID column.
5. **Deploy.** Go to **Deploy → New deployment → Web app**, choose *Execute as: **Me*** and *Who has access: **Anyone***, then deploy and copy the **`/exec` URL**.
6. **Connect the website.** The `/exec` URL is set in `src/environments/environment.ts` (it is a public endpoint, not a secret). To switch to a new deployment without editing code, add a GitHub repository **Variable** `APPS_SCRIPT_URL`; it overrides the file at build time.

> After any change to `Code.gs`, use **Deploy → Manage deployments → Edit → New version**. This keeps the same URL.

**Sheet columns:** Lead ID · Submitted At (IST) · Name · WhatsApp · Phone · Gender · Age Range · Service · Preferred Date ·
Preferred Time · Email · Message · Consent · Source · UTM Source · UTM Medium · UTM Campaign · Referrer · Landing Page ·
Form Page · Status · Follow-up Notes · Notification Status · Submission ID (hidden)

**What the backend guarantees**

- Server-side validation: name, Indian mobile format, allowed service list, optional email, date not in the past, message length, consent.
- Spam protection: honeypot field, minimum fill time, and a rate limit of 3 enquiries per number per 10 minutes.
- No duplicates: the browser sends one submission ID per form fill, and a retry returns the original Lead ID instead of adding a second row. A script lock prevents race conditions.
- Lead ID (`HL-yyMMdd-XXXXX`) and an Asia/Kolkata timestamp are created on the server.
- Success is returned **only after the row is saved**. The website never shows "thank you" otherwise.
- The owner email is sent after saving. If it fails, the lead is kept and *Notification Status* shows `FAILED: …`. Retry from the sheet menu **HAUTE LOOKS → Retry failed notifications**.
- Cells starting with `= + - @` are escaped to prevent formula injection. Logs contain only the Lead ID, never personal data.

## Deploy to GitHub Pages

1. Push this project to the `main` branch of the GitHub repo.
2. In the repo, set *Settings → Pages → Source: **GitHub Actions***.
3. *(Optional)* Add these repository **Variables**:
   - `APPS_SCRIPT_URL`: overrides the Apps Script `/exec` URL in `environment.ts`
   - `GA4_ID`: e.g. `G-XXXXXXX` (enables analytics with a consent banner)
   - `BASE_HREF`: `/` when using a custom domain (default is `/<repo-name>/`)
4. Each push to `main` builds and deploys the site to `https://<user>.github.io/<repo>/`.

If you add a custom domain, update `SITE.url` in `site.config.ts` and the URLs in `public/sitemap.xml` and `public/robots.txt`.

---

## ⚠️ Owner checklist before launch

- [ ] Confirm which number is the **primary WhatsApp booking** number (currently +91 99760 81533) → `site.config.ts`
- [ ] Confirm opening hours (supplied: all 7 days, 8:30 AM – 9:00 PM)
- [ ] Replace `googleProfileUrl` / `directionsUrl` with the final Google Maps / Business Profile URL. Paste a Maps **embed** URL into `mapEmbedUrl` to show the map.
- [ ] Confirm the service list in `content.ts` (skin services are shown as "ask for current menu")
- [ ] Provide the owner/lead stylist's **name** (`SITE.leader.name`) and confirm the portrait is approved
- [ ] Supply **real before/after pairs** with written client permission. Then set `demo: false` in `TRANSFORMATIONS`. The current sliders are labelled demo previews.
- [ ] Add **verified** Google reviews (with permission) to `reviews.component.ts`. No ratings or quotes are shown until then.
- [ ] Confirm whether gender and age range are needed (both are optional in the form now)
- [ ] Approve the privacy policy wording and the 12-month retention period
- [ ] Test one real enquiry: exactly one row appears in the sheet and the owner email arrives
- [ ] Supplied service images contained another salon's text. They were cropped to clean areas; replace them with the salon's own photos when available.
