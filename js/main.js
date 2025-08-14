/**
 * @file main.js
 * @description Script utama untuk mengelola Dashboard Pengiriman JaluStore.
 * @version 2.0
 *
 * Catatan: Script ini mengasumsikan variabel `deliveryData` tersedia secara global
 * dari file `data.js` yang dimuat sebelumnya.
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
            cloudCount: 8,
            heartCount: 15,
            targetDate: { // Tanggal yang akan ditampilkan di dasbor
                year: 2025,
                month: 6, // 0-indexed, 6 = Juli
                day: 1
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
            slotSections: {} // Diisi saat inisialisasi
        },

        /**
         * Fungsi inisialisasi utama.
         */
        init() {
            // Mengisi cache untuk section-section slot
            for (const key in this.dom.slots) {
                this.dom.slotSections[key] = this.dom.slots[key]?.parentElement;
            }

            // Membuat elemen dekoratif
            this.createDecorativeElements('cloud', this.config.cloudCount, this.helpers.getCloudStyles);
            this.createDecorativeElements('heart', this.config.heartCount, this.helpers.getHeartStyles);

            // Memulai jam live dan render awal
            this.updateTime();
            setInterval(() => this.updateTime(), 1000);

            if (typeof deliveryData !== 'undefined') {
                this.renderDashboard(deliveryData);
            } else {
                console.error('Variabel `deliveryData` tidak ditemukan. Pastikan `data.js` dimuat dengan benar.');
                if (this.dom.slots[1]) {
                    this.dom.slots[1].innerHTML = '<p class="error-message">Gagal memuat data pembeli.</p>';
                    this.dom.slotSections[1].style.display = 'block';
                }
            }
        },

        // ===============================================
        // Fungsi Inti (Core Functions)
        // ===============================================

        /**
         * Memperbarui tampilan jam live di dasbor.
         * Menggunakan tanggal target dari config dengan waktu saat ini.
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
         * @param {Array<Object>} data - Array data pesanan dari `deliveryData`.
         */
        renderDashboard(data) {
            const cardsToRender = { 1: [], 2: [], 3: [], completed: [] };

            data.forEach(item => {
                const statusInfo = this.helpers.getStatusInfo(item);
                const progressPercent = (item.order > 0) ? Math.min((item.send / item.order) * 100, 100) : 0;

                const cardHTML = `
                    <div class="card ${statusInfo.class}">
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
         * @param {string} className - Nama class untuk elemen (misal: 'cloud').
         * @param {number} count - Jumlah elemen yang akan dibuat.
         * @param {Function} getStylesFn - Fungsi yang mengembalikan properti style untuk setiap elemen.
         */
        createDecorativeElements(className, count, getStylesFn) {
            const container = className === 'cloud' ? this.dom.cloudsContainer : this.dom.heartsContainer;
            if (!container) return;

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
             * @param {Object} item - Item pesanan.
             * @returns {{class: string, text: string, showProgress: boolean, targetSlot: string}}
             */
            getStatusInfo(item) {
                const isNumericallyComplete = (typeof item.send === 'number' && typeof item.order === 'number' && item.send >= item.order);

                if (item.statusOverride === 'done' || isNumericallyComplete && item.statusOverride !== 'fail') {
                    return { class: 'done', text: '<i class="fas fa-check-circle"></i> Selesai', showProgress: false, targetSlot: 'completed' };
                }
                if (item.statusOverride === 'fail') {
                    return { class: 'fail', text: '<i class="fas fa-exclamation-circle"></i> Gagal', showProgress: true, targetSlot: String(item.slot) };
                }
                return { class: 'pending', text: '<i class="fas fa-hourglass-half"></i> Proses', showProgress: true, targetSlot: String(item.slot) };
            },

            /** Mengembalikan style acak untuk elemen awan. */
            getCloudStyles() {
                return {
                    width: `${Math.random() * 100 + 50}px`,
                    height: `${(Math.random() * 60 + 30)}px`,
                    opacity: Math.random() * 0.4 + 0.3,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 30 + 30}s`,
                    animationDelay: `${Math.random() * 10}s`
                };
            },

            /** Mengembalikan style acak untuk elemen hati. */
            getHeartStyles() {
                return {
                    fontSize: `${Math.random() * 20 + 10}px`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 3 + 3}s`,
                    opacity: Math.random() * 0.5 + 0.3
                };
            }
        }
    };

    // Jalankan aplikasi dasbor.
    DashboardApp.init();
});
