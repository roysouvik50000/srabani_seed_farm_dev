/**
 * SRABANI SEED FARM – Main JavaScript
 * Handles navigation, mobile drawer, form validation, image fallbacks, and utility interactions.
 */

(function () {
  'use strict';

  // 1. Mobile Navigation Drawer
  function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const closeBtn = document.querySelector('.mobile-drawer-close');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.mobile-drawer-overlay');

    if (!toggleBtn || !drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Close drawer when a nav link is clicked
    const mobileLinks = drawer.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });
  }

  // 2. Highlight Active Nav Link
  function initActiveNav() {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const currentFile = currentPath.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.replace(/^\.\//, '').replace(/\/$/, '').split('/').pop() || 'index.html';

      if (currentFile === linkFile || (currentFile === '' && linkFile === 'index.html')) {
        link.classList.add('active');
      } else if (currentPath.includes('/products/') && href.includes('products')) {
        link.classList.add('active');
      }
    });
  }

  // 3. Dynamic Footer Year
  function initFooterYear() {
    const yearEls = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = currentYear;
    });
  }

  // 4. Global Image Fallback Handler
  function initImageFallbacks() {
    // When any product image fails to load, swap with placeholder SVG
    document.addEventListener('error', function (e) {
      if (e.target && e.target.tagName === 'IMG' && e.target.classList.contains('fallbackable')) {
        // Find relative path to placeholder
        const depth = (window.location.pathname.match(/\//g) || []).length;
        const prefix = window.location.pathname.includes('/products/') ? '../../' : '';
        e.target.src = prefix + 'assets/images/products/placeholder.svg';
        e.target.alt = 'SRABANI SEED FARM – Image sample placeholder';
      }
    }, true);
  }

  // 5. Contact Form Handler (Transparent Static Form Behavior)
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Check if URL has ?product= query parameter to auto-fill
    const urlParams = new URLSearchParams(window.location.search);
    const productQuery = urlParams.get('product');
    const subjectSelect = document.getElementById('inquirySubject');
    const messageBox = document.getElementById('inquiryMessage');

    if (productQuery && subjectSelect) {
      // Find matching option or set value
      for (let i = 0; i < subjectSelect.options.length; i++) {
        if (subjectSelect.options[i].text.toLowerCase().includes(productQuery.toLowerCase())) {
          subjectSelect.selectedIndex = i;
          break;
        }
      }
      if (messageBox && !messageBox.value) {
        messageBox.value = `Hello SRABANI SEED FARM, I would like to inquire about seed availability, packaging, and pricing for: ${productQuery}.`;
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const name = document.getElementById('inquiryName') ? document.getElementById('inquiryName').value.trim() : '';
      const phone = document.getElementById('inquiryPhone') ? document.getElementById('inquiryPhone').value.trim() : '';
      const subject = subjectSelect ? subjectSelect.value : 'Paddy Seed Inquiry';
      const message = messageBox ? messageBox.value.trim() : '';

      const statusBox = document.getElementById('formStatusNotice');
      if (statusBox) {
        statusBox.className = 'form-status-notice success';
        statusBox.innerHTML = `
          <strong>Thank you, ${escapeHtml(name)}!</strong><br>
          Your inquiry for <em>${escapeHtml(subject)}</em> has been prepared.<br>
          <p style="margin-top: 8px; margin-bottom: 8px; font-size: 0.9rem;">
            Because SRABANI SEED FARM operates on direct farmer communication, you can connect with our Sabang center immediately:
          </p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">
            <a href="https://wa.me/919932442449?text=${encodeURIComponent('Hello SRABANI SEED FARM, my name is ' + name + ' (Phone: ' + phone + '). Inquiry about ' + subject + ': ' + message)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp">💬 Send to WhatsApp (+91 99324 42449)</a>
            <a href="tel:+919932442449" class="btn btn-sm btn-primary">📞 Call +91 99324 42449</a>
            <a href="tel:+918348456914" class="btn btn-sm btn-outline-green">📞 Call +91 83484 56914</a>
            <a href="mailto:srabaniseedfarm@gmail.com?subject=${encodeURIComponent('Inquiry: ' + subject)}&body=${encodeURIComponent('Name: ' + name + '\nPhone: ' + phone + '\nMessage: ' + message)}" class="btn btn-sm btn-golden">✉ Send via Email</a>
          </div>
        `;
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    });
  }

  // Initialize all on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initActiveNav();
    initFooterYear();
    initImageFallbacks();
    initContactForm();
  });
})();
