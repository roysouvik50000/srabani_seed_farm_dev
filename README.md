# SRABANI SEED FARM – Static Business Website

A fast, lightweight, accessible, and SEO-optimized static website for **SRABANI SEED FARM**, located in Sindurmuri, Sabang, Paschim Medinipur, West Bengal.

Built strictly using:
- **HTML5** (Semantic & Accessible)
- **CSS3** (Responsive Design, Custom Properties, No Frameworks)
- **Vanilla JavaScript** (ES6+, No External Libraries or Bundlers)
- **JSON** (Centralized Product Catalog)

---

## 🌾 1. Company Information

- **Company Name:** SRABANI SEED FARM
- **Category:** Paddy Seeds / Agricultural Seeds
- **Address:** Sabang - Moharh Rd, Sindurmuri, Sabang, West Bengal 721144, India
- **Phone Numbers:**
  - `+91 99324 42449` (Direct / WhatsApp / Orders)
  - `+91 3222 291 185` (Office / Landline)
- **Google Maps:** Centered on Sabang, West Bengal coordinates `(22.176728, 87.610644)`

---

## 🎨 2. Brand Theme & Color Palette

- **Primary Green:** `#237A3B` (Dominant brand green, primary buttons, accents)
- **Dark Green:** `#164D2A` (Header top-bar, typography, footer, high-contrast text)
- **Golden:** `#D6A52C` (Highlights, callouts, CTA buttons, grain motifs)
- **White:** `#FFFFFF` (Primary background, content contrast)
- **Light Green:** `#EAF4E9` (Subtle card backdrops, badge pills)
- **Cream:** `#FFF9E9` (Highlight strips, specifications headers)
- **Dark Text:** `#252525` (Body copy, high readability)

---

## 📁 3. Project Structure

```text
/
├── index.html                       # Home Page (Hero, Highlights, Featured, Why Us, CTA)
├── products.html                    # Product Catalog (Search & Category Filter)
├── product-details.html             # Reusable Dynamic Product Details (?slug=...)
├── about.html                       # About Us (Story, Mission, Vision, Commitments)
├── contact.html                     # Contact Us (Cards, Map, Validated Inquiry Form)
├── 404.html                         # Custom Agricultural 404 Page
├── robots.txt                       # Search Engine Crawling Instructions
├── sitemap.xml                      # XML Sitemap with All Canonical URLs
├── manifest.webmanifest             # Web App Manifest (PWA Metadata)
├── README.md                        # Documentation & Maintenance Guide
│
├── data/
│   └── products.json                # Centralized Product Data (Single Source of Truth)
│
├── products/                        # Static SEO Landing Pages for Crawlers
│   ├── pousami-gold/
│   │   └── index.html
│   ├── gobinda-bhog/
│   │   └── index.html
│   └── badsha-bhog/
│       └── index.html
│
└── assets/
    ├── css/
    │   ├── style.css                # Base Styles, Typography, Components, Theme
    │   └── responsive.css           # Media Queries (1024px, 768px, 480px, Print)
    ├── js/
    │   ├── main.js                  # Navigation, Mobile Drawer, Form Validation
    │   ├── products.js              # Product Catalog Fetcher & Search Filter
    │   ├── product-details.js       # Dynamic Details Page, Carousel & Related Seeds
    │   └── seo.js                   # Client-side Schema and SEO Helpers
    └── images/
        ├── logo.png                 # Vector Brand Logo (Wheat/Paddy motif)
        ├── logo.png              # Vector Favicon (Leaf & Paddy Shield)
        ├── logo.png             # 1200x630 OpenGraph / Social Share Banner
        ├── hero/
        │   └── hero-bg.jpg          # Green Paddy Field Backdrop
        ├── about/
        │   └── about-farm.jpg       # Sabang Seed Processing Facility Image
        └── products/
            ├── placeholder.svg      # Graceful Fallback Placeholder Image
            ├── pousami-gold-1.jpg
            ├── pousami-gold-2.jpg
            ├── pousami-gold-3.jpg
            ├── gobinda-bhog-1.jpg
            ├── gobinda-bhog-2.jpg
            ├── gobinda-bhog-3.jpg
            ├── badsha-bhog-1.jpg
            ├── badsha-bhog-2.jpg
            └── badsha-bhog-3.jpg
```

