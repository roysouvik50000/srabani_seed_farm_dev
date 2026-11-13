/**
 * SRABANI SEED FARM – Products Listing & Inline Expandable Details JavaScript
 * Dynamically loads products from data/products.json and renders them into the DOM.
 * Products expand inline on the products page without navigating away.
 */

(function () {
  'use strict';

  // Helper to determine relative path prefix to site root
  function getPathPrefix() {
    return '';
  }

  // Escape HTML helper
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

  // Format spec keys into human readable labels
  function formatSpecLabel(key) {
    const labels = {
      seedType: 'Seed Type',
      packaging: 'Packaging',
      availability: 'Current Availability',
      cropSeason: 'Sowing Season',
      maturityDuration: 'Maturity Duration',
      grainType: 'Grain Classification',
      origin: 'Farm Origin'
    };
    if (labels[key]) return labels[key];
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  // Fetch centralized products data
  async function fetchProducts() {
    const dataUrl = 'data/products.json';
    try {
      const response = await fetch(dataUrl);
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
    const imageObj = (product.images && product.images.length > 0) ? product.images[0] : null;
    const imgSrc = imageObj ? imageObj.src : 'assets/images/products/placeholder.svg';
    const imgAlt = imageObj ? imageObj.alt : `${product.name} at SRABANI SEED FARM`;
    const targetUrl = `products.html#${encodeURIComponent(product.slug)}`;

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
          <span class="product-card-badge">${escapeHtml(product.category || 'Paddy Seeds')}</span>
        </div>
        <div class="product-card-body">
          <h3 class="product-card-title">
            <a href="${targetUrl}">${escapeHtml(product.name)}</a>
          </h3>
          <p class="product-card-desc">
            ${escapeHtml(product.shortDescription || 'Quality paddy seed selected by SRABANI SEED FARM.')}
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
    const images = (product.images && product.images.length > 0) ? product.images : [{
      src: 'assets/images/products/placeholder.svg',
      alt: `${product.name} sample`
    }];
    const primaryImg = images[0];
    const cardId = `product-${product.slug}`;
    const detailsId = `details-${product.slug}`;

    // Gallery thumbnails (if more than 1 image)
    let galleryHtml = '';
    if (images.length > 1) {
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

      galleryHtml = `
        <div class="product-card-gallery">
          <span class="product-gallery-label">Photos (${images.length}):</span>
          <div class="product-gallery-thumbs" role="group" aria-label="Product photo gallery">
            ${thumbsHtml}
          </div>
        </div>
      `;
    }

    // Features list
    let featuresHtml = '';
    if (product.features && product.features.length > 0) {
      featuresHtml = `
        <div class="product-features-wrap">
          <h4 class="features-heading">Key Variety Features</h4>
          <ul class="features-list">
            ${product.features.map(f => `
              <li class="feature-item">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                <span>${escapeHtml(f)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    // Specifications table
    let specsHtml = '';
    if (product.specifications && Object.keys(product.specifications).length > 0) {
      const specRows = Object.entries(product.specifications).map(([key, val]) => `
        <tr>
          <th scope="row">${escapeHtml(formatSpecLabel(key))}</th>
          <td>${escapeHtml(val)}</td>
        </tr>
      `).join('');

      specsHtml = `
        <div class="product-specs-wrap">
          <h4 class="product-detail-subheading">Seed Specifications</h4>
          <table class="specs-table">
            <tbody>
              ${specRows}
            </tbody>
          </table>
        </div>
      `;
    }

    // WhatsApp pre-filled text
    const waText = `Hello SRABANI SEED FARM, I would like to inquire about seed availability, packaging, and pricing for: ${product.name}.`;
    const waUrl = `https://wa.me/919932442449?text=${encodeURIComponent(waText)}`;
    const onlineInquireUrl = `contact.html?product=${encodeURIComponent(product.name)}`;

    return `
      <article class="product-card" id="${escapeHtml(cardId)}" data-slug="${escapeHtml(product.slug)}">
        <div class="product-card-img-wrap">
          <img 
            src="${escapeHtml(primaryImg.src)}" 
            alt="${escapeHtml(primaryImg.alt)}" 
            class="product-card-img fallbackable" 
            loading="lazy" 
            width="400" 
            height="300"
          >
          <span class="product-card-badge">${escapeHtml(product.category || 'Paddy Seeds')}</span>
        </div>

        <div class="product-card-body">
          <h3 class="product-card-title">
            <a href="#${escapeHtml(product.slug)}" class="product-title-toggle" role="button" aria-expanded="false" aria-controls="${escapeHtml(detailsId)}">
              ${escapeHtml(product.name)}
            </a>
          </h3>
          <p class="product-card-desc">
            ${escapeHtml(product.shortDescription || 'High-purity agricultural paddy seed.')}
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

            <div class="product-detail-block">
              <h4 class="product-detail-subheading">About Variety</h4>
              <p class="product-detail-text">
                ${escapeHtml(product.description || product.shortDescription || '')}
              </p>
            </div>

            ${featuresHtml}

            ${specsHtml}

            <div class="product-card-actions">
              <div class="product-card-actions-row">
                <a href="${waUrl}" class="btn btn-sm btn-whatsapp" target="_blank" rel="noopener noreferrer">
                  💬 WhatsApp Farm
                </a>
                <a href="${onlineInquireUrl}" class="btn btn-sm btn-primary">
                  ✉ Inquire Online
                </a>
              </div>
              <a href="tel:+919932442449" class="btn btn-sm btn-golden btn-block">
                📞 Call Sabang Farm (+91 99324 42449)
              </a>
            </div>

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
    // 1. Expand / Collapse Button & Title click delegation
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
        // Scroll card gently into view if user was scrolled down inside details
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      // Gallery thumbnail click
      const thumbBtn = e.target.closest('.product-gallery-thumb-btn');
      if (thumbBtn) {
        e.preventDefault();
        const card = thumbBtn.closest('.product-card');
        const mainImg = card.querySelector('.product-card-img');
        const newSrc = thumbBtn.getAttribute('data-src');
        const newAlt = thumbBtn.getAttribute('data-alt');

        if (mainImg && newSrc) {
          mainImg.style.opacity = '0.4';
          setTimeout(() => {
            mainImg.src = newSrc;
            if (newAlt) mainImg.alt = newAlt;
            mainImg.style.opacity = '1';
          }, 120);
        }

        // Update active thumbnail
        const thumbs = card.querySelectorAll('.product-gallery-thumb-btn');
        thumbs.forEach(t => t.classList.remove('active'));
        thumbBtn.classList.add('active');
        return;
      }
    });
  }

  // Handle URL hash or search parameter navigation (e.g. products.html#pousami-gold)
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

      function renderList(list) {
        if (list.length === 0) {
          productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
              <p>No paddy seed varieties matched your search. Try searching "Pousami", "Gobinda", or "Badsha".</p>
            </div>
          `;
        } else {
          productsGrid.innerHTML = list.map(p => createCatalogCardHtml(p)).join('');
        }
        if (countBadge) {
          countBadge.textContent = `${list.length} Variet${list.length === 1 ? 'y' : 'ies'} Available`;
        }
      }

      renderList(products);

      // Search Filter
      if (searchInput) {
        searchInput.addEventListener('input', function (e) {
          const query = e.target.value.toLowerCase().trim();
          const filtered = products.filter(p => {
            const nameMatch = p.name && p.name.toLowerCase().includes(query);
            const shortMatch = p.shortDescription && p.shortDescription.toLowerCase().includes(query);
            const descMatch = p.description && p.description.toLowerCase().includes(query);
            const catMatch = p.category && p.category.toLowerCase().includes(query);
            const featureMatch = p.features && p.features.some(f => f.toLowerCase().includes(query));
            return nameMatch || shortMatch || descMatch || catMatch || featureMatch;
          });
          renderList(filtered);
        });
      }

      // Check URL hash immediately and listen for changes
      handleUrlTarget();
      window.addEventListener('hashchange', handleUrlTarget);
    }
  }

  document.addEventListener('DOMContentLoaded', initProducts);
})();
