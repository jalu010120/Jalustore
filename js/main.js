(() => {
  "use strict";

  let activeCurrency = "idr";
  let activePackage = null;

  function formatPrice(amount, currency) {
    const cfg = STORE_CONFIG.currency[currency];
    if (currency === "idr") {
      return cfg.symbol + " " + amount.toLocaleString("id-ID");
    }
    return cfg.symbol + amount.toFixed(2);
  }

  function getPackagePrice(pkg, currency) {
    return currency === "idr" ? pkg.priceIDR : pkg.priceUSD;
  }

  function renderPackages() {
    const grid = document.getElementById("packages-grid");
    if (!grid) return;
    grid.innerHTML = "";

    HEART_PACKAGES.forEach((pkg) => {
      const price = getPackagePrice(pkg, activeCurrency);
      const formattedPrice = formatPrice(price, activeCurrency);
      const totalHearts = pkg.hearts + pkg.bonus;

      const card = document.createElement("div");
      card.className = "package-card" + (pkg.popular ? " popular" : "");
      card.dataset.id = pkg.id;

      card.innerHTML = `
        ${pkg.popular ? '<div class="badge-popular">✦ Terlaris</div>' : ""}
        ${pkg.bonus > 0 ? `<div class="badge-bonus">+${pkg.bonus} Bonus!</div>` : ""}
        <div class="pkg-label">${pkg.label}</div>
        <div class="pkg-hearts">
          <span class="heart-icon">♥</span>
          <span class="heart-count">${totalHearts.toLocaleString("id-ID")}</span>
          <span class="heart-unit">Heart</span>
        </div>
        ${pkg.bonus > 0 ? `<div class="pkg-base-note">${pkg.hearts} + ${pkg.bonus} Bonus</div>` : ""}
        <div class="pkg-price" data-pkg-id="${pkg.id}">${formattedPrice}</div>
        <div class="pkg-estimate">~${pkg.estimateDays} hari pengiriman</div>
        <p class="pkg-desc">${pkg.description}</p>
        <button class="btn-order" data-pkg-id="${pkg.id}">Pesan Sekarang</button>
      `;

      grid.appendChild(card);
    });

    document.querySelectorAll(".btn-order").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const pkgId = e.currentTarget.dataset.pkgId;
        openCheckoutModal(pkgId);
      });
    });
  }

  function updatePriceLabels() {
    document.querySelectorAll(".pkg-price[data-pkg-id]").forEach((el) => {
      const pkgId = el.dataset.pkgId;
      const pkg = HEART_PACKAGES.find((p) => p.id === pkgId);
      if (pkg) {
        const price = getPackagePrice(pkg, activeCurrency);
        el.textContent = formatPrice(price, activeCurrency);
        el.classList.add("price-flash");
        setTimeout(() => el.classList.remove("price-flash"), 400);
      }
    });
  }

  function initCurrencySwitcher() {
    const switcher = document.getElementById("currency-switcher");
    const btnIDR = document.getElementById("btn-idr");
    const btnUSD = document.getElementById("btn-usd");

    if (!switcher) return;

    function updateSwitcher(currency) {
      activeCurrency = currency;
      btnIDR.classList.toggle("active", currency === "idr");
      btnUSD.classList.toggle("active", currency === "usd");
      updatePriceLabels();
    }

    btnIDR.addEventListener("click", () => updateSwitcher("idr"));
    btnUSD.addEventListener("click", () => updateSwitcher("usd"));
  }

  function openCheckoutModal(pkgId) {
    const pkg = HEART_PACKAGES.find((p) => p.id === pkgId);
    if (!pkg) return;
    activePackage = pkg;

    const modal = document.getElementById("checkout-modal");
    const totalHearts = pkg.hearts + pkg.bonus;
    const price = getPackagePrice(pkg, activeCurrency);
    const formattedPrice = formatPrice(price, activeCurrency);

    document.getElementById("modal-pkg-name").textContent =
      pkg.label + " — " + totalHearts + " Heart";
    document.getElementById("modal-pkg-price").textContent = formattedPrice;
    document.getElementById("modal-pkg-estimate").textContent =
      "Estimasi: ~" + pkg.estimateDays + " hari";

    const idrSection = document.getElementById("modal-idr-payment");
    const usdSection = document.getElementById("modal-usd-payment");

    if (activeCurrency === "idr") {
      idrSection.style.display = "block";
      usdSection.style.display = "none";
      const qrisImg = document.getElementById("qris-image");
      qrisImg.src = STORE_CONFIG.qrisImage;
      qrisImg.alt = "QRIS BALILSTORE";
    } else {
      idrSection.style.display = "none";
      usdSection.style.display = "block";
      document.getElementById("paypal-link").href = STORE_CONFIG.paypal.link;
      document.getElementById("paypal-email").textContent =
        STORE_CONFIG.paypal.email;
    }

    const waText = encodeURIComponent(
      "Halo BALILSTORE! Saya ingin pesan:\n" +
        "📦 Paket: " + pkg.label + " (" + totalHearts + " Heart)\n" +
        "💰 Harga: " + formattedPrice + "\n" +
        "🎮 Game: Sky: Children of the Light\n\n" +
        "Mohon bantu proses pesanan saya ya, terima kasih!"
    );
    document.getElementById("btn-wa-order").href =
      "https://wa.me/" + STORE_CONFIG.whatsapp + "?text=" + waText;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    modal.classList.remove("active");
    document.body.style.overflow = "";
    activePackage = null;
  }

  function initModal() {
    const modal = document.getElementById("checkout-modal");
    if (!modal) return;

    document.getElementById("modal-close").addEventListener("click", closeCheckoutModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeCheckoutModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCheckoutModal();
    });
  }

  function checkOrder() {
    const input = document
      .getElementById("tracking-input")
      .value.trim()
      .toLowerCase();
    const resultBox = document.getElementById("tracking-result");

    if (!input) {
      showTrackingError(resultBox, "Masukkan Order ID atau Nickname kamu.");
      return;
    }

    resultBox.innerHTML = '<div class="tracking-loading"><span class="spinner"></span> Memeriksa pesanan...</div>';
    resultBox.style.display = "block";
    resultBox.className = "tracking-result-box loading";

    setTimeout(() => {
      const order = DEMO_ORDERS.find(
        (o) =>
          o.id.toLowerCase() === input ||
          o.nickname.toLowerCase() === input
      );

      if (!order) {
        const cfg = STATUS_LABELS.notfound;
        resultBox.className = "tracking-result-box error";
        resultBox.innerHTML = `
          <div class="tracking-status-icon" style="color:${cfg.color}">${cfg.icon}</div>
          <div class="tracking-status-text" style="color:${cfg.color}">${cfg.text}</div>
          <p class="tracking-message">Tidak ada pesanan dengan ID atau Nickname "<strong>${input}</strong>". Pastikan data benar atau hubungi Admin.</p>
          <a href="https://wa.me/${STORE_CONFIG.whatsapp}" class="btn-track-wa" target="_blank">Tanya Admin</a>
        `;
        return;
      }

      const cfg = STATUS_LABELS[order.status];
      const totalHearts = order.package.replace(" Heart", "");
      const remaining = parseInt(totalHearts) - order.heartsSent;

      resultBox.className = "tracking-result-box " + order.status;
      resultBox.innerHTML = `
        <div class="tracking-header">
          <span class="tracking-id">📋 ${order.id.toUpperCase()}</span>
          <span class="tracking-date">📅 ${order.date}</span>
        </div>
        <div class="tracking-status-row">
          <div class="tracking-status-icon" style="color:${cfg.color}">${cfg.icon}</div>
          <div class="tracking-status-text" style="color:${cfg.color}">${cfg.text}</div>
        </div>
        <div class="tracking-grid">
          <div class="tracking-stat">
            <div class="stat-value">${order.package}</div>
            <div class="stat-label">Paket Dipesan</div>
          </div>
          <div class="tracking-stat">
            <div class="stat-value">${order.heartsSent}</div>
            <div class="stat-label">Heart Terkirim</div>
          </div>
          <div class="tracking-stat">
            <div class="stat-value">${remaining > 0 ? remaining : "—"}</div>
            <div class="stat-label">Sisa Heart</div>
          </div>
          <div class="tracking-stat">
            <div class="stat-value">${order.queuePosition > 0 ? "#" + order.queuePosition : "—"}</div>
            <div class="stat-label">Posisi Antrean</div>
          </div>
        </div>
        <div class="tracking-nickname">👤 <strong>${order.nickname}</strong></div>
        ${order.status !== "completed" ? `<p class="tracking-note">Pengiriman dilanjutkan setiap hari. Maks. ${STORE_CONFIG.dailyCapacity} Heart/hari.</p>` : '<p class="tracking-note tracking-done">Pesanan selesai! Terima kasih telah berbelanja di BALILSTORE ✦</p>'}
      `;
    }, 1200);
  }

  function showTrackingError(box, msg) {
    box.style.display = "block";
    box.className = "tracking-result-box error";
    box.innerHTML = `<p class="tracking-message" style="color:#f87171">⚠ ${msg}</p>`;
  }

  function initTracking() {
    const btn = document.getElementById("btn-check-order");
    const input = document.getElementById("tracking-input");
    if (!btn || !input) return;

    btn.addEventListener("click", checkOrder);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkOrder();
    });
  }

  function initFAQ() {
    const container = document.getElementById("faq-container");
    if (!container) return;

    FAQ_DATA.forEach((item, i) => {
      const el = document.createElement("div");
      el.className = "faq-item";
      el.innerHTML = `
        <button class="faq-question" aria-expanded="false" data-index="${i}">
          <span>${item.q}</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer" id="faq-ans-${i}">
          <p>${item.a}</p>
        </div>
      `;
      container.appendChild(el);
    });

    container.querySelectorAll(".faq-question").forEach((btn) => {
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        container.querySelectorAll(".faq-question").forEach((b) => {
          b.setAttribute("aria-expanded", "false");
          b.querySelector(".faq-icon").textContent = "+";
        });
        if (!expanded) {
          btn.setAttribute("aria-expanded", "true");
          btn.querySelector(".faq-icon").textContent = "−";
        }
      });
    });
  }

  function initStars() {
    const starsContainer = document.getElementById("stars-bg");
    if (!starsContainer) return;

    const count = 160;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      star.className = "star";
      const size = Math.random() * 2.5 + 0.5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = Math.random() * 6 + 6;
      const opacity = Math.random() * 0.7 + 0.3;

      star.style.cssText = `
        left:${x}%;
        top:${y}%;
        width:${size}px;
        height:${size}px;
        animation-delay:${delay}s;
        animation-duration:${duration}s;
        opacity:${opacity};
      `;
      fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
  }

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });
  }

  function initNavScroll() {
    const nav = document.getElementById("main-nav");
    if (!nav) return;

    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 50);
    });

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

  function initMobileMenu() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("nav-links");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.innerHTML = open ? "✕" : "☰";
    });

    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", false);
        toggle.innerHTML = "☰";
      });
    });
  }

  function init() {
    initStars();
    renderPackages();
    initCurrencySwitcher();
    initModal();
    initTracking();
    initFAQ();
    initScrollAnimations();
    initNavScroll();
    initMobileMenu();

    const waGroupBtn = document.getElementById("btn-join-wa");
    if (waGroupBtn) waGroupBtn.href = STORE_CONFIG.waGroup;

    const year = document.getElementById("footer-year");
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
