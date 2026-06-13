// render products ke halaman
function renderProducts() {
    const grid = document.getElementById('heartGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    HEART_PACKAGES.forEach(pkg => {
        const card = document.createElement('div');
        card.className = 'product-card';
        let promoTag = '';
        let extraText = '';
        let displayHearts = pkg.hearts;

        if (pkg.promo && pkg.extra > 0) {
            promoTag = `<div class="promo-flag">🎉 PROMO SPESIAL 🎉</div>`;
            extraText = `<div style="font-size:0.7rem; color:#FFDD99;">✨ +${pkg.extra} HEART GRATIS! Total ${pkg.total} ❤️ ✨</div>`;
            displayHearts = `${pkg.hearts}+${pkg.extra}`;
        }

        card.innerHTML = `
            ${promoTag}
            <div class="heart-badge">❤️‍🔥 ${displayHearts} ❤️</div>
            <div class="product-title">${pkg.total} Heart</div>
            <div class="price-tag">Rp ${pkg.price.toLocaleString('id-ID')}</div>
            ${extraText}
            <div class="delivery-note">🚚 Kirim ${STORE_CONFIG.deliveryPerDay}❤️/hari (bertahap)</div>
            <button class="btn-order" data-hearts="${pkg.total}" data-price="${pkg.price}" data-pack="${pkg.hearts}❤️" data-totalheart="${pkg.total}">Pesan Sekarang</button>
        `;
        grid.appendChild(card);
    });

    // attach event listener ke semua tombol order
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const hearts = btn.getAttribute('data-hearts');
            const price = btn.getAttribute('data-price');
            const packLabel = btn.getAttribute('data-pack');
            const totalHeart = btn.getAttribute('data-totalheart');
            openOrderModal(hearts, price, packLabel, totalHeart);
        });
    });
}

// modal elements
const modalEl = document.getElementById('orderModal');
const modalTextDiv = document.getElementById('modalText');
const qrisSectionDiv = document.getElementById('qrisSection');
const waBtn = document.getElementById('whatsappBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

let activeOrder = null;

function openOrderModal(hearts, price, packLabel, totalHeart) {
    let qrisHtml = '';
    if (QRIS_CONFIG.enabled) {
        qrisHtml = `
            <div style="margin: 15px 0;">
                <div class="qris-placeholder">
                    ⚡ QRIS Payment ⚡<br>
                    <img src="${QRIS_CONFIG.imageUrl}" alt="QRIS Code" style="max-width: 200px; margin: 10px auto; border-radius: 16px; background: white; padding: 10px;" onerror="this.onerror=null; this.src='https://placehold.co/200x200?text=QRIS+GANTI+DENGAN+GAMBAR+ASLI';">
                    <div style="font-size: 12px; margin-top: 8px;">📱 ${QRIS_CONFIG.note}</div>
                    <button class="copy-btn" id="copyQrisBtn">📋 Simpan / Screenshot QRIS</button>
                </div>
            </div>
        `;
    }
    
    modalTextDiv.innerHTML = `
        🛒 <strong>${packLabel} (${totalHeart} Heart)</strong><br>
        💰 Total: Rp ${parseInt(price).toLocaleString('id-ID')}<br><br>
        📦 Pengiriman: ${STORE_CONFIG.deliveryPerDay} Heart/hari (non-instant)<br>
        🧑‍💼 Admin akan kirim harian hingga ${totalHeart}❤️ lunas.<br><br>
        ✅ <strong>Langkah pembayaran:</strong><br>
        1. Scan QRIS di atas<br>
        2. Bayar sesuai total harga<br>
        3. Screenshot bukti bayar<br>
        4. Klik tombol WA & kirim bukti ke admin
    `;
    
    qrisSectionDiv.innerHTML = qrisHtml;
    
    activeOrder = { hearts: totalHeart, price, packLabel };
    modalEl.classList.add('open');
    
    // event untuk copy button
    setTimeout(() => {
        const copyBtn = document.getElementById('copyQrisBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                alert("Silakan screenshot QRIS di atas atau simpan gambar untuk scan pembayaran.");
            });
        }
    }, 100);
}

function closeModal() {
    modalEl.classList.remove('open');
    activeOrder = null;
}

if (waBtn) {
    waBtn.addEventListener('click', () => {
        if (!activeOrder) {
            closeModal();
            return;
        }
        const { hearts, price, packLabel } = activeOrder;
        const waMsg = `Halo Admin BALILSTORE%0A%0ASaya mau ORDER HEART SKY (sudah bayar via QRIS):%0APaket: ${packLabel} (${hearts} Heart)%0AHarga: Rp ${price.toLocaleString('id-ID')}%0AMetode kirim: ${STORE_CONFIG.deliveryPerDay} Heart/hari%0A%0ASaya sudah upload bukti transfer QRIS. Mohon diproses. Terima kasih!`;
        window.open(`https://wa.me/${STORE_CONFIG.adminWA}?text=${waMsg}`, '_blank');
        closeModal();
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (modalEl) {
    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) closeModal();
    });
}

// init saat halaman load
document.addEventListener('DOMContentLoaded', renderProducts);
