# Navin 3D Design and Creations — website

Product showcase and digital catalogue for **Navin 3D Design and Creations**, a 3D printing studio in Udaipur, Rajasthan.
Customers browse products by category, view photos and details, download the PDF catalogue, and send enquiries on WhatsApp, by phone or by email.

There is no database, no login and no payment gateway. All content lives in a few plain files you can edit.

**Built with:** React 19 · Vite 7 · TypeScript · Tailwind CSS 4 · React Router 7 · Lucide icons

---

## 1. Run it on your computer

You need **Node.js 20.19 or newer** (https://nodejs.org).

```bash
cd navin3d-web
npm install          # first time only
npm run dev          # opens a live preview at http://localhost:5173
```

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Checks for errors and creates the finished website in `dist/` |
| `npm run preview` | Shows the finished `dist/` site at http://localhost:4173 |
| `npm run typecheck` | Checks the code for mistakes without building |

---

## 2. Project structure

```
navin3d-web/
├── public/                         ← files served as-is
│   ├── catalogue/
│   │   ├── Navin3D-Product-Catalogue.pdf   ← the downloadable catalogue
│   │   └── preview-1.webp … preview-4.webp ← page previews on the Catalogue page
│   ├── images/products/<product>/1.webp …  ← one folder of photos per product
│   ├── favicon.svg, robots.txt, _redirects
├── src/
│   ├── config/site.ts              ← ★ business name, phone, WhatsApp, email, social links, catalogue
│   ├── data/products.ts            ← ★ every product (add / edit / remove here)
│   ├── data/categories.ts          ← ★ the six categories
│   ├── pages/                      ← Home, Products, ProductDetail, About, Catalogue, Contact, NotFound
│   ├── components/                 ← ProductCard, ProductImage, Navbar, Footer, WhatsApp button…
│   ├── lib/                        ← WhatsApp/phone/email links, page titles (SEO), helpers
│   ├── index.css                   ← brand colours and fonts
│   ├── App.tsx                     ← page routes
│   └── main.tsx
├── index.html                      ← default title, description, business info for Google
└── vite.config.ts
```

The files marked ★ are the only ones you normally need to touch.

### Pages

| URL | Page |
|---|---|
| `/` | Home: hero, featured products, categories, why choose us, custom & bulk orders, catalogue, enquiry |
| `/products` | All products with search, category filter and sort. Filters are kept in the link, e.g. `/products?category=keychains` |
| `/products/<slug>` | Product details: photo gallery, description, colours, customisation, price, enquiry buttons |
| `/about` | About the business, services, customisation and quality |
| `/catalogue` | PDF preview, download and open-in-browser |
| `/contact` | Phone, WhatsApp, email, Instagram, location and the enquiry form |

---

## 3. Change contact details

Open **`src/config/site.ts`**:

```ts
contact: {
  phone: "+91 63754 11047",          // shown on the site, used for "Call"
  whatsapp: "916375411047",          // digits only, with 91 in front
  email: "jaroli20kritik@gmail.com",
  location: "Udaipur, Rajasthan, India",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Udaipur%2C+Rajasthan",
  hours: "",                         // e.g. "Mon–Sat, 10 am – 7 pm"
},
social: {
  instagram: "",                     // e.g. "https://instagram.com/navin3d"
  facebook: "",
  youtube: "",
},
```

- **Anything left as `""` is hidden** on the site, so no empty or fake details ever show.
- **Instagram is empty for now.** Paste your full profile link and the icon appears in the footer and on the Contact page.
- Set `url` to your real web address once the site is live, for example `"https://navin3d.in"`. Product links shared on WhatsApp then use it.
- The phone and email also appear in `index.html` (the `application/ld+json` block, used by Google). Update them there too if they change.

---

## 4. Add, edit or remove products

Open **`src/data/products.ts`**.

### Add a product

1. **Photos:** create a folder `public/images/products/<slug>/`, for example `public/images/products/lotus-diya-stand/`, and put the photos in it named `1.webp`, `2.webp`, `3.webp` …
   - `.jpg` and `.png` also work: use `photos("lotus-diya-stand", 3, "jpg")`.
   - Square photos about 1200 × 1200 px look best. Photo 1 is the cover.
2. **Details:** copy one existing `{ … },` block, paste it into the list and change the values:

```ts
{
  slug: "lotus-diya-stand",                 // lowercase-with-dashes, unique; becomes /products/lotus-diya-stand
  name: "Lotus Diya Stand",
  categories: ["festival", "home-decor"],   // ids from categories.ts — first one is the main category
  shortDescription: "One line for the product card.",
  description: "A longer paragraph for the product page.",
  highlights: ["Point one", "Point two", "Point three"],
  images: photos("lotus-diya-stand", 3),
  price: "",                                // "" shows "Price on request", or e.g. "₹299" / "From ₹199"
  colors: ["Red", "Ivory"],                 // only colours you really offer; [] hides the list
  customizable: true,                       // shows the "Customisable" badge
  customizationOptions: ["Any name", "Choice of colour"],
  featured: true,                           // optional: show on the home page
  isNew: true,                              // optional: show the "New" badge
},
```

3. Save. The product now appears on the Products page, in its categories, in search, on its own page and in the enquiry form's product list.

**No photos yet?** Use `images: []`. A clearly labelled **"Photo coming soon"** placeholder is shown instead of a stock photo.

### Edit or remove a product

- **Edit:** change the values in that product's block.
- **Remove:** delete the whole block from `{` to `},`. You can also delete its photo folder.

### Categories

Categories are in `src/data/categories.ts`. Each has an `id`, a display `name`, a `description` and a `cover` photo. To add one, add an entry and use its `id` in products' `categories` lists.

---

## 5. Replace the PDF catalogue

1. Name the new PDF **`Navin3D-Product-Catalogue.pdf`**.
2. Replace the file in **`public/catalogue/`**.
3. If the page count or size changed, update `pages` and `sizeLabel` under `catalogue` in `src/config/site.ts`.
4. *(Optional)* Replace `public/catalogue/preview-1.webp` … `preview-4.webp` with images of the new first pages. Any image editor or a screenshot works; portrait, about 700 px wide.

To use a different file name, change `file` and `downloadName` in `site.ts`.

**Keep the PDF small (under about 5 MB) so it downloads quickly on phones.** Free tools like ilovepdf.com → *Compress PDF* help.

---

## 6. Change colours or fonts

Brand colours and fonts are set at the top of **`src/index.css`**, under `@theme`:

- `--color-accent` (orange)
- `--color-ink` (charcoal text)
- `--color-paper` (off-white background)
- `--font-display` (headings, Manrope)
- `--font-sans` (body text, DM Sans)

The fonts are loaded in `index.html`.

---

## 7. Deploy (put the website online) — all free options

Run `npm run build`. The finished website is the **`dist/`** folder, which any static host can serve.

### Option A — Netlify (easiest)
1. Sign in at https://app.netlify.com.
2. Choose **Add new site → Import from Git**, pick this repository, and set:
   - Base directory: `navin3d-web`
   - Build command: `npm run build`
   - Publish directory: `navin3d-web/dist`
3. Deploy. Page links like `/products/voronoi-planter` work because of `public/_redirects`.
4. Add your own domain under **Domain settings** if you have one.

*(No Git? Run `npm run build` and drag the `dist` folder onto https://app.netlify.com/drop.)*

### Option B — Vercel
Import the repository at https://vercel.com/new, then:
- Set **Root Directory** to `navin3d-web`.
- Framework: **Vite** (detected automatically).

`vercel.json` makes page links work.

### Option C — GitHub Pages
This repository already includes `.github/workflows/deploy-navin3d.yml`.
1. On GitHub, go to **Settings → Pages → Source** and choose **GitHub Actions**.
2. Push to `main`, or run the workflow from the **Actions** tab.
3. The site goes live at `https://<your-username>.github.io/<repo-name>/`.

The workflow builds with the right sub-folder path (`BASE_PATH`) automatically, and `404.html` keeps page links working.

To build for a sub-folder by hand: `BASE_PATH=/blog-break/ npm run build`.

### After deploying
- Set `url` in `src/config/site.ts` to the live address, then deploy again.
- Check that the catalogue downloads and that WhatsApp opens on your phone.

---

## 8. What's built in

- Sticky navigation, responsive mobile menu, smooth scrolling, skip-to-content link
- Floating WhatsApp button, and a pre-filled WhatsApp message on every product
- Enquiry form with validation. It opens WhatsApp or email with the message written out; nothing is stored or sent to a server.
- Product search, category filters and sorting, with an empty state when nothing matches
- A page title, description and social-sharing tags on every page, plus business info for Google (`index.html`)
- Fast loading:
  - WebP photos (about 1.8 MB for all 80)
  - Lazy-loaded images with shimmer placeholders
  - Pages split into small files
- Error handling:
  - A friendly error screen with a reload button
  - A 404 page
  - "Product not found" for old links
  - A "Photo coming soon" placeholder for missing photos
- Accessible: labelled buttons and form fields, keyboard-usable gallery (arrow keys), visible focus rings, respects "reduce motion"

### Deliberately not included
- No payment gateway, customer accounts or database
- No reviews or testimonials (add real ones later if you collect them)
- No invented prices: every product shows **"Price on request"** until you set `price`
