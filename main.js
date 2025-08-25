/* Main JS for Sneha Gupta Portfolio */
// Smooth scroll, theme toggle, GSAP animations, Three.js scenes (stars/particles), skills hover, 3D cards.

// ===== Utilities =====
const byId = (id) => document.getElementById(id);
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];

// ===== Theme Toggle =====
(function themeInit(){
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  const btn = byId('themeToggle');
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
  // Accent palette
  const setPalette = (key) => {
    const palettes = {
      'violet-cyan': { primary: '#7c3aed', accent: '#22d3ee' },
      'blue-pink': { primary: '#2563eb', accent: '#ec4899' },
      'emerald-amber': { primary: '#10b981', accent: '#f59e0b' },
      'rose-sky': { primary: '#f43f5e', accent: '#38bdf8' },
    };
    const pal = palettes[key] || palettes['violet-cyan'];
    root.style.setProperty('--primary', pal.primary);
    root.style.setProperty('--accent', pal.accent);
    root.style.setProperty('--grad-1', `linear-gradient(135deg, ${pal.primary}, #4f46e5 50%, ${pal.accent})`);
    root.style.setProperty('--grad-2', `linear-gradient(135deg, ${hexToRgba(pal.primary, .25)}, ${hexToRgba(pal.accent, .2)})`);
    localStorage.setItem('palette', key);
  window.dispatchEvent(new CustomEvent('palettechange', { detail: pal }));
  };
  const savedPal = localStorage.getItem('palette');
  if (savedPal) setPalette(savedPal);
  const palette = byId('palette');
  if (palette){
    palette.addEventListener('click', (e) => {
      const btn = e.target.closest('.swatch');
      if (!btn) return;
      setPalette(btn.dataset.accent);
    });
  }
})();

// ===== Typing effect for name (Anime.js) =====
(function typing(){
  const el = qs('.typing');
  const text = 'Sneha Gupta';
  el.textContent = '';
  const targets = document.createElement('span');
  el.appendChild(targets);
  anime({
    targets,
    duration: 1400,
    easing: 'linear',
    update: (anim) => {
      const progress = anim.progress / 100; // 0..1
      const length = Math.round(text.length * progress);
      targets.textContent = text.slice(0, length);
    }
  });
  // glow underline animation on name once loaded
  gsap.fromTo('.typing', { filter: 'drop-shadow(0 0 0 rgba(255,255,255,0))' }, { filter: 'drop-shadow(0 0 18px rgba(255,255,255,.25))', duration: 1.6, delay: 0.4, ease: 'sine.out' });

  // role rotator
  const roleEl = byId('role');
  const roles = ['Aspiring Software Engineer', 'MERN Stack Developer', '3D Web Enthusiast'];
  let idx = 0;
  if (roleEl){
    setInterval(()=>{
      idx = (idx + 1) % roles.length;
      roleEl.style.opacity = 0;
      setTimeout(()=>{ roleEl.textContent = roles[idx]; roleEl.style.opacity = 1; }, 180);
    }, 2200);
  }
})();

// ===== GSAP Scroll Animations =====
(function gsapAnimations(){
  gsap.registerPlugin(ScrollTrigger);
  // Fade in sections on scroll
  qsa('.section').forEach((sec) => {
    gsap.from(sec, { opacity: 0, y: 40, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: sec, start: 'top 80%' }
    });
  });

  // About image: no tilt/rotation per user request

  // Hero CTA buttons entrance (gentle to avoid layout jump)
  gsap.from('.hero .cta .btn', {
    y: 8, opacity: 0, stagger: 0.08, duration: 0.45, ease: 'sine.out', delay: 0.1
  });

  // Timeline items slide-in
  gsap.utils.toArray('.timeline .item').forEach((item) => {
    gsap.from(item, {
      x: 40, opacity: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: item, start: 'top 85%' }
    });
  });
})();

// (Project card tilt intentionally omitted to preserve flip effect)

