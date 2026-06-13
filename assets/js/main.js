/* ============================================================
   SUDEEP NANDYAL PORTFOLIO – MAIN JAVASCRIPT
   ============================================================ */

'use strict';

/* ── Utility ──────────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = qs('#scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = `${pct}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ============================================================
   2. PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  if (prefersReducedMotion) return;

  const canvas = qs('#particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 1.5 + 0.4;
      this.vx    = (Math.random() - 0.5) * 0.4;
      this.vy    = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '168,85,247' : '34,211,238';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  const COUNT = Math.min(120, Math.floor(W * H / 12000));

  const init = () => {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  };

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(34,211,238,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  };

  init();
  loop();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
})();

/* ============================================================
   3. NAVBAR – scroll class + hamburger + active link
   ============================================================ */
(function initNavbar() {
  const navbar    = qs('#navbar');
  const hamburger = qs('#hamburger');
  const mobileMenu= qs('#mobile-menu');
  const navLinks  = qsa('.nav-link');
  const sections  = qsa('section[id]');

  // Scroll: add .scrolled
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Back to top button
    const btn = qs('#back-to-top');
    if (btn) btn.hidden = window.scrollY < 400;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.classList.toggle('open', open);
  });

  // Close mobile menu on link click
  qsa('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    });
  });

  // Active section highlighting (IntersectionObserver)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const matches = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', matches);
          link.setAttribute('aria-current', matches ? 'page' : '');
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  // Smooth scroll for all anchor links
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = qs(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ============================================================
   4. TYPING EFFECT
   ============================================================ */
(function initTyping() {
  const el    = qs('#typed-text');
  if (!el) return;

  const words = [
    'Java Developer',
    'Spring Boot Developer',
    'Backend Developer',
    'REST API Developer',
    'Full Stack Developer'
  ];

  let wordIdx = 0, charIdx = 0, deleting = false;

  const speed = () => deleting
    ? 50 + Math.random() * 30
    : 90 + Math.random() * 50;

  const tick = () => {
    const word = words[wordIdx];
    el.textContent = deleting
      ? word.slice(0, charIdx--)
      : word.slice(0, ++charIdx);

    if (!deleting && charIdx === word.length) {
      setTimeout(() => { deleting = true; setTimeout(tick, 80); }, 1600);
      return;
    }
    if (deleting && charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
    }
    setTimeout(tick, speed());
  };

  if (prefersReducedMotion) {
    el.textContent = words[0];
  } else {
    setTimeout(tick, 500);
  }
})();

/* ============================================================
   5. SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const elements = qsa('.reveal-fade, .reveal-slide-left, .reveal-slide-right');
  if (!elements.length) return;

  if (prefersReducedMotion) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   6. ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = qsa('[data-count]');
  if (!counters.length) return;

  const ease = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;

  const animateCounter = (el, target, duration = 1400) => {
    if (prefersReducedMotion) { el.textContent = target; return; }
    const start = performance.now();
    const step  = ts => {
      const pct  = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(ease(pct) * target);
      if (pct < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   7. RIPPLE EFFECT on buttons
   ============================================================ */
(function initRipple() {
  const rippleTargets = qsa('.btn-primary, .btn-secondary, .btn-submit, .btn-project-primary');

  rippleTargets.forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x    = e.clientX - rect.left - size / 2;
      const y    = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();

/* ============================================================
   8. CONTACT FORM
   ============================================================ */
(function initContactForm() {
  const form = qs('#contact-form');
  if (!form) return;

  const btnText    = form.querySelector('.btn-submit-text');
  const btnLoading = form.querySelector('.btn-submit-loading');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Show loading state
    btnText.hidden    = true;
    btnLoading.hidden = false;

    // Simulate async submission
    await new Promise(r => setTimeout(r, 1800));

    btnText.hidden    = false;
    btnLoading.hidden = true;
    form.reset();
    showToast('Message sent! Sudeep will get back to you soon.', 'success');
  });
})();

/* ============================================================
   9. TOAST NOTIFICATION
   ============================================================ */
function showToast(message, type = 'success') {
  const existing = qs('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  const color= type === 'success' ? '#22C55E' : '#EF4444';

  toast.innerHTML = `
    <i class="fas ${icon}" style="color:${color}; font-size:1.1rem;" aria-hidden="true"></i>
    <span>${message}</span>
  `;

  Object.assign(toast.style, {
    position:    'fixed',
    bottom:      '2rem',
    left:        '50%',
    transform:   'translateX(-50%) translateY(20px)',
    background:  'rgba(22,22,22,0.95)',
    border:      `1px solid rgba(255,255,255,0.1)`,
    borderLeft:  `3px solid ${color}`,
    color:       '#F8FAFC',
    padding:     '0.85rem 1.5rem',
    borderRadius:'10px',
    display:     'flex',
    alignItems:  'center',
    gap:         '0.6rem',
    fontSize:    '0.88rem',
    fontWeight:  '500',
    zIndex:      '9999',
    backdropFilter: 'blur(16px)',
    boxShadow:   '0 8px 32px rgba(0,0,0,0.5)',
    opacity:     '0',
    transition:  'opacity 0.3s ease, transform 0.3s ease',
    whiteSpace:  'nowrap',
    maxWidth:    '90vw',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ============================================================
   10. BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = qs('#back-to-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   11. PROJECT CARD TILT
   ============================================================ */
(function initTilt() {
  if (prefersReducedMotion) return;

  const cards = qsa('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================================
   12. SKILL CARD GLOW
   ============================================================ */
(function initSkillGlow() {
  if (prefersReducedMotion) return;

  const cards = qsa('.skill-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(59,130,246,.08) 0%, rgba(255,255,255,.04) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

/* ============================================================
   13. LAZY LOAD IMAGES (future-proof)
   ============================================================ */
(function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) return; // native lazy supported
  const imgs = qsa('img[loading="lazy"]');
  if (!imgs.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
})();

/* ============================================================
   14. CERT CARD HOVER GLOW
   ============================================================ */
(function initCertGlow() {
  if (prefersReducedMotion) return;

  const cards = qsa('.cert-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 0 28px rgba(59,130,246,.18)';
      card.style.borderColor = 'rgba(59,130,246,.25)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      card.style.borderColor = '';
    });
  });
})();

/* ============================================================
   15. NAVBAR KEYBOARD ACCESSIBILITY
   ============================================================ */
(function initKeyboardNav() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const hamburger  = qs('#hamburger');
      const mobileMenu = qs('#mobile-menu');
      if (mobileMenu?.classList.contains('open')) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        hamburger.focus();
      }
    }
  });
})();

/* ============================================================
   16. SECTION ENTRANCE – staggered highlight cards
   ============================================================ */
(function initHighlightStagger() {
  const highlights = qsa('.highlight-card');
  highlights.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    card.classList.add('reveal-fade');
  });

  // Re-observe them
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  highlights.forEach(c => observer.observe(c));
})();

/* ============================================================
   17. HERO INTRO VIDEO – play/pause + sound toggle
   ============================================================ */
(function initHeroVideo() {
  const video     = qs('#intro-video');
  const overlay   = qs('#video-play-overlay');
  const playIcon  = qs('#video-play-icon');
  const soundBtn  = qs('#video-sound-btn');
  const soundIcon = qs('#video-sound-icon');
  if (!video) return;

  // Start muted so browser allows autoplay, user can unmute via button
  video.muted = true;

  /* ── Play / Pause ── */
  const syncPlayIcon = () => {
    if (playIcon) playIcon.className = video.paused ? 'fas fa-play' : 'fas fa-pause';
  };

  overlay?.addEventListener('click', () => {
    video.paused ? video.play() : video.pause();
    syncPlayIcon();
  });

  video.addEventListener('play',  syncPlayIcon);
  video.addEventListener('pause', syncPlayIcon);
  video.addEventListener('ended', syncPlayIcon);

  /* ── Sound toggle ── */
  const syncSoundIcon = () => {
    if (!soundIcon || !soundBtn) return;
    if (video.muted) {
      soundIcon.className = 'fas fa-volume-mute';
      soundBtn.classList.remove('unmuted');
      soundBtn.setAttribute('aria-label', 'Unmute video');
    } else {
      soundIcon.className = 'fas fa-volume-up';
      soundBtn.classList.add('unmuted');
      soundBtn.setAttribute('aria-label', 'Mute video');
    }
  };

  soundBtn?.addEventListener('click', (e) => {
    e.stopPropagation(); // don't trigger play/pause overlay
    video.muted = !video.muted;
    syncSoundIcon();
  });

  // Initial icon state
  syncSoundIcon();
})();

/* ============================================================
   DONE – Portfolio JS loaded
   ============================================================ */
console.log('%cSudeep Nandyal Portfolio – v1.0', 'color:#3B82F6; font-size:14px; font-weight:700;');
console.log('%cBuilt with ❤️  Java passion & clean code.', 'color:#F97316; font-size:12px;');
