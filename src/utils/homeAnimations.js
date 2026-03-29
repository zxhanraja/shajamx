import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { 
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer, 
  BufferGeometry, 
  BufferAttribute, 
  PointsMaterial, 
  Points, 
  IcosahedronGeometry, 
  MeshBasicMaterial, 
  Mesh, 
  Raycaster, 
  Vector2, 
  Plane, 
  Vector3, 
  AdditiveBlending,
  SphereGeometry,
  TorusKnotGeometry
} from 'three';
import Lenis from '@studio-freight/lenis';

let heroRafId, aboutRafId, testimonialsRafId, whyUsRafId, servicesRafId;
let isHomeActive = false;
let homeCtx;
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

export function initHome() {
  if (isHomeActive) return;
  isHomeActive = true;
  
  // Ensure GSAP plugins are registered
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // Mobile-specific ScrollTrigger optimizations
  if (isMobile) {
    ScrollTrigger.normalizeScroll(true);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  homeCtx = gsap.context(() => {

  // Robust layout shift fixes for ScrollTrigger
  ScrollTrigger.refresh();
  const refreshOnLoad = () => ScrollTrigger.refresh();
  if (document.fonts) {
    document.fonts.ready.then(refreshOnLoad);
  }
  
  const pBar = ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      gsap.to(".scroll-progress", { width: `${self.progress * 100}%`, duration: 0, ease: "none" });
    }
  });

  // --- 3. PRELOADER & HERO ENTRANCE ---
  const preloader = document.getElementById("preloader");
  if (preloader) {
    const tlPreload = gsap.timeline({
      onComplete: () => {
        window.scrollTo(0, 0);
        if(window.lenis) window.lenis.scrollTo(0);
        initHeroAnimations();
        gsap.set(preloader, { display: "none" });
      }
    });

    const glitchText = document.getElementById("preloader-text");
    const colors = ["#c8ff00", "#ff3cac", "#00e5ff", "#f0f0f0"];
    let glitchInterval;

    if(glitchText) {
      tlPreload.to(glitchText, {
        text: "SHAJAMX",
        duration: 1,
        ease: "none",
        onStart: () => {
          glitchInterval = setInterval(() => {
            let chars = glitchText.innerText.split("");
            if(chars.length > 0) {
              glitchText.style.color = colors[Math.floor(Math.random() * colors.length)];
            }
          }, 100);
        },
        onComplete: () => {
          clearInterval(glitchInterval);
          glitchText.style.color = "#f0f0f0";
        }
      });
    }

    tlPreload.to("#preloader-bar", {
      width: "100%",
      duration: 2.5,
      ease: "power2.inOut"
    }, 0);

    tlPreload.to(".preloader-content", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    });

    tlPreload.to(".preloader-overlay", {
      scaleY: 0,
      transformOrigin: "center center",
      duration: 1,
      ease: "expo.out"
    });
  } else {
    initHeroAnimations();
  }

  function initHeroAnimations() {
    const heroSection = document.getElementById("hero");
    if(!heroSection) return;
    
    const tlHero = gsap.timeline();
    
    tlHero.to(".hero-line", {
      y: "0%",
      opacity: 1,
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.08
    });

    tlHero.to("#hero-mono", {
      text: "EST. 2026 / WEB AGENCY",
      duration: 1,
      ease: "none"
    }, "-=0.8");

    tlHero.to(".hero-accent-line", {
      scaleX: 1,
      duration: 1,
      ease: "power4.out"
    }, "-=0.8");

    tlHero.to(".hero-body-text", {
      opacity: 1,
      y: -20,
      duration: 1,
      ease: "power2.out"
    }, "-=0.6");

    gsap.to(".arrow-down", {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
      ease: "power1.inOut"
    });

    const heroContent = document.querySelector(".hero-content");
    const onHeroMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      gsap.to(heroContent, {
        x: -x,
        y: -y,
        duration: 1,
        ease: "power2.out"
      });
    };
    window.addEventListener("mousemove", onHeroMove);
    window._homeScrubbers = window._homeScrubbers || [];
    window._homeScrubbers.push(() => window.removeEventListener("mousemove", onHeroMove));
  }

  function observeCanvas(canvas, onVisibleChange) {
    if(!canvas) return;
    const observer = new IntersectionObserver((entries) => {
      onVisibleChange(entries[0].isIntersecting);
    }, { rootMargin: "100px" });
    observer.observe(canvas);
  }

  // --- HERO THREE.JS PARTICLES ---
  const heroCanvas = document.getElementById("hero-canvas");
  if (heroCanvas) {
    const heroScene = new Scene();
    const heroCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const heroRenderer = new WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });

    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = isMobile ? 600 : 3000;
    const particlesGeo = new BufferGeometry();
    const particlesPos = new Float32Array(particleCount * 3);
    const particlesBasePos = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i++) {
      const val = (Math.random() - 0.5) * 15;
      particlesPos[i] = val;
      particlesBasePos[i] = val;
    }

    particlesGeo.setAttribute("position", new BufferAttribute(particlesPos, 3));
    particlesGeo.setAttribute("basePosition", new BufferAttribute(particlesBasePos, 3));

    const particleMat = new PointsMaterial({
      size: 0.02,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.6,
      blending: AdditiveBlending
    });

    const particleMesh = new Points(particlesGeo, particleMat);
    heroScene.add(particleMesh);

    const icos = [];
    const icoGeo = new IcosahedronGeometry(Math.random() * 0.5 + 0.5, 0);
    const icoMat = new MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1 });

    for(let i=0; i<4; i++) {
      const ico = new Mesh(icoGeo, icoMat);
      ico.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5);
      ico.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      ico.userData = { rx: (Math.random() - 0.5) * 0.01, ry: (Math.random() - 0.5) * 0.01 };
      heroScene.add(ico);
      icos.push(ico);
    }

    heroCamera.position.z = 5;

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const onMouse = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouse);
    if(window._homeScrubbers) window._homeScrubbers.push(() => window.removeEventListener("mousemove", onMouse));

    const startTime = performance.now();
    let heroFrameCount = 0;
    let isHeroVisible = true;
    observeCanvas(heroCanvas, (v) => isHeroVisible = v);

    function animateHero() {
      heroRafId = requestAnimationFrame(animateHero);
      if (!isHeroVisible) return;
      heroFrameCount++;
      if (isMobile && heroFrameCount % 2 === 0) return;
      
      const time = (performance.now() - startTime) * 0.001;
      particleMesh.rotation.y = time * 0.05;
      particleMesh.rotation.x = time * 0.02;

      icos.forEach(ico => {
        ico.rotation.x += ico.userData.rx;
        ico.rotation.y += ico.userData.ry;
      });

      raycaster.setFromCamera(mouse, heroCamera);
      const intersectPlane = new Plane(new Vector3(0, 0, 1), 0);
      const intersectPoint = new Vector3();
      raycaster.ray.intersectPlane(intersectPlane, intersectPoint);

      const positions = particleMesh.geometry.attributes.position.array;
      const basePositions = particleMesh.geometry.attributes.basePosition.array;

      const localIntersect = intersectPoint.clone();
      particleMesh.worldToLocal(localIntersect);

      for(let i=0; i<particleCount; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        const px = positions[ix], py = positions[iy], pz = positions[iz];
        const bx = basePositions[ix], by = basePositions[iy], bz = basePositions[iz];

        const dx = px - localIntersect.x;
        const dy = py - localIntersect.y;
        const dz = pz - localIntersect.z;
        const distSq = dx*dx + dy*dy + dz*dz;

        if(distSq < 2.0) {
          const force = (2.0 - Math.sqrt(distSq)) * 0.05;
          positions[ix] += dx * force;
          positions[iy] += dy * force;
          positions[iz] += dz * force;
        } else {
          positions[ix] += (bx - px) * 0.05;
          positions[iy] += (by - py) * 0.05;
          positions[iz] += (bz - pz) * 0.05;
        }
      }
      
      particleMesh.geometry.attributes.position.needsUpdate = true;
      heroRenderer.render(heroScene, heroCamera);
    }
    animateHero();

    const onResize = () => {
      if(window.innerWidth > 768) {
        heroCamera.aspect = window.innerWidth / window.innerHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", onResize);
    if(window._homeScrubbers) window._homeScrubbers.push(() => window.removeEventListener("resize", onResize));
  }

  // --- MARQUEE ---
  gsap.to(".row-1 .marquee-inner", { xPercent: -50, ease: "none", duration: isMobile ? 30 : 10, repeat: -1 });
  gsap.to(".row-2 .marquee-inner", { xPercent: 50, ease: "none", duration: isMobile ? 30 : 12, repeat: -1, modifiers: { xPercent: gsap.utils.unitize(x => parseFloat(x) - 100) } });
  gsap.set(".row-2 .marquee-inner", { xPercent: -50 });

  // --- SERVICES STAGGER ---
  ScrollTrigger.create({
    trigger: "#services",
    start: isMobile ? "top 90%" : "top 60%",
    invalidateOnRefresh: true,
    once: true,
    onEnter: () => {
      gsap.to(".service-card", { x: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power2.out" });
    }
  });

  // --- WORK SECTION ---
  const workTrack = document.querySelector(".work-track");
  if (workTrack) {
    // On mobile, GSAP pin requires NO ancestor to have overflow:hidden
    // Remove it temporarily so the pinned translateX works without clipping
    if (isMobile) {
      const ancestors = [document.body, document.documentElement, document.getElementById("home-wrapper")];
      ancestors.forEach(el => {
        if (el) {
          el.style.overflowX = "visible";
        }
      });
    }

    const getScrollDist = () => {
      const trackW = workTrack.scrollWidth;
      const vw = window.innerWidth;
      // Add a little extra (one viewport width) so the last card fully slides in before unpinning
      return Math.max(trackW - vw, 0) + (isMobile ? vw * 0.2 : 0);
    };

    gsap.to(workTrack, {
      x: () => -(workTrack.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: "#work",
        pin: true,
        scrub: isMobile ? 0.5 : 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        start: "top top",
        end: () => "+=" + getScrollDist(),
        id: "work-pin",
        onLeaveBack: () => {
          // Restore on desktop when scrolled back past section
        }
      }
    });

    // On mobile: restore body overflow-x hidden AFTER ScrollTrigger sets up
    // (GSAP pins via position:fixed so overflow-x is safe after init)
    if (isMobile) {
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        document.body.style.overflowX = "hidden";
        if (document.documentElement) document.documentElement.style.overflowX = "hidden";
        const hw = document.getElementById("home-wrapper");
        if (hw) hw.style.overflowX = "";
      });
    }
  }

  // --- STATS ---
  ScrollTrigger.create({
    trigger: "#stats",
    start: isMobile ? "top 90%" : "top 80%",
    invalidateOnRefresh: true,
    onEnter: () => {
      document.querySelectorAll(".counter").forEach(counter => {
        const target = parseFloat(counter.getAttribute("data-target"));
        const isInteger = Number.isInteger(target);
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: isInteger ? 1 : 0.1 },
          onUpdate: function() {
            if(!isInteger) counter.innerHTML = parseFloat(counter.innerHTML).toFixed(1);
          }
        });
        gsap.to(counter.parentElement, { color: "#c8ff00", duration: 2, ease: "power2.out" });
      });
    },
    once: true
  });

  // --- ABOUT SECTION ---
  const aboutCanvas = document.getElementById("about-canvas");
  if (aboutCanvas) {
    const aboutScene = new Scene();
    const aboutCamera = new PerspectiveCamera(75, 1, 0.1, 100);
    const aboutRenderer = new WebGLRenderer({ canvas: aboutCanvas, alpha: true, antialias: true });
    aboutRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const aboutLeft = document.querySelector(".about-left");
    function resizeAbout() {
      if(!aboutLeft) return;
      const rect = aboutLeft.getBoundingClientRect();
      aboutRenderer.setSize(rect.width, rect.height);
      aboutCamera.aspect = rect.width / rect.height;
      aboutCamera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resizeAbout);
    if(window._homeScrubbers) window._homeScrubbers.push(() => window.removeEventListener("resize", resizeAbout));
    resizeAbout();

    let geoSphere = new SphereGeometry(2, 32, 32);
    let geoTorus = new TorusKnotGeometry(1.5, 0.4, 100, 16);
    const matWire = new MeshBasicMaterial({ color: 0xc8ff00, wireframe: true, transparent: true, opacity: 0 });

    const meshSphere = new Mesh(geoSphere, matWire.clone());
    const meshTorus = new Mesh(geoTorus, matWire.clone());
    meshSphere.material.opacity = 1;
    meshTorus.material.opacity = 0;

    aboutScene.add(meshSphere);
    aboutScene.add(meshTorus);
    aboutCamera.position.z = 5;

    ScrollTrigger.create({
      trigger: "#about",
      start: "top 60%",
      end: "bottom 40%",
      scrub: true,
      onUpdate: (self) => {
        meshSphere.material.opacity = 1 - self.progress;
        meshTorus.material.opacity = self.progress;
        meshSphere.scale.setScalar(1 + self.progress * 0.5);
        meshTorus.scale.setScalar(0.5 + self.progress * 0.5);
      }
    });

    ScrollTrigger.create({
      trigger: "#about",
      start: "top 50%",
      onEnter: () => {
        gsap.to(".about-bracket", { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(".about-line", { y: "0%", duration: 1, stagger: 0.1, ease: "expo.out", delay: 0.2 });
      }
    });

    let isAboutVisible = false;
    observeCanvas(aboutCanvas, (v) => isAboutVisible = v);

    function animateAbout() {
      aboutRafId = requestAnimationFrame(animateAbout);
      if (!isAboutVisible) return;
      meshSphere.rotation.x += 0.005;
      meshSphere.rotation.y += 0.005;
      meshTorus.rotation.x += 0.005;
      meshTorus.rotation.y += 0.008;
      aboutRenderer.render(aboutScene, aboutCamera);
    }
    animateAbout();
  }

  // --- TESTIMONIALS ---
  const testimonialsCanvas = document.getElementById("testimonials-canvas");
  if (testimonialsCanvas) {
    const tScene = new Scene();
    const tCamera = new PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
    const tRenderer = new WebGLRenderer({ canvas: testimonialsCanvas, alpha: true, antialias: true });
    tRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    tRenderer.setSize(window.innerWidth, 500);
    tCamera.position.z = 10;

    const geo = new SphereGeometry(12, 40, 40);
    const mat = new PointsMaterial({ color: 0x00e5ff, size: 0.08, transparent: true, opacity: 0.4 });
    const points = new Points(geo, mat);
    tScene.add(points);

    let isTestimonialsVisible = false;
    observeCanvas(testimonialsCanvas, (v) => isTestimonialsVisible = v);

    function animateTestimonials() {
      testimonialsRafId = requestAnimationFrame(animateTestimonials);
      if (!isTestimonialsVisible) return;
      points.rotation.y += 0.0015;
      points.rotation.x += 0.0008;
      tRenderer.render(tScene, tCamera);
    }
    animateTestimonials();

    const tResize = () => {
      const tRect = document.getElementById("testimonials").getBoundingClientRect();
      tCamera.aspect = window.innerWidth / tRect.height;
      tCamera.updateProjectionMatrix();
      tRenderer.setSize(window.innerWidth, tRect.height);
    };
    window.addEventListener("resize", tResize);
    if(window._homeScrubbers) window._homeScrubbers.push(() => window.removeEventListener("resize", tResize));
  }

  const testGrid = document.querySelector(".testimonials-grid");
  if (testGrid && isMobile) {
    const getTestScrollDist = () => {
      const tw = testGrid.scrollWidth;
      const vw = window.innerWidth;
      return Math.max(tw - vw, 0) + vw * 0.2;
    };

    gsap.to(testGrid, {
      x: () => -(testGrid.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: "#testimonials",
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        start: "top top",
        end: () => "+=" + getTestScrollDist(),
        id: "test-pin"
      }
    });

    // Restore body overflow after pin setup
    requestAnimationFrame(() => {
      document.body.style.overflowX = "hidden";
    });
  } else {
    ScrollTrigger.create({
      trigger: "#testimonials",
      start: "top 70%",
      invalidateOnRefresh: true,
      once: true,
      onEnter: () => {
        gsap.to(".testimonial-card", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: { each: 0.15, from: "start" },
          ease: "expo.out"
        });
      }
    });
  }


  ScrollTrigger.create({
    trigger: "#contact",
    start: isMobile ? "top 90%" : "top 60%",
    invalidateOnRefresh: true,
    once: true,
    onEnter: () => gsap.to(".contact-h2", { y: 0, opacity: 1, duration: 1, ease: "expo.out" })
  });

  const magnets = document.querySelectorAll('.social-icon');
  magnets.forEach((el) => {
      const move = (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
      if(window._homeScrubbers) {
        window._homeScrubbers.push(() => el.removeEventListener('mousemove', move));
        window._homeScrubbers.push(() => el.removeEventListener('mouseleave', leave));
      }
  });

  // --- WHY US ---
  const whyUsCanvas = document.getElementById("why-us-canvas");
  if (whyUsCanvas) {
    const whyUsScene = new Scene();
    const whyUsCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const whyUsRenderer = new WebGLRenderer({ canvas: whyUsCanvas, alpha: true, antialias: true });
    whyUsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    whyUsRenderer.setSize(window.innerWidth, window.innerHeight);
    whyUsCamera.position.z = 8;

    const tornadoGeo = new TorusKnotGeometry(10, 3, 64, 8);
    const tornadoMat = new MeshBasicMaterial({ color: 0xff3cac, wireframe: true, transparent: true, opacity: 0.05 });
    const tornado = new Mesh(tornadoGeo, tornadoMat);
    whyUsScene.add(tornado);

    let isWhyUsVisible = false;
    observeCanvas(whyUsCanvas, (v) => isWhyUsVisible = v);

    function animateWhyUs() {
      whyUsRafId = requestAnimationFrame(animateWhyUs);
      if (!isWhyUsVisible) return;
      tornado.rotation.y += 0.002;
      tornado.rotation.x += 0.001;
      whyUsRenderer.render(whyUsScene, whyUsCamera);
    }
    animateWhyUs();

    const wResize = () => {
      whyUsCamera.aspect = window.innerWidth / window.innerHeight;
      whyUsCamera.updateProjectionMatrix();
      whyUsRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", wResize);
    if(window._homeScrubbers) window._homeScrubbers.push(() => window.removeEventListener("resize", wResize));
  }

  ScrollTrigger.create({
    trigger: "#why-us",
    start: isMobile ? "top 90%" : "top 70%",
    invalidateOnRefresh: true,
    once: true,
    onEnter: () => {
      gsap.to("#why-us .section-title", { duration: 1.5, text: { value: "SHAJAMX VS. THE OTHERS", delimiter: "" }, ease: "none" });
      gsap.from("#why-us .comp-header, #why-us .comp-cell", { y: 40, opacity: 0, duration: 0.8, stagger: { each: 0.05, from: "start", grid: "auto" }, ease: "power3.out" });
    }
  });

  // --- SERVICES THREE.JS ---
  const servicesCanvas = document.getElementById("services-canvas");
  if (servicesCanvas) {
    const sScene = new Scene();
    const sCamera = new PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
    const sRenderer = new WebGLRenderer({ canvas: servicesCanvas, alpha: true, antialias: true });
    sRenderer.setSize(window.innerWidth, 400); sCamera.position.z = 5;

    const geo = new TorusKnotGeometry(10, 3, 100, 16);
    const mat = new MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.1 });
    const knot = new Mesh(geo, mat);
    knot.scale.set(0.15, 0.15, 0.15);
    sScene.add(knot);

    let isServicesVisible = false;
    observeCanvas(servicesCanvas, (v) => isServicesVisible = v);

    function animateServices() {
      servicesRafId = requestAnimationFrame(animateServices);
      if (!isServicesVisible) return;
      knot.rotation.x += 0.01; knot.rotation.y += 0.01;
      sRenderer.render(sScene, sCamera);
    }
    animateServices();

    const sResize = () => {
      sCamera.aspect = window.innerWidth / 400; sCamera.updateProjectionMatrix();
      sRenderer.setSize(window.innerWidth, 400);
    };
    window.addEventListener("resize", sResize);
    if(window._homeScrubbers) window._homeScrubbers.push(() => window.removeEventListener("resize", sResize));
  }

  // --- COMPARISON SECTION ANIMATION ---
  const compRows = gsap.utils.toArray('.comp-row');
  if (compRows.length > 0) {
    gsap.to(compRows, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.comparison-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // Pop effect for check icons
    const checks = gsap.utils.toArray('.check-icon');
    checks.forEach(check => {
      gsap.fromTo(check, 
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: check,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  // --- USP SECTION ANIMATIONS ---
  const uspCards = gsap.utils.toArray('.usp-card');
  if (uspCards.length > 0) {
    gsap.fromTo(uspCards, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.usp-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  }); // End of homeCtx

  // Global refresh after setting up everything
  ScrollTrigger.refresh();
}

export function cleanupHome() {
  isHomeActive = false;
  
  // Safely kill only the triggers initialized by home animations
  if (homeCtx) {
    homeCtx.revert();
  }

  cancelAnimationFrame(heroRafId);
  cancelAnimationFrame(aboutRafId);
  cancelAnimationFrame(testimonialsRafId);
  cancelAnimationFrame(whyUsRafId);
  cancelAnimationFrame(servicesRafId);
  
  if (window._homeScrubbers) {
    window._homeScrubbers.forEach(fn => fn());
    window._homeScrubbers = [];
  }
}