// ===== Skills hover animation =====
(function skillHover(){
  qsa('.skill').forEach((el) => {
    el.addEventListener('mouseenter', () => el.classList.add('hover'));
    el.addEventListener('mouseleave', () => el.classList.remove('hover'));
  });
  // Subtle floating animation for each skill icon
  qsa('.skill').forEach((el, i) => {
    gsap.to(el, {
      y: () => gsap.utils.random(-6, 6),
      x: () => gsap.utils.random(-4, 4),
      rotationY: () => gsap.utils.random(-8, 8),
      duration: () => gsap.utils.random(2, 4),
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: i * 0.08
    });
  });
})();

// ===== Footer year =====
byId('year').textContent = new Date().getFullYear();

// ===== Scroll progress & Cursor glow & Magnetic buttons =====
(function uiEnhancements(){
  const prog = byId('scrollProgress');
  const glow = byId('cursorGlow');
  const ctas = qsa('.btn');
  const backTop = byId('backTop');
  const header = document.querySelector('header.nav');

  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = Math.max(0, Math.min(100, (scrollTop / height) * 100));
    if (prog) prog.style.width = pct + '%';
    if (backTop){
      if (scrollTop > 600) backTop.classList.add('show');
      else backTop.classList.remove('show');
    }
    if (header){ header.classList.toggle('scrolled', scrollTop > 12); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  window.addEventListener('mousemove', (e) => {
    if (!glow) return;
    // light parallax on hero content
    const hero = byId('hero');
    if (hero){
      const rect = hero.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - .5;
      const cy = (e.clientY - rect.top) / rect.height - .5;
      gsap.to('.hero-content', { x: cx * 10, y: cy * 10, duration: .4, ease: 'sine.out' });
    }
    gsap.to(glow, { x: e.clientX, y: e.clientY, duration: .25, ease: 'sine.out' });
  });

  // Magnetic buttons (subtle)
  ctas.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: .2, ease: 'sine.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .3, ease: 'sine.out' }));
  });

  // Back to Top click
  if (backTop){
    backTop.addEventListener('click', () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) window.scrollTo(0, 0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

// ===== Active nav highlight =====
(function activeNav(){
  const sections = qsa('section[id]');
  const navLinks = qsa('header.nav nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;
  const byHref = (id) => navLinks.find(a => a.getAttribute('href') === `#${id}`);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting){
        navLinks.forEach(a => a.classList.remove('active'));
        const link = byHref(ent.target.id);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 });
  sections.forEach(s => io.observe(s));
})();
// ===== Three.js Background: Enhanced Hero Scene =====
(function heroScene(){
  const canvas = byId('bg');
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  // prettier tone mapping for glow
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000);
  camera.position.set(0.2, 0.1, 2.6);

  // Lights
  const hemi = new THREE.HemisphereLight(0xffffff, 0x202030, 0.6);
  scene.add(hemi);
  const point = new THREE.PointLight(0xffffff, 1, 10);
  point.position.set(2, 1, 2);
  scene.add(point);

  // Helpers for palette-aware colors
  const getColor = (cssVar) => new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '#7c3aed');
  let primaryC = getColor('--primary');
  let accentC = getColor('--accent');

  // Starfields (far + mid)
  function makeStars(count, size, color, spread){
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i=0; i<count; i++){
      pos[i*3] = (Math.random() - 0.5) * spread;
      pos[i*3+1] = (Math.random() - 0.5) * spread;
      pos[i*3+2] = (Math.random() - 0.5) * spread;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color, size, transparent:true, opacity:0.9, depthWrite:false });
    const points = new THREE.Points(geo, mat);
    return points;
  }
  const starsFar = makeStars(prefersReduce ? 800 : 1600, 0.015, 0xffffff, 80);
  const starsMid = makeStars(prefersReduce ? 400 : 900, 0.025, accentC.getHex(), 50);
  scene.add(starsFar, starsMid);

  // Floating instanced shapes
  const instCount = prefersReduce ? 28 : 72;
  const icoGeo = new THREE.IcosahedronGeometry(0.1, 0);
  const instMat = new THREE.MeshStandardMaterial({ color: primaryC, metalness: 0.2, roughness: 0.3, transparent:true, opacity:0.85 });
  const inst = new THREE.InstancedMesh(icoGeo, instMat, instCount);
  inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(inst);
  const dummy = new THREE.Object3D();
  const offsets = Array.from({ length: instCount }, () => ({
    p: new THREE.Vector3((Math.random()-0.5)*6, (Math.random()-0.5)*3, (Math.random()-0.5)*6),
    r: new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI),
    s: 0.3*Math.random()+0.08,
    t: Math.random()*Math.PI*2
  }));

  // Centerpiece: torus knot (mesh + wireframe)
  const tkGeo = new THREE.TorusKnotGeometry(0.55, 0.16, 140, 20);
  const tkMat = new THREE.MeshPhysicalMaterial({ color: accentC, emissive: accentC.clone().multiplyScalar(0.25), roughness: 0.2, metalness: 0.4, transparent:true, opacity:0.5 });
  const tkMesh = new THREE.Mesh(tkGeo, tkMat);
  tkMesh.position.z = -0.5;
  scene.add(tkMesh);
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(tkGeo), new THREE.LineBasicMaterial({ color: 0xffffff, opacity:0.15, transparent:true }));
  wire.position.copy(tkMesh.position);
  scene.add(wire);

  // Aurora shader backdrop
  const auroraGeo = new THREE.PlaneGeometry(12, 8, 1, 1);
  const auroraMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPrimary: { value: new THREE.Color(primaryC) },
      uAccent: { value: new THREE.Color(accentC) },
      uAlpha: { value: 0.65 }
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime; uniform vec3 uPrimary; uniform vec3 uAccent; uniform float uAlpha;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
      float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); float a=hash(i); float b=hash(i+vec2(1.0,0.0)); float c=hash(i+vec2(0.0,1.0)); float d=hash(i+vec2(1.0,1.0)); vec2 u=f*f*(3.0-2.0*f); return mix(a,b,u.x)+ (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y; }
      float fbm(vec2 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }
      void main(){
        vec2 uv = vUv;
        uv.y += 0.02 * sin(uv.x*10.0 + uTime*0.6);
        float n1 = fbm(uv*3.0 + vec2(0.0,uTime*0.05));
        float n2 = fbm(uv*1.2 + vec2(uTime*0.02, -uTime*0.03));
        vec3 col = mix(uPrimary, uAccent, smoothstep(0.2,0.8, n1));
        col *= 0.6 + 0.6*n2;
        // vignette
        float d = distance(uv, vec2(0.5));
        float vig = smoothstep(0.9, 0.3, d);
        col *= vig;
        gl_FragColor = vec4(col, uAlpha);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const aurora = new THREE.Mesh(auroraGeo, auroraMat);
  aurora.position.z = -1.2;
  scene.add(aurora);

  // Postprocessing: bloom
  const composer = new THREE.EffectComposer(renderer);
  const renderPass = new THREE.RenderPass(scene, camera);
  const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(1,1), prefersReduce ? 0.4 : 0.8, 0.4, 0.85);
  composer.addPass(renderPass);
  composer.addPass(bloomPass);

  // Respond to theme & palette changes
  const root = document.documentElement;
  const applyFog = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    scene.fog = isLight ? new THREE.Fog(0xf0f5ff, 10, 55) : null;
  };
  const updatePalette = () => {
    primaryC = getColor('--primary');
    accentC = getColor('--accent');
    inst.material.color = primaryC;
    tkMat.color = accentC; tkMat.emissive = accentC.clone().multiplyScalar(0.25); tkMat.needsUpdate = true;
  starsMid.material.color = accentC; starsMid.material.needsUpdate = true;
  auroraMat.uniforms.uPrimary.value = new THREE.Color(primaryC);
  auroraMat.uniforms.uAccent.value = new THREE.Color(accentC);
  };
  const mo = new MutationObserver(applyFog); mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] }); applyFog();
  window.addEventListener('palettechange', updatePalette);

  // Resize handling
  const resize = () => {
    const width = canvas.clientWidth; const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    composer.setSize(width, height);
    bloomPass.setSize(width, height);
  };
  window.addEventListener('resize', resize);
  resize();

  // Scroll-linked subtle camera parallax on hero section
  const camTarget = { z: camera.position.z, x: camera.position.x, y: camera.position.y };
  if (window.ScrollTrigger){
    ScrollTrigger.create({
      trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1,
      onUpdate: (self) => {
        const p = self.progress; // 0..1 within hero
        camTarget.z = 2.6 + p * 0.8;
        camTarget.y = 0.1 - p * 0.15;
      }
    });
  }

  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += prefersReduce ? 0.003 : 0.006;

    // Rotate centerpiece and wireframe
    tkMesh.rotation.y += 0.0025; tkMesh.rotation.x += 0.0009;
    wire.rotation.copy(tkMesh.rotation);

    // Move point light in a lazy circle
    point.position.x = Math.cos(t*0.6) * 2.2; point.position.y = Math.sin(t*0.4) * 1.2; point.position.z = Math.sin(t*0.5) * 1.8;

    // Starfield drift
    starsFar.rotation.y += 0.0004; starsMid.rotation.y -= 0.0006;

    // Update instanced shapes float
    offsets.forEach((o, i) => {
      const y = o.p.y + Math.sin(t + o.t) * 0.15;
      dummy.position.set(o.p.x, y, o.p.z);
      dummy.rotation.set(o.r.x + t*0.2, o.r.y + t*0.16, o.r.z + t*0.12);
      dummy.scale.setScalar(o.s);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;

    // Camera towards target
    camera.position.z += (camTarget.z - camera.position.z) * 0.08;
    camera.position.x += (camTarget.x - camera.position.x) * 0.08;
    camera.position.y += (camTarget.y - camera.position.y) * 0.08;
    camera.lookAt(0, 0, -0.2);

  auroraMat.uniforms.uTime.value = t;
  composer.render();
  }
  animate();
})();

