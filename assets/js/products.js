/**
 * SRABANI SEED FARM – Products Listing JavaScript
 * Dynamically loads products from data/products.json and renders them into the DOM.
 */

(function () {
  'use strict';

  // Helper to determine relative path prefix to site root
  function getPathPrefix() {
    const path = window.location.pathname;
    if (path.includes('/products/')) {
      return '../../';
    }
    return '';
  }

  // Fetch centralized products data
  async function fetchProducts() {
    const prefix = getPathPrefix();
    const dataUrl = prefix + 'data/products.json';
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

  // Render a single product card
  function createProductCardHtml(product, prefix) {
    const imageObj = (product.images && product.images.length > 0) ? product.images[0] : null;
    const imgSrc = imageObj ? prefix + imageObj.src : prefix + 'assets/images/products/placeholder.svg';
    const imgAlt = imageObj ? imageObj.alt : `${product.name} at SRABANI SEED FARM`;
    const detailsUrl = `${prefix}product-details.html?slug=${encodeURIComponent(product.slug)}`;

    return `
      <article class="product-card" data-slug="${escapeHtml(product.slug)}">
        <div class="product-card-img-wrap">
          <a href="${detailsUrl}" tabindex="-1" aria-hidden="true">
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
            <a href="${detailsUrl}">${escapeHtml(product.name)}</a>
          </h3>
          <p class="product-card-desc">
            ${escapeHtml(product.shortDescription || 'Quality paddy seed selected by SRABANI SEED FARM.')}
          </p>
          <div class="product-card-footer">
            <span class="product-origin-label">Sabang, West Bengal</span>
            <a href="${detailsUrl}" class="btn btn-sm btn-primary" aria-label="View details for ${escapeHtml(product.name)}">
              View Details &rarr;
            </a>
          </div>
        </div>
      </article>
    `;
  }

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

  // Initialize Product Listing on page load
  async function initProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const featuredGrid = document.getElementById('featuredProductsGrid');
    const searchInput = document.getElementById('productSearchInput');
    const countBadge = document.getElementById('productsCount');

    if (!productsGrid && !featuredGrid) return;

    const prefix = getPathPrefix();
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

    // If featured grid on home page
    if (featuredGrid) {
      // Display first 3 products
      const featuredItems = products.slice(0, 3);
      featuredGrid.innerHTML = featuredItems.map(p => createProductCardHtml(p, prefix)).join('');
    }

    // If full products listing page
    if (productsGrid) {
      function renderList(list) {
        if (list.length === 0) {
          productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
              <p>No paddy seed varieties matched your search. Try "Pousami", "Gobinda", or "Badsha".</p>
            </div>
          `;
        } else {
          productsGrid.innerHTML = list.map(p => createProductCardHtml(p, prefix)).join('');
        }
        if (countBadge) {
          countBadge.textContent = `${list.length} Variet${list.length === 1 ? 'y' : 'ies'} Available`;
        }
      }

      renderList(products);

      if (searchInput) {
        searchInput.addEventListener('input', function (e) {
          const query = e.target.value.toLowerCase().trim();
          const filtered = products.filter(p => {
            return p.name.toLowerCase().includes(query) ||
                   (p.shortDescription && p.shortDescription.toLowerCase().includes(query)) ||
                   (p.category && p.category.toLowerCase().includes(query));
          });
          renderList(filtered);
        });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', initProducts);
})();
