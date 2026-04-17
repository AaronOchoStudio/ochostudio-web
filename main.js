/* ============================================================
   OCHOSTUDIO — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. LENIS SMOOTH SCROLL ──────────────────────────────── */
  const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  /* ── 2. GSAP + SCROLLTRIGGER ─────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ── NAV ─────────────────────────────────────────────────── */
  const nav        = document.getElementById('nav');
  const navBurger  = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  navBurger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    navBurger.classList.toggle('is-open', open);
    navBurger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  });

  document.querySelectorAll('.mobile-menu__nav a, .nav__links a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      navBurger.classList.remove('is-open');
      navBurger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    });
  });

  /* ── 3. HERO VIDEO ZOOM ──────────────────────────────────── */
  gsap.to('#heroVideoWrap video', {
    scale: 1.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  /* ── 4. FADE IN GENERAL (.js-fade) ──────────────────────── */
  gsap.utils.toArray('.js-fade').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ── 5. CARDS SERVICIOS 3D ───────────────────────────────── */
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      rotateX: 15,
      y: 50,
      duration: 0.7,
      delay: i * 0.08,
      transformPerspective: 900,
      transformOrigin: 'top center',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ── 6. STATS SCRAMBLE ───────────────────────────────────── */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';

  function scrambleTo(el, final, ms = 900) {
    const steps = Math.floor(ms / 50);
    let n = 0;
    const iv = setInterval(() => {
      el.textContent = final.split('').map((ch, i) =>
        i < (n / steps) * final.length
          ? ch
          : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join('');
      if (++n > steps) { el.textContent = final; clearInterval(iv); }
    }, 50);
  }

  document.querySelectorAll('.stat-card__num').forEach(el => {
    const final = el.dataset.final || el.textContent.trim();
    el.textContent = final;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => scrambleTo(el, final, 800),
    });
  });

  /* ── 7. PIN TELESILLA + ZOOM ─────────────────────────────── */
  if (window.innerWidth > 768) {
    ScrollTrigger.create({
      trigger: '.telesilla',
      start: 'top top',
      end: '+=400',
      pin: true,
      scrub: 1,
      onUpdate: self => {
        const el = document.querySelector('.telesilla img, .telesilla__img-wrap img');
        if (el) gsap.set(el, { scale: 1 + self.progress * 0.12 });
      },
    });
  }

  /* ── 8. MID VIDEO PIN + CHAR REVEAL ─────────────────────── */
  const midTextEl = document.getElementById('mid-text');
  if (midTextEl) {
    const RAW = 'MIENTRAS TU COMPETENCIA DUERME, TUS AUTOMACIONES TRABAJAN';
    midTextEl.innerHTML = RAW.split('').map(ch =>
      `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
    const chars = midTextEl.querySelectorAll('.char');

    if (window.innerWidth > 768) {
      ScrollTrigger.create({
        trigger: '#mid-section',
        start: 'top top',
        end: '+=500',
        pin: true,
        scrub: 1,
        onUpdate: self => {
          chars.forEach((ch, i) => {
            ch.style.opacity = self.progress > i / chars.length ? '1' : '0.1';
          });
        },
      });
    } else {
      ScrollTrigger.create({
        trigger: '#mid-section',
        start: 'top 75%',
        once: true,
        onEnter: () => chars.forEach(ch => { ch.style.opacity = '1'; }),
      });
    }
  }

  /* ── 9. AUTO CARDS ENTRADA ───────────────────────────────── */
  gsap.from('.auto-card', {
    opacity: 0, y: 36, duration: 0.6, stagger: 0.06, ease: 'power2.out',
    scrollTrigger: { trigger: '.autos__grid', start: 'top 85%' },
  });

  /* ── 10. PROCESO STEPS ENTRADA ───────────────────────────── */
  gsap.from('.proceso__step', {
    opacity: 0, x: -24, duration: 0.6, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.proceso__steps', start: 'top 85%' },
  });

  /* ── 11. MARQUEE PAUSA AL HOVER ──────────────────────────── */
  const track = document.querySelector('.marquee__track');
  if (track) {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }

  /* ── 12. CURSOR PERSONALIZADO (solo desktop) ─────────────── */
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (!isTouch) {
    const dot    = document.getElementById('cursor-dot');
    const canvas = document.getElementById('cursor-canvas');
    const ctx    = canvas.getContext('2d');
    let mx = -200, my = -200, px = -200, py = -200, rot = 0, pts = [];

    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize(); window.addEventListener('resize', resize, { passive: true });

    class Dot {
      constructor(x, y) {
        this.x = x + (Math.random() - .5) * 12; this.y = y + (Math.random() - .5) * 12;
        this.r = Math.random() * 2.5 + 1; this.a = 0.65;
        this.vx = (Math.random() - .5) * 1.4; this.vy = (Math.random() - .5) * 1.4 - .6;
      }
      tick() { this.x += this.vx; this.y += this.vy; this.a -= 0.025; }
      draw() { ctx.globalAlpha = Math.max(0, this.a); ctx.fillStyle = '#5BB8F5'; ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fill(); }
      get dead() { return this.a <= 0; }
    }

    document.addEventListener('mousemove', e => {
      px = mx; py = my; mx = e.clientX; my = e.clientY;
      const dx = mx - px, dy = my - py, spd = Math.sqrt(dx*dx + dy*dy);
      if (spd > 2) rot = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      dot.style.transform = `translate(${mx-10}px,${my-10}px) rotate(${rot}deg)`;
      if (spd > 6) for (let i = 0; i < Math.min(Math.floor(spd/6), 4); i++) pts.push(new Dot(mx, my));
    });
    document.addEventListener('mouseleave', () => { dot.style.transform = 'translate(-200px,-200px)'; });

    (function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts = pts.filter(p => !p.dead);
      pts.forEach(p => { p.tick(); p.draw(); });
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    })();
  }

  /* ── 13. DESACTIVAR PINS EN MOBILE ───────────────────────── */
  if (window.innerWidth <= 768) {
    ScrollTrigger.getAll().forEach(st => { if (st.pin) st.kill(); });
  }

});
