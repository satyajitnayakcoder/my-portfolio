document.addEventListener("DOMContentLoaded", function () {
  console.log("Portfolio Loaded - Satyajit Nayak");
  const navLinks = document.querySelectorAll(".nav-links a");
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinksContainer = document.querySelector(".nav-links");

  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener("click", function () {
      navLinksContainer.classList.toggle("active");
    });
  }

    navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        const glass = document.getElementById("glassSlide");
        if (glass) glass.classList.add("active");
        setTimeout(function() {
          if (targetSection) targetSection.scrollIntoView({ behavior: "auto" });
          if (glass) {
            glass.classList.add("slide-out");
            setTimeout(function(){
              glass.classList.remove("active", "slide-out");
            }, 550);
          }
        }, 550);
        if (navLinksContainer) navLinksContainer.classList.remove("active");
      }
    });
  });

  window.addEventListener("scroll", function () {
    if (navbar) navbar.style.boxShadow = window.scrollY > 50 ? "0 8px 25px rgba(0,0,0,0.4)" : "none";
  });

  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", function () {
    let current = "";
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 200) current = section.getAttribute("id");
    });
    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) link.classList.add("active");
    });
  });

  const projects = document.querySelectorAll(".project-card");
  projects.forEach(function (card) {
    card.addEventListener("mouseenter", function () { card.style.transform = "translateY(-8px)"; });
    card.addEventListener("mouseleave", function () { card.style.transform = "translateY(0)"; });
  });

  const skills = document.querySelectorAll(".skill-card");
  skills.forEach(function (skill) {
    skill.addEventListener("click", function () {
      skill.style.borderColor = "#ff923d";
      setTimeout(function () { skill.style.borderColor = "#252525"; }, 600);
    });
  });

  const footerText = document.querySelector("footer p");
  if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.textContent = "© " + currentYear + " SATYAJIT NAYAK. ALL RIGHTS RESERVED.";
  }
  document.addEventListener("DOMContentLoaded", function () {
  console.log("Portfolio Loaded - Satyajit Nayak");
  const navLinks = document.querySelectorAll(".nav-links a");
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinksContainer = document.querySelector(".nav-links");

  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener("click", function () {
      navLinksContainer.classList.toggle("active");
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) targetSection.scrollIntoView({ behavior: "smooth" });
        if (navLinksContainer) navLinksContainer.classList.remove("active");
      }
    });
  });

  window.addEventListener("scroll", function () {
    if (navbar) navbar.style.boxShadow = window.scrollY > 50 ? "0 8px 25px rgba(0,0,0,0.4)" : "none";
  });

  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", function () {
    let current = "";
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 200) current = section.getAttribute("id");
    });
    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) link.classList.add("active");
    });
  });

  const projects = document.querySelectorAll(".project-card");
  projects.forEach(function (card) {
    card.addEventListener("mouseenter", function () { card.style.transform = "translateY(-8px)"; });
    card.addEventListener("mouseleave", function () { card.style.transform = "translateY(0)"; });
  });

  const skills = document.querySelectorAll(".skill-card");
  skills.forEach(function (skill) {
    skill.addEventListener("click", function () {
      skill.style.borderColor = "#ff923d";
      setTimeout(function () { skill.style.borderColor = "#252525"; }, 600);
    });
  });

  const footerText = document.querySelector("footer p");
  if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.textContent = "© " + currentYear + " SATYAJIT NAYAK. ALL RIGHTS RESERVED.";
  }
    });

function openCertView() {
  const img = document.getElementById("certImage");
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certModalImg");
  const modalDownload = document.getElementById("certModalDownload");
  if (img && modal) {
    modalImg.src = img.src;
    modalDownload.href = img.src;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}
function closeCertView() {
  const modal = document.getElementById("certModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "auto";
  }
}
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeCertView();
});


// Mobile friendly glassy slide
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.05 });

sections.forEach(s => observer.observe(s));
document.querySelector('#home')?.classList.add('visible');
});

function openCertView() {
  const img = document.getElementById("certImage");
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certModalImg");
  const modalDownload = document.getElementById("certModalDownload");
  if (img && modal) {
    modalImg.src = img.src;
    modalDownload.href = img.src;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}
function closeCertView() {
  const modal = document.getElementById("certModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "auto";
  }
}
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeCertView();
});
// Menu Toggle Fix
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      nav.classList.toggle("active");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("active");
      });
    });
  }
});