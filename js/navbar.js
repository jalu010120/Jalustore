/**
 * JALUSTORE - Navbar Module
 * Handles scroll effects and mobile menu toggle
 */

(function() {
  'use strict';

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  
  const navbar = document.getElementById('navbar');
  let scrollTicking = false;

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 30;
          navbar.classList.toggle('scrolled', scrolled);
          scrollTicking = false;
        });
        scrollTicking = true;
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

})();
