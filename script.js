const PRODUCTS = [
    { id: 1, hearts: 100, price: 10000, priceUSD: 0.99, tag: "Starter", popular: false },
    { id: 2, hearts: 200, price: 20000, priceUSD: 1.99, tag: "Basic", popular: false },
    { id: 3, hearts: 360, price: 35000, priceUSD: 2.99, tag: "Populer", popular: true },
    { id: 4, hearts: 480, price: 45000, priceUSD: 3.99, tag: "Pro Gamer", popular: false },
    { id: 5, hearts: 600, price: 55000, priceUSD: 4.99, tag: "Elite Light", popular: false },
    { id: 6, hearts: 700, price: 60000, priceUSD: 5.49, tag: "Legendary", popular: true },
    { id: 7, hearts: 1000, price: 100000, priceUSD: 8.99, tag: "Ultimate", popular: false }
];

let cartItems = [];

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
            addToCartById(id);
        });
    });
}

function renderTracking(dataToRender) {
    const grid = document.getElementById('trackingGrid');
    if (!grid) return;

    if (typeof TRACKING_DATA === 'undefined') {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #f7768e; padding: 2rem;">Error: File data.js tidak terbaca! Pastikan filenya sudah di-upload ke GitHub.</div>`;
        return;
    }

    if (dataToRender.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #8a9bb5; padding: 2rem;">Mencari Nickname... Kosong! Pastikan ejaannya benar ya.</div>`;
        return;
    }

    grid.innerHTML = dataToRender.map(data => {
        const isDone = data.kirim >= data.order;
        const statusText = isDone ? "Selesai ✅" : "Proses ⏳";
        const statusClass = isDone ? "status-done" : "status-process";
        
        let percentage = (data.kirim / data.order) * 100;
        if (percentage > 100) percentage = 100;

        return `
            <div class="track-card animate__animated animate__fadeIn">
                <div class="track-header">
                    <div class="track-name">
                        ${data.name} 
                        <span class="slot-badge">${data.slot}</span>
                    </div>
                    <div class="status-badge ${statusClass}">${statusText}</div>
                </div>
                <div class="progress-info">
                    <span>Dikirim: ${data.kirim}</span>
                    <span>Total: ${data.order} <i class="fa-solid fa-heart" style="color:#f7768e; font-size:0.8rem;"></i></span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    }).join('');
}

function initLiveSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        if(typeof TRACKING_DATA !== 'undefined') {
            const filteredData = TRACKING_DATA.filter(item => 
                item.name.toLowerCase().includes(keyword)
            );
            renderTracking(filteredData);
        }
    });
}

function addToCartById(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    cartItems.push({
        id: product.id,
        hearts: product.hearts,
        price: product.price,
        priceUSD: product.priceUSD,
        tag: product.tag
    });
    updateCartUI();

    Swal.fire({
        icon: 'success',
        title: 'Tersimpan!',
        text: `${product.hearts} Hearts ditambahkan ✨`,
        background: '#0e1628',
        color: '#fff',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1600
    });
}

function updateCartUI() {
    const badge = document.getElementById('cartCountBadge');
    if (badge) badge.innerText = cartItems.length;

    const cartListDiv = document.getElementById('cartItemsList');
    const totalSpan = document.getElementById('cartTotalAmount');
    
    if (cartListDiv) {
        if (cartItems.length === 0) {
            cartListDiv.innerHTML = `<div style="text-align:center; padding: 2rem; color: #6c7f9e;">Keranjang masih kosong~ <i class="fa-regular fa-heart"></i></div>`;
        } else {
            cartListDiv.innerHTML = cartItems.map((item, idx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #1e2a3a;">
                    <div><i class="fa-solid fa-heart" style="color: #f7768e;"></i> ${item.hearts} Hearts <span style="font-size:0.8rem;">(${item.tag})</span></div>
                    <div style="text-align: right;">Rp ${item.price.toLocaleString('id-ID')} <br><span style="font-size:0.8rem; color:#8a9bb5;">$${item.priceUSD}</span></div>
                    <i class="fa-regular fa-trash-can" onclick="removeCartItem(${idx})" style="cursor: pointer; color: #f7768e; margin-left: 10px;"></i>
                </div>
            `).join('');
        }
    }
    
    if (totalSpan) {
        const total = cartItems.reduce((sum, i) => sum + i.price, 0);
        const totalUSD = cartItems.reduce((sum, i) => sum + i.priceUSD, 0);
        totalSpan.innerHTML = `Rp ${total.toLocaleString('id-ID')} <br><span style="font-size:0.9rem; color:#8a9bb5;">$${totalUSD.toFixed(2)}</span>`;
    }
}

