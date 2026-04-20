import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from 'lenis';

// Dynamic import placeholders for THREE
let THREE_CORE = null;
async function loadThree() {
  if (!THREE_CORE) {
    THREE_CORE = await import('three');
  }
  return THREE_CORE;
}

export function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader || preloader.style.display === "none") return;

  const tlPreload = gsap.timeline({
    onComplete: () => {
      window.scrollTo(0, 0);
      if (window.lenis) window.lenis.scrollTo(0);

      // Look for hero lines to animate in after preloader
      const heroLines = document.querySelectorAll(".hero-line");
      if (heroLines.length > 0) {
        gsap.to(heroLines, {
          y: "0%",
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.08
        });
      }

      gsap.set(preloader, { display: "none" });
    }
  });

  const glitchText = document.getElementById("preloader-text");
  const colors = ["#c8ff00", "#ff3cac", "#00e5ff", "#f0f0f0"];
  let glitchInterval;

  if (glitchText) {
    tlPreload.to(glitchText, {
      text: "SHAJAMX",
      duration: 1,
      ease: "none",
      onStart: () => {
        glitchInterval = setInterval(() => {
          let chars = glitchText.innerText.split("");
          if (chars.length > 0) {
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
}

let isMobile = false;
if (typeof window !== 'undefined') {
  isMobile = window.innerWidth <= 768;
}

export async function initHome() {
  // Ensure GSAP plugins are registered
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // Batch DOM reads for layout to prevent forced reflows
  let winW = window.innerWidth;
  let winH = window.innerHeight;
  let dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.2);

  // Mobile-specific ScrollTrigger optimizations
  if (isMobile) {
    ScrollTrigger.normalizeScroll(true);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  const state = {
    rafs: {
      hero: null,
      about: null,
      testimonials: null,
      whyUs: null,
      services: null
    },
    context: null,
    listeners: []
  };

  // Pre-load Three.js for immersive sections
  const THREE = await loadThree();

  state.context = gsap.context(() => {

    // Robust layout shift fixes for ScrollTrigger
    // Delay refresh to allow DOM to settle
    const refreshOnLoad = () => ScrollTrigger.refresh();
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(refreshOnLoad, 100);
      });
    }

    const pBar = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        // Use gsap.set for instant updates to avoid layout thrashing in scrubbed animations
        gsap.set(".scroll-progress", { width: `${self.progress * 100}%` });
      }
    });


    function initHeroAnimations() {
      const heroSection = document.getElementById("hero");
      if (!heroSection) return;

      // Ensure we have the target elements
      const lines = document.querySelectorAll(".hero-line");
      if (lines.length === 0) {
        // Small fallback for rapid navigation/mounting
        requestAnimationFrame(initHeroAnimations);
        return;
      }

      const tlHero = gsap.timeline();

      tlHero.to(".hero-line", {
        y: "0%",
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.08
      });

      tlHero.to("#hero-mono", {
        text: "",
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
        if (isMobile) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(heroContent, {
          x: -x,
          y: -y,
          duration: 1,
          ease: "power2.out"
        });
      };
      window.addEventListener("mousemove", onHeroMove);
      state.listeners.push(() => window.removeEventListener("mousemove", onHeroMove));
    }

    initHeroAnimations();

    function observeCanvas(canvas, onVisibleChange) {
      if (!canvas) return;
      const observer = new IntersectionObserver((entries) => {
        onVisibleChange(entries[0].isIntersecting);
      }, { rootMargin: "100px" });
      observer.observe(canvas);
    }

    // --- HERO THREE.JS PARTICLES ---
    const heroCanvas = document.getElementById("hero-canvas");
    if (heroCanvas) {
      const heroScene = new THREE.Scene();
      const heroCamera = new THREE.PerspectiveCamera(75, winW / winH, 0.1, 1000);
      const heroRenderer = new THREE.WebGLRenderer({
        canvas: heroCanvas,
        alpha: true,
        antialias: dpr === 1 // Disable antialias on HiDPI for massive GPU gains
      });

      heroRenderer.setSize(winW, winH);
      heroRenderer.setPixelRatio(dpr);

      const particleCount = isMobile ? 400 : 1500;
      const particlesGeo = new THREE.BufferGeometry();
      const particlesPos = new Float32Array(particleCount * 3);
      const particlesBasePos = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i++) {
        const val = (Math.random() - 0.5) * 15;
        particlesPos[i] = val;
        particlesBasePos[i] = val;
      }

      particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlesPos, 3));
      particlesGeo.setAttribute("basePosition", new THREE.BufferAttribute(particlesBasePos, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });

      const particleMesh = new THREE.Points(particlesGeo, particleMat);
      heroScene.add(particleMesh);

      const icos = [];
      const icoGeo = new THREE.IcosahedronGeometry(Math.random() * 0.5 + 0.5, 0);
      const icoMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1 });

      for (let i = 0; i < 4; i++) {
        const ico = new THREE.Mesh(icoGeo, icoMat);
        ico.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5);
        ico.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        ico.userData = { rx: (Math.random() - 0.5) * 0.01, ry: (Math.random() - 0.5) * 0.01 };
        heroScene.add(ico);
        icos.push(ico);
      }

      heroCamera.position.z = 5;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onMouse = (event) => {
        mouse.x = (event.clientX / winW) * 2 - 1;
        mouse.y = -(event.clientY / winH) * 2 + 1;
      };
      window.addEventListener("mousemove", onMouse);
      state.listeners.push(() => window.removeEventListener("mousemove", onMouse));

      const startTime = performance.now();
      let heroFrameCount = 0;
      let isHeroVisible = true;
      observeCanvas(heroCanvas, (v) => isHeroVisible = v);

      function animateHero() {
        state.rafs.hero = requestAnimationFrame(animateHero);
        if (!isHeroVisible) return;
        heroFrameCount++;
        const time = (performance.now() - startTime) * 0.001;
        particleMesh.rotation.y = time * 0.05;
        particleMesh.rotation.x = time * 0.02;

        icos.forEach(ico => {
          ico.rotation.x += ico.userData.rx;
          ico.rotation.y += ico.userData.ry;
        });

        // Skip intensive CPU raycasting and math loops on mobile device for buttery performance
        if (!isMobile) {
          raycaster.setFromCamera(mouse, heroCamera);
          const intersectPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
          const intersectPoint = new THREE.Vector3();
          raycaster.ray.intersectPlane(intersectPlane, intersectPoint);

          const positions = particleMesh.geometry.attributes.position.array;
          const basePositions = particleMesh.geometry.attributes.basePosition.array;

          const localIntersect = intersectPoint.clone();
          particleMesh.worldToLocal(localIntersect);

          for (let i = 0; i < particleCount; i++) {
            const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;

            const dx = positions[ix] - localIntersect.x;
            const dy = positions[iy] - localIntersect.y;
            const dz = positions[iz] - localIntersect.z;
            const d2 = dx * dx + dy * dy + dz * dz;

            if (d2 < 2.0) {
              const force = (2.0 - d2) * 0.02;
              positions[ix] += dx * force;
              positions[iy] += dy * force;
              positions[iz] += dz * force;
            } else {
              positions[ix] += (basePositions[ix] - positions[ix]) * 0.08;
              positions[iy] += (basePositions[iy] - positions[iy]) * 0.08;
              positions[iz] += (basePositions[iz] - positions[iz]) * 0.08;
            }
          }

          particleMesh.geometry.attributes.position.needsUpdate = true;
        }
        heroRenderer.render(heroScene, heroCamera);
      }
      animateHero();

      const onResize = () => {
        winW = window.innerWidth;
        winH = window.innerHeight;
        if (winW > 768) {
          heroCamera.aspect = winW / winH;
          heroCamera.updateProjectionMatrix();
          heroRenderer.setSize(winW, winH);
        }
      };
      window.addEventListener("resize", onResize);
      state.listeners.push(() => window.removeEventListener("resize", onResize));
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
            onUpdate: function () {
              if (!isInteger) counter.innerHTML = parseFloat(counter.innerHTML).toFixed(1);
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
      const aboutScene = new THREE.Scene();
      const aboutCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
      const aboutRenderer = new THREE.WebGLRenderer({
        canvas: aboutCanvas,
        alpha: true,
        antialias: dpr === 1
      });
      aboutRenderer.setPixelRatio(Math.min(dpr, 1.2));

      const aboutLeft = document.querySelector(".about-left");
      let aboutRect = aboutLeft ? { width: aboutLeft.offsetWidth, height: aboutLeft.offsetHeight } : { width: 0, height: 0 };
      
      function resizeAbout() {
        if (!aboutLeft) return;
        // Batch read
        const w = aboutLeft.offsetWidth;
        const h = aboutLeft.offsetHeight;
        aboutRenderer.setSize(w, h);
        aboutCamera.aspect = w / h;
        aboutCamera.updateProjectionMatrix();
        aboutRect = { width: w, height: h };
      }
      window.addEventListener("resize", resizeAbout);
      state.listeners.push(() => window.removeEventListener("resize", resizeAbout));
      
      // Initial sizing
      if (aboutLeft) {
        aboutRenderer.setSize(aboutRect.width, aboutRect.height);
        aboutCamera.aspect = aboutRect.width / aboutRect.height;
        aboutCamera.updateProjectionMatrix();
      }

      let geoSphere = new THREE.SphereGeometry(2, 32, 32);
      let geoTorus = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
      const matWire = new THREE.MeshBasicMaterial({ color: 0xc8ff00, wireframe: true, transparent: true, opacity: 0 });

      const meshSphere = new THREE.Mesh(geoSphere, matWire.clone());
      const meshTorus = new THREE.Mesh(geoTorus, matWire.clone());
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
          gsap.set(".about-bracket", { opacity: 1 }); // Use set for simple entry
          gsap.to(".about-line", { y: "0%", duration: 1, stagger: 0.1, ease: "expo.out", delay: 0.2 });
        }
      });

      let isAboutVisible = false;
      observeCanvas(aboutCanvas, (v) => isAboutVisible = v);

      function animateAbout() {
        state.rafs.about = requestAnimationFrame(animateAbout);
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
      const tScene = new THREE.Scene();
      const tCamera = new THREE.PerspectiveCamera(75, winW / 500, 0.1, 1000);
      const tRenderer = new THREE.WebGLRenderer({
        canvas: testimonialsCanvas,
        alpha: true,
        antialias: dpr === 1
      });
      tRenderer.setPixelRatio(Math.min(dpr, 1.2));
      tRenderer.setSize(winW, 500);
      tCamera.position.z = 10;

      const geo = new THREE.SphereGeometry(12, 40, 40);
      const mat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.08, transparent: true, opacity: 0.4 });
      const points = new THREE.Points(geo, mat);
      tScene.add(points);

      let isTestimonialsVisible = false;
      observeCanvas(testimonialsCanvas, (v) => isTestimonialsVisible = v);

      function animateTestimonials() {
        state.rafs.testimonials = requestAnimationFrame(animateTestimonials);
        if (!isTestimonialsVisible) return;
        points.rotation.y += 0.0015;
        points.rotation.x += 0.0008;
        tRenderer.render(tScene, tCamera);
      }
      animateTestimonials();

      const tResize = () => {
        const tRect = document.getElementById("testimonials").getBoundingClientRect();
        tCamera.aspect = winW / tRect.height;
        tCamera.updateProjectionMatrix();
        tRenderer.setSize(winW, tRect.height);
      };
      window.addEventListener("resize", tResize);
      state.listeners.push(() => window.removeEventListener("resize", tResize));
    }

    const testGrid = document.querySelector(".testimonials-grid");
    if (testGrid && isMobile) {
      const getTestScrollDist = () => {
        const tw = testGrid.scrollWidth;
        const vw = winW;
        return Math.max(tw - vw, 0) + vw * 0.2;
      };

      gsap.to(testGrid, {
        x: () => -(testGrid.scrollWidth - winW),
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
      state.listeners.push(() => el.removeEventListener('mousemove', move));
      state.listeners.push(() => el.removeEventListener('mouseleave', leave));
    });

    // --- WHY US ---
    const whyUsCanvas = document.getElementById("why-us-canvas");
    if (whyUsCanvas) {
      const whyUsScene = new THREE.Scene();
      const whyUsCamera = new THREE.PerspectiveCamera(75, winW / winH, 0.1, 1000);
      const whyUsRenderer = new THREE.WebGLRenderer({
        canvas: whyUsCanvas,
        alpha: true,
        antialias: dpr === 1
      });
      whyUsRenderer.setPixelRatio(Math.min(dpr, 1.2));

      whyUsRenderer.setSize(winW, winH);
      whyUsCamera.position.z = 8;

      const tornadoGeo = new THREE.TorusKnotGeometry(10, 3, 64, 8);
      const tornadoMat = new THREE.MeshBasicMaterial({ color: 0xff3cac, wireframe: true, transparent: true, opacity: 0.05 });
      const tornado = new THREE.Mesh(tornadoGeo, tornadoMat);
      whyUsScene.add(tornado);

      let isWhyUsVisible = false;
      observeCanvas(whyUsCanvas, (v) => isWhyUsVisible = v);

      function animateWhyUs() {
        state.rafs.whyUs = requestAnimationFrame(animateWhyUs);
        if (!isWhyUsVisible) return;
        tornado.rotation.y += 0.002;
        tornado.rotation.x += 0.001;
        whyUsRenderer.render(whyUsScene, whyUsCamera);
      }
      animateWhyUs();

      const wResize = () => {
        whyUsCamera.aspect = winW / winH;
        whyUsCamera.updateProjectionMatrix();
        whyUsRenderer.setSize(winW, winH);
      };
      window.addEventListener("resize", wResize);
      state.listeners.push(() => window.removeEventListener("resize", wResize));
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
      const sScene = new THREE.Scene();
      const sCamera = new THREE.PerspectiveCamera(75, winW / 400, 0.1, 1000);
      const sRenderer = new THREE.WebGLRenderer({ canvas: servicesCanvas, alpha: true, antialias: true });
      sRenderer.setSize(winW, 400); sCamera.position.z = 5;

      const geo = new THREE.TorusKnotGeometry(10, 3, 100, 16);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.1 });
      const knot = new THREE.Mesh(geo, mat);
      knot.scale.set(0.15, 0.15, 0.15);
      sScene.add(knot);

      let isServicesVisible = false;
      observeCanvas(servicesCanvas, (v) => isServicesVisible = v);

      function animateServices() {
        state.rafs.services = requestAnimationFrame(animateServices);
        if (!isServicesVisible) return;
        knot.rotation.x += 0.01; knot.rotation.y += 0.01;
        sRenderer.render(sScene, sCamera);
      }
      animateServices();

      const sResize = () => {
        sCamera.aspect = winW / 400; sCamera.updateProjectionMatrix();
        sRenderer.setSize(winW, 400);
      };
      window.addEventListener("resize", sResize);
      state.listeners.push(() => window.removeEventListener("resize", sResize));
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

  }); // End of state.context

  // Global refresh after setting up everything
  ScrollTrigger.refresh();

  return state;
}

export function cleanupHome(state) {
  if (!state) return;

  // Safely kill only the triggers initialized by home animations
  if (state.context) {
    state.context.revert();
  }

  if (state.rafs) {
    cancelAnimationFrame(state.rafs.hero);
    cancelAnimationFrame(state.rafs.about);
    cancelAnimationFrame(state.rafs.testimonials);
    cancelAnimationFrame(state.rafs.whyUs);
    cancelAnimationFrame(state.rafs.services);
  }

  if (state.listeners) {
    state.listeners.forEach(fn => fn());
  }
}
