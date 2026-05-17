// ========== PRODUCTS DATA ==========
const PRODUCTS = [
    { id: 1, hearts: 100, price: 10000, priceUSD: 0.99, tag: "Starter", popular: false },
    { id: 2, hearts: 200, price: 20000, priceUSD: 1.99, tag: "Basic", popular: false },
    { id: 3, hearts: 360, price: 35000, priceUSD: 2.99, tag: "Populer", popular: true },
    { id: 4, hearts: 480, price: 45000, priceUSD: 3.99, tag: "Pro Gamer", popular: false },
    { id: 5, hearts: 600, price: 55000, priceUSD: 4.99, tag: "Elite Light", popular: false },
    { id: 6, hearts: 700, price: 60000, priceUSD: 5.49, tag: "Legendary", popular: true },
    { id: 7, hearts: 1000, price: 100000, priceUSD: 8.99, tag: "Ultimate", popular: false }
];

function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = PRODUCTS.map(prod => `
        <div class="premium-card">
            ${prod.popular ? '<div style="position: absolute; top: 16px; right: 20px; background: #f7768e; padding: 5px 12px; border-radius: 50px; font-size: 0.7rem; font-weight: bold; color: #fff; box-shadow: 0 4px 10px rgba(247, 118, 142, 0.3);">🔥 Best</div>' : ''}
            
            <div class="heart-container">
                <span class="heart-number">${prod.hearts}</span>
                <i class="fa-solid fa-heart heart-icon"></i>
            </div>
            
            <div class="product-tag">${prod.tag}</div>
            
            <div class="price-amount">
                Rp ${prod.price.toLocaleString('id-ID')} 
                <span class="price-usd">/ $${prod.priceUSD}</span>
            </div>
            
            <button class="btn-order" data-id="${prod.id}">
                <i class="fa-solid fa-cart-plus"></i> Ambil Sekarang
            </button>
        </div>
    `).join('');

    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            if (typeof addToCartById === 'function') {
                addToCartById(id);
            }
        });
    });
}
