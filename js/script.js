/**
 * JALUSTORE - Main Application
 * Entry point - initializes all modules and common functionality
 */

(function() {
  'use strict';

  // ============================================
  // LOADING SCREEN
  // ============================================
  
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 500);
      }, 300);
    });
  }

  // ============================================
  // SCROLL REVEAL (Fade In)
  // ============================================
  
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });

  // ============================================
  // SCROLL TO TOP
  // ============================================
  
  const scrollBtn = document.getElementById('scrollTop');
  let scrollBtnTicking = false;

  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (!scrollBtnTicking) {
        window.requestAnimationFrame(() => {
          const show = window.scrollY > 400;
          scrollBtn.classList.toggle('visible', show);
          scrollBtnTicking = false;
        });
        scrollBtnTicking = true;
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  
  const navbar = document.getElementById('navbar');
  let navTicking = false;

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (!navTicking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 30;
          navbar.classList.toggle('scrolled', scrolled);
          navTicking = false;
        });
        navTicking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = menuBtn?.querySelector('.menu-icon');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      if (menuIcon) {
        menuIcon.textContent = isOpen ? '✕' : '☰';
      }
    });

    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        if (menuIcon) {
          menuIcon.textContent = '☰';
        }
      });
    });
  }

  // ============================================
  // DARK MODE (already in separate file, but we also handle toggle)
  // ============================================
  
  // Dark mode is handled by darkmode.js
  // But we need to ensure toggle buttons work
  const toggleBtn = document.getElementById('darkToggle');
  const toggleBtnMobile = document.getElementById('darkToggleMobile');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.classList.contains('dark');
      html.classList.toggle('dark');
      const newDark = html.classList.contains('dark');
      try {
        localStorage.setItem('jalustore-theme', newDark ? 'dark' : 'light');
      } catch (e) {}
      const icon = newDark ? '☀️' : '🌙';
      document.querySelectorAll('.theme-toggle, .theme-toggle-mobile').forEach(el => {
        el.textContent = icon;
      });
    });
  }

  if (toggleBtnMobile) {
    toggleBtnMobile.addEventListener('click', toggleBtn?.click);
  }

  // ============================================
  // CONSOLE BRANDING
  // ============================================
  
  console.log('%c☁️ JALUSTORE', 'font-size: 24px; font-weight: bold; color: #4AA3FF;');
  console.log('%cTrusted Heart Seller for Sky: Children of the Light', 'font-size: 14px; color: #87CEEB;');
  console.log('%cWhatsApp: 6285363625159', 'font-size: 12px; color: #25D366;');

})();
