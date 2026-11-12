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
      const location = document.getElementById('inquiryLocation') ? document.getElementById('inquiryLocation').value.trim() : '';
      const subject = subjectSelect ? subjectSelect.value : 'Paddy Seed Inquiry';
      const message = messageBox ? messageBox.value.trim() : '';

      // Format WhatsApp Message for Srabani Seed Farm (+91 99324 42449)
      let text = `🌾 *SRABANI SEED FARM - Seed Inquiry*\n\n`;
      text += `👤 *Name:* ${name}\n`;
      text += `📞 *Phone:* ${phone}\n`;
      if (location) {
        text += `📍 *Location:* ${location}\n`;
      }
      text += `🌱 *Variety:* ${subject}\n`;
      if (message) {
        text += `📝 *Quantity & Sowing Details:* ${message}\n`;
      }

      const whatsappNumber = '919932442449';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

      const statusBox = document.getElementById('formStatusNotice');
      if (statusBox) {
        statusBox.className = 'form-status-notice success';
        statusBox.innerHTML = `
          <strong>✓ Connecting to WhatsApp...</strong><br>
          Opening WhatsApp with your inquiry for <em>${escapeHtml(subject)}</em>.<br>
          <div style="margin-top: 10px;">
            <a href="${whatsappUrl}" class="btn btn-sm btn-whatsapp btn-block" target="_blank" rel="noopener noreferrer">
              💬 Click here if WhatsApp didn't open automatically
            </a>
          </div>
        `;
      }

      // Automatically redirect to WhatsApp with pre-filled inquiry details
      window.location.href = whatsappUrl;
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
