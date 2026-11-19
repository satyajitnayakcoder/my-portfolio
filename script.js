// ===== SATYAJIT PORTFOLIO - FULL JS - FIXED MENU + CENTER POP =====

document.addEventListener('DOMContentLoaded', function() {

  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navLinks');
  const menuCheck = document.getElementById('menuCheck');

  // 1. MENU - 3 LINE BUTTON - JS se bhi khulega, CSS se bhi
  if (menuBtn && navMenu && menuCheck) {

    // Label pe click hoga toh checkbox khud toggle hoga,
    // hum sirf class sync karenge
    menuBtn.addEventListener('click', function(e) {
      // Label ka default kaam hone do, phir class lagao
      setTimeout(function() {
        if (menuCheck.checked) {
          navMenu.classList.add('active');
          setTimeout(updateCenterPop, 60);
        } else {
          navMenu.classList.remove('active');
        }
      }, 20);
    });

    // Checkbox change hoga toh class bhi change
    menuCheck.addEventListener('change', function() {
      if (menuCheck.checked) {
        navMenu.classList.add('active');
        setTimeout(updateCenterPop, 60);
      } else {
        navMenu.classList.remove('active');
      }
    });

    // Kisi pill pe click -> menu band
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        menuCheck.checked = false;
      });
    });

    // Bahar click -> band
    document.addEventListener('click', function(e) {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        e.target !== menuBtn &&
        !menuBtn.contains(e.target)
      ) {
        navMenu.classList.remove('active');
        menuCheck.checked = false;
      }
    });
  }

  // 2. AUTO CENTER POP - Jo pill bich me aayega, wohi bada hoga
  function updateCenterPop() {
    if (!navMenu) return;
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

  if (navMenu) {
    navMenu.addEventListener('scroll', updateCenterPop, { passive: true });
    navMenu.addEventListener('touchmove', updateCenterPop, { passive: true });
    navMenu.addEventListener('touchend', function() {
      setTimeout(updateCenterPop, 100);
    });
  }

  // 3. CERTIFICATE MODAL
  const certModal = document.getElementById('certModal');
  const certImage = document.getElementById('certImage');
  const certModalImg = document.getElementById('certModalImg');
  const certModalDownload = document.getElementById('certModalDownload');

  window.openCertView = function() {
    if (!certModal || !certImage) return;
    if (certModalImg) certModalImg.src = certImage.src;
    if (certModalDownload) certModalDownload.href = certImage.src;
    certModal.style.display = 'flex';
  };

  window.closeCertView = function() {
    if (certModal) certModal.style.display = 'none';
  };

  // 4. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  console.log('JS Loaded - Menu Fixed');
});