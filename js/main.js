// ========== MAIN INITIALIZATION ==========
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
    // Render products
    if (typeof renderProducts === 'function') {
        renderProducts();
    }
    
    // Render tracking data
    if (typeof TRACKING_DATA !== 'undefined') {
        renderTracking(TRACKING_DATA);
    } else {
        console.error("File data.js belum terhubung!");
    }
    
    // Initialize features
    initLiveSearch();
    initFAQ();
    
    // Setup cart form
    const form = document.getElementById('checkoutForm');
    if (form && typeof submitOrder === 'function') {
        form.addEventListener('submit', submitOrder);
    }
    
    // Initialize particles
    if (typeof initParticles === 'function') {
        initParticles();
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('cartModal');
    if (modal && typeof closeCartModal === 'function') {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCartModal();
        });
    }
    
    // Update cart UI initially
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
});
