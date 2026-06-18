// Corteyo Animations

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Scroll-triggered fade-in ──
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
  targets.forEach(el => { el.classList.add('anim-hidden'); observer.observe(el); });

  // ── 2. Navbar glass effect on scroll ──
  const nav = document.querySelector('nav') || document.querySelector('header');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav-scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── 3. Number counter animation (targets text like "495+", "10+", "20+") ──
  function animateCounter(el, target, suffix, prefix, duration) {
    el.setAttribute('data-counted', '1');
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  }

  function parseStatText(text) {
    const raw = text.trim();
    const match = raw.match(/^([₹$]?)(\d[\d,]*)([+%KkMm]?)$/);
    if (!match) return null;
    let [, prefix, numStr, suffix] = match;
    let num = parseInt(numStr.replace(/,/g, ''));
    if (suffix.toLowerCase() === 'k') { num *= 1000; suffix = 'K+'; }
    if (suffix.toLowerCase() === 'm') { num *= 1000000; suffix = 'M+'; }
    return { prefix, num, suffix };
  }

  function initCounters() {
    // Target all large text elements that look like stats
    const allEls = document.querySelectorAll(
      '[class*="text-4xl"], [class*="text-5xl"], [class*="text-6xl"], [class*="text-7xl"], [class*="text-3xl"]'
    );
    allEls.forEach(el => {
      if (el.getAttribute('data-counted')) return;
      const parsed = parseStatText(el.textContent);
      if (!parsed) return;

      el.setAttribute('data-original', el.textContent);
      el.classList.add('stat-shimmer');

      const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !el.getAttribute('data-counted')) {
            animateCounter(el, parsed.num, parsed.suffix, parsed.prefix, 2000);
            counterObs.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      counterObs.observe(el);
    });
  }

  // Run immediately + after React finishes rendering
  setTimeout(initCounters, 600);
  setTimeout(initCounters, 1500);

  // ── 4. Make email & phone clickable (runs after React renders, covers ALL pages) ──
  function linkifyNode(node) {
    if (node.nodeType === 3) {
      const text = node.textContent;
      const emailRe = /([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g;
      const phoneRe = /(\b(?:\+91[\s-]?)?[6-9]\d{9}\b)/g;
      if (!emailRe.test(text) && !phoneRe.test(text)) return;

      const span = document.createElement('span');
      let html = text
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(emailRe, '<a href="mailto:$1" class="corteyo-link">$1</a>')
        .replace(phoneRe, '<a href="tel:$1" class="corteyo-link">$1</a>');
      span.innerHTML = html;
      node.parentNode.replaceChild(span, node);
    } else if (node.nodeType === 1 && !['A','SCRIPT','STYLE','NOSCRIPT'].includes(node.tagName)) {
      Array.from(node.childNodes).forEach(linkifyNode);
    }
  }

  // Run on initial load and re-run on route changes (React SPA)
  function runLinkify() { linkifyNode(document.body); }
  setTimeout(runLinkify, 800);
  setTimeout(runLinkify, 2000); // catch lazy-loaded contact page

  // Watch for React route changes
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(runLinkify, 600);
      setTimeout(initCounters, 600);
    }
  }).observe(document.body, { childList: true, subtree: true });

  // ── 5. Cursor glow ──
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

  // ── 6. WhatsApp floating button (appears after 5 seconds) ──
  const waLink = 'https://wa.me/917012949018?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20your%20Virtual%20CFO%20services.%20Please%20connect%20me%20with%20your%20team%20to%20discuss%20how%20you%20can%20support%20my%20business';

  const waBtn = document.createElement('a');
  waBtn.href = waLink;
  waBtn.target = '_blank';
  waBtn.rel = 'noopener noreferrer';
  waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  waBtn.className = 'wa-float-btn';
  waBtn.innerHTML = `
    <div class="wa-bubble">
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.496.658 4.84 1.806 6.87L2 30l7.338-1.783A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.46 11.46 0 01-5.845-1.6l-.418-.25-4.353 1.058 1.09-4.24-.273-.435A11.46 11.46 0 014.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.29-8.61c-.344-.172-2.036-1.004-2.351-1.118-.316-.115-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.535-2.766-1.707-1.022-.912-1.712-2.038-1.912-2.382-.2-.344-.021-.53.15-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.573.115-.23.057-.43-.029-.603-.086-.172-.776-1.87-1.063-2.56-.28-.672-.564-.58-.776-.59l-.66-.011c-.23 0-.603.086-.919.43-.316.344-1.205 1.176-1.205 2.868s1.234 3.326 1.406 3.556c.172.23 2.429 3.71 5.886 5.204.823.355 1.465.567 1.966.726.826.263 1.578.226 2.172.137.662-.099 2.036-.832 2.323-1.635.287-.803.287-1.49.2-1.635-.086-.144-.316-.23-.66-.402z"/>
      </svg>
      <span class="wa-label">Chat with us</span>
    </div>
  `;

  const waTooltip = document.createElement('div');
  waTooltip.className = 'wa-tooltip';
  waTooltip.textContent = '👋 Hi! Need help? Chat with us on WhatsApp';

  // Append but hidden — show after 5 seconds
  waBtn.style.display = 'none';
  waTooltip.style.display = 'none';
  document.body.appendChild(waBtn);
  document.body.appendChild(waTooltip);

  setTimeout(() => {
    waBtn.style.display = '';
    waTooltip.style.display = '';
    // Show tooltip 1.5s after button appears
    setTimeout(() => {
      waTooltip.classList.add('wa-tooltip-show');
      setTimeout(() => waTooltip.classList.remove('wa-tooltip-show'), 5000);
    }, 1500);
  }, 5000);

  waBtn.addEventListener('mouseenter', () => waTooltip.classList.add('wa-tooltip-show'));
  waBtn.addEventListener('mouseleave', () => waTooltip.classList.remove('wa-tooltip-show'));

  // ── 7. "Crafted by BuildEdge Studios" footer badge ──
  function injectFooterBadge() {
    const footer = document.querySelector('footer');
    if (!footer || footer.querySelector('.buildedge-badge')) return;
    const badge = document.createElement('div');
    badge.className = 'buildedge-badge';
    badge.innerHTML = `Crafted by <a href="https://buildedgestudios.in/" target="_blank" rel="noopener noreferrer">BuildEdge Studios</a>`;
    footer.appendChild(badge);
  }
  setTimeout(injectFooterBadge, 800);
  setTimeout(injectFooterBadge, 2000);

});
