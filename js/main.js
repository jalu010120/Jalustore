// js/main.js

// Pastikan deliveryData tersedia dari data.js
// Jika Anda menggunakan `const deliveryData = [...]` di data.js tanpa `export`,
// maka `deliveryData` akan secara otomatis tersedia di sini karena data.js dimuat lebih dulu.

// Function to create clouds
function createClouds() {
    const cloudsContainer = document.getElementById('clouds');
    const cloudCount = 8;
    
    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        // Random cloud properties
        const size = Math.random() * 100 + 50;
        const opacity = Math.random() * 0.4 + 0.3;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const animationDuration = Math.random() * 30 + 30;
        const delay = Math.random() * 10;
        
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.6}px`;
        cloud.style.opacity = opacity;
        cloud.style.left = `${left}%`;
        cloud.style.top = `${top}%`;
        cloud.style.animationDuration = `${animationDuration}s`;
        cloud.style.animationDelay = `${delay}s`;
        
        cloudsContainer.appendChild(cloud);
    }
}

// Function to create floating hearts
function createHearts() {
    const heartsContainer = document.getElementById('hearts');
    const heartCount = 15;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        
        // Random heart properties
        const size = Math.random() * 20 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 3;
        const opacity = Math.random() * 0.5 + 0.3;
        
        heart.style.fontSize = `${size}px`;
        heart.style.left = `${left}%`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.opacity = opacity;
        
        heartsContainer.appendChild(heart);
    }
}

// Function to update live time
function updateTime() {
    const now = new Date();
    // Gunakan tanggal 1 Juli 2025 dengan waktu saat ini
    const targetDate = new Date(2025, 6, 1, now.getHours(), now.getMinutes(), now.getSeconds()); 
    const waktu = targetDate.toLocaleString('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    document.getElementById('live-time').textContent = '⏰ ' + waktu;
}

// Function to render the cards
function renderDashboard(data) {
    const slots = {
        1: document.getElementById('slot1-cards'),
        2: document.getElementById('slot2-cards'),
        3: document.getElementById('slot3-cards'),
        completed: document.getElementById('completed-cards')
    };

    const slotSections = {
        1: document.querySelector('#slot1-cards').parentElement,
        2: document.querySelector('#slot2-cards').parentElement,
        3: document.querySelector('#slot3-cards').parentElement,
        completed: document.querySelector('#completed-cards').parentElement
    };

    // Clear existing cards from all containers
    Object.values(slots).forEach(container => {
        if (container) container.innerHTML = '';
    });

    // Hide all sections initially
    Object.values(slotSections).forEach(section => {
        if (section) section.style.display = 'none';
    });

    const cardsToRender = {
        1: [],
        2: [],
        3: [],
        completed: [] 
    };

    // Loop through each item in the data
    data.forEach(item => {
        let statusClass, statusText, showProgress, targetSlotKey;
        const isCompleted = (typeof item.send === 'number' && typeof item.order === 'number' && item.send >= item.order);
        
        // Determine status
        if (item.statusOverride === 'done') {
            statusClass = 'done';
            statusText = '<i class="fas fa-check-circle"></i> Done';
            showProgress = false;
            targetSlotKey = 'completed';
        } else if (item.statusOverride === 'fail') {
            statusClass = 'fail';
            statusText = '<i class="fas fa-exclamation-circle"></i> Stuck';
            showProgress = true;
            targetSlotKey = item.slot;
        } else if (isCompleted) {
            statusClass = 'done';
            statusText = '<i class="fas fa-check-circle"></i> Done';
            showProgress = false;
            targetSlotKey = 'completed';
        } else {
            statusClass = 'pending';
            statusText = '<i class="fas fa-hourglass-half"></i> Progress';
            showProgress = true;
            targetSlotKey = item.slot;
        }

        // Calculate progress percentage
        let progressPercent = 0;
        if (showProgress && typeof item.order === 'number' && typeof item.send === 'number' && item.order > 0) {
            progressPercent = Math.min((item.send / item.order) * 100, 100);
        }

        const cardHTML = `
            <div class="card ${statusClass}">
                <div class="name">${item.name}</div>
                <div class="number">Order: ${item.order} | Send: ${item.send}</div>
                <span class="status ${statusClass}">${statusText}</span>
                ${showProgress ? `
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
                </div>
                ` : ''}
            </div>
        `;
        
        if (cardsToRender[targetSlotKey]) {
            cardsToRender[targetSlotKey].push(cardHTML);
        }
    });

    // Render cards into their respective containers
    Object.keys(slots).forEach(slotKey => {
        const container = slots[slotKey];
        const section = slotSections[slotKey];

        if (container && section) {
            if (cardsToRender[slotKey].length > 0) {
                container.innerHTML = cardsToRender[slotKey].join('');
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    });
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    createClouds();
    createHearts();
    updateTime();
    setInterval(updateTime, 1000);
    // Panggil renderDashboard dengan deliveryData yang dimuat dari data.js
    renderDashboard(deliveryData); 
});
