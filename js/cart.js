// ========== CART LOGIC ==========
let cartItems = [];

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