// ===== Three.js Background for contact: subtle waves using points =====
(function contactWaves(){
  const canvas = byId('bg2');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000);
  camera.position.z = 3;

  const grid = 80; const sep = 0.12;
  const positions = [];
  for (let i=0; i<grid; i++){
    for (let j=0; j<grid; j++){
      positions.push((i - grid/2) * sep, (j - grid/2) * sep, 0);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0x88ccff, size: 0.015, transparent:true, opacity:0.6 });
  const mesh = new THREE.Points(geo, mat);
  scene.add(mesh);

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);
  resize();

  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.02;
    const pos = geo.attributes.position;
    for (let i=0; i<pos.count; i++){
      const x = pos.getX(i); const y = pos.getY(i);
      pos.setZ(i, Math.sin((x + t)) * 0.06 + Math.cos((y + t * 0.8)) * 0.06);
    }
    pos.needsUpdate = true;
    mesh.rotation.z += 0.0006;
    renderer.render(scene, camera);
  }
  animate();
})();

// ===== Form handler (placeholder) =====
(function form(){
  const form = qs('.contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = byId('name').value.trim();
    const email = byId('email').value.trim();
    const message = byId('message').value.trim();
    if (!name || !email || !message){
      alert('Please fill all fields.');
      return;
    }
    // You can wire this to a backend or service like EmailJS / Formspree
    alert('Thanks! Your message has been queued.');
    form.reset();
  });
})();

// ===== Helpers =====
function hexToRgba(hex, a){
  const m = hex.replace('#','');
  const bigint = parseInt(m.length===3? m.split('').map(c=>c+c).join('') : m, 16);
  const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// ===== Education counters =====
(function eduCounters(){
  const nums = qsa('.education .num[data-target]');
  if (!nums.length) return;
  const animateNum = (el) => {
    const target = parseFloat(el.getAttribute('data-target')) || 0;
    const isFloat = target % 1 !== 0;
    const dur = 1600;
    const start = performance.now();
    const step = (ts) => {
      const p = Math.min(1, (ts - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = isFloat ? val.toFixed(2) : Math.round(val);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? target.toFixed(2) : String(target);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(ent => {
      if (ent.isIntersecting){
        animateNum(ent.target);
        observer.unobserve(ent.target);
      }
    });
  }, { rootMargin: '0px 0px -20% 0px', threshold: 0.2 });
  nums.forEach(n => io.observe(n));
})();
