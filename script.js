// BULLETPROOF MENU - Checkbox nahi, sirf JS
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navLinks');

  console.log('MenuBtn mila?', !!menuBtn, 'Nav mila?', !!navMenu);

  if (!menuBtn || !navMenu) return;

  function openMenu() {
    navMenu.classList.add('menu-open');
    navMenu.classList.add('active');
    // CSS ke !important ko bhi hara dega
    navMenu.style.setProperty('display', 'flex', 'important');
    setTimeout(updateCenterPop, 60);
  }
  function closeMenu() {
    navMenu.classList.remove('menu-open');
    navMenu.classList.remove('active');
    navMenu.style.setProperty('display', 'none', 'important');
  }
  function toggleMenu() {
    if (navMenu.classList.contains('menu-open')) closeMenu();
    else openMenu();
  }

  // Click + Touch dono pe chalega
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

  // Pill pe click -> band
  navMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });

  // Bahar click -> band
  document.addEventListener('click', function(e) {
    if (navMenu.classList.contains('menu-open') && !navMenu.contains(e.target) && e.target !== menuBtn) {
      closeMenu();
    }
  });

  // CENTER POP
  function updateCenterPop() {
    const links = navMenu.querySelectorAll('a');
    if (!links.length) return;
    const menuRect = navMenu.getBoundingClientRect();
    const centerY = menuRect.top + menuRect.height / 2;
    let closest = null, closestDist = 10000;
    links.forEach(function(a) {
      const r = a.getBoundingClientRect();
      const dist = Math.abs((r.top + r.height / 2) - centerY);
      if (dist < closestDist) { closestDist = dist; closest = a; }
    });
    links.forEach(a => a.classList.remove('pop'));
    if (closest) closest.classList.add('pop');
  }
  navMenu.addEventListener('scroll', updateCenterPop, { passive: true });
  navMenu.addEventListener('touchmove', updateCenterPop, { passive: true });

  // CERTIFICATE
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

  // SMOOTH SCROLL
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