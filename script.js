const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navLinks');

if (menuBtn && navMenu) {
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    navMenu.classList.toggle('active');
  });

  // Bahar click karega toh band hoga
  document.addEventListener('click', function(e) {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && e.target !== menuBtn) {
      navMenu.classList.remove('active');
    }
  });

  // Kisi pill pe click karega toh menu band hoga
  navMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
    });
  });

  // Slide pe sirf ungli wala pill pop hoga
  function clearPop() {
    navMenu.querySelectorAll('a').forEach(a => a.classList.remove('pop'));
  }
  navMenu.addEventListener('touchmove', function(e) {
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const link = el ? el.closest('a') : null;
    clearPop();
    if (link && navMenu.contains(link)) {
      link.classList.add('pop');
    }
  }, { passive: true });

  navMenu.addEventListener('touchend', function() {
    setTimeout(clearPop, 150);
  });
}