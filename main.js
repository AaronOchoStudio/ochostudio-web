/* ============================================================
   OCHOSTUDIO — main.js
   Lenis smooth scroll + GSAP ScrollTrigger + custom cursor
   ============================================================ */

const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
const IS_TOUCH  = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ── LENIS SMOOTH SCROLL ─────────────────────────────────── */
const lenis = new Lenis({
  lerp: 0.1,
  smooth: true,
  direction: 'vertical',
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger);

/* ── NAV ─────────────────────────────────────────────────── */
const nav       = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks  = document.querySelectorAll('.mobile-menu__nav a, .nav__links a');

// Scroll state
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

// Burger toggle
navBurger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  navBurger.classList.toggle('is-open', isOpen);
  navBurger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

// Close on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    navBurger.classList.remove('is-open');
    navBurger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  });
});

/* ── CUSTOM CURSOR (desktop only) ────────────────────────── */
if (!IS_TOUCH) {
  const cursorDot    = document.getElementById('cursor-dot');
  const cursorCanvas = document.getElementById('cursor-canvas');
  const ctx          = cursorCanvas.getContext('2d');

  let mouseX = -200, mouseY = -200;
  let prevX  = -200, prevY  = -200;
  let rotation = 0;
  let particles = [];

  function resizeCanvas() {
    cursorCanvas.width  = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Snowdot {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 12;
      this.y = y + (Math.random() - 0.5) * 12;
      this.r = Math.random() * 2.5 + 1;
      this.alpha = 0.65;
      this.decay = 0.025 + Math.random() * 0.02;
      this.vx    = (Math.random() - 0.5) * 1.4;
      this.vy    = (Math.random() - 0.5) * 1.4 - 0.6;
    }
    tick() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle   = '#5BB8F5';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
    get dead() { return this.alpha <= 0; }
  }

  document.addEventListener('mousemove', (e) => {
    prevX  = mouseX;
    prevY  = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    const dx = mouseX - prevX;
    const dy = mouseY - prevY;
    const speed = Math.sqrt(dx * dx + dy * dy);

    // Rotate snowflake based on movement direction
    if (speed > 2) {
      rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    }

    cursorDot.style.transform =
      `translate(${mouseX - 10}px, ${mouseY - 10}px) rotate(${rotation}deg)`;

    // Spawn trail particles when moving fast
    if (speed > 6) {
      const count = Math.min(Math.floor(speed / 6), 4);
      for (let i = 0; i < count; i++) {
        particles.push(new Snowdot(mouseX, mouseY));
      }
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'translate(-200px, -200px)';
  });

  function rafParticles() {
    ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    particles = particles.filter(p => !p.dead);
    particles.forEach(p => { p.tick(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(rafParticles);
  }
  rafParticles();
}

/* ── HERO VIDEO PARALLAX ZOOM ────────────────────────────── */
if (!IS_MOBILE) {
  gsap.to('#heroVideoWrap .hero__video', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
    scale: 1.15,
    ease: 'none',
  });
}

/* ── TELESILLA PIN + ZOOM ────────────────────────────────── */
if (!IS_MOBILE) {
  const telesilla = document.getElementById('telesilla-section');
  const telesillImg = telesilla.querySelector('img');

  ScrollTrigger.create({
    trigger: telesilla,
    start: 'top top',
    end: '+=400',
    pin: true,
    scrub: true,
    onUpdate(self) {
      gsap.set(telesillImg, {
        scale: 1 + self.progress * 0.1,
        ease: 'none',
      });
    },
  });
}

/* ── MID VIDEO PIN + TYPEWRITER ──────────────────────────── */
const midTextEl = document.getElementById('mid-text');
const RAW_TEXT  = 'MIENTRAS TU COMPETENCIA DUERME, TUS AUTOMACIONES TRABAJAN';

// Build char spans
midTextEl.innerHTML = RAW_TEXT.split('').map((ch, i) =>
  `<span class="char" style="--i:${i}">${ch === ' ' ? '&nbsp;' : ch}</span>`
).join('');

const chars = midTextEl.querySelectorAll('.char');

if (!IS_MOBILE) {
  ScrollTrigger.create({
    trigger: '#mid-video',
    start: 'top top',
    end: '+=500',
    pin: true,
    scrub: 1,
    onUpdate(self) {
      const totalChars = chars.length;
      chars.forEach((ch, i) => {
        ch.style.opacity = self.progress > i / totalChars ? '1' : '0.1';
      });
    },
  });
} else {
  // On mobile: fade in the text block
  gsap.to('#mid-text', {
    scrollTrigger: {
      trigger: '#mid-video',
      start: 'top 75%',
    },
    opacity: 1,
    ease: 'none',
    duration: 0,
    onStart() {
      chars.forEach(ch => { ch.style.opacity = '1'; });
    },
  });
}

/* ── SERVICE CARDS 3D ENTRANCE ───────────────────────────── */
gsap.from('.service-card', {
  scrollTrigger: {
    trigger: '#servicesGrid',
    start: 'top 85%',
  },
  rotateX: 18,
  y: 48,
  opacity: 0,
  duration: 0.75,
  stagger: {
    each: 0.07,
    from: 'start',
  },
  ease: 'power3.out',
  transformPerspective: 900,
  transformOrigin: 'top center',
});

/* ── STAT CARDS SCRAMBLE ─────────────────────────────────── */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';

function scrambleTo(el, finalText, duration = 900) {
  const steps     = Math.floor(duration / 50);
  let   iteration = 0;

  const interval = setInterval(() => {
    el.textContent = finalText
      .split('')
      .map((ch, i) => {
        if (i < (iteration / steps) * finalText.length) return ch;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join('');

    if (iteration >= steps) {
      el.textContent = finalText;
      clearInterval(interval);
    }
    iteration++;
  }, 50);
}

document.querySelectorAll('.stat-card__num').forEach(el => {
  const finalVal = el.dataset.final;
  el.textContent = finalVal;             // default visible value

  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    once: true,
    onEnter() {
      scrambleTo(el, finalVal, 800);
    },
  });
});

/* ── AUTO CARDS ENTRANCE ─────────────────────────────────── */
gsap.from('.auto-card', {
  scrollTrigger: {
    trigger: '.autos__grid',
    start: 'top 85%',
  },
  y: 36,
  opacity: 0,
  duration: 0.6,
  stagger: 0.06,
  ease: 'power2.out',
});

/* ── PROCESO STEPS ENTRANCE ──────────────────────────────── */
gsap.from('.proceso__step', {
  scrollTrigger: {
    trigger: '.proceso__steps',
    start: 'top 85%',
  },
  x: -24,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out',
});

/* ── GENERIC FADE-IN SECTIONS (.js-fade) ─────────────────── */
document.querySelectorAll('.js-fade').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter() {
      el.classList.add('is-visible');
    },
  });
});

/* ── MARQUEE PAUSE ON HOVER ──────────────────────────────── */
const marqueeTrack = document.querySelector('.marquee__track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}
