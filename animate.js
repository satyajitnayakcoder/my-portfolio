// ===== SIRF ANIMATION - Purani script.js ko haath nahi lagaya =====
document.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // 1. Purane HTML ko bina edit kiye, JS se hi class lagao
  // Section ke andar ke headings / paragraphs ko Word-by-Word ke liye pakdo
  const wordTargets = document.querySelectorAll(
    '.hero h2, .hero-description, #about .section-heading h2, #about > p, #projects .section-heading h2, #skills .section-heading h2, #experience .section-heading h2, #certificates .section-heading h2, #resume .section-heading h2, #contact .section-heading h2, #contact > p'
  );

  wordTargets.forEach(function(el) {
    // Agar pehle se setup ho gaya toh dobara mat karo
    if (el.dataset.animateDone) return;
    el.dataset.animateDone = '1';
    // Original text save karo, screen pe khali karo, JS khud word-by-word bharega
    el.dataset.fullText = el.textContent.trim();
    el.textContent = '';
    // Cursor add karo - purane HTML me nahi tha, JS se add ho raha hai
    const cursor = document.createElement('span');
    cursor.className = 'animate-cursor';
    cursor.textContent = '|';
    el.appendChild(cursor);
    // Text ke liye alag span banao taaki cursor hamesha end me rahe
    const textSpan = document.createElement('span');
    el.insertBefore(textSpan, cursor);
    el._textSpan = textSpan;
  });

  // 2. Word-by-Word - Typewriter nahi, pura word ek saath
  function showWords(el, reverse) {
    const span = el._textSpan;
    if (!span) return;
    const words = (el.dataset.fullText || '').split(' ');
    if (el._typing) clearInterval(el._typing);

    if (!reverse) {
      let count = span.textContent.trim() ? span.textContent.trim().split(' ').length : 0;
      if (count >= words.length) return;
      el._typing = setInterval(function() {
        count++;
        span.textContent = words.slice(0, count).join(' ');
        if (count >= words.length) clearInterval(el._typing);
      }, 180); // Speed yahan se - 180 = normal, 300 = slow, 100 = fast
    } else {
      let count = span.textContent.trim() ? span.textContent.trim().split(' ').length : words.length;
      el._typing = setInterval(function() {
        count--;
        span.textContent = words.slice(0, Math.max(0, count)).join(' ');
        if (count <= 0) clearInterval(el._typing);
      }, 60);
    }
  }

  // 3. Left / Right 3D Reveal - Flip nahi
  // Purane cards / sections ko JS se hi Left / Right de do - HTML edit nahi
  const revealItems = document.querySelectorAll(
    '.hero-image-wrapper, .section-label, .section-heading, #about > p, .about-stats > div, .project-card, .skill-card, .timeline-item, .cert-card, .resume-card, #contact > p, #contact > a, .contact-links'
  );

  revealItems.forEach(function(el, index) {
    const fromLeft = index % 2 === 0; // Ek Left, ek Right, ek Left, ek Right...
    el.classList.add(fromLeft ? 'animate-left' : 'animate-right');

    // Agar ye card hai toh 3D card class bhi laga do
    if (el.classList.contains('project-card') || el.classList.contains('skill-card') || el.classList.contains('timeline-item') || el.classList.contains('cert-card') || el.classList.contains('resume-card') || el.parentElement.classList.contains('about-stats')) {
      el.classList.add('animate-card');
    }

    const startX = fromLeft ? -110 : 110;
    gsap.set(el, { x: startX, y: 30, z: 40, scale: 0.92, opacity: 0 });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      end: 'bottom 5%',
      onEnter: function() {
        el.classList.remove('dissolving');
        gsap.to(el, { x: 0, y: 0, z: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out', overwrite: true });
        // Iske andar jo word-target hai usko word-by-word dikhao
        el.querySelectorAll('[data-full-text]').forEach(function(t) { showWords(t, false); });
        if (el.dataset.fullText) showWords(el, false);
      },
      onLeave: function() {
        el.classList.add('dissolving');
        gsap.to(el, { x: fromLeft ? -80 : 80, y: 20, z: 20, scale: 0.92, opacity: 0, duration: 0.5, ease: 'power2.in' });
        el.querySelectorAll('[data-full-text]').forEach(function(t) { showWords(t, true); });
        if (el.dataset.fullText) showWords(el, true);
      },
      onEnterBack: function() {
        el.classList.remove('dissolving');
        gsap.to(el, { x: 0, y: 0, z: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out', overwrite: true });
        el.querySelectorAll('[data-full-text]').forEach(function(t) { showWords(t, false); });
        if (el.dataset.fullText) showWords(el, false);
      },
      onLeaveBack: function() {
        el.classList.add('dissolving');
        gsap.to(el, { x: startX, y: 30, z: 40, scale: 0.92, opacity: 0, duration: 0.5, ease: 'power2.in' });
        el.querySelectorAll('[data-full-text]').forEach(function(t) { showWords(t, true); });
        if (el.dataset.fullText) showWords(el, true);
      }
    });
  });

  // Hero ka text page load pe hi word-by-word
  document.querySelectorAll('.hero h2, .hero-description').forEach(function(t) {
    setTimeout(function() { showWords(t, false); }, 600);
  });

  // 4. 3D Tilt - Halka jhukega, paltega nahi
  document.querySelectorAll('.animate-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateZ(20px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });

  // 5. Skill Bar - Scroll pe fill
  gsap.utils.toArray('.skill-bar span').forEach(function(bar) {
    const w = bar.style.width;
    gsap.fromTo(bar, { width: '0%' }, { width: w, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: bar, start: 'top 92%' } });
  });

  // 6. Smooth Scroll - Sirf Desktop pe
  let targetY = window.scrollY, currentY = window.scrollY, isScrolling = false;
  function smoothLoop() {
    currentY += (targetY - currentY) * 0.12;
    if (Math.abs(targetY - currentY) > 0.5) {
      window.scrollTo(0, currentY);
      requestAnimationFrame(smoothLoop);
    } else {
      isScrolling = false;
      window.scrollTo(0, targetY);
    }
    ScrollTrigger.refresh();
  }
  if (window.innerWidth > 900) {
    window.addEventListener('wheel', function(e) {
      if (document.body.classList.contains('menu-open-body')) return;
      e.preventDefault();
      targetY = Math.max(0, Math.min(document.body.scrollHeight - window.innerHeight, targetY + e.deltaY));
      if (!isScrolling) { isScrolling = true; requestAnimationFrame(smoothLoop); }
    }, { passive: false });
  }
});