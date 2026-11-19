// ===== FULL JS - MENU + SLIDE POP + CERT MODAL =====

document.addEventListener('DOMContentLoaded', function() {

  // 1. MENU BUTTON - 3 LINE
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navLinks');
  const menuCheck = document.getElementById('menuCheck');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      // Agar CSS wala checkbox hai toh usko bhi toggle karo
      if (menuCheck) {
        // Checkbox wala system hai toh JS toggle mat karo, checkbox khud karega
        return;
      }
      navMenu.classList.toggle('active');
    });

    // Kisi pill pe click karega toh menu band
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        if (menuCheck) menuCheck.checked = false;
      });
    });

    // Bahar click karega toh band
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        if (menuCheck) menuCheck.checked = false;
      }
    });
  }

  // 2. SLIDE POP - Ungli jis pill pe hogi, sirf wahi pop hoga
  if (navMenu) {
    function clearPop() {
      navMenu.querySelectorAll('a').forEach(function(a) {
        a.classList.remove('pop');
      });
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

    // Mouse pe bhi pop - PC pe check karne ke liye
    navMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('mouseenter', function() {
        clearPop();
        a.classList.add('pop');
      });
      a.addEventListener('mouseleave', function() {
        a.classList.remove('pop');
      });
    });
  }

  // 3. CERTIFICATE MODAL
  const certModal = document.getElementById('certModal');
  const certModalImg = document.getElementById('certModalImg');
  const certModalDownload = document.getElementById('certModalDownload');
  const certImage = document.getElementById('certImage');

  window.openCertView = function() {
    if (!certModal || !certImage) return;
    if (certModalImg) certModalImg.src = certImage.src;
    if (certModalDownload) certModalDownload.href = certImage.src;
    certModal.style.display = 'flex';
  };

  window.closeCertView = function() {
    if (certModal) certModal.style.display = 'none';
  };

  // 4. SMOOTH SCROLL - Menu band karke section pe le jayega
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  console.log('JS loaded - menu ready');
});