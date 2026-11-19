// ============ PART 1: TERA PURANA CODE - SAME ============
document.addEventListener('DOMContentLoaded', function() {
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

  // ============ PART 2: SWARM REBUILD ANIMATION ============
  gsap.registerPlugin(ScrollTrigger);
  const isMobile = window.innerWidth < 768;
  const COUNT = isMobile ? 280 : 650; // Mobile pe kam particles = fast

  const canvas = document.getElementById('swarm-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, -100, 100);
  camera.position.z = 10;

  // Arrow shape texture - Canvas se banaya hua teer
  function makeArrowTexture(){
    const c = document.createElement('canvas'); c.width=c.height=64;
    const ctx=c.getContext('2d');
    ctx.translate(32,32); ctx.fillStyle='#ff6600';
    ctx.shadowColor='#ff6600'; ctx.shadowBlur=18;
    ctx.beginPath(); ctx.moveTo(0,-22); ctx.lineTo(10,4); ctx.lineTo(4,4); ctx.lineTo(4,22); ctx.lineTo(-4,22); ctx.lineTo(-4,4); ctx.lineTo(-10,4); ctx.closePath(); ctx.fill();
    const tex=new THREE.CanvasTexture(c); return tex;
  }
  const arrowTex = makeArrowTexture();

  // Particles
  const positions = new Float32Array(COUNT*3);
  const targets = new Float32Array(COUNT*3);
  const swarm = new Float32Array(COUNT*3); // idhar-udhar udne wali position
  const speeds = new Float32Array(COUNT);
  for(let i=0;i<COUNT;i++){
    positions[i*3]= (Math.random()-0.5)*window.innerWidth;
    positions[i*3+1]= (Math.random()-0.5)*window.innerHeight;
    positions[i*3+2]=0;
    swarm[i*3]=positions[i*3]; swarm[i*3+1]=positions[i*3+1];
    targets[i*3]=positions[i*3]; targets[i*3+1]=positions[i*3+1];
    speeds[i]=0.02+Math.random()*0.04;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const mat = new THREE.PointsMaterial({ size: isMobile?10:14, map: arrowTex, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, color:0xff7700, opacity:0.95 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Kisi section ke andar ke elements se TARGET points banana
  // Logic: Har card / heading / button ke border pe points bichha do, taaki particles uski shape banaye
  function buildTargetsFor(sectionEl){
    const rects=[];
    sectionEl.querySelectorAll('h1,h2,h3,p,a,div,img,span').forEach(el=>{
      const r=el.getBoundingClientRect();
      // Sirf screen ke andar wale aur bade elements lo
      if(r.width>20 && r.height>10 && r.top>-100 && r.top<window.innerHeight+100){
        rects.push({x:r.left+r.width/2 - window.innerWidth/2, y:-(r.top+r.height/2 - window.innerHeight/2), w:r.width, h:r.height});
      }
    });
    if(!rects.length) return;
    for(let i=0;i<COUNT;i++){
      const box=rects[i % rects.length];
      // Border pe random point - isse outline banta hai, asli reconstruction jaisa lagta hai
      const side=Math.floor(Math.random()*4);
      let x=box.x, y=box.y;
      if(side===0){ x=box.x - box.w/2 + Math.random()*box.w; y=box.y - box.h/2; }
      if(side===1){ x=box.x - box.w/2 + Math.random()*box.w; y=box.y + box.h/2; }
      if(side===2){ x=box.x - box.w/2; y=box.y - box.h/2 + Math.random()*box.h; }
      if(side===3){ x=box.x + box.w/2; y=box.y - box.h/2 + Math.random()*box.h; }
      // Thoda randomness taaki perfect line na lage, organic lage
      targets[i*3]=x + (Math.random()-0.5)*8;
      targets[i*3+1]=y + (Math.random()-0.5)*8;
    }
    // GSAP se smooth fly - particles ko target pe bhejo
    gsap.to({p:0},{p:1,duration:0.1});
  }

  // Har section aate hi uska shape banao + content ko particles ke saath reveal karo
  let currentSection = null;
  document.querySelectorAll('section').forEach(sec=>{
    // Content pehle thoda chhupa do, particles banayenge
    gsap.set(sec,{opacity:0.15});
    ScrollTrigger.create({
      trigger: sec, start:'top 70%', end:'bottom 30%',
      onEnter: ()=>{ currentSection=sec; buildTargetsFor(sec); gsap.to(sec,{opacity:1,duration:0.9,delay:0.35,ease:'power2.out'}); },
      onEnterBack: ()=>{ currentSection=sec; buildTargetsFor(sec); gsap.to(sec,{opacity:1,duration:0.7,ease:'power2.out'}); },
      onLeave: ()=>{ gsap.to(sec,{opacity:0.25,duration:0.4}); },
    });
  });
  // Hero turant dikhao
  const hero=document.getElementById('home');
  if(hero){ buildTargetsFor(hero); gsap.to(hero,{opacity:1,duration:0.8}); }

  // Animation loop - Lerp = smooth piche-piche aana + trail jaisa lagna
  let time=0;
  function animate(){
    requestAnimationFrame(animate);
    time+=0.008;
    const pos=geo.attributes.position.array;
    for(let i=0;i<COUNT;i++){
      // Swarm wobble - halki hawa me hilna
      const wob = Math.sin(time*2 + i)*6;
      const tx = targets[i*3] + wob*0.3;
      const ty = targets[i*3+1] + Math.cos(time*2 + i*0.7)*6*0.3;
      pos[i*3]   += (tx - pos[i*3]) * speeds[i];
      pos[i*3+1] += (ty - pos[i*3+1]) * speeds[i];
      // Arrow ko movement ki direction me ghumana - yahi asli arrow feel hai
      // PointsMaterial me rotation nahi hota, isliye size pulse se glow feel dete hai
    }
    mat.size = (isMobile?10:14) + Math.sin(time*3)*1.5; // breathing glow
    geo.attributes.position.needsUpdate=true;
    renderer.render(scene,camera);
  }
  animate();

  // Scroll pe particles tez ho jaye - jaise koi likh raha ho
  let lastScrollY=window.scrollY;
  window.addEventListener('scroll',()=>{
    const diff=Math.abs(window.scrollY-lastScrollY);
    lastScrollY=window.scrollY;
    if(diff>2){ gsap.to(mat,{opacity:1,duration:0.2}); }
  },{passive:true});

  window.addEventListener('resize',()=>{
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.left=-window.innerWidth/2; camera.right=window.innerWidth/2;
    camera.top=window.innerHeight/2; camera.bottom=-window.innerHeight/2;
    camera.updateProjectionMatrix();
    if(currentSection) buildTargetsFor(currentSection);
  });
});