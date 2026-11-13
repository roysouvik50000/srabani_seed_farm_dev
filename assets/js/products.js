/**
 * SRABANI SEED FARM – Seasonal Products Listing & Inline Expandable Details
 * Supports Kharif & Boro seasons, OP Paddy & Improved Paddy categories,
 * with minimal common specifications, 4 general images, and instant search/filtering.
 */

(function () {
  'use strict';

  // Helper to escape HTML safely
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    });
  }

  // Fetch centralized products data
  async function fetchProducts() {
    try {
      const response = await fetch('data/products.json');
      if (!response.ok) {
        throw new Error(`Failed to load product data: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching products.json:', err);
      return [];
    }
  }

  // Create card HTML for Featured Grid (Home Page)
  function createFeaturedCardHtml(product) {
    const images = (product.images && product.images.length > 0) ? product.images : [
      { src: 'assets/images/products/seed_packet_1.jpeg', alt: 'Paddy seed packet' }
    ];
    const imgSrc = images[0].src;
    const imgAlt = images[0].alt;
    const targetUrl = `products.html#${encodeURIComponent(product.slug)}`;
    const seasonClass = product.season ? `product-badge-${product.season.toLowerCase()}` : '';

    return `
      <article class="product-card" data-slug="${escapeHtml(product.slug)}">
        <div class="product-card-img-wrap">
          <a href="${targetUrl}" tabindex="-1" aria-hidden="true">
            <img 
              src="${escapeHtml(imgSrc)}" 
              alt="${escapeHtml(imgAlt)}" 
              class="product-card-img fallbackable" 
              loading="lazy" 
              width="400" 
              height="300"
            >
          </a>
          <span class="product-card-badge ${seasonClass}">${escapeHtml(product.season || 'Paddy')}</span>
          ${product.type ? `<span class="product-type-pill">${escapeHtml(product.type)}</span>` : ''}
        </div>
        <div class="product-card-body">
          <h3 class="product-card-title">
            <a href="${targetUrl}">${escapeHtml(product.name)}</a>
          </h3>
          <div class="product-meta-row">
            ${product.duration ? `<span class="product-meta-chip">⏱ Duration: <strong>${escapeHtml(product.duration)}</strong></span>` : ''}
            ${product.packaging ? `<span class="product-meta-chip">📦 Pack: <strong>${escapeHtml(product.packaging)}</strong></span>` : ''}
          </div>
          <p class="product-card-desc">
            ${escapeHtml(product.shortDescription || 'Quality certified paddy seed from SRABANI SEED FARM.')}
          </p>
          <div class="product-card-footer">
            <span class="product-origin-label">Sabang, West Bengal</span>
            <a href="${targetUrl}" class="btn btn-sm btn-primary" aria-label="View details for ${escapeHtml(product.name)}">
              View Details &rarr;
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // Create card HTML for Full Catalog Grid (Products Page) with Inline Expandable Details
  function createCatalogCardHtml(product) {
    const images = (product.images && product.images.length > 0) ? product.images : [
      { src: 'assets/images/products/seed_packet_1.jpeg', alt: 'Paddy seed packet' },
      { src: 'assets/images/products/seed_packet_2.jpeg', alt: 'Paddy seed packet' },
      { src: 'assets/images/products/seed_packet_3.jpeg', alt: 'Paddy seed packet' }
    ];
    const primaryImg = images[0];
    const cardId = `product-${product.slug}`;
    const detailsId = `details-${product.slug}`;
    const seasonClass = product.season ? `product-badge-${product.season.toLowerCase()}` : '';

    // Gallery thumbnails (random seed packet photos)
    const thumbsHtml = images.map((img, idx) => `
      <button 
        type="button" 
        class="product-gallery-thumb-btn ${idx === 0 ? 'active' : ''}" 
        data-src="${escapeHtml(img.src)}" 
        data-alt="${escapeHtml(img.alt)}" 
        aria-label="View photo ${idx + 1} of ${images.length}"
      >
        <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" class="product-gallery-thumb-img fallbackable" loading="lazy">
      </button>
    `).join('');

    const galleryHtml = `
      <div class="product-card-gallery">
        <span class="product-gallery-label">Seed Packet Photos (${images.length}):</span>
        <div class="product-gallery-thumbs" role="group" aria-label="Product photo gallery">
          ${thumbsHtml}
        </div>
      </div>
    `;

    // WhatsApp pre-filled text
    const waText = `Hello SRABANI SEED FARM, I would like to inquire about ${product.name} (${product.season} Season, Duration: ${product.duration}, Packaging: ${product.packaging}).`;
    const waUrl = `https://wa.me/919932442449?text=${encodeURIComponent(waText)}`;
    const onlineInquireUrl = `contact.html?product=${encodeURIComponent(product.name)}`;

    return `
      <article class="product-card" id="${escapeHtml(cardId)}" data-slug="${escapeHtml(product.slug)}" data-season="${escapeHtml((product.season || '').toLowerCase())}" data-type="${escapeHtml((product.type || '').toLowerCase())}">
        <div class="product-card-img-wrap">
          <img 
            src="${escapeHtml(primaryImg.src)}" 
            alt="${escapeHtml(primaryImg.alt)}" 
            class="product-card-img fallbackable" 
            loading="lazy" 
            width="400" 
            height="300"
          >
          <span class="product-card-badge ${seasonClass}">${escapeHtml(product.season || 'Paddy')}</span>
          ${product.type ? `<span class="product-type-pill">${escapeHtml(product.type)}</span>` : ''}
        </div>

        <div class="product-card-body">
          <h3 class="product-card-title">
            <a href="#${escapeHtml(product.slug)}" class="product-title-toggle" role="button" aria-expanded="false" aria-controls="${escapeHtml(detailsId)}">
              ${escapeHtml(product.name)}
            </a>
          </h3>

          <div class="product-meta-row">
            <span class="product-meta-chip">⏱ Duration: <strong>${escapeHtml(product.duration || 'Standard')}</strong></span>
            <span class="product-meta-chip">📦 Pack: <strong>${escapeHtml(product.packaging || 'Available')}</strong></span>
          </div>

          <p class="product-card-desc">
            ${escapeHtml(product.shortDescription || 'Graded agricultural paddy seed lot processed at Sabang.')}
          </p>

          <div class="product-card-footer">
            <span class="product-origin-label">Sabang, West Bengal</span>
            <button 
              type="button" 
              class="btn btn-sm btn-primary product-expand-btn" 
              aria-expanded="false" 
              aria-controls="${escapeHtml(detailsId)}"
              data-slug="${escapeHtml(product.slug)}"
            >
              <span class="expand-btn-text">View Details</span>
              <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>

          <!-- Inline Expandable Details -->
          <div class="product-card-details" id="${escapeHtml(detailsId)}" hidden>
            ${galleryHtml}

            <!-- Minimal Specifications Table -->
            <div class="product-specs-wrap">
              <h4 class="product-detail-subheading">Variety Specifications</h4>
              <table class="specs-table">
                <tbody>
                  <tr>
                    <th scope="row">Crop Season</th>
                    <td><strong>${escapeHtml(product.season || 'Kharif / Boro')}</strong></td>
                  </tr>
                  <tr>
                    <th scope="row">Crop Duration</th>
                    <td><strong>${escapeHtml(product.duration || 'N/A')}</strong></td>
                  </tr>
                  <tr>
                    <th scope="row">Seed Classification</th>
                    <td>${escapeHtml(product.type || 'Paddy Seed')}</td>
                  </tr>
                  <tr>
                    <th scope="row">Available Packaging</th>
                    <td>${escapeHtml(product.packaging || 'Standard bags')}</td>
                  </tr>
                  <tr>
                    <th scope="row">Quality Standard</th>
                    <td>Cleaned, physically graded, high germination vitality</td>
                  </tr>
                  <tr>
                    <th scope="row">Farm Processing</th>
                    <td>SRABANI SEED FARM, Sabang, West Bengal</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Minimal Variety Highlights -->
            <div class="product-features-wrap">
              <h4 class="features-heading">Key Variety Features</h4>
              <ul class="features-list">
                <li class="feature-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  <span>Matures reliably within <strong>${escapeHtml(product.duration)}</strong> for ${escapeHtml(product.season)} season.</span>
                </li>
                <li class="feature-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  <span>Graded to remove inert matter and chaff for uniform germination.</span>
                </li>
                <li class="feature-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  <span>Supplied in genuine farm-sealed packs directly from Sabang facility.</span>
                </li>
              </ul>
            </div>

            <!-- Action CTAs -->
            <div class="product-card-actions">
              <div class="product-card-actions-row">
                <a href="${waUrl}" class="btn btn-sm btn-whatsapp" target="_blank" rel="noopener noreferrer">
                  💬 WhatsApp Inquiry
                </a>
                <a href="${onlineInquireUrl}" class="btn btn-sm btn-primary">
                  ✉ Inquire Online
                </a>
              </div>
              <a href="tel:+919932442449" class="btn btn-sm btn-golden btn-block">
                📞 Call Sabang Farm (+91 99324 42449)
              </a>
            </div>

            <!-- Collapse Trigger -->
            <div class="product-card-collapse-wrap">
              <button 
                type="button" 
                class="btn btn-sm btn-outline-green product-collapse-trigger" 
                data-slug="${escapeHtml(product.slug)}"
                aria-controls="${escapeHtml(detailsId)}"
              >
                ▲ Hide Details
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // Toggle single card expansion
  function toggleCard(card, forceOpen = null) {
    if (!card) return;
    const details = card.querySelector('.product-card-details');
    const expandBtn = card.querySelector('.product-expand-btn');
    const titleToggle = card.querySelector('.product-title-toggle');
    const btnText = card.querySelector('.expand-btn-text');

    if (!details) return;

    const isCurrentlyOpen = card.classList.contains('is-expanded');
    const shouldOpen = (forceOpen !== null) ? forceOpen : !isCurrentlyOpen;

    if (shouldOpen) {
      card.classList.add('is-expanded');
      details.hidden = false;
      if (expandBtn) expandBtn.setAttribute('aria-expanded', 'true');
      if (titleToggle) titleToggle.setAttribute('aria-expanded', 'true');
      if (btnText) btnText.textContent = 'Hide Details';
    } else {
      card.classList.remove('is-expanded');
      details.hidden = true;
      if (expandBtn) expandBtn.setAttribute('aria-expanded', 'false');
      if (titleToggle) titleToggle.setAttribute('aria-expanded', 'false');
      if (btnText) btnText.textContent = 'View Details';
    }
  }

  // Attach interactive events to products grid
  function attachGridEvents(productsGrid) {
    productsGrid.addEventListener('click', function (e) {
      // Toggle button
      const expandBtn = e.target.closest('.product-expand-btn');
      if (expandBtn) {
        e.preventDefault();
        const card = expandBtn.closest('.product-card');
        toggleCard(card);
        return;
      }

      // Title click
      const titleToggle = e.target.closest('.product-title-toggle');
      if (titleToggle) {
        e.preventDefault();
        const card = titleToggle.closest('.product-card');
        toggleCard(card);
        return;
      }

      // Bottom collapse button
      const collapseBtn = e.target.closest('.product-collapse-trigger');
      if (collapseBtn) {
        e.preventDefault();
        const card = collapseBtn.closest('.product-card');
        toggleCard(card, false);
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      // Photo gallery thumbnail click
      const thumbBtn = e.target.closest('.product-gallery-thumb-btn');
      if (thumbBtn) {
        e.preventDefault();
        const card = thumbBtn.closest('.product-card');
        const mainImg = card.querySelector('.product-card-img');
        const newSrc = thumbBtn.getAttribute('data-src');
        const newAlt = thumbBtn.getAttribute('data-alt');

        if (mainImg && newSrc) {
          mainImg.style.opacity = '0.35';
          setTimeout(() => {
            mainImg.src = newSrc;
            if (newAlt) mainImg.alt = newAlt;
            mainImg.style.opacity = '1';
          }, 120);
        }

        const thumbs = card.querySelectorAll('.product-gallery-thumb-btn');
        thumbs.forEach(t => t.classList.remove('active'));
        thumbBtn.classList.add('active');
        return;
      }
    });
  }

  // Handle URL hash or search parameter navigation (e.g. products.html#gobinda-bhog)
  function handleUrlTarget() {
    const hash = window.location.hash.replace('#', '').trim();
    const urlParams = new URLSearchParams(window.location.search);
    const targetSlug = hash || urlParams.get('slug') || urlParams.get('product');

    if (!targetSlug) return;

    const card = document.querySelector(`.product-card[data-slug="${targetSlug}"]`);
    if (card) {
      toggleCard(card, true);
      card.classList.add('card-highlight');
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      setTimeout(() => {
        card.classList.remove('card-highlight');
      }, 2500);
    }
  }

  // Initialize Product Listing on page load
  async function initProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const featuredGrid = document.getElementById('featuredProductsGrid');
    const searchInput = document.getElementById('productSearchInput');
    const countBadge = document.getElementById('productsCount');
    const filterButtons = document.querySelectorAll('.catalog-filter-bar .filter-btn');

    if (!productsGrid && !featuredGrid) return;

    const products = await fetchProducts();

    if (!products || products.length === 0) {
      const emptyHtml = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #FFF9E9; border-radius: 8px; border: 1px solid #D6A52C;">
          <h3 style="color: #164D2A;">Product Catalog Update</h3>
          <p style="color: #555;">Our seasonal paddy seed listings are currently being updated from Sabang, West Bengal. Please check back shortly or call us directly at +91 99324 42449.</p>
        </div>
      `;
      if (productsGrid) productsGrid.innerHTML = emptyHtml;
      if (featuredGrid) featuredGrid.innerHTML = emptyHtml;
      return;
    }

    // 1. Featured Grid on Home Page
    if (featuredGrid) {
      const featuredItems = products.slice(0, 3);
      featuredGrid.innerHTML = featuredItems.map(p => createFeaturedCardHtml(p)).join('');
    }

    // 2. Full Catalog Grid on Products Page
    if (productsGrid) {
      attachGridEvents(productsGrid);

      let currentFilter = 'all';
      let currentQuery = '';

      // Check URL search param for initial season filter (e.g. ?season=kharif or ?season=boro)
      const urlParams = new URLSearchParams(window.location.search);
      const seasonParam = urlParams.get('season');
      if (seasonParam && (seasonParam.toLowerCase() === 'kharif' || seasonParam.toLowerCase() === 'boro')) {
        currentFilter = seasonParam.toLowerCase();
        filterButtons.forEach(btn => {
          if (btn.getAttribute('data-filter') === currentFilter) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      function applyFilters() {
        const filtered = products.filter(p => {
          // Season / Category filter
          if (currentFilter === 'kharif' && (p.season || '').toLowerCase() !== 'kharif') return false;
          if (currentFilter === 'boro' && (p.season || '').toLowerCase() !== 'boro') return false;
          if (currentFilter === 'op' && !(p.type || '').toLowerCase().includes('op')) return false;
          if (currentFilter === 'improved' && !(p.type || '').toLowerCase().includes('improved')) return false;

          // Search text filter
          if (currentQuery) {
            const nameMatch = p.name && p.name.toLowerCase().includes(currentQuery);
            const durationMatch = p.duration && p.duration.toLowerCase().includes(currentQuery);
            const seasonMatch = p.season && p.season.toLowerCase().includes(currentQuery);
            const typeMatch = p.type && p.type.toLowerCase().includes(currentQuery);
            const packMatch = p.packaging && p.packaging.toLowerCase().includes(currentQuery);
            return nameMatch || durationMatch || seasonMatch || typeMatch || packMatch;
          }
          return true;
        });

        if (filtered.length === 0) {
          productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-alt); border-radius: var(--radius-md); border: 1px dashed var(--border-light);">
              <p style="margin-bottom: 8px; font-weight: 600; color: var(--dark-text);">No seed varieties found matching your filter.</p>
              <p style="font-size: 0.9rem; color: var(--muted-text);">Try searching for variety names like "MTU-7029", "Santoshi", "Gobinda Bhog", "Shyamashree", or clear the filter.</p>
            </div>
          `;
        } else {
          productsGrid.innerHTML = filtered.map(p => createCatalogCardHtml(p)).join('');
        }

        if (countBadge) {
          countBadge.textContent = `${filtered.length} Variet${filtered.length === 1 ? 'y' : 'ies'} Available`;
        }
      }

      // Initial render
      applyFilters();

      // Search input listener
      if (searchInput) {
        searchInput.addEventListener('input', function (e) {
          currentQuery = e.target.value.toLowerCase().trim();
          applyFilters();
        });
      }

      // Filter buttons listener
      if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
          btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            applyFilters();
          });
        });
      }

      // Handle deep links (hash navigation)
      handleUrlTarget();
      window.addEventListener('hashchange', handleUrlTarget);
    }
  }

  document.addEventListener('DOMContentLoaded', initProducts);
})();
