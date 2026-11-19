document.addEventListener('DOMContentLoaded', function() {
  // ===== MENU =====
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navLinks');
  if (menuBtn && navMenu) {
    if (navMenu.parentElement !== document.body) document.body.appendChild(navMenu);
    if (menuBtn.parentElement !== document.body) document.body.appendChild(menuBtn);
    let lastToggle = 0;
    function toggleMenuSafe(){ const now=Date.now(); if(now-lastToggle<400) return; lastToggle=now; if(navMenu.classList.contains('menu-open')) closeMenu(); else openMenu(); }
    function centrePills(){ const first=navMenu.querySelector('a'); if(!first) return; const h=window.innerHeight; const pillH=first.offsetHeight||50; const pad=Math.max(0,(h/2)-(pillH/2)); navMenu.style.setProperty('padding-top',pad+'px','important'); navMenu.style.setProperty('padding-bottom',pad+'px','important'); navMenu.scrollTop=0; updateCenterPop(); }
    function openMenu(){ navMenu.classList.add('menu-open'); navMenu.style.setProperty('display','flex','important'); document.body.classList.add('menu-open-body'); menuBtn.textContent='✕'; centrePills(); setTimeout(centrePills,100); setTimeout(centrePills,300); }
    function closeMenu(){ navMenu.classList.remove('menu-open'); navMenu.style.setProperty('display','none','important'); document.body.classList.remove('menu-open-body'); menuBtn.textContent='☰'; }
    menuBtn.addEventListener('click',function(e){ e.stopPropagation(); e.preventDefault(); toggleMenuSafe(); });
    navMenu.querySelectorAll('a').forEach(function(link){ link.addEventListener('click',function(){ closeMenu(); }); });
    document.addEventListener('click',function(e){ if(navMenu.classList.contains('menu-open') && !navMenu.contains(e.target) && e.target!==menuBtn && !menuBtn.contains(e.target)) closeMenu(); });
    function updateCenterPop(){ const links=navMenu.querySelectorAll('a'); if(!links.length) return; const centerY=window.innerHeight/2; let closest=null,closestDist=10000; links.forEach(function(a){ const r=a.getBoundingClientRect(); const d=Math.abs((r.top+r.height/2)-centerY); if(d<closestDist){closestDist=d;closest=a;} }); links.forEach(a=>a.classList.remove('pop')); if(closest) closest.classList.add('pop'); }
    let startY=0,startScroll=0,isDragging=false;
    navMenu.addEventListener('touchstart',function(e){ isDragging=true; startY=e.touches[0].clientY; startScroll=navMenu.scrollTop; },{passive:true});
    navMenu.addEventListener('touchmove',function(e){ if(!isDragging) return; navMenu.scrollTop=startScroll+(startY-e.touches[0].clientY); updateCenterPop(); },{passive:true});
    navMenu.addEventListener('touchend',function(){ isDragging=false; setTimeout(updateCenterPop,100); });
    navMenu.addEventListener('scroll',updateCenterPop,{passive:true});
    window.addEventListener('resize',function(){ if(navMenu.classList.contains('menu-open')) centrePills(); });
  }
  const certModal=document.getElementById('certModal'); const certImage=document.getElementById('certImage');
  window.openCertView=function(){ if(!certModal||!certImage) return; document.getElementById('certModalImg').src=certImage.src; document.getElementById('certModalDownload').href=certImage.src; certModal.style.display='flex'; };
  window.closeCertView=function(){ if(certModal) certModal.style.display='none'; };
  const viewBtn=document.getElementById('viewResumeBtn');
  if(viewBtn){ viewBtn.addEventListener('click',function(e){ e.preventDefault(); const absoluteUrl=new URL('public/resume.pdf',window.location.href).href; const viewerUrl='https://docs.google.com/viewer?url='+encodeURIComponent(absoluteUrl)+'&embedded=true'; window.open(viewerUrl,'_blank'); }); }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){ a.addEventListener('click',function(e){ const id=a.getAttribute('href'); if(id&&id.length>1){ const t=document.querySelector(id); if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); } } }); });

  // ===== COLOUR-MATCHING PARTICLE SYSTEM =====
  gsap.registerPlugin(ScrollTrigger);
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth < 768;
  function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas(); window.addEventListener('resize', resizeCanvas);
  let particles = [];

  function getElementColors(el){
    const colors = [];
    const style = getComputedStyle(el);
    function addColor(c){
      if(!c || c === 'rgba(0, 0, 0, 0)' || c === 'transparent') return;
      const m = c.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if(m) colors.push(`rgb(${m[1]},${m[2]},${m[3]})`);
    }
    addColor(style.backgroundColor);
    addColor(style.color);
    addColor(style.borderTopColor);
    el.querySelectorAll('*').forEach(child => {
      const cs = getComputedStyle(child);
      addColor(cs.color);
      addColor(cs.backgroundColor);
      if(child.classList.contains('status-dot')) colors.push('rgb(0,255,136)');
      if(child.tagName === 'SPAN' && cs.color !== 'rgb(255, 255, 255)') addColor(cs.color);
    });
    const img = el.querySelector('img');
    if(img && img.complete && img.naturalWidth > 0){
      try{
        const tmp = document.createElement('canvas');
        tmp.width = 10; tmp.height = 10;
        const tctx = tmp.getContext('2d');
        tctx.drawImage(img, 0, 0, 10, 10);
        const data = tctx.getImageData(0,0,10,10).data;
        for(let i=0;i<data.length;i+=40){
          const r=data[i], g=data[i+1], b=data[i+2], a=data[i+3];
          if(a > 50) colors.push(`rgb(${r},${g},${b})`);
        }
      }catch(e){}
    }
    if(colors.length === 0) return ['rgb(255,102,0)'];
    return colors;
  }

  function makeParticle(x, y, tx, ty, mode, color){
    return { x:x, y:y, tx:tx, ty:ty, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, size: 1.5 + Math.random()*3.5, life:1, decay:0.008 + Math.random()*0.01, mode:mode, color:color, angle: Math.random()*Math.PI*2 };
  }

  function spawnAssemble(el){
    const r = el.getBoundingClientRect();
    if(r.top < -100 || r.top > window.innerHeight+100) return;
    const colors = getElementColors(el);
    const count = isMobile ? 45 : 90;
    const fromLeft = el.classList.contains('reveal-left');
    for(let i=0;i<count;i++){
      const side = Math.floor(Math.random()*4);
      let tx = r.left + r.width/2, ty = r.top + r.height/2;
      if(side===0){ tx = r.left + Math.random()*r.width; ty = r.top; }
      if(side===1){ tx = r.left + Math.random()*r.width; ty = r.top + r.height; }
      if(side===2){ tx = r.left; ty = r.top + Math.random()*r.height; }
      if(side===3){ tx = r.left + r.width; ty = r.top + Math.random()*r.height; }
      const sx = fromLeft ? -30 - Math.random()*150 : window.innerWidth + 30 + Math.random()*150;
      const sy = ty + (Math.random()-0.5)*220;
      const col = colors[Math.floor(Math.random()*colors.length)];
      particles.push(makeParticle(sx, sy, tx, ty, 'assemble', col));
    }
  }

  function spawnDissolve(el){
    const r = el.getBoundingClientRect();
    if(r.top < -100 || r.top > window.innerHeight+100) return;
    const colors = getElementColors(el);
    const count = isMobile ? 35 : 70;
    for(let i=0;i<count;i++){
      const x = r.left + Math.random()*r.width;
      const y = r.top + Math.random()*r.height;
      const tx = x + (Math.random()-0.5)*350;
      const ty = y + (Math.random()-0.5)*350;
      const col = colors[Math.floor(Math.random()*colors.length)];
      const p = makeParticle(x, y, tx, ty, 'dissolve', col);
      p.vx = (Math.random()-0.5)*6; p.vy = -1 - Math.random()*4;
      particles.push(p);
    }
  }

  function drawLoop(){
    requestAnimationFrame(drawLoop);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      if(p.mode === 'assemble'){
        p.x += (p.tx - p.x) * 0.12 + (Math.random()-0.5)*1.5;
        p.y += (p.ty - p.y) * 0.12 + (Math.random()-0.5)*1.5;
        p.life -= p.decay * 1.4;
      } else {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= p.decay * 1.2;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 12;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle + p.x*0.01);
      ctx.beginPath();
      ctx.moveTo(0, -p.size*1.8); ctx.lineTo(p.size, p.size); ctx.lineTo(0, p.size*0.4); ctx.lineTo(-p.size, p.size);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    });
  }
  drawLoop();

  function setupReveal(el){
    const fromLeft = el.classList.contains('reveal-left');
    const startX = fromLeft ? -90 : 90;
    gsap.set(el, {x: startX, opacity: 0});
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', end: 'bottom 5%',
      onEnter: () => {
        spawnAssemble(el);
        gsap.to(el, {x:0, opacity:1, duration:0.9, delay:0.18, ease:'power3.out', overwrite:true, onStart:()=> el.classList.remove('dissolving')});
      },
      onLeave: () => {
        el.classList.add('dissolving');
        spawnDissolve(el);
        gsap.to(el, {x: fromLeft ? -70 : 70, opacity:0, duration:0.45, ease:'power2.in'});
      },
      onEnterBack: () => {
        el.classList.remove('dissolving');
        spawnAssemble(el);
        gsap.to(el, {x:0, opacity:1, duration:0.9, delay:0.15, ease:'power3.out', overwrite:true});
      },
      onLeaveBack: () => {
        el.classList.add('dissolving');
        spawnDissolve(el);
        gsap.to(el, {x: startX, opacity:0, duration:0.45, ease:'power2.in'});
      }
    });
  }
  document.querySelectorAll('.reveal-left, .reveal-right').forEach(setupReveal);
  ScrollTrigger.create({ trigger:'#home', start:'top 80%', onEnter:()=> gsap.to('.scroll-hint',{opacity:0,duration:0.3}) });
  gsap.utils.toArray('.skill-bar span').forEach(function(bar){
    const w = bar.style.width;
    gsap.fromTo(bar, {width:'0%'}, { width:w, duration:1.2, ease:'power2.out', scrollTrigger:{ trigger: bar, start:'top 92%' } });
  });
});