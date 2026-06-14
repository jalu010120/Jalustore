// main.js - UPGRADED VERSION
(() => {
  "use strict";

  /* ─── State ─── */
  let activeCurrency = "idr";
  let activeCheckoutPkg = null;
  let cart = [];
  let liveVisitorCount = Math.floor(Math.random() * (28 - 12 + 1) + 12);
  let visitorInterval;

  /* ─── Helpers ─── */
  function fmt(amount, cur) {
    if (cur === "idr") return "Rp " + amount.toLocaleString("id-ID");
    return "$" + amount.toFixed(2);
  }

  function pkgPrice(pkg, cur) {
    return cur === "idr" ? pkg.priceIDR : pkg.priceUSD;
  }

  function pkgPerHeart(pkg, cur) {
    const total = pkg.hearts + pkg.bonus;
    if (cur === "idr") return "Rp " + Math.round(pkg.priceIDR / total).toLocaleString("id-ID") + "/Heart";
    return "$" + (pkg.priceUSD / total).toFixed(4) + "/Heart";
  }

  /* ─── Toast ─── */
  function toast(icon, text, dur = 3000) {
    const wrap = document.getElementById("toast-wrap");
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="toast-ico">${icon}</span><span class="toast-text">${text}</span>`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.classList.add("exiting");
      setTimeout(() => el.remove(), 350);
    }, dur);
  }

  /* ─── Live Visitor Counter ─── */
  function initLiveVisitor() {
    const container = document.createElement('div');
    container.className = 'live-visitor';
    container.innerHTML = `
      <span class="live-visitor-dot"></span>
      <span id="visitor-count">${liveVisitorCount}</span>
      <span>orang sedang melihat halaman ini</span>
    `;
    document.body.appendChild(container);

    // Simulate visitor count changes
    visitorInterval = setInterval(() => {
      const delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      liveVisitorCount = Math.max(3, liveVisitorCount + delta);
      const countEl = document.getElementById('visitor-count');
      if (countEl) countEl.textContent = liveVisitorCount;
    }, 30000);
  }

  /* ─── Floating WhatsApp Widget ─── */
  function initWhatsAppWidget() {
    const widget = document.createElement('div');
    widget.className = 'floating-wa';
    widget.innerHTML = `
      <div class="whatsapp-button" id="floating-wa-btn">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>
      <div class="whatsapp-tooltip">Chat dengan Admin →</div>
    `;
    document.body.appendChild(widget);

    document.getElementById('floating-wa-btn')?.addEventListener('click', () => {
      window.open(`https://wa.me/${STORE_CONFIG.whatsapp}?text=Halo%20BALILSTORE!%20Saya%20ingin%20bertanya%20tentang%20top-up%20Heart%20Sky%3A%20CoTL.`, '_blank', 'noopener');
    });

    // Auto popup welcome message after 5 seconds (only once per session)
    if (!sessionStorage.getItem('wa-welcome-shown')) {
      setTimeout(() => {
        toast('💬', 'Ada yang bisa kami bantu? Klik tombol hijau di pojok kanan bawah untuk chat Admin!', 5000);
        sessionStorage.setItem('wa-welcome-shown', 'true');
      }, 5000);
    }
  }

  /* ─── Cookie Consent ─── */
  function initCookieConsent() {
    if (localStorage.getItem('cookie-consent')) return;

    const consent = document.createElement('div');
    consent.className = 'cookie-consent';
    consent.innerHTML = `
      <span class="cookie-text">🍪 Kami menggunakan cookie untuk meningkatkan pengalaman Anda di BALILSTORE.</span>
      <div class="cookie-buttons">
        <button class="btn-cookie-accept" id="cookie-accept">Terima</button>
        <button class="btn-cookie-decline" id="cookie-decline">Tolak</button>
      </div>
    `;
    document.body.appendChild(consent);

    document.getElementById('cookie-accept')?.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      consent.remove();
      toast('✅', 'Terima kasih! Pengaturan cookie tersimpan.', 2000);
    });

    document.getElementById('cookie-decline')?.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'declined');
      consent.remove();
    });
  }

  /* ─── Queue Preview ─── */
  function renderQueuePreview() {
    const trackingSection = document.getElementById('tracking');
    if (!trackingSection) return;

    // Check if queue preview already exists
    if (document.querySelector('.queue-preview')) return;

    const activeOrders = DEMO_ORDERS.filter(o => o.status !== 'completed').slice(0, 3);
    if (activeOrders.length === 0) return;

    const queuePreview = document.createElement('div');
    queuePreview.className = 'queue-preview reveal';
    queuePreview.innerHTML = `
      <div class="queue-title">📋 Antrean Pesanan Aktif</div>
      <div class="queue-list">
        ${activeOrders.map(order => `
          <div class="queue-item">
            <div class="queue-pos">#${order.queuePosition || '?'}</div>
            <div class="queue-info">
              <div class="queue-order-id">${order.id}</div>
              <div class="queue-package">${order.package}</div>
            </div>
            <div class="queue-progress">${order.heartsSent}/${order.heartsTotal} ♥</div>
          </div>
        `).join('')}
      </div>
      <p style="font-size:0.7rem;color:var(--c-dim);margin-top:12px;">*Pengiriman maks. 30 Heart/hari</p>
    `;

    const trackWrap = document.querySelector('.track-wrap');
    if (trackWrap) trackWrap.appendChild(queuePreview);
    initReveal();
  }

  /* ─── Render packages ─── */
  function renderPackages() {
    const grid = document.getElementById("pkg-grid");
    if (!grid) return;
    grid.innerHTML = "";

    HEART_PACKAGES.forEach((pkg, idx) => {
      const price = pkgPrice(pkg, activeCurrency);
      const totalHearts = pkg.hearts + pkg.bonus;
      const per = pkgPerHeart(pkg, activeCurrency);

      let tagHTML = "";
      if (pkg.tag === "TERLARIS") tagHTML = `<span class="pkg-tag tag-popular">★ TERLARIS</span>`;
      else if (pkg.tag === "HEMAT")    tagHTML = `<span class="pkg-tag tag-hemat">♻ HEMAT</span>`;
      else if (pkg.tag === "BONUS +20") tagHTML = `<span class="pkg-tag tag-bonus">+20 Bonus</span>`;

      const staggerClass = `reveal-stagger${idx % 3 === 0 ? '' : idx % 3 === 1 ? '-2' : '-3'}`;

      const card = document.createElement("div");
      card.className = `pkg-card reveal ${staggerClass} ${pkg.popular ? "is-popular" : ""}`;
      card.innerHTML = `
        ${tagHTML}
        <div class="pkg-label">${pkg.label}</div>
        <div class="pkg-amount">
          <span class="pkg-heart-ico">♥</span>
          <span class="pkg-heart-num">${totalHearts.toLocaleString("id-ID")}</span>
          <span class="pkg-heart-unit">Heart</span>
        </div>
        ${pkg.bonus > 0 ? `<div class="pkg-bonus-note">♦ ${pkg.hearts} + ${pkg.bonus} Heart Bonus</div>` : ""}
        <div class="pkg-price" data-pkg="${pkg.id}">${fmt(price, activeCurrency)}</div>
        <div class="pkg-per" data-per="${pkg.id}">${per}</div>
        <div class="pkg-est">⏱ Estimasi ~${pkg.estimateDays} hari</div>
        <p class="pkg-desc">${pkg.description}</p>
        <div class="pkg-actions">
          <button class="btn-add-cart" data-pkg="${pkg.id}">+ Keranjang</button>
          <button class="btn-buy-now"  data-pkg="${pkg.id}">Beli Sekarang</button>
        </div>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll(".btn-buy-now").forEach((b) => {
      b.addEventListener("click", () => openCheckout(b.dataset.pkg));
    });
    grid.querySelectorAll(".btn-add-cart").forEach((b) => {
      b.addEventListener("click", () => addToCart(b.dataset.pkg));
    });

    initReveal();
  }

  function updatePriceDisplay() {
    document.querySelectorAll(".pkg-price[data-pkg]").forEach((el) => {
      const pkg = HEART_PACKAGES.find((p) => p.id === el.dataset.pkg);
      if (!pkg) return;
      el.textContent = fmt(pkgPrice(pkg, activeCurrency), activeCurrency);
      el.classList.add("flash");
      setTimeout(() => el.classList.remove("flash"), 300);
    });
    document.querySelectorAll(".pkg-per[data-per]").forEach((el) => {
      const pkg = HEART_PACKAGES.find((p) => p.id === el.dataset.per);
      if (pkg) el.textContent = pkgPerHeart(pkg, activeCurrency);
    });
    renderCartItems();
    updateCartTotal();
  }

  /* ─── Currency switcher ─── */
  function initCurrency() {
    const btnIDR = document.getElementById("btn-idr");
    const btnUSD = document.getElementById("btn-usd");
    if (!btnIDR) return;

    function setCur(cur) {
      activeCurrency = cur;
      btnIDR.classList.toggle("on", cur === "idr");
      btnUSD.classList.toggle("on", cur === "usd");
      updatePriceDisplay();
    }

    btnIDR.addEventListener("click", () => setCur("idr"));
    btnUSD.addEventListener("click", () => setCur("usd"));
  }

  /* ─── Cart ─── */
  function addToCart(pkgId) {
    const pkg = HEART_PACKAGES.find((p) => p.id === pkgId);
    if (!pkg) return;

    const exists = cart.find((i) => i.id === pkgId);
    if (exists) {
      exists.qty += 1;
      toast("🛒", `${pkg.label} (${pkg.hearts + pkg.bonus} Heart) quantity ditambah jadi ${exists.qty}!`);
    } else {
      cart.push({ id: pkgId, qty: 1 });
      toast("🛒", `${pkg.label} (${pkg.hearts + pkg.bonus} Heart) ditambahkan ke keranjang!`);
    }

    updateCartBadge();
  }

  function removeFromCart(pkgId) {
    cart = cart.filter((i) => i.id !== pkgId);
    updateCartBadge();
    renderCartItems();
    updateCartTotal();
    toast("🗑️", "Item dihapus dari keranjang");
  }

  function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    const total = cart.reduce((s, i) => s + i.qty, 0);
    badge.textContent = total;
    badge.classList.toggle("show", total > 0);
  }

  function renderCartItems() {
    const el = document.getElementById("cart-items");
    const empty = document.getElementById("cart-empty");
    const footer = document.getElementById("cart-footer");
    if (!el) return;

    if (cart.length === 0) {
      el.innerHTML = "";
      empty.style.display = "block";
      footer.style.display = "none";
      return;
    }

    empty.style.display = "none";
    footer.style.display = "block";
    el.innerHTML = "";

    cart.forEach((item) => {
      const pkg = HEART_PACKAGES.find((p) => p.id === item.id);
      if (!pkg) return;
      const total = pkg.hearts + pkg.bonus;
      const price = pkgPrice(pkg, activeCurrency) * item.qty;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <span class="cart-item-icon">♥</span>
        <div class="cart-item-info">
          <div class="cart-item-name">${pkg.label} — ${total} Heart ${item.qty > 1 ? `<strong>×${item.qty}</strong>` : ""}</div>
          <div class="cart-item-sub">~${pkg.estimateDays * item.qty} hari estimasi pengiriman</div>
        </div>
        <div class="cart-item-price">${fmt(price, activeCurrency)}</div>
        <button class="btn-cart-remove" data-pkg="${pkg.id}" aria-label="Hapus dari keranjang">×</button>
      `;
      el.appendChild(div);
    });

    el.querySelectorAll(".btn-cart-remove").forEach((b) => {
      b.addEventListener("click", () => removeFromCart(b.dataset.pkg));
    });
  }

  function updateCartTotal() {
    const el = document.getElementById("cart-total");
    if (!el) return;
    const total = cart.reduce((s, item) => {
      const pkg = HEART_PACKAGES.find((p) => p.id === item.id);
      return pkg ? s + pkgPrice(pkg, activeCurrency) * item.qty : s;
    }, 0);
    el.textContent = fmt(activeCurrency === "idr" ? Math.round(total) : total, activeCurrency);
  }

  function buildCartWaText() {
    let lines = ["Halo BALILSTORE! Saya ingin order dari keranjang belanja:\n"];
    cart.forEach((item, i) => {
      const pkg = HEART_PACKAGES.find((p) => p.id === item.id);
      if (pkg) {
        const total = pkg.hearts + pkg.bonus;
        const price = pkgPrice(pkg, activeCurrency) * item.qty;
        lines.push(`${i + 1}. ${pkg.label} — ${total} Heart ×${item.qty} = ${fmt(price, activeCurrency)}`);
      }
    });
    const grandTotal = cart.reduce((s, item) => {
      const pkg = HEART_PACKAGES.find((p) => p.id === item.id);
      return pkg ? s + pkgPrice(pkg, activeCurrency) * item.qty : s;
    }, 0);
    lines.push(`\nTotal: ${fmt(activeCurrency === "idr" ? Math.round(grandTotal) : grandTotal, activeCurrency)}`);
    lines.push("\nMohon konfirmasi pesanan saya, terima kasih!");
    return encodeURIComponent(lines.join("\n"));
  }

  /* ─── Cart modal ─── */
  function openCartModal() {
    renderCartItems();
    updateCartTotal();
    openModal("modal-cart");
  }

  /* ─── Checkout modal ─── */
  function openCheckout(pkgId) {
    const pkg = HEART_PACKAGES.find((p) => p.id === pkgId);
    if (!pkg) return;
    activeCheckoutPkg = pkg;

    const totalH = pkg.hearts + pkg.bonus;
    const price = pkgPrice(pkg, activeCurrency);

    document.getElementById("modal-pkg-name").textContent = `${pkg.label} — ${totalH.toLocaleString("id-ID")} Heart`;
    document.getElementById("modal-pkg-price").textContent = fmt(price, activeCurrency);
    document.getElementById("modal-pkg-est").textContent = `⏱ Estimasi ~${pkg.estimateDays} hari`;

    const idrSec = document.getElementById("pay-idr");
    const usdSec = document.getElementById("pay-usd");

    if (activeCurrency === "idr") {
      idrSec.style.display = "block";
      usdSec.style.display = "none";
      const img = document.getElementById("qris-img");
      if (img) img.src = STORE_CONFIG.qrisImage;
    } else {
      idrSec.style.display = "none";
      usdSec.style.display = "block";
      const paypalEmail = document.getElementById("paypal-email-show");
      const paypalLink = document.getElementById("btn-paypal-link");
      if (paypalEmail) paypalEmail.textContent = STORE_CONFIG.paypal.email;
      if (paypalLink) paypalLink.href = STORE_CONFIG.paypal.link;
    }

    const waText = encodeURIComponent(
      `Halo BALILSTORE! Saya ingin memesan:\n` +
      `📦 Paket: ${pkg.label} (${totalH} Heart)\n` +
      `💰 Harga: ${fmt(price, activeCurrency)}\n` +
      `🎮 Game: Sky: Children of the Light\n\n` +
      `Mohon proses pesanan saya, terima kasih!`
    );
    const waBtn = document.getElementById("btn-wa-checkout");
    if (waBtn) waBtn.href = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${waText}`;

    openModal("modal-checkout");
  }

  /* ─── Generic modal helpers ─── */
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  function initModals() {
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
    });

    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.open").forEach((m) => closeModal(m.id));
      }
    });

    const checkoutBtn = document.getElementById("btn-cart-checkout");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
          toast("⚠", "Keranjang masih kosong!");
          return;
        }
        const waUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${buildCartWaText()}`;
        closeModal("modal-cart");
        window.open(waUrl, "_blank", "noopener");
      });
    }
  }

  /* ─── Cart button ─── */
  function initCartBtn() {
    const btn = document.getElementById("btn-open-cart");
    if (btn) btn.addEventListener("click", openCartModal);
  }

  /* ─── Tracking ─── */
  function doTrack() {
    const val = document.getElementById("track-input").value.trim().toLowerCase();
    const box = document.getElementById("track-result");

    if (!val) {
      box.style.display = "block";
      box.className = "track-result s-error";
      box.innerHTML = `<p class="tr-error-msg" style="color:var(--c-red)">⚠ Masukkan Order ID atau Nickname kamu terlebih dahulu.</p>`;
      return;
    }

    box.style.display = "block";
    box.className = "track-result";
    box.innerHTML = `<div class="tr-loading"><span class="spinner"></span> Memeriksa pesanan...</div>`;

    setTimeout(() => {
      const order = DEMO_ORDERS.find(
        (o) => o.id.toLowerCase() === val || o.nickname.toLowerCase() === val
      );

      if (!order) {
        const meta = STATUS_META.notfound;
        box.className = "track-result s-error";
        box.innerHTML = `
          <div class="tr-status">
            <span class="tr-status-ico" style="color:${meta.color}">${meta.icon}</span>
            <span class="tr-status-text" style="color:${meta.color}">${meta.text}</span>
          </div>
          <p class="tr-error-msg">Tidak ada pesanan dengan ID atau Nickname "<strong>${val}</strong>". Periksa kembali data kamu atau hubungi Admin.</p>
          <a href="https://wa.me/${STORE_CONFIG.whatsapp}" class="btn btn-green btn-sm" target="_blank" rel="noopener">💬 Tanya Admin</a>
        `;
        return;
      }

      const meta = STATUS_META[order.status];
      const pct = order.heartsTotal > 0 ? Math.round((order.heartsSent / order.heartsTotal) * 100) : 0;
      const remaining = order.heartsTotal - order.heartsSent;

      box.className = `track-result s-${order.status}`;
      box.innerHTML = `
        <div class="tr-head">
          <span class="tr-id">📋 ${order.id.toUpperCase()}</span>
          <span class="tr-date">📅 ${order.date}</span>
        </div>
        <div class="tr-status">
          <span class="tr-status-ico" style="color:${meta.color}">${meta.icon}</span>
          <span class="tr-status-text" style="color:${meta.color}">${meta.text}</span>
        </div>
        <div class="tr-grid">
          <div class="tr-stat"><span class="tr-stat-val">${order.package}</span><span class="tr-stat-lbl">Paket</span></div>
          <div class="tr-stat"><span class="tr-stat-val">${order.heartsSent}</span><span class="tr-stat-lbl">Terkirim</span></div>
          <div class="tr-stat"><span class="tr-stat-val">${remaining > 0 ? remaining : "—"}</span><span class="tr-stat-lbl">Sisa</span></div>
          <div class="tr-stat"><span class="tr-stat-val">${order.queuePosition > 0 ? "#" + order.queuePosition : "—"}</span><span class="tr-stat-lbl">Antrean</span></div>
        </div>
        ${order.heartsTotal > 0 ? `
        <div class="tr-progress">
          <div style="display:flex;justify-content:space-between;font-size:0.7rem;color:var(--c-dim)">
            <span>Progress Pengiriman</span><span>${pct}%</span>
          </div>
          <div class="tr-progress-bar"><div class="tr-progress-fill" style="width:0%" data-target="${pct}"></div></div>
        </div>` : ""}
        <div class="tr-nick">👤 <strong>${order.nickname}</strong></div>
        ${order.status !== "completed"
          ? `<p class="tr-note">Pengiriman maks. ${STORE_CONFIG.dailyCapacity} Heart/hari · 08.00–22.00 WIB</p>`
          : `<p class="tr-note tr-note-done">✓ Pesanan selesai! Terima kasih telah berbelanja di BALILSTORE.</p>`}
      `;

      const fill = box.querySelector(".tr-progress-fill");
      if (fill) setTimeout(() => { fill.style.width = fill.dataset.target + "%"; }, 100);
    }, 1100);
  }

  function initTracking() {
    const btn = document.getElementById("btn-track");
    const inp = document.getElementById("track-input");
    if (!btn) return;
    btn.addEventListener("click", doTrack);
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") doTrack(); });
  }

  /* ─── Reviews ─── */
  function renderReviews() {
    const grid = document.getElementById("reviews-grid");
    if (!grid) return;
    REVIEWS.forEach((r, idx) => {
      const stars = "★".repeat(r.stars) + "☆".repeat(5 - r.stars);
      const staggerClass = `reveal-stagger${idx % 3 === 0 ? '' : idx % 3 === 1 ? '-2' : '-3'}`;
      const el = document.createElement("div");
      el.className = `rv-card reveal ${staggerClass}`;
      el.innerHTML = `
        <div class="rv-head">
          <div class="rv-avatar">${r.avatar}</div>
          <div class="rv-info">
            <div class="rv-name">${r.name}</div>
            <div class="rv-meta">${r.date} · <span class="rv-stars">${stars}</span></div>
          </div>
        </div>
        <span class="rv-pkg">♥ ${r.pkg}</span>
        <p class="rv-text">${r.text}</p>
      `;
      grid.appendChild(el);
    });
  }

  /* ─── FAQ ─── */
  function renderFAQ() {
    const list = document.getElementById("faq-list");
    if (!list) return;
    FAQ_DATA.forEach((item) => {
      const id = "faq-" + Math.random().toString(36).slice(2, 7);
      const el = document.createElement("div");
      el.className = "faq-item reveal";
      el.innerHTML = `
        <button class="faq-q" aria-expanded="false" aria-controls="${id}">
          <span>${item.q}</span>
          <span class="faq-arrow">+</span>
        </button>
        <div class="faq-ans" id="${id}" role="region"><p>${item.a}</p></div>
      `;
      list.appendChild(el);
    });

    list.querySelectorAll(".faq-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        list.querySelectorAll(".faq-q").forEach((b) => {
          b.setAttribute("aria-expanded", "false");
          const arrow = b.querySelector(".faq-arrow");
          if (arrow) arrow.textContent = "+";
        });
        if (!open) {
          btn.setAttribute("aria-expanded", "true");
          const arrow = btn.querySelector(".faq-arrow");
          if (arrow) arrow.textContent = "−";
        }
      });
    });
  }

  /* ─── Stats Animation ─── */
  function animateStats() {
    const customersEl = document.getElementById("stat-customers");
    const ordersEl = document.getElementById("stat-orders");
    
    if (customersEl) {
      const target = parseInt(STORE_CONFIG.stats.customers.replace(/[^0-9]/g, ''));
      animateNumber(customersEl, 0, target, 1500);
    }
    
    if (ordersEl) {
      const target = parseInt(STORE_CONFIG.stats.orders.replace(/[^0-9]/g, ''));
      animateNumber(ordersEl, 0, target, 1500);
    }
  }

  function animateNumber(el, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        el.textContent = end.toLocaleString('id-ID') + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString('id-ID');
      }
    }, 16);
  }

  /* ─── Navbar ─── */
  function initNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("btn-menu");
    const links = document.getElementById("nav-links");
    if (!nav) return;

    window.addEventListener("scroll", () => {
      nav.classList.toggle("stuck", window.scrollY > 40);
    }, { passive: true });

    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open);
        toggle.textContent = open ? "✕" : "☰";
      });
      links.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          links.classList.remove("open");
          toggle.textContent = "☰";
        });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* ─── Scroll reveal ─── */
  function initReveal() {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
  }

  /* ─── Init ─── */
  function init() {
    renderPackages();
    initCurrency();
    initCartBtn();
    initModals();
    initTracking();
    renderReviews();
    renderFAQ();
    initNav();
    initReveal();
    animateStats();
    renderQueuePreview();
    initLiveVisitor();
    initWhatsAppWidget();
    initCookieConsent();

    const waGroupBtn = document.getElementById("btn-wa-group");
    if (waGroupBtn) waGroupBtn.href = STORE_CONFIG.waGroup;

    const yr = document.getElementById("footer-year");
    if (yr) yr.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