---

## 🔍 4. SEO & Schema.org Implementation

1. **Page-Specific Meta Tags:**
   - Every page has an independent, non-duplicate `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph, and Twitter tags.
2. **Local SEO Optimization:**
   - Naturally incorporates keywords for *Sabang*, *Paschim Medinipur*, *West Bengal*, *Paddy Seed supplier*, and specific varietal queries (*Pousami Gold*, *Gobinda Bhog*, *Badsha Bhog*).
3. **Structured Data (JSON-LD):**
   - `Organization`: Identity, official logo, telephone contacts.
   - `LocalBusiness`: Exact Sabang address, telephone numbers, geo-coordinates.
   - `WebSite`: Publisher reference.
   - `BreadcrumbList`: Implemented across all pages for breadcrumb rich snippets.
   - `Product`: Integrated on product pages (both dynamic and static SEO versions).
4. **Static SEO Pages (Requirement 10.E):**
   - Independent HTML files at `products/{slug}/index.html` provide full pre-rendered HTML content and schema to guarantee 100% Googlebot indexing without waiting for client-side JavaScript execution.

---

## 🛠️ 5. Maintenance: Updating Products and Images

### A. Updating Existing Product Details
Edit `data/products.json`. Each product follows this standard JSON structure:

```json
{
  "id": "pousami-gold",
  "slug": "pousami-gold",
  "name": "Pousami Gold Paddy Seed",
  "category": "Paddy Seeds",
  "shortDescription": "Pousami Gold Paddy Seed from SRABANI SEED FARM.",
  "description": "Full description of the variety...",
  "features": [
    "High physical purity with thorough seed grading",
    "Selected for strong germination and seedling vigour"
  ],
  "specifications": {
    "seedType": "High-Yielding Paddy Seed",
    "packaging": "Standard farm-sealed bags",
    "availability": "Available for current sowing season"
  },
  "images": [
    {
      "src": "assets/images/products/pousami-gold-1.jpg",
      "alt": "Pousami Gold Paddy Seed packaging and grain sample at SRABANI SEED FARM"
    }
  ]
}
```

> **Note on Specifications:** The UI is designed to only render specifications when the field is non-empty. If a specification is not verified or currently unknown, set it to `""` or omit it.

### B. Adding a New Product Variety
1. Add a new product object to the array in `data/products.json`.
2. Add the corresponding images (e.g. `assets/images/products/new-variety-1.jpg`).
3. Create the static SEO page directory `products/{slug}/index.html` (copying one of the existing static templates) to ensure direct search engine indexing.
4. Add the new static URL to `sitemap.xml`.

### C. Replacing Images
1. Save high-resolution photography in `assets/images/products/` (recommended ratio: 4:3, e.g. 800x600 or 1200x900, WebP or JPG).
2. Update the `src` and descriptive `alt` attribute in `data/products.json`.
3. If an image path is ever broken, the system automatically swaps in `assets/images/products/placeholder.svg`.

---

## 🚀 6. Deployment Guide

### Netlify
1. Simply drag-and-drop the project folder to the Netlify Drop dashboard, or connect via GitHub repository.
2. Build command: None required (static).
3. Publish directory: `.` (root).
4. To enable contact form processing via Netlify Forms, add `data-netlify="true"` to `<form id="contactForm">` in `contact.html`.

### GitHub Pages
1. Push the repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Choose the branch `main` and root directory `/`.
4. Click **Save**.

### Traditional Web Hosting (cPanel / Apache / Nginx)
Upload all files and directories into `public_html/`. The site requires no Node.js, PHP, or database.

---

## 📞 7. Direct Contact

**SRABANI SEED FARM**
- **Address:** Sabang - Moharh Rd, Sindurmuri, Sabang, West Bengal 721144, India
- **Phone:** +91 99324 42449 / +91 3222 291 185
