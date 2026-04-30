/* ===========================
   LUMIÈRE — CLÍNICA ESTÉTICA
   script.js
=========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================
     1. NAV SCROLL EFFECT
  =========================== */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  /* ===========================
     2. MOBILE MENU
  =========================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ===========================
     3. SCROLL FADE-IN OBSERVER
  =========================== */
  const fadeEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const observerOpts = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  fadeEls.forEach(el => fadeObserver.observe(el));


  /* ===========================
     4. COUNTER ANIMATION (STATS)
  =========================== */
  const counters = document.querySelectorAll('.stat__number');

  const formatNumber = (n) => {
    if (n >= 1000) {
      const k = n / 1000;
      return Number.isInteger(k) ? k + 'K' : k.toFixed(1) + 'K';
    }
    return n.toString();
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out-expo
      const eased = 1 - Math.pow(2, -10 * progress);
      const current = Math.round(eased * target);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(target);
    };

    requestAnimationFrame(step);
  };

  const statsSection = document.querySelector('.stats');
  let counterStarted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counterStarted) {
      counterStarted = true;
      counters.forEach(counter => animateCounter(counter));
    }
  }, { threshold: 0.3 });

  if (statsSection) statsObserver.observe(statsSection);


  /* ===========================
     5. TESTIMONIALS CAROUSEL
  =========================== */
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  let currentTestimonial = 1; // middle card starts active
  let autoplayInterval;

  const setTestimonial = (index) => {
    cards.forEach((c, i) => c.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentTestimonial = index;
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      setTestimonial(i);
      resetAutoplay();
    });
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  const track = document.getElementById('testimonialTrack');

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 50) {
        const next = delta < 0
          ? (currentTestimonial + 1) % cards.length
          : (currentTestimonial - 1 + cards.length) % cards.length;
        setTestimonial(next);
        resetAutoplay();
      }
    }, { passive: true });
  }

  const startAutoplay = () => {
    autoplayInterval = setInterval(() => {
      const next = (currentTestimonial + 1) % cards.length;
      setTestimonial(next);
    }, 4500);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  startAutoplay();


  /* ===========================
     6. FAQ ACCORDION
  =========================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-item__q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });


  /* ===========================
     7. CTA FORM SUBMISSION
  =========================== */
  const ctaForm = document.getElementById('ctaForm');

  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = ctaForm.querySelector('button[type="submit"]');
      const original = btn.textContent;

      btn.textContent = '✓ Enviado!';
      btn.style.background = '#3e8e44';
      btn.style.color = '#fff';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        ctaForm.reset();
      }, 3000);
    });
  }


  /* ===========================
     8. SMOOTH ANCHOR SCROLL
  =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ===========================
     9. ACTIVE NAV LINK HIGHLIGHT
  =========================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.fontWeight = link.getAttribute('href') === `#${id}` ? '500' : '400';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

});
