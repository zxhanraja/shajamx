import React, { useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useTransition } from '../context/TransitionContext.jsx';

export default function Footer() {
  const { navigateTo } = useTransition();

  const handleLinkClick = (e, to) => {
    e.preventDefault();
    if(navigateTo) navigateTo(to);
  };

  // Always make footer nav links visible (GSAP only runs home-page animation)
  useEffect(() => {
    gsap.to([
      '.footer-logo', '.footer-tagline', '.footer-desc',
      '.footer-link', '.footer-bottom > div',
      '.footer-nav-heading'
    ], { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.3, stagger: 0.03 });
  }, []);

  // Keep the Three.js loop for footer isolated strictly here
  useEffect(() => {
    const footerCanvas = document.getElementById("footer-canvas");
    let fRafId;
    let isFooterVisible = false;

    if (footerCanvas) {
      const fScene = new THREE.Scene();
      const fCamera = new THREE.PerspectiveCamera(75, window.innerWidth / 300, 0.1, 1000);
      const fRenderer = new THREE.WebGLRenderer({ canvas: footerCanvas, alpha: true, antialias: true });
      fRenderer.setSize(window.innerWidth, 300);
      fCamera.position.z = 5;

      const pCount = 400;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);

      for(let i=0; i<pCount; i++) {
        pPos[i*3] = (Math.random() - 0.5) * 20;
        pPos[i*3+1] = (Math.random() - 0.5) * 5;
        pPos[i*3+2] = (Math.random() - 0.5) * 10;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({ color: 0xff3cac, size: 0.05, transparent: true, opacity: 0.5 });
      const pMesh = new THREE.Points(pGeo, pMat);
      fScene.add(pMesh);

      const observer = new IntersectionObserver((entries) => {
        isFooterVisible = entries[0].isIntersecting;
      }, { rootMargin: "50px" });
      observer.observe(footerCanvas);

      function animateFooter() {
        fRafId = requestAnimationFrame(animateFooter);
        if(!isFooterVisible) return;
        
        pMesh.rotation.x += 0.002;
        pMesh.rotation.y += 0.003;
        fRenderer.render(fScene, fCamera);
      }
      animateFooter();

      const onResize = () => {
        fCamera.aspect = window.innerWidth / 300;
        fCamera.updateProjectionMatrix();
        fRenderer.setSize(window.innerWidth, 300);
      };
      window.addEventListener("resize", onResize);

      return () => {
        observer.disconnect();
        cancelAnimationFrame(fRafId);
        window.removeEventListener("resize", onResize);
        fRenderer.dispose();
      };
    }
  }, []);

  return (
    <footer id="footer" itemScope itemType="https://schema.org/WPFooter">
      <canvas id="footer-canvas"></canvas>

      {/* MAIN FOOTER TOP */}
      <div className="footer-top">
        <div className="footer-left">
          <div className="footer-logo" itemProp="name">SHAJAMX</div>
          <div className="footer-tagline">Where Code Meets Craft</div>
          <p className="footer-desc">
            A premium digital agency building high-performance websites,
            immersive UI/UX experiences, and scalable web applications
            using React, GSAP, and Three.js.
          </p>
        </div>
        <div className="footer-right">
          <nav className="footer-nav-col" aria-label="Footer Pages">
            <div className="footer-nav-heading">Pages</div>
            <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="footer-link" aria-label="Go to Home">Home</a>
            <a href="/services" onClick={(e) => handleLinkClick(e, '/services')} className="footer-link" aria-label="Go to Services">Services</a>
            <a href="/work" onClick={(e) => handleLinkClick(e, '/work')} className="footer-link" aria-label="Go to Our Work">Our Work</a>
            <a href="/about" onClick={(e) => handleLinkClick(e, '/about')} className="footer-link" aria-label="Go to About Us">About Us</a>
            <a href="/why-us" onClick={(e) => handleLinkClick(e, '/why-us')} className="footer-link" aria-label="Go to Why ShajamX">Why ShajamX</a>
          </nav>
          <nav className="footer-nav-col" aria-label="Footer Services">
            <div className="footer-nav-heading">Services</div>
            <a href="/services" onClick={(e) => handleLinkClick(e, '/services')} className="footer-link" aria-label="Service: Web Development">Web Development</a>
            <a href="/services" onClick={(e) => handleLinkClick(e, '/services')} className="footer-link" aria-label="Service: UI/UX Design">UI/UX Design</a>
            <a href="/services" onClick={(e) => handleLinkClick(e, '/services')} className="footer-link" aria-label="Service: React Development">React Development</a>
            <a href="/services" onClick={(e) => handleLinkClick(e, '/services')} className="footer-link" aria-label="Service: GSAP Animation">GSAP Animation</a>
            <a href="/services" onClick={(e) => handleLinkClick(e, '/services')} className="footer-link" aria-label="Service: Three.js 3D Web">Three.js 3D Web</a>
          </nav>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <div className="copyright">&copy; 2026 ShajamX Agency. All rights reserved.</div>
        <div className="built-with">Built with Love + GSAP + Three.js + React Router</div>
      </div>

      {/* TICKER */}
      <div className="footer-ticker-container">
        <div className="footer-ticker-track">
          <div className="footer-ticker-inner">
            WEB DEVELOPMENT &middot; UI/UX DESIGN &middot; REACT APPS &middot; GSAP ANIMATION &middot; THREE.JS 3D &middot; SEO OPTIMIZED &middot; DIGITAL AGENCY &middot; FRONTEND EXPERTS &middot; WEB DEVELOPMENT &middot; UI/UX DESIGN &middot; REACT APPS &middot; GSAP ANIMATION &middot; THREE.JS 3D &middot; SEO OPTIMIZED &middot; DIGITAL AGENCY &middot; FRONTEND EXPERTS &middot;
          </div>
          <div className="footer-ticker-inner">
            WEB DEVELOPMENT &middot; UI/UX DESIGN &middot; REACT APPS &middot; GSAP ANIMATION &middot; THREE.JS 3D &middot; SEO OPTIMIZED &middot; DIGITAL AGENCY &middot; FRONTEND EXPERTS &middot; WEB DEVELOPMENT &middot; UI/UX DESIGN &middot; REACT APPS &middot; GSAP ANIMATION &middot; THREE.JS 3D &middot; SEO OPTIMIZED &middot; DIGITAL AGENCY &middot; FRONTEND EXPERTS &middot;
          </div>
        </div>
      </div>
    </footer>
  );
}
