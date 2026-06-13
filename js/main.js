(() => {
  "use strict";

  /* ─── State ─── */
  let activeCurrency = "idr";
  let activeCheckoutPkg = null;
  let cart = [];

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

  /* ─── Render packages ─── */
  function renderPackages() {
    const grid = document.getElementById("pkg-grid");
    if (!grid) return;
    grid.innerHTML = "";

    HEART_PACKAGES.forEach((pkg) => {
      const price = pkgPrice(pkg, activeCurrency);
      const totalHearts = pkg.hearts + pkg.bonus;
      const per = pkgPerHeart(pkg, activeCurrency);

      let tagHTML = "";
      if (pkg.tag === "TERLARIS") tagHTML = `<span class="pkg-tag tag-popular">★ TERLARIS</span>`;
      else if (pkg.tag === "HEMAT")    tagHTML = `<span class="pkg-tag tag-hemat">♻ HEMAT</span>`;
      else if (pkg.tag === "BONUS +20") tagHTML = `<span class="pkg-tag tag-bonus">+20 Bonus</span>`;

      const card = document.createElement("div");
      card.className = "pkg-card reveal" + (pkg.popular ? " is-popular" : "");
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
    } else {
      cart.push({ id: pkgId, qty: 1 });
    }

    updateCartBadge();
    toast("🛒", `${pkg.label} (${pkg.hearts + pkg.bonus} Heart) ditambahkan ke keranjang!`);
  }

  function removeFromCart(pkgId) {
    cart = cart.filter((i) => i.id !== pkgId);
    updateCartBadge();
    renderCartItems();
    updateCartTotal();
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
      img.src = STORE_CONFIG.qrisImage;
    } else {
      idrSec.style.display = "none";
      usdSec.style.display = "block";
      document.getElementById("paypal-email-show").textContent = STORE_CONFIG.paypal.email;
      document.getElementById("btn-paypal-link").href = STORE_CONFIG.paypal.link;
    }

    const waText = encodeURIComponent(
      `Halo BALILSTORE! Saya ingin memesan:\n` +
      `📦 Paket: ${pkg.label} (${totalH} Heart)\n` +
      `💰 Harga: ${fmt(price, activeCurrency)}\n` +
      `🎮 Game: Sky: Children of the Light\n\n` +
      `Mohon proses pesanan saya, terima kasih!`
    );
    document.getElementById("btn-wa-checkout").href = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${waText}`;

    openModal("modal-checkout");
  }

  /* ─── Generic modal helpers ─── */
  function openModal(id) {
    document.getElementById(id).classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    document.getElementById(id).classList.remove("open");
    document.body.style.overflow = "";
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

    document.getElementById("btn-cart-checkout").addEventListener("click", () => {
      if (cart.length === 0) { toast("⚠", "Keranjang masih kosong!"); return; }
      const waUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${buildCartWaText()}`;
      closeModal("modal-cart");
      window.open(waUrl, "_blank", "noopener");
    });
  }

  /* ─── Cart button ─── */
  function initCartBtn() {
    document.getElementById("btn-open-cart").addEventListener("click", openCartModal);
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
    REVIEWS.forEach((r) => {
      const stars = "★".repeat(r.stars) + "☆".repeat(5 - r.stars);
      const el = document.createElement("div");
      el.className = "rv-card reveal";
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
      el.className = "faq-item";
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
          b.querySelector(".faq-arrow").textContent = "+";
        });
        if (!open) {
          btn.setAttribute("aria-expanded", "true");
          btn.querySelector(".faq-arrow").textContent = "−";
        }
      });
    });
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
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
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
