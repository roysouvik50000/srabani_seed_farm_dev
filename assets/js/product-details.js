/**
 * SRABANI SEED FARM – Dynamic Product Details JavaScript
 * Reads slug from URL query, fetches data/products.json, renders product details,
 * powers the image carousel, handles specifications conditionally, and shows related products.
 */

(function () {
  'use strict';

  function getPathPrefix() {
    const path = window.location.pathname;
    if (path.includes('/products/')) {
      return '../../';
    }
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

  // Format camelCase or snake_case key to Human Readable title
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
    // Fallback: camelCase to words
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  // Carousel State & Controller
  class ProductCarousel {
    constructor(images, containerEl, prefix) {
      this.images = images && images.length > 0 ? images : [{
        src: 'assets/images/products/placeholder.svg',
        alt: 'SRABANI SEED FARM product sample'
      }];
      this.containerEl = containerEl;
      this.prefix = prefix;
      this.currentIndex = 0;
      this.touchStartX = 0;
      this.touchEndX = 0;

      this.init();
    }

    init() {
      this.render();
      this.attachEvents();
    }

    render() {
      const activeImg = this.images[this.currentIndex];
      const activeSrc = this.prefix + activeImg.src;
      const activeAlt = activeImg.alt || 'Paddy seed sample';

      const thumbnailsHtml = this.images.map((img, idx) => `
        <button 
          type="button" 
          class="carousel-thumb-btn ${idx === this.currentIndex ? 'active' : ''}" 
          data-index="${idx}"
          aria-label="View photo ${idx + 1} of ${this.images.length}"
        >
          <img src="${escapeHtml(this.prefix + img.src)}" alt="${escapeHtml(img.alt)}" class="carousel-thumb-img fallbackable">
        </button>
      `).join('');

      this.containerEl.innerHTML = `
        <div class="carousel-wrapper" role="region" aria-label="Product Image Carousel">
          <div class="carousel-viewport">
            <img 
              id="carouselMainImg" 
              src="${escapeHtml(activeSrc)}" 
              alt="${escapeHtml(activeAlt)}" 
              class="carousel-main-img fallbackable"
              width="800"
              height="600"
            >
            ${this.images.length > 1 ? `
              <button type="button" class="carousel-nav-btn carousel-prev-btn" aria-label="Previous Image">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button type="button" class="carousel-nav-btn carousel-next-btn" aria-label="Next Image">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            ` : ''}
          </div>
          ${this.images.length > 1 ? `
            <div class="carousel-thumbnails" role="tablist" aria-label="Image thumbnails">
              ${thumbnailsHtml}
            </div>
          ` : ''}
        </div>
      `;
    }

    attachEvents() {
      const prevBtn = this.containerEl.querySelector('.carousel-prev-btn');
      const nextBtn = this.containerEl.querySelector('.carousel-next-btn');
      const thumbs = this.containerEl.querySelectorAll('.carousel-thumb-btn');
      const viewport = this.containerEl.querySelector('.carousel-viewport');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.prev());
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.next());
      }

      thumbs.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
          const index = parseInt(thumb.getAttribute('data-index'), 10);
          this.goTo(index);
        });
      });

      // Keyboard left/right
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });

      // Touch swipe gestures
      if (viewport) {
        viewport.addEventListener('touchstart', (e) => {
          this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
          this.touchEndX = e.changedTouches[0].screenX;
          this.handleSwipe();
        }, { passive: true });
      }
    }

    handleSwipe() {
      const swipeDistance = this.touchEndX - this.touchStartX;
      if (swipeDistance > 45) {
        this.prev();
      } else if (swipeDistance < -45) {
        this.next();
      }
    }

    goTo(index) {
      if (index < 0) index = this.images.length - 1;
      if (index >= this.images.length) index = 0;
      this.currentIndex = index;

      const mainImg = this.containerEl.querySelector('#carouselMainImg');
      if (mainImg) {
        mainImg.style.opacity = '0.4';
        setTimeout(() => {
          const cur = this.images[this.currentIndex];
          mainImg.src = this.prefix + cur.src;
          mainImg.alt = cur.alt || 'Paddy seed sample';
          mainImg.style.opacity = '1';
        }, 120);
      }

      const thumbs = this.containerEl.querySelectorAll('.carousel-thumb-btn');
      thumbs.forEach((th, idx) => {
        th.classList.toggle('active', idx === this.currentIndex);
      });
    }

    next() {
      this.goTo(this.currentIndex + 1);
    }

    prev() {
      this.goTo(this.currentIndex - 1);
    }
  }

  // Populate dynamic product details
  async function initProductDetails() {
    const detailsContainer = document.getElementById('productDetailsApp');
    const notFoundContainer = document.getElementById('productNotFound');
    if (!detailsContainer) return;

    const prefix = getPathPrefix();

    // 1. Identify product slug
    // Priority: query param ?slug=... OR data-static-slug attribute on static SEO pages
    const urlParams = new URLSearchParams(window.location.search);
    let slug = urlParams.get('slug');

    if (!slug) {
      const staticAttr = detailsContainer.getAttribute('data-static-slug');
      if (staticAttr) {
        slug = staticAttr;
      } else {
        // Check if URL ends with products/{slug}/
        const pathSegments = window.location.pathname.replace(/\/$/, '').split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (lastSegment && lastSegment !== 'product-details.html' && lastSegment !== 'index.html') {
          slug = lastSegment;
        }
      }
    }

    if (!slug) {
      showNotFound('No product identifier was specified in the request.');
      return;
    }

    slug = slug.toLowerCase().trim();

    // 2. Fetch products.json
    let products = [];
    try {
      const response = await fetch(prefix + 'data/products.json');
      if (!response.ok) throw new Error('Could not fetch products catalog');
      products = await response.json();
    } catch (err) {
      console.error(err);
      showNotFound('Unable to retrieve seed catalog data. Please try again or contact us directly.');
      return;
    }

    // 3. Find matching product
    const product = products.find(p => p.slug === slug || p.id === slug);

    if (!product) {
      showNotFound(`We could not find any paddy seed variety matching "${escapeHtml(slug)}".`);
      return;
    }

    // 4. Update Document Metadata
    document.title = `${product.name} | SRABANI SEED FARM, Sabang`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && product.shortDescription) {
      metaDesc.setAttribute('content', `${product.shortDescription} Sourced & distributed by SRABANI SEED FARM in Sabang, West Bengal.`);
    }

    // 5. Populate Breadcrumb product name
    const breadcrumbCurrent = document.getElementById('breadcrumbProduct');
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = product.name;
    }

    // 6. Mount Carousel
    const carouselMount = document.getElementById('carouselMount');
    if (carouselMount) {
      new ProductCarousel(product.images, carouselMount, prefix);
    }

    // 7. Mount Info
    const titleEl = document.getElementById('productTitle');
    if (titleEl) titleEl.textContent = product.name;

    const categoryBadge = document.getElementById('productCategory');
    if (categoryBadge) categoryBadge.textContent = product.category || 'Paddy Seeds';

    const shortDescEl = document.getElementById('productShortDesc');
    if (shortDescEl) shortDescEl.textContent = product.shortDescription || '';

    const fullDescEl = document.getElementById('productFullDesc');
    if (fullDescEl) {
      fullDescEl.textContent = product.description || product.shortDescription || '';
    }

    // 8. Mount Features list
    const featuresWrap = document.getElementById('productFeaturesWrap');
    const featuresList = document.getElementById('productFeaturesList');
    if (featuresWrap && featuresList) {
      if (Array.isArray(product.features) && product.features.length > 0) {
        featuresList.innerHTML = product.features.map(f => `
          <li class="feature-item">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span>${escapeHtml(f)}</span>
          </li>
        `).join('');
        featuresWrap.style.display = 'block';
      } else {
        featuresWrap.style.display = 'none';
      }
    }

    // 9. Mount Specifications table ONLY when actual verified data is available
    const specsWrap = document.getElementById('productSpecsWrap');
    const specsBody = document.getElementById('productSpecsBody');
    if (specsWrap && specsBody) {
      const specs = product.specifications;
      if (specs && typeof specs === 'object') {
        const validEntries = Object.entries(specs).filter(([_, val]) => {
          return val !== null && val !== undefined && String(val).trim() !== '';
        });

        if (validEntries.length > 0) {
          specsBody.innerHTML = validEntries.map(([k, v]) => `
            <tr>
              <th scope="row">${escapeHtml(formatSpecLabel(k))}</th>
              <td>${escapeHtml(v)}</td>
            </tr>
          `).join('');
          specsWrap.style.display = 'block';
        } else {
          specsWrap.style.display = 'none';
        }
      } else {
        specsWrap.style.display = 'none';
      }
    }

    // 10. Configure Action Buttons
    const inquireBtn = document.getElementById('inquireProductBtn');
    if (inquireBtn) {
      inquireBtn.href = `${prefix}contact.html?product=${encodeURIComponent(product.name)}`;
    }

    // 11. Render Related Products
    const relatedSection = document.getElementById('relatedProductsSection');
    const relatedGrid = document.getElementById('relatedProductsGrid');
    if (relatedSection && relatedGrid) {
      const otherProducts = products.filter(p => p.slug !== product.slug);
      if (otherProducts.length > 0) {
        relatedGrid.innerHTML = otherProducts.map(p => {
          const imgObj = (p.images && p.images.length > 0) ? p.images[0] : null;
          const imgSrc = imgObj ? prefix + imgObj.src : prefix + 'assets/images/products/placeholder.svg';
          const link = `${prefix}product-details.html?slug=${encodeURIComponent(p.slug)}`;
          return `
            <article class="product-card">
              <div class="product-card-img-wrap">
                <a href="${link}" tabindex="-1" aria-hidden="true">
                  <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(p.name)}" class="product-card-img fallbackable" loading="lazy">
                </a>
                <span class="product-card-badge">${escapeHtml(p.category || 'Paddy Seeds')}</span>
              </div>
              <div class="product-card-body">
                <h3 class="product-card-title"><a href="${link}">${escapeHtml(p.name)}</a></h3>
                <p class="product-card-desc">${escapeHtml(p.shortDescription || '')}</p>
                <div class="product-card-footer">
                  <span class="product-origin-label">Sabang, WB</span>
                  <a href="${link}" class="btn btn-sm btn-primary">View Details &rarr;</a>
                </div>
              </div>
            </article>
          `;
        }).join('');
        relatedSection.style.display = 'block';
      } else {
        relatedSection.style.display = 'none';
      }
    }

    // Make sure details view is visible and error is hidden
    detailsContainer.style.display = 'block';
    if (notFoundContainer) notFoundContainer.style.display = 'none';
  }

  function showNotFound(message) {
    const detailsContainer = document.getElementById('productDetailsApp');
    const notFoundContainer = document.getElementById('productNotFound');
    const notFoundMsg = document.getElementById('notFoundMsg');

    if (detailsContainer) detailsContainer.style.display = 'none';
    if (notFoundContainer) {
      notFoundContainer.style.display = 'block';
      if (notFoundMsg && message) notFoundMsg.textContent = message;
    }
  }

  document.addEventListener('DOMContentLoaded', initProductDetails);
})();
