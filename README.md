# BALILSTORE — Top-Up Heart Sky: Children of the Light

Website toko top-up Heart game Sky: Children of the Light dengan tampilan premium bertema langit malam bertabur bintang.

## Struktur File

```
balilstore/
├── index.html          # Halaman utama
├── terms.html          # Ketentuan Layanan & Refund Policy
├── css/
│   └── style.css       # Stylesheet responsif dengan efek glassmorphism & animasi bintang
├── js/
│   └── main.js         # Logika interaksi, multi-currency, tracking, dan modal
├── config/
│   └── data.js         # Konfigurasi toko, paket harga, dan data demo order
└── assets/
    └── qris.png        # ⚠ Ganti dengan file QRIS asli kamu
```

## Fitur

- **Multi-Currency Switcher** — Toggle IDR/USD di navbar, harga berubah dinamis
- **Live Order Tracking** — Lacak pesanan via Order ID atau Nickname Sky
- **Dynamic Checkout Modal** — Modal otomatis tampilkan QRIS (IDR) atau PayPal (USD)
- **Animasi Bintang** — Background animasi bintang melayang dengan CSS keyframes
- **Glassmorphism UI** — Efek kaca transparan pada kartu dan modal
- **Fully Responsive** — Desktop, tablet, dan mobile

## Setup & Deploy ke GitHub Pages

1. **Clone / download** repository ini
2. **Ganti `assets/qris.png`** dengan file QRIS asli dari rekening/dompet digital kamu
3. **Edit `config/data.js`** — sesuaikan nomor WhatsApp, link grup, email PayPal
4. **Push ke GitHub**, aktifkan GitHub Pages dari Settings → Pages → Branch: main

## Konfigurasi Cepat

Buka `config/data.js` dan ubah bagian berikut:

```js
const STORE_CONFIG = {
  whatsapp: "6285363625159",          // Nomor WA tanpa tanda +
  waGroup: "https://chat.whatsapp.com/...",  // Link grup WA
  qrisImage: "assets/qris.png",       // Path ke file QRIS
  paypal: {
    email: "balilstore@paypal.com",   // Email PayPal
    link: "https://paypal.me/balilstore",
  },
};
```

## Customisasi Paket

Tambah atau ubah paket di array `HEART_PACKAGES` dalam `config/data.js`:

```js
{
  id: "pkg-100",        // ID unik
  hearts: 100,          // Jumlah Heart
  bonus: 0,             // Bonus Heart (0 jika tidak ada)
  label: "Starter",     // Nama paket
  popular: false,       // true untuk badge "Terlaris"
  priceIDR: 12000,      // Harga dalam IDR
  priceUSD: 1.0,        // Harga dalam USD
  description: "...",   // Deskripsi singkat
  estimateDays: 4,      // Estimasi hari pengiriman
}
```

## Teknologi

- HTML5 semantik dengan aksesibilitas (ARIA)
- CSS3 murni — glassmorphism, animasi keyframes, grid responsif
- Vanilla JavaScript (ES6+, IIFE pattern)
- Google Fonts: Cinzel (display) + Inter (body)
- Zero dependensi external library

---

© 2025 BALILSTORE. Bukan afiliasi resmi thatgamecompany.
