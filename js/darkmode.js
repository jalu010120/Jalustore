/**
 * JALUSTORE - Dark Mode Module
 * Handles theme switching with localStorage persistence
 */

(function() {
  'use strict';

  const THEME_KEY = 'jalustore-theme';
  const html = document.documentElement;

  // ============================================
  // INITIALIZE THEME
  // ============================================
  
  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved !== null) {
        return saved === 'dark';
      }
    } catch (e) {
      // localStorage unavailable
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    
    return true; // Default to dark
  }

  function setTheme(dark) {
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    } catch (e) {
      // localStorage unavailable
    }
    
    const icon = dark ? '☀️' : '🌙';
    document.querySelectorAll('.theme-toggle, .theme-toggle-mobile').forEach(el => {
      el.textContent = icon;
    });
  }

  // ============================================
  // TOGGLE THEME
  // ============================================
  
  function toggleTheme() {
    const isDark = html.classList.contains('dark');
    setTheme(!isDark);
  }

  // ============================================
  // INIT
  // ============================================
  
  const initialDark = getInitialTheme();
  setTheme(initialDark);

  // ============================================
  // EVENT LISTENERS
  // ============================================
  
  const toggleBtn = document.getElementById('darkToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }

  const toggleBtnMobile = document.getElementById('darkToggleMobile');
  if (toggleBtnMobile) {
    toggleBtnMobile.addEventListener('click', toggleTheme);
  }

  // ============================================
  // SYSTEM PREFERENCE CHANGE
  // ============================================
  
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      try {
        if (localStorage.getItem(THEME_KEY) === null) {
          setTheme(e.matches);
        }
      } catch (err) {
        // localStorage unavailable
      }
    });
  }

})();
