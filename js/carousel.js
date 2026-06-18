/**
 * JALUSTORE - Testimonial Carousel Module
 * Auto-sliding testimonial carousel with dots
 */

(function() {
  'use strict';

  // ============================================
  // TESTIMONIAL DATA
  // ============================================
  
  const TESTIMONIALS = [
   
  { "name": "A***", "city": "" "text": "Proses cepat dan aman. Heart langsung masuk!", "rating": 5 },
  { "name": "S***", "city": "" "text": "Heart masuk setiap hari sesuai paket. Recommended!", "rating": 5 },
  { "name": "R***", "city": "" "text": "Seller ramah dan fast response. Puas banget.", "rating": 5 },
  { "name": "D****", "city": "" "text": "Harga murah, proses transparan. Langganan di sini.", "rating": 5 },
  { "name": "F****", "city": "" "text": "Pengiriman cepat, pelayanan ramah. Top banget!", "rating": 5 },
  { "name": "L***", "city": "" "text": "Aman dan terpercaya. Sudah 3 kali order.", "rating": 5 }
];

  const STARS = '⭐⭐⭐⭐⭐';

  // ============================================
  // STATE
  // ============================================
  
  let currentIndex = 0;
  let cardsPerView = 1;
  let autoSlideInterval = null;
  let isPaused = false;
  const totalCards = TESTIMONIALS.length;

  // ============================================
  // DOM REFS
  // ============================================
  
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevTesti');
  const nextBtn = document.getElementById('nextTesti');
  const dotsContainer = document.getElementById('dotsContainer');

  // ============================================
  // RENDER CARDS
  // ============================================
  
  function renderCards() {
    if (!track) return;
    
    let html = '';
    TESTIMONIALS.forEach((t) => {
      html += `
        <div class="carousel-item testimonial-card" role="listitem">
          <div class="glass-card p-5 rounded-xl h-full border border-white/5">
            <div class="stars" aria-hidden="true">${STARS}</div>
            <p class="testimonial-text">"${t.text}"</p>
            <p class="testimonial-author">— ${t.name}, ${t.city}</p>
          </div>
        </div>
      `;
    });
    
    track.innerHTML = html;
  }

  // ============================================
  // UPDATE CAROUSEL
  // ============================================
  
  function updateCarousel() {
    if (!track) return;
    
    const containerWidth = track.parentElement.offsetWidth;
    cardsPerView = containerWidth >= 768 ? 3 : 1;
    
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    
    const offset = currentIndex * (100 / cardsPerView);
    track.style.transform = `translateX(-${offset}%)`;
    
    updateDots();
  }

  // ============================================
  // UPDATE DOTS
  // ============================================
  
  function updateDots() {
    if (!dotsContainer) return;
    
    const dotCount = Math.ceil(totalCards / cardsPerView);
    let html = '';
    
    for (let i = 0; i < dotCount; i++) {
      const active = i === currentIndex ? 'active' : '';
      html += `
        <button class="carousel-dot ${active}" 
                data-index="${i}" 
                aria-label="Testimonial ${i + 1}"
                role="tab"
                aria-selected="${i === currentIndex}">
        </button>
      `;
    }
    
    dotsContainer.innerHTML = html;
    
    dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index, 10);
        goToSlide(index);
      });
    });
  }

  // ============================================
  // NAVIGATION
  // ============================================
  
  function goToSlide(index) {
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateCarousel();
    resetAutoSlide();
  }

  function nextSlide() {
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
    updateCarousel();
    resetAutoSlide();
  }

  function prevSlide() {
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    currentIndex = (currentIndex - 1) < 0 ? maxIndex : currentIndex - 1;
    updateCarousel();
    resetAutoSlide();
  }

  // ============================================
  // AUTO SLIDE
  // ============================================
  
  function startAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    if (!isPaused) {
      autoSlideInterval = setInterval(nextSlide, 5000);
    }
  }

  function resetAutoSlide() {
    if (!isPaused) {
      startAutoSlide();
    }
  }

  function togglePause(pause) {
    isPaused = pause;
    if (isPaused) {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    } else {
      startAutoSlide();
    }
  }

  // ============================================
  // RESIZE HANDLER
  // ============================================
  
  let resizeTimeout = null;
  
  function handleResize() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      updateCarousel();
      resetAutoSlide();
    }, 200);
  }

  // ============================================
  // INIT
  // ============================================
  
  function initCarousel() {
    renderCards();
    updateCarousel();
    startAutoSlide();
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    const wrapper = track?.closest('.carousel-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => togglePause(true));
      wrapper.addEventListener('mouseleave', () => togglePause(false));
      wrapper.addEventListener('touchstart', () => togglePause(true), { passive: true });
      wrapper.addEventListener('touchend', () => togglePause(false), { passive: true });
    }
    
    window.addEventListener('resize', handleResize, { passive: true });
  }

  // ============================================
  // CLEANUP
  // ============================================
  
  function destroyCarousel() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
    window.removeEventListener('resize', handleResize);
  }

  // ============================================
  // RUN
  // ============================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  // Expose for cleanup if needed
  window.__carousel = { destroy: destroyCarousel };

})();
