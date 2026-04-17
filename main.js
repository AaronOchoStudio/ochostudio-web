/* ============================================================
   OCHOSTUDIO — main.js  (canvas-hero edition)
   Animaciones: canvas scroll-driven · fade secciones · cards stagger
   ============================================================ */

window.addEventListener('load', () => {

  /* ── LENIS ───────────────────────────────────────────────── */
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

  /* ── NAV ─────────────────────────────────────────────────── */
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

  /* ── CANVAS SCROLL-DRIVEN HERO ───────────────────────────── */
  const isMobile = window.innerWidth < 768;
  const canvas   = document.getElementById('hero-canvas');

  if (!isMobile && canvas) {
    const ctx        = canvas.getContext('2d');
    const frameCount = 57;
    const images     = [];
    const imageSeq   = { frame: 0 };

    // Resize canvas to always fill viewport
    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Cover-fit draw
    function render() {
      const img = images[imageSeq.frame];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const x = (canvas.width  - img.naturalWidth  * scale) / 2;
      const y = (canvas.height - img.naturalHeight * scale) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
    }

    // Preload all 57 frames
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const idx = i - 1; // 0-indexed
      img.src = `assets/frames/frame_${String(i).padStart(3, '0')}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (idx === 0) render(); // draw first frame immediately
      };
      images.push(img);
    }

    // GSAP drives frame index via scroll
    gsap.to(imageSeq, {
      frame: frameCount - 1,   // 0 → 56
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=200%',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: render,       // also in onUpdate for snap accuracy
      },
      onUpdate: render,
    });

    // Hero text fades out early in the scroll
    gsap.to('.hero__content', {
      opacity: 0,
      y: -50,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=60%',
        scrub: 1,
      },
    });

    gsap.to('.hero__scroll-hint', {
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=15%',
        scrub: 1,
      },
    });
  }

  /* ── FADE IN secciones (todas salvo hero) ────────────────── */
  gsap.utils.toArray('section:not(.hero), .marquee').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 48,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ── SERVICE CARDS stagger ───────────────────────────────── */
  gsap.from('.service-card', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.07,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.services__grid', start: 'top 80%' },
  });

  /* ── AUTO CARDS stagger ──────────────────────────────────── */
  gsap.from('.auto-card', {
    opacity: 0,
    y: 24,
    duration: 0.5,
    stagger: 0.06,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.auto__grid', start: 'top 82%' },
  });

  /* ── PROCESS STEPS stagger ───────────────────────────────── */
  gsap.from('.process__step', {
    opacity: 0,
    x: -24,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.process__steps', start: 'top 82%' },
  });

});
