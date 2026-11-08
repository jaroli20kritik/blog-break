# Navin 3D Designs & Creations

A static, interactive product showcase for handcrafted 3D-printed décor, idols, planters, desk accessories and keychains.
It doesn't need a database or a server. Every product on the site comes from one file, `js/products.js`.

## Open it

Double-click `index.html`, or host the `Navin3D/` folder on any static host (GitHub Pages, Netlify, Vercel, etc.).

## Add a new product

**Option A: the builder page (easiest)**
1. Open `admin.html` in your browser.
2. Fill in the name, category, highlights and so on, and choose the photos.
3. Click **Download updated products.js**.
4. Copy the photos into `images/products/` and replace `js/products.js` with the downloaded file.
5. Refresh `index.html`. The new product now appears in the grid, filters, search, category tiles and counters.

**Option B: by hand**
Open `js/products.js`, copy one `{ ... }` block, paste it at the end of the list and change the values.
If you type a new `category`, a new filter and category tile are created automatically.

| Field | Meaning |
|---|---|
| `id` | unique, lowercase-with-dashes; used for share links like `index.html#product/voronoi-planter` |
| `name` | product name |
| `category` | main group (drives filters and category tiles) |
| `tags` | small labels under the name |
| `isNew` | `true` shows the **NEW** badge |
| `featured` | `true` adds it to the hero slider |
| `price` | `""` shows "Price on request", or e.g. `"₹299"` |
| `images` | photo paths; the first one is the cover, and you can add as many as you like |
| `highlights` | bullet points in the product view |
| `description` | optional paragraph |

## Contact buttons

At the top of `js/products.js`, fill in `whatsapp` (digits with country code, e.g. `919876543210`), `email`, `phone` and `instagram`.
The WhatsApp, e-mail and call buttons appear automatically once these are filled. Customers' enquiry lists are then sent straight to you as a pre-written message.

## Features

- Hero slider with a 3D tilt effect, showing the featured products
- Live search, category filter chips and sorting
- Product cards with a 3D tilt and shine effect, and a second photo on hover
- Product view with a gallery, zoom, swipe, keyboard arrows, next/previous design and shareable links
- Enquiry list (saved in the visitor's browser) with quantities and notes, sent by WhatsApp or e-mail or copied as text
- Light and dark theme, scroll animations, and a layout that works on phones
