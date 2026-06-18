/**
 * JALUSTORE - Products Module
 * Fetches product data and renders cards with WhatsApp ordering
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  
  const WHATSAPP_NUMBER = '6285363625159';
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

  // ============================================
  // FETCH PRODUCTS
  // ============================================
  
  async function fetchProducts() {
    try {
      const response = await fetch('data/products.json');
      if (!response.ok) throw new Error('Failed to load products');
      return await response.json();
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback data
      return {
        '30/hari': [
          { qty: '100🤍', price: 'Rp10.000' },
          { qty: '200🤍', price: 'Rp20.000' },
          { qty: '300🤍', price: 'Rp30.000' },
          { qty: '440🤍', price: 'Rp40.000' },
          { qty: '560🤍', price: 'Rp50.000' },
          { qty: '1200🤍', price: 'Rp100.000', best: true },
        ],
        '50/hari': [
          { qty: '100🤍', price: 'Rp15.000' },
          { qty: '200🤍', price: 'Rp25.000' },
          { qty: '300🤍', price: 'Rp35.000' },
          { qty: '440🤍', price: 'Rp45.000' },
          { qty: '560🤍', price: 'Rp55.000' },
          { qty: '1200🤍', price: 'Rp130.000', best: true },
        ]
      };
    }
  }

  // ============================================
  // SANITIZATION
  // ============================================
  
  function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function buildWhatsAppMessage(qty, price, cat) {
    const message = `Halo JALUSTORE, saya mau pesan ${qty} (${cat}) dengan harga ${price}. Kode pertemanan saya: [isi kode]`;
    return encodeURIComponent(message);
  }

  // ============================================
  // RENDER PRODUCTS
  // ============================================
  
  function renderProducts(products, category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = products[category];
    if (!items || items.length === 0) {
      container.innerHTML = '<p class="text-center text-white/40">Produk tidak tersedia</p>';
      return;
    }

    let html = '';
    
    items.forEach((product) => {
      const isBest = product.best === true;
      const bestClass = isBest ? 'best-seller' : '';
      const bestBadge = isBest 
        ? `<span class="best-badge" aria-label="Best seller">⭐ Best Seller</span>` 
        : '';
      
      const qty = sanitizeText(product.qty);
      const price = sanitizeText(product.price);
      const cat = sanitizeText(category);
      
      const waMessage = buildWhatsAppMessage(qty, price, cat);
      const waLink = `${WHATSAPP_URL}?text=${waMessage}`;

      html += `
        <div class="product-card ${bestClass}" role="listitem">
          ${bestBadge}
          <div class="flex justify-between items-center">
            <span class="heart-icon" aria-hidden="true">${qty}</span>
            <span class="product-price">${price}</span>
          </div>
          <div class="product-actions">
            <a href="${waLink}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn-wa"
               aria-label="Pesan ${qty} via WhatsApp">
              💬 Pesan Sekarang
            </a>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // ============================================
  // INIT
  // ============================================
  
  async function initProducts() {
    const products = await fetchProducts();
    renderProducts(products, '30/hari', 'productGrid1');
    renderProducts(products, '50/hari', 'productGrid2');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
  } else {
    initProducts();
  }

})();
