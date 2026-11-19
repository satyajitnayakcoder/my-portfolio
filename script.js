// FULL JS - Har pill bich me aayega + ONLY Centre Pop
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navLinks');
  if (!menuBtn || !navMenu) return;

  function openMenu() {
    navMenu.classList.add('menu-open');
    navMenu.style.setProperty('display', 'flex', 'important');
    setTimeout(function() {
      navMenu.scrollTop = 0;
      updateCenterPop();
    }, 80);
  }
  function closeMenu() {
    navMenu.classList.remove('menu-open');
    navMenu.style.setProperty('display', 'none', 'important');
  }
  function toggleMenu() {
    if (navMenu.classList.contains('menu-open')) closeMenu();
    else openMenu();
  }

  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    toggleMenu();
  });
  menuBtn.addEventListener('touchstart', function(e) {
    e.stopPropagation();
    e.preventDefault();
    toggleMenu();
  }, { passive: false });

  navMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });

  document.addEventListener('click', function(e) {
    if (navMenu.classList.contains('menu-open') && !navMenu.contains(e.target) && e.target !== menuBtn) {
      closeMenu();
    }
  });

  function updateCenterPop() {
    const links = navMenu.querySelectorAll('a');
    if (!links.length) return;
    const menuRect = navMenu.getBoundingClientRect();
    const centerY = menuRect.top + menuRect.height / 2;
    let closest = null;
    let closestDist = 10000;
    links.forEach(function(a) {
      const r = a.getBoundingClientRect();
      const pillCenter = r.top + r.height / 2;
      const dist = Math.abs(pillCenter - centerY);
      if (dist < closestDist) {
        closestDist = dist;
        closest = a;
      }
    });
    links.forEach(a => a.classList.remove('pop'));
    if (closest) closest.classList.add('pop');
  }

  navMenu.addEventListener('scroll', updateCenterPop, { passive: true });
  navMenu.addEventListener('touchmove', updateCenterPop, { passive: true });
  navMenu.addEventListener('touchend', function() {
    setTimeout(updateCenterPop, 100);
  });

  const certModal = document.getElementById('certModal');
  const certImage = document.getElementById('certImage');
  window.openCertView = function() {
    if (!certModal || !certImage) return;
    document.getElementById('certModalImg').src = certImage.src;
    document.getElementById('certModalDownload').href = certImage.src;
    certModal.style.display = 'flex';
  };
  window.closeCertView = function() {
    if (certModal) certModal.style.display = 'none';
  };

  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
      }
    });
  });
});