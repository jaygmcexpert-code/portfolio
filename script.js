document.addEventListener('DOMContentLoaded', function () {

  /* ============ STICKY HEADER ON SCROLL ============ */
  const header = document.getElementById('site-header');
  function handleHeaderScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ============ MOBILE NAV TOGGLE ============ */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ============ SMOOTH SCROLL FOR NAV LINKS ============ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============ ACTIVE SECTION HIGHLIGHTING ============ */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(function (link) {
          link.classList.toggle('active-link', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(function (section) { sectionObserver.observe(section); });

  /* ============ ANIMATED HERO STAT COUNTERS ============ */
  const statNums = document.querySelectorAll('.hero-stat-num');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    statNums.forEach(function (el) {
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  const heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStats();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(heroStatsEl);
  }

  /* ============ SKILL BAR FILL ANIMATION ============ */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.fill + '%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(function (bar) { skillObserver.observe(bar); });

  /* ============ PROJECT FILTERING ============ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active-filter'); });
      btn.classList.add('active-filter');

      const filter = btn.dataset.filter;
      projectCards.forEach(function (card) {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ============ PROJECT CASE STUDY MODALS ============ */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseBtns = document.querySelectorAll('[data-modal-close]');

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modalOverlay.classList.add('visible');
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal').forEach(function (m) { m.classList.remove('visible'); });
    modalOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openModal(trigger.dataset.modalTarget);
    });
  });

  modalCloseBtns.forEach(function (btn) {
    btn.addEventListener('click', closeAllModals);
  });

  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeAllModals();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllModals();
  });

  /* ============ CONTACT FORM VALIDATION ============ */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    const row = field.closest('.form-row');
    if (message) {
      row.classList.add('has-error');
      errorEl.textContent = message;
      return false;
    } else {
      row.classList.remove('has-error');
      errorEl.textContent = '';
      return true;
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successMsg.classList.remove('visible');

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    const nameOk = setError('cf-name', 'err-name', name.length < 2 ? 'Please enter your name.' : '');
    const emailOk = setError('cf-email', 'err-email', !isValidEmail(email) ? 'Please enter a valid email address.' : '');
    const subjectOk = setError('cf-subject', 'err-subject', subject.length < 3 ? 'Please add a short subject.' : '');
    const messageOk = setError('cf-message', 'err-message', message.length < 10 ? 'Please write a bit more (10+ characters).' : '');

    if (nameOk && emailOk && subjectOk && messageOk) {
      // No backend is wired up — replace this block with a fetch() call to your
      // form endpoint (e.g. Formspree, Netlify Forms, or your own API) to actually send it.
      successMsg.classList.add('visible');
      form.reset();
      setTimeout(function () { successMsg.classList.remove('visible'); }, 6000);
    }
  });

  /* ============ FOOTER YEAR ============ */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
