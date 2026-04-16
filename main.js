/* ============================================================
   OCHO STUDIO — main.js
   Basic interactivity only — animations in next session
   ============================================================ */

// ── Mobile nav toggle ──────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Nav background on scroll ───────────────────────────────
const nav = document.getElementById('nav');

if (nav) {
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
