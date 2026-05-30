/* ============================================
   NAVIGATION
   ============================================ */
function initNav() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Set active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect(selector, words, speed = 80, pause = 2000) {
  const el = document.querySelector(selector);
  if (!el) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = words[wordIndex];
    const displayed = isDeleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);

    el.textContent = displayed;
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    let delay = isDeleting ? speed / 2 : speed;

    if (!isDeleting && charIndex === current.length) {
      delay = pause;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ============================================
   PROJECT FILTER
   ============================================ */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================
   CONTACT FORM — Formspree
   Replace YOUR_FORM_ID with your actual Formspree form ID.
   Get one free at https://formspree.io (sign up → New Form → copy the ID).
   ============================================ */
const FORMSPREE_ID = 'mjgzdvko';

function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type=submit]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const errorEl = document.querySelector('.form-error');

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        form.style.display = 'none';
        const success = document.querySelector('.form-success');
        if (success) success.style.display = 'block';
      } else {
        const data = await response.json();
        const msg = data?.errors?.map(e => e.message).join(', ') || 'Submission failed. Please try again.';
        if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
        btn.textContent = originalText;
        btn.disabled = false;
      }
    } catch {
      if (errorEl) { errorEl.textContent = 'Network error. Please check your connection and try again.'; errorEl.style.display = 'block'; }
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + '+';
    }
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target, parseInt(entry.target.dataset.count));
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  initProjectFilter();
  initContactForm();
  initCounters();

  initTypingEffect('#typing-title', [
    'Senior Software Developer',
    'Tech Lead',
    'Backend Engineer',
    'Python Specialist',
    'Full Stack Developer',
  ]);
});
