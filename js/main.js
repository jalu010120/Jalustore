/**
 * @file main.js
 * @description Script utama untuk mengelola Dashboard Pengiriman JaluStore.
 * @version 2.1
 * 
 * Perubahan utama:
 * - Penambahan logika status yang lebih robust
 * - Peningkatan animasi dan efek visual
 * - Penanganan error yang lebih baik
 * - Optimasi performa
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * @namespace DashboardApp
     * @description Objek utama yang mengenkapsulasi semua fungsionalitas dasbor.
     */
    const DashboardApp = {
        /**
         * Konfigurasi untuk dasbor.
         */
        config: {
            cloudCount: 10,
            heartCount: 20,
            targetDate: {
                year: 2025,
                month: 6,
                day: 1
            },
            animationIntervals: {
                clouds: 50,
                hearts: 500
            }
        },

        /**
         * Cache untuk elemen DOM yang sering digunakan.
         */
        dom: {
            cloudsContainer: document.getElementById('clouds'),
            heartsContainer: document.getElementById('hearts'),
            liveTime: document.getElementById('live-time'),
            slots: {
                1: document.getElementById('slot1-cards'),
                2: document.getElementById('slot2-cards'),
                3: document.getElementById('slot3-cards'),
                completed: document.getElementById('completed-cards')
            },
            slotSections: {},
            searchBox: document.getElementById('search-box'),
            statsContainer: document.getElementById('stats-container'),
            refreshButton: document.getElementById('refresh-button')
        },

        /**
         * State aplikasi
         */
        state: {
            deliveryData: [],
            filteredData: [],
            searchTerm: '',
            stats: {
                total: 0,
                completed: 0,
                pending: 0,
                failed: 0
            }
        },

        /**
         * Fungsi inisialisasi utama.
         */
        init() {
            // Mengisi cache untuk section-section slot
            for (const key in this.dom.slots) {
                this.dom.slotSections[key] = this.dom.slots[key]?.parentElement;
            }

            // Setup event listeners
            this.setupEventListeners();

            // Membuat elemen dekoratif
            this.createDecorativeElements('cloud', this.config.cloudCount, this.helpers.getCloudStyles);
            this.createDecorativeElements('heart', this.config.heartCount, this.helpers.getHeartStyles);

            // Memulai jam live dan render awal
            this.updateTime();
            setInterval(() => this.updateTime(), 1000);

            // Load data awal
            this.loadData();
        },

        // ===============================================
        // Fungsi Inti (Core Functions)
        // ===============================================

        /**
         * Setup semua event listeners
         */
        setupEventListeners() {
            // Search functionality
            if (this.dom.searchBox) {
                this.dom.searchBox.addEventListener('input', (e) => {
                    this.state.searchTerm = e.target.value.toLowerCase();
                    this.filterData();
                    this.renderDashboard(this.state.filteredData);
                });
            }

            // Refresh button
            if (this.dom.refreshButton) {
                this.dom.refreshButton.addEventListener('click', () => {
                    this.dom.refreshButton.classList.add('loading');
                    this.loadData();
                });
            }
        },

        /**
         * Memfilter data berdasarkan search term
         */
        filterData() {
            if (!this.state.searchTerm) {
                this.state.filteredData = [...this.state.deliveryData];
                return;
            }

            this.state.filteredData = this.state.deliveryData.filter(item => {
                return (
                    item.name.toLowerCase().includes(this.state.searchTerm) ||
                    String(item.order).includes(this.state.searchTerm) ||
                    String(item.send).includes(this.state.searchTerm)
                );
            });
        },

        /**
         * Memuat data dari sumber eksternal
         */
        loadData() {
            try {
                if (typeof deliveryData !== 'undefined') {
                    this.state.deliveryData = deliveryData;
                    this.filterData();
                    this.calculateStats();
                    this.renderDashboard(this.state.filteredData);
                } else {
                    throw new Error('Variabel `deliveryData` tidak ditemukan');
                }
            } catch (error) {
                console.error('Error loading data:', error);
                if (this.dom.slots[1]) {
                    this.dom.slots[1].innerHTML = '<p class="error-message">Gagal memuat data pembeli.</p>';
                    this.dom.slotSections[1].style.display = 'block';
                }
            } finally {
                if (this.dom.refreshButton) {
                    this.dom.refreshButton.classList.remove('loading');
                }
            }
        },

        /**
         * Menghitung statistik dashboard
         */
        calculateStats() {
            this.state.stats = {
                total: this.state.deliveryData.length,
                completed: 0,
                pending: 0,
                failed: 0
            };

            this.state.deliveryData.forEach(item => {
                const statusInfo = this.helpers.getStatusInfo(item);
                if (statusInfo.class === 'done') this.state.stats.completed++;
                else if (statusInfo.class === 'fail') this.state.stats.failed++;
                else this.state.stats.pending++;
            });

            this.renderStats();
        },

        /**
         * Merender statistik ke DOM
         */
        renderStats() {
            if (!this.dom.statsContainer) return;

            this.dom.statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">${this.state.stats.total}</div>
                    <div class="stat-label">Total Order</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.state.stats.completed}</div>
                    <div class="stat-label">Selesai</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.state.stats.pending}</div>
                    <div class="stat-label">Proses</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.state.stats.failed}</div>
                    <div class="stat-label">Gagal</div>
                </div>
            `;
        },

        /**
         * Memperbarui tampilan jam live di dasbor.
         */
        updateTime() {
            const now = new Date();
            const { year, month, day } = this.config.targetDate;
            const targetTime = new Date(year, month, day, now.getHours(), now.getMinutes(), now.getSeconds());
            
            const timeString = targetTime.toLocaleString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            if (this.dom.liveTime) {
                this.dom.liveTime.textContent = `⏰ ${timeString}`;
            }
        },

        /**
         * Merender semua kartu pesanan ke dalam slot yang sesuai.
         */
        renderDashboard(data) {
            // Jika tidak ada data yang cocok dengan pencarian
            if (this.state.searchTerm && (!data || data.length === 0)) {
                if (this.dom.slots[1]) {
                    this.dom.slots[1].innerHTML = `<p class="card-placeholder">Tidak ditemukan hasil untuk "${this.state.searchTerm}"</p>`;
                    this.dom.slotSections[1].style.display = 'block';
                }
                return;
            }

            const cardsToRender = { 1: [], 2: [], 3: [], completed: [] };

            (data || this.state.deliveryData).forEach(item => {
                const statusInfo = this.helpers.getStatusInfo(item);
                const progressPercent = (item.order > 0) ? Math.min((item.send / item.order) * 100, 100) : 0;

                const cardHTML = `
                    <div class="card ${statusInfo.class}" data-id="${item.name}">
                        <div class="name">${item.name}</div>
                        <div class="number">Order: ${item.order} | Send: ${item.send}</div>
                        <span class="status ${statusInfo.class}">${statusInfo.text}</span>
                        ${statusInfo.showProgress ? `
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
                        </div>` : ''}
                    </div>
                `;
                
                if (cardsToRender[statusInfo.targetSlot]) {
                    cardsToRender[statusInfo.targetSlot].push(cardHTML);
                }
            });

            // Render ke DOM dan tampilkan/sembunyikan section
            for (const slotKey in this.dom.slots) {
                const container = this.dom.slots[slotKey];
                const section = this.dom.slotSections[slotKey];
                if (!container || !section) continue;

                if (cardsToRender[slotKey] && cardsToRender[slotKey].length > 0) {
                    container.innerHTML = cardsToRender[slotKey].join('');
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            }
        },

        /**
         * Membuat elemen dekoratif (awan/hati) secara dinamis.
         */
        createDecorativeElements(className, count, getStylesFn) {
            const container = className === 'cloud' ? this.dom.cloudsContainer : this.dom.heartsContainer;
            if (!container) return;

            // Clear existing elements
            container.innerHTML = '';

            for (let i = 0; i < count; i++) {
                const element = document.createElement('div');
                element.className = className;
                if (className === 'heart') {
                    element.innerHTML = '<i class="fas fa-heart"></i>';
                }
                
                const styles = getStylesFn();
                for (const prop in styles) {
                    element.style[prop] = styles[prop];
                }
                
                container.appendChild(element);
            }
        },

        // ===============================================
        // Fungsi Bantuan (Helper Functions)
        // ===============================================
        
        helpers: {
            /**
             * Menentukan status, teks, dan slot target dari sebuah item pesanan.
             */
            getStatusInfo(item) {
                const isNumericallyComplete = (typeof item.send === 'number' && 
                                             typeof item.order === 'number' && 
                                             item.send >= item.order);

                if (item.statusOverride === 'done' || (isNumericallyComplete && item.statusOverride !== 'fail')) {
                    return { 
                        class: 'done', 
                        text: '<i class="fas fa-check-circle"></i> Selesai', 
                        showProgress: false, 
                        targetSlot: 'completed' 
                    };
                }
                if (item.statusOverride === 'fail') {
                    return { 
                        class: 'fail', 
                        text: '<i class="fas fa-exclamation-circle"></i> Gagal', 
                        showProgress: true, 
                        targetSlot: String(item.slot) 
                    };
                }
                return { 
                    class: 'pending', 
                    text: '<i class="fas fa-hourglass-half"></i> Proses', 
                    showProgress: true, 
                    targetSlot: String(item.slot) 
                };
            },

            /** Mengembalikan style acak untuk elemen awan. */
            getCloudStyles() {
                const size = Math.random() * 100 + 50;
                return {
                    width: `${size}px`,
                    height: `${size * 0.6}px`,
                    opacity: Math.random() * 0.4 + 0.3,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 30 + 30}s`,
                    animationDelay: `${Math.random() * 10}s`,
                    filter: `blur(${Math.random() * 3}px)`
                };
            },

            /** Mengembalikan style acak untuk elemen hati. */
            getHeartStyles() {
                return {
                    fontSize: `${Math.random() * 20 + 10}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 3 + 3}s`,
                    opacity: Math.random() * 0.5 + 0.3,
                    color: `hsl(${Math.random() * 60 + 330}, 100%, 70%)` // Warna pink/merah
                };
            }
        }
    };

    // Jalankan aplikasi dasbor.
    DashboardApp.init();
});
