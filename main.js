/* ============================================================
   OCHOSTUDIO — main.js  (image-only edition, no Lenis)
   3 tipos de animación: hero scale · parallax quotes · fade-up secciones
   ============================================================ */

window.addEventListener('load', () => {

  /* ── GSAP + SCROLLTRIGGER ────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── NAV ─────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── BURGER ──────────────────────────────────────────────── */
  const burger     = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  });

  document.querySelectorAll('.mobile-menu__nav a, .nav__links a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    });
  });

  const isMobile = window.innerWidth < 768;

  /* ── 1. HERO — scale + fade texto (sin pin) ──────────────── */
  if (!isMobile) {
    gsap.to('.hero__img', {
      scale: 1.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });

    gsap.to('.hero__content', {
      opacity: 0,
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '60% top',
        scrub: 0.5,
      },
    });

    gsap.to('.hero__scroll-hint', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '20% top',
        scrub: 0.5,
      },
    });
  }

  /* ── 2. PARALLAX — quote1, marketing, process, final ─────── */
  if (!isMobile) {
    const parallaxTargets = [
      { bg: '.quote1__bg',    trigger: '.quote1'    },
      { bg: '.marketing__bg', trigger: '.marketing' },
      { bg: '.process__bg',   trigger: '.process'   },
      { bg: '.final__bg',     trigger: '.final'     },
    ];

    parallaxTargets.forEach(({ bg, trigger }) => {
      const el = document.querySelector(bg);
      if (!el) return;

      gsap.fromTo(el,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      );
    });

    // Fade del texto de quote al entrar
    gsap.from('.quote1__text', {
      opacity: 0,
      y: 32,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.quote1', start: 'top 65%', toggleActions: 'play none none none' },
    });

    gsap.from('.marketing__headline, .marketing__sub', {
      opacity: 0,
      y: 32,
      duration: 0.9,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.marketing', start: 'top 65%', toggleActions: 'play none none none' },
    });
  }

  /* ── 3. FADE-UP — todas las secciones al 85% viewport ────── */
  // Statement
  gsap.from('.statement__text', {
    opacity: 0, y: 40, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.statement', start: 'top 85%', toggleActions: 'play none none none' },
  });

  gsap.from('.stat-card', {
    opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.stats-grid', start: 'top 85%', toggleActions: 'play none none none' },
  });

  // Services header + cards stagger
  gsap.from('.services__header', {
    opacity: 0, y: 32, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.services', start: 'top 85%', toggleActions: 'play none none none' },
  });

  gsap.from('.service-card', {
    opacity: 0, y: 36, duration: 0.6, stagger: 0.07, ease: 'power2.out',
    scrollTrigger: { trigger: '.services__grid', start: 'top 85%', toggleActions: 'play none none none' },
  });

  // Auto header + cards
  gsap.from('.auto__header', {
    opacity: 0, y: 32, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.auto', start: 'top 85%', toggleActions: 'play none none none' },
  });

  gsap.from('.auto-card', {
    opacity: 0, y: 20, duration: 0.5, stagger: 0.05, ease: 'power2.out',
    scrollTrigger: { trigger: '.auto__grid', start: 'top 85%', toggleActions: 'play none none none' },
  });

  // Process steps
  gsap.from('.process__title', {
    opacity: 0, y: 32, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.process__content', start: 'top 85%', toggleActions: 'play none none none' },
  });

  gsap.from('.process__step', {
    opacity: 0, y: 24, duration: 0.6, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.process__grid', start: 'top 85%', toggleActions: 'play none none none' },
  });

  // Final CTA
  gsap.from('.final__headline, .final__sub, .final__actions', {
    opacity: 0, y: 36, duration: 0.9, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.final__content', start: 'top 80%', toggleActions: 'play none none none' },
  });

});
