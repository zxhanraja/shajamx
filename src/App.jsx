import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionProvider } from './context/TransitionContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ContactModal from './components/ContactModal.jsx';

// Lazy load page components for better performance (splitting heavy Three.js/GSAP per page)
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Work = lazy(() => import('./pages/Work.jsx'));
const WhyUs = lazy(() => import('./pages/WhyUs.jsx'));

// Minimal fallback loader
const PageLoader = () => (
  <div className="page-loader-mini">
    <div className="loader-bar"></div>
  </div>
);

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Draggable } from 'gsap/Draggable';
import Lenis from '@studio-freight/lenis';
gsap.registerPlugin(ScrollTrigger, TextPlugin, Draggable);

// Initialize Global Tools exactly once
function GlobalSetup() {
  const location = useLocation();

  useEffect(() => {
    // Route change reset and GSAP recalculation
    // This fixes the blank space issue where animations fail to trigger because GSAP doesn't know the new layout
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Let DOM paint then refresh scroll triggers
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    // Initialize Global Lenis Smooth Scroll with MAX BUTTERY settings
    if (!window.lenis) {
      const lenis = new Lenis({
        lerp: 0.04, // Extremely low linear interpolation for super buttery inertia
        smoothWheel: true,
        wheelMultiplier: 0.9, // Slightly reduced scroll speed per wheel notch
        touchMultiplier: 1.5,
      });
      window.lenis = lenis;

      // Sync Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // Custom Cursor Lerp Loop
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorRing = document.querySelector(".cursor-ring");
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouchDevice) {
        const onMouseMove = (e) => {
            if (window.innerWidth <= 1024) return;
            mouseX = e.clientX;
            mouseY = e.clientY;
            gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.15, ease: "power2.out" });
        };
        window.addEventListener("mousemove", onMouseMove);
        
        gsap.ticker.add(() => {
            if (window.innerWidth <= 1024) return;
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            gsap.set(cursorRing, { x: ringX, y: ringY });
        });
        
        const onMouseDown = () => cursorRing.classList.add("cursor-squish");
        const onMouseUp = () => cursorRing.classList.remove("cursor-squish");
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        
        // Event delegation for cursor hover since DOM swaps
        const onMouseOver = (e) => {
            if(e.target.closest('a, button, .service-card, .work-card, input, textarea, .nav-link, .hero-content')) {
                document.body.classList.add("cursor-hover");
            }
        };
        const onMouseOut = (e) => {
            if(e.target.closest('a, button, .service-card, .work-card, input, textarea, .nav-link, .hero-content')) {
                document.body.classList.remove("cursor-hover");
            }
        };
        document.body.addEventListener('mouseover', onMouseOver, true);
        document.body.addEventListener('mouseout', onMouseOut, true);
    }
  }, []);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <GlobalSetup />
        
        {/* Global UI */}
        <div className="cursor-dot"></div>
        <div className="cursor-ring"></div>
        <div className="scroll-progress-container">
          <div className="scroll-progress" id="global-scroll-progress"></div>
        </div>

        <Header />
        <ContactModal />
        
        <main id="spa-root">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
              <Route path="/why-us" element={<WhyUs />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </TransitionProvider>
    </BrowserRouter>
  );
}
