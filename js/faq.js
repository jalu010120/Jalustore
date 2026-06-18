/**
 * JALUSTORE - FAQ Module
 * Accordion-style FAQ with smooth animations
 */

(function() {
  'use strict';

  // ============================================
  // FAQ DATA
  // ============================================
  
  const FAQ_DATA = [
    {
      question: 'Apakah aman?',
      answer: 'Tentu, kami sudah berpengalaman dan memiliki banyak pelanggan. Semua transaksi aman dan terpercaya.'
    },
    {
      question: 'Berapa lama proses?',
      answer: 'Proses pengiriman Heart dilakukan setiap hari, maksimal 24 jam setelah pembayaran dikonfirmasi.'
    },
    {
      question: 'Bagaimana cara kirim kode?',
      answer: 'Setelah pesan melalui WhatsApp, kirimkan kode pertemanan Sky Anda, kami akan langsung memprosesnya.'
    },
    {
      question: 'Apakah bisa refund?',
      answer: 'Kami tidak menerima refund setelah Heart dikirim. Namun jika ada kendala, hubungi kami untuk solusi terbaik.'
    },
    {
      question: 'Apakah akun saya aman?',
      answer: 'Ya, kami hanya membutuhkan kode pertemanan, tidak pernah meminta password atau data sensitif lainnya.'
    }
  ];

  // ============================================
  // RENDER FAQ
  // ============================================
  
  function renderFAQ() {
    const container = document.getElementById('faqContainer');
    if (!container) return;

    let html = '';
    
    FAQ_DATA.forEach((item, index) => {
      const id = `faq-${index}`;
      html += `
        <div class="faq-item glass-card" role="listitem">
          <button class="faq-question" 
                  role="button" 
                  aria-expanded="false"
                  aria-controls="${id}"
                  id="${id}-btn">
            <span>${item.question}</span>
            <span class="faq-icon" aria-hidden="true">+</span>
          </button>
          <div class="faq-answer" 
               id="${id}" 
               role="region"
               aria-labelledby="${id}-btn">
            ${item.answer}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    initAccordion();
  }

  // ============================================
  // ACCORDION LOGIC
  // ============================================
  
  function initAccordion() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');

      if (!question || !answer) return;

      const toggle = () => {
        const isOpen = answer.classList.contains('open');
        
        // Close all
        items.forEach((otherItem) => {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherAnswer && otherAnswer !== answer) {
            otherAnswer.classList.remove('open');
            otherAnswer.style.maxHeight = '0';
            otherAnswer.style.opacity = '0';
            if (otherIcon) otherIcon.classList.remove('open');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (!isOpen) {
          answer.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity = '1';
          if (icon) icon.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
        } else {
          answer.classList.remove('open');
          answer.style.maxHeight = '0';
          answer.style.opacity = '0';
          if (icon) icon.classList.remove('open');
          question.setAttribute('aria-expanded', 'false');
        }
      };

      question.addEventListener('click', toggle);

      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  // ============================================
  // INIT
  // ============================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFAQ);
  } else {
    renderFAQ();
  }

})();