function removeCartItem(index) {
    cartItems.splice(index, 1);
    updateCartUI();
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        updateCartUI();
        modal.style.display = 'flex';
    }
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.style.display = 'none';
}

function generateOrderSummary(nickname, identifier, paymentMethod, totalAmount, totalUSDAmount, itemsArray) {
    const dateNow = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    let itemsDetail = itemsArray.map(i => `🎁 ${i.hearts} Heart (${i.tag}) - Rp ${i.price.toLocaleString('id-ID')} / $${i.priceUSD}`).join('\n');
    return `✨ *ORDER JALUSTORE* ✨\n────────────────\n🕒 Date: ${dateNow}\n👤 Nickname: ${nickname}\n🆔 ID/Code: ${identifier}\n💳 Payment: ${paymentMethod}\n────────────────\n📦 *Order Details:*\n${itemsDetail}\n────────────────\n💰 *Total:* Rp ${totalAmount.toLocaleString('id-ID')} / $${totalUSDAmount.toFixed(2)}\n────────────────\n📌 Status: Waiting for Payment\n⚡ Please send the payment proof! Thank you.`;
}

const WA_NUMBER = "6285363625159";

function submitOrder(e) {
    e.preventDefault();
    
    if (cartItems.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Keranjang masih kosong, pilih paket Heart dulu ya!',
            background: '#0e1628',
            color: '#fff'
        });
        return;
    }

    const nickname = document.getElementById('skyNickname').value.trim();
    const identifier = document.getElementById('skyIdentifier').value.trim();
    const payment = document.getElementById('paymentMethod').value;

    if (!nickname || !identifier || !payment) {
        Swal.fire({
            icon: 'warning',
            title: 'Data belum lengkap',
            text: 'Isi semua data (Nama, ID/Code, Metode Bayar) terlebih dahulu.',
            background: '#0e1628',
            color: '#fff'
        });
        return;
    }

    const totalPrice = cartItems.reduce((sum, i) => sum + i.price, 0);
    const totalUSD = cartItems.reduce((sum, i) => sum + i.priceUSD, 0);
    const message = generateOrderSummary(nickname, identifier, payment, totalPrice, totalUSD, cartItems);
    const encodedMsg = encodeURIComponent(message);
    const waLink = `https://wa.me/${WA_NUMBER}?text=${encodedMsg}`;

    Swal.fire({
        title: 'Kirim Pesanan?',
        html: `Total: <strong style="color:#7aa2f7;">Rp ${totalPrice.toLocaleString('id-ID')} / $${totalUSD.toFixed(2)}</strong><br>Lanjut ke WhatsApp?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#7aa2f7',
        cancelButtonColor: '#f7768e',
        confirmButtonText: 'Ya, Kirim',
        cancelButtonText: 'Batal',
        background: '#0e1628',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            window.open(waLink, '_blank');
            
            cartItems = [];
            updateCartUI();
            closeCartModal();
            
            document.getElementById('skyNickname').value = '';
            document.getElementById('skyIdentifier').value = '';
            document.getElementById('paymentMethod').value = '';
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Pesanan terkirim, tunggu konfirmasi ya.',
                background: '#0e1628',
                color: '#fff',
                timer: 2200,
                showConfirmButton: false
            });
        }
    });
}

function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 65, density: { enable: true, value_area: 800 } },
                color: { value: "#7aa2f7" },
                shape: { type: "circle" },
                opacity: { value: 0.25, random: true },
                size: { value: 2, random: true },
                line_linked: { enable: true, distance: 140, color: "#7aa2f7", opacity: 0.12, width: 1 },
                move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: false }, resize: true },
            },
            retina_detect: true
        });
    }
}

function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const currentItem = q.parentElement;
            
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('active');
                }
            });
            
            currentItem.classList.toggle('active');
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
    if (typeof TRACKING_DATA !== 'undefined') {
        renderTracking(TRACKING_DATA);
    } else {
        console.error("File data.js belum terhubung!");
    }
    
    initLiveSearch();
    updateCartUI();
    initFAQ();

    const form = document.getElementById('checkoutForm');
    if (form) form.addEventListener('submit', submitOrder);

    initParticles();

    const modal = document.getElementById('cartModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCartModal();
    });
});
