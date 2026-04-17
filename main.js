/* ============================================================
   OCHOSTUDIO — main.js
   3 animaciones: hero pin, fade secciones, cards stagger
   ============================================================ */

window.addEventListener('load', () => {

  /* ── LENIS SMOOTH SCROLL ─────────────────────────────────── */
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => 1 - Math.pow(1 - t, 3),
  });

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  /* ── GSAP + SCROLLTRIGGER ────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ── NAV SCROLL ──────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── BURGER ──────────────────────────────────────────────── */
  const navBurger  = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

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

  /* ── 1. HERO PIN ─────────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: '+=100%',
    pin: true,
    pinSpacing: true,
    scrub: 1,
  });

  // Texto se desvanece al scrollear
  gsap.to('.hero__content', {
    opacity: 0,
    y: -60,
    ease: 'power2.in',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=50%',
      scrub: 1,
    },
  });

  // Video hace zoom suave
  gsap.to('.hero__video', {
    scale: 1.1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=100%',
      scrub: 1,
    },
  });

  /* ── 2. FADE IN secciones ────────────────────────────────── */
  gsap.utils.toArray('section:not(.hero)').forEach(sec => {
    gsap.from(sec, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sec,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ── 3. SERVICE CARDS stagger ────────────────────────────── */
  gsap.from('.service-card', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.services',
      start: 'top 75%',
    },
  });

  /* ── DESACTIVAR PIN EN MOBILE ────────────────────────────── */
  if (window.innerWidth <= 768) {
    ScrollTrigger.getAll().forEach(st => { if (st.vars.pin) st.kill(); });
  }

});
