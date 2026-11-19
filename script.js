// ===== SCROLL-LINKED - Jitni speed scroll, utni speed animation =====
// Typing nahi, Cursor nahi, Time animation nahi - Sirf Scroll se chalega
document.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // ---------- 1. WORDS KO APPEAR KE LIYE TAIYAR KARO ----------
  const wordTargets = document.querySelectorAll(
    '.hero h2, .hero-description, #about .section-heading h2, #about > p, #projects .section-heading h2, #skills .section-heading h2, #experience .section-heading h2, #certificates .section-heading h2, #resume .section-heading h2, #contact .section-heading h2, #contact > p'
  );

  function wrapWords(el) {
    if (el.dataset.animateDone) return;
    el.dataset.animateDone = '1';
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(function(node) {
      const text = node.textContent;
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach(function(part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const s = document.createElement('span');
          s.className = 'animate-word';
          s.textContent = part;
          frag.appendChild(s);
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
    el._words = el.querySelectorAll('.animate-word');
  }
  wordTargets.forEach(wrapWords);

  // ---------- 2. BOXES / IMAGES - Left / Right, SCROLL SPEED SE ----------
  const revealItems = document.querySelectorAll(
    '.hero-image-wrapper, .section-label, .section-heading, #about > p, .about-stats > div, .project-card, .skill-card, .timeline-item, .cert-card, .resume-card, #contact > p, #contact > a, .contact-links'
  );

  revealItems.forEach(function(el, index) {
    const fromLeft = index % 2 === 0; // Ek Left, ek Right
    el.classList.add(fromLeft ? 'animate-left' : 'animate-right');

    if (el.classList.contains('project-card') || el.classList.contains('skill-card') || el.classList.contains('timeline-item') || el.classList.contains('cert-card') || el.classList.contains('resume-card') || el.parentElement.classList.contains('about-stats')) {
      el.classList.add('animate-card');
    }

    const startX = fromLeft ? -60 : 60;

    // SCRUB = Scroll se linked
    gsap.fromTo(el,
      { x: startX, y: 10, opacity: 0 },
      {
        x: 0, y: 0, opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 55%',
          scrub: 1
        }
      }
    );

    // ---------- 3. TEXT - Word by Word, SCROLL SPEED SE ----------
    const textsInside = el.querySelectorAll('[data-animate-done]');
    const texts = [];
    if (el.dataset.animateDone) texts.push(el);
    textsInside.forEach(function(t) { texts.push(t); });

    texts.forEach(function(t) {
      if (!t._words || !t._words.length) return;
      gsap.set(t._words, { opacity: 0, y: 10 });
      gsap.to(t._words, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 55%',
          scrub: 1
        }
      });
    });
  });

  // ---------- 4. Skill Bar - Scroll speed se fill hoga ----------
  gsap.utils.toArray('.skill-bar span').forEach(function(bar) {
    const w = bar.style.width;
    gsap.fromTo(bar, { width: '0%' }, {
      width: w,
      ease: 'none',
      scrollTrigger: {
        trigger: bar,
        start: 'top 95%',
        end: 'top 70%',
        scrub: 1
      }
    });
  });

  // ---------- 5. Card Hover - Halka 3D ----------
  document.querySelectorAll('.animate-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(900px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg) translateY(-2px)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });
});