// DOM Elements
const liveTimeEl = document.getElementById('live-time');
const refreshButton = document.getElementById('refresh-button');
const searchBox = document.getElementById('search-box');
const statsContainer = document.getElementById('stats-container');

const slot1Cards = document.getElementById('slot1-cards');
const slot2Cards = document.getElementById('slot2-cards');
const slot3Cards = document.getElementById('slot3-cards');
const completedCards = document.getElementById('completed-cards');

const orderModal = document.getElementById('order-modal');
const closeModalButton = document.getElementById('close-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalDetails = document.getElementById('modal-details');
const whatsappButton = document.getElementById('whatsapp-button');

// Time update function
function updateLiveTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    };
    liveTimeEl.textContent = now.toLocaleDateString('id-ID', options);
}

// Render cards function
function renderCards(searchTerm = '') {
    slot1Cards.innerHTML = '';
    slot2Cards.innerHTML = '';
    slot3Cards.innerHTML = '';
    completedCards.innerHTML = '';

    const filteredData = deliveryData.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const orderMatch = String(item.order).includes(searchTerm);
        const sendMatch = String(item.send).includes(searchTerm);
        return nameMatch || orderMatch || sendMatch;
    });

    filteredData.forEach(item => {
        const card = document.createElement('div');
        let statusClass = '';
        let statusText = '';
        let statusIcon = '';
        let progress = 0;

        // Calculate progress only for non-completed items
        if (item.slot !== 'completed') {
            progress = (item.send / item.order) * 100;
            if (progress >= 100) {
                statusClass = 'done';
                statusText = 'Selesai';
                statusIcon = 'fa-check-circle';
            } else if (item.statusOverride === 'fail') {
                statusClass = 'fail';
                statusText = 'Gagal';
                statusIcon = 'fa-times-circle';
            } else if (item.statusOverride === 'pending' || progress < 100) {
                statusClass = 'pending';
                statusText = 'Proses';
                statusIcon = 'fa-hourglass-half';
            }
        } else { // Already in completed section
            statusClass = 'done';
            statusText = 'Selesai';
            statusIcon = 'fa-check-circle';
        }

        // Override status if explicitly set in data
        if (item.statusOverride) {
            if (item.statusOverride === 'fail') {
                statusClass = 'fail';
                statusText = 'Gagal';
                statusIcon = 'fa-times-circle';
            } else if (item.statusOverride === 'pending') {
                statusClass = 'pending';
                statusText = 'Proses';
                statusIcon = 'fa-hourglass-half';
            }
        }

        card.classList.add('card', statusClass);
        card.dataset.id = item.id;
        card.dataset.name = item.name;
        card.dataset.order = item.order;
        card.dataset.send = item.send;
        card.dataset.slot = item.slot;
        card.dataset.status = statusText;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Order ${item.name}, status ${statusText}`);

        let progressHtml = '';
        if (statusClass === 'pending' || statusClass === 'fail') {
            progressHtml = `
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progress.toFixed(0)}%;"></div>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="name">${item.name}</div>
            <div class="number">Order: ${item.order} | Terkirim: ${item.send}</div>
            ${progressHtml}
            <div class="status ${statusClass}">
                <i class="fas ${statusIcon}"></i>
                ${statusText}
            </div>
        `;

        // Add to appropriate slot
        const targetContainer = 
            item.slot === 1 ? slot1Cards :
            item.slot === 2 ? slot2Cards :
            item.slot === 3 ? slot3Cards :
            completedCards;
        
        targetContainer.appendChild(card);

        // Add event listeners for both click and keyboard
        card.addEventListener('click', () => openOrderModal(item));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openOrderModal(item);
            }
        });
    });
}

// Update stats function
function updateStats() {
    const totalOrders = deliveryData.length;
    const totalCompleted = deliveryData.filter(item => 
        (item.slot === 'completed' || (item.send >= item.order && item.statusOverride !== 'fail'))
    ).length;
    const totalPending = deliveryData.filter(item => 
        (item.slot !== 'completed' && item.send < item.order && item.statusOverride !== 'fail')
    ).length;
    const totalFailed = deliveryData.filter(item => 
        (item.slot !== 'completed' && item.statusOverride === 'fail')
    ).length;

    statsContainer.innerHTML = `
        <div class="stat-card" aria-label="Total order: ${totalOrders}">
            <div class="stat-value">${totalOrders}</div>
            <div class="stat-label">Total Order</div>
        </div>
        <div class="stat-card" aria-label="Order selesai: ${totalCompleted}">
            <div class="stat-value">${totalCompleted}</div>
            <div class="stat-label">Selesai</div>
        </div>
        <div class="stat-card" aria-label="Order proses: ${totalPending}">
            <div class="stat-value">${totalPending}</div>
            <div class="stat-label">Proses</div>
        </div>
        <div class="stat-card" aria-label="Order gagal: ${totalFailed}">
            <div class="stat-value">${totalFailed}</div>
            <div class="stat-label">Gagal</div>
        </div>
    `;
}

// Modal functions
function openOrderModal(item) {
    const progressPercentage = ((item.send / item.order) * 100).toFixed(2);
    const statusText = item.statusOverride === 'fail' ? 'Gagal' : (item.send >= item.order ? 'Selesai' : 'Proses');
    
    modalDetails.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Nama</div>
            <div class="detail-value">${item.name}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Jumlah Order</div>
            <div class="detail-value">${item.order} Heart</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Terkirim</div>
            <div class="detail-value">${item.send} Heart</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Sisa</div>
            <div class="detail-value">${item.order - item.send} Heart</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Status</div>
            <div class="detail-value">${statusText}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Progress</div>
            <div class="detail-value">${progressPercentage}%</div>
        </div>
        ${item.number ? `
        <div class="detail-item" style="grid-column: 1 / -1;">
            <div class="detail-label">Nomor Telepon</div>
            <div class="detail-value">${item.number}</div>
        </div>
        ` : ''}
        ${item.notes ? `
        <div class="detail-item" style="grid-column: 1 / -1;">
            <div class="detail-label">Catatan</div>
            <div class="detail-value">${item.notes}</div>
        </div>
        ` : ''}
    `;
    
    // WhatsApp button logic
    if (item.number) {
        whatsappButton.style.display = 'inline-block';
        const whatsappLink = `https://wa.me/${item.number.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(item.name)},%20kami%20ingin%20menginformasikan%20status%20orderan%20heart%20Anda%20dengan%20jumlah%20order%20${item.order}%20dan%20telah%20terkirim%20${item.send}.%20Sisa%20pengiriman%20adalah%20${item.order - item.send}.%20Terima%20kasih!`;
        whatsappButton.onclick = () => window.open(whatsappLink, '_blank');
    } else {
        whatsappButton.style.display = 'none';
    }

    orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    orderModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cloud animation setup
function createCloud() {
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');
    const size = Math.random() * 100 + 50; // 50 to 150px
    cloud.style.width = `${size}px`;
    cloud.style.height = `${size * 0.7}px`;
    cloud.style.left = `${Math.random() * 100}%`;
    cloud.style.top = `${Math.random() * 100}%`;
    cloud.style.animationDuration = `${Math.random() * 30 + 20}s`; // 20-50s
    cloud.style.filter = `blur(${Math.random() * 3}px)`;
    cloudsContainer.appendChild(cloud);
}

// Floating elements animation setup (hearts/stars)
function createFloatingElement() {
    const element = document.createElement('i');
    element.classList.add(Math.random() > 0.5 ? 'fas' : 'far');
    element.classList.add(Math.random() > 0.5 ? 'fa-heart' : 'fa-star');
    element.classList.add(Math.random() > 0.5 ? 'heart' : 'star');
    element.style.left = `${Math.random() * 100}vw`;
    element.style.fontSize = `${Math.random() * 1.5 + 0.8}rem`;
    element.style.animationDuration = `${Math.random() * 5 + 3}s`;
    element.style.animationDelay = `${Math.random() * 2}s`;
    floatingElementsContainer.appendChild(element);

    // Remove element after animation
    element.addEventListener('animationend', () => {
        element.remove();
    });
}

// Initialize the dashboard
function initDashboard() {
    // Create initial clouds
    for (let i = 0; i < 10; i++) {
        createCloud();
    }
    
    // Start floating elements animation
    setInterval(createFloatingElement, 500);
    
    // Set up time updates
    updateLiveTime();
    setInterval(updateLiveTime, 1000);
    
    // Initial render
    renderCards();
    updateStats();
}

// Event Listeners
refreshButton.addEventListener('click', () => {
    // In a real app, this would fetch fresh data from the server
    renderCards();
    updateStats();
    
    // Visual feedback
    refreshButton.querySelector('i').classList.add('fa-spin');
    setTimeout(() => {
        refreshButton.querySelector('i').classList.remove('fa-spin');
    }, 1000);
});

searchBox.addEventListener('input', (e) => renderCards(e.target.value));

closeModalButton.addEventListener('click', closeOrderModal);
closeModalBtn.addEventListener('click', closeOrderModal);

// Close modal when clicking outside or pressing ESC
orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        closeOrderModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && orderModal.classList.contains('active')) {
        closeOrderModal();
    }
});

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
