/**
 * SRABANI SEED FARM – SEO Helper Script
 * Enhances client-side metadata and validates schema integration.
 */

(function () {
  'use strict';

  // Helper to dynamically update or inject Product Schema on dynamic product-details page
  function updateProductSchema(product) {
    if (!product) return;

    let schemaScript = document.getElementById('dynamicProductSchema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'dynamicProductSchema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const domain = window.location.origin.includes('http') ? window.location.origin : 'https://srabaniseedfarm.com';
    const firstImg = product.images && product.images.length > 0 ? product.images[0].src : 'assets/images/logo.png';

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.shortDescription || product.description,
      "image": [
        `${domain}/${firstImg}`
      ],
      "category": product.category || "Paddy Seeds",
      "brand": {
        "@type": "Brand",
        "name": "SRABANI SEED FARM"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "LocalBusiness",
          "name": "SRABANI SEED FARM",
          "telephone": ["+919932442449", "+918348456914"],
          "sameAs": ["https://www.facebook.com/share/1JAVYuC28b/"],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Sabang - Moharh Rd, Sindurmuri",
            "addressLocality": "Sabang",
            "addressRegion": "West Bengal",
            "postalCode": "721144",
            "addressCountry": "IN"
          }
        }
      }
    };

    schemaScript.textContent = JSON.stringify(productSchema, null, 2);
  }

  window.SRABANI_SEO = {
    updateProductSchema: updateProductSchema
  };
})();
