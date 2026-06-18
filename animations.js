// Corteyo Animations — scroll observer + nav effects

document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll-triggered fade-in for sections, cards, headings
  const targets = document.querySelectorAll(
    'section, [class*="rounded-2xl"], [class*="rounded-3xl"], ' +
    '[class*="rounded-[32px]"], [class*="rounded-[40px]"], ' +
    'h1, h2, h3, p[class*="text-lg"], p[class*="text-xl"]'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => {
    el.classList.add('anim-hidden');
    observer.observe(el);
  });

  // 2. Navbar glass effect on scroll
  const nav = document.querySelector('nav') || document.querySelector('header');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    }, { passive: true });
  }

  // 3. Animated number counter for stat figures
  const statEls = document.querySelectorAll('[class*="text-4xl"], [class*="text-5xl"], [class*="text-6xl"]');
  statEls.forEach(el => {
    const text = el.innerText.trim();
    if (/^\d[\d,+%KkMm\.]*$/.test(text)) {
      el.classList.add('stat-shimmer');
    }
  });

  // 4. Smooth cursor glow on hero section
  const hero = document.querySelector('section');
  if (hero) {
    const glow = document.createElement('div');
    Object.assign(glow.style, {
      position: 'fixed', width: '300px', height: '300px',
      borderRadius: '50%', pointerEvents: 'none', zIndex: '0',
      background: 'radial-gradient(circle, rgba(35,200,200,0.08) 0%, transparent 70%)',
      transform: 'translate(-50%, -50%)',
      transition: 'left 0.15s ease, top 0.15s ease',
    });
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

});
