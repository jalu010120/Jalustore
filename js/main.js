/**
 * JALUSTORE - Main Application
 * Entry point - initializes all modules
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
  // CONSOLE BRANDING
  // ============================================
  
  console.log('%c☁️ JALUSTORE', 'font-size: 24px; font-weight: bold; color: #4AA3FF;');
  console.log('%cTrusted Heart Seller for Sky: Children of the Light', 'font-size: 14px; color: #87CEEB;');
  console.log('%cWhatsApp: 6285363625159', 'font-size: 12px; color: #25D366;');

})();
