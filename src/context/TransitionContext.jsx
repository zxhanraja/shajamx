import React, { createContext, useContext, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TransitionContext = createContext({});

export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef(null);

  const navigateTo = (href) => {
    // Check if simple hash jump on same page
    const isSamePageHash = href.startsWith('#') || (href.includes('#') && href.split('#')[0] === location.pathname);
    if (isSamePageHash) {
      const id = href.includes('#') ? href.split('#')[1] : href.substring(1);
      const el = document.getElementById(id);
      if (el && window.lenis) {
        window.lenis.scrollTo(el);
      } else if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (location.pathname === href || isTransitioning) return;
    
    setIsTransitioning(true);

    const isMobile = window.innerWidth <= 768;
    const panelCount = isMobile ? 3 : 4;
    const stagger = isMobile ? 0.06 : 0.08;
    const duration = isMobile ? 0.45 : 0.55;

    const panels = Array.from(overlayRef.current.children).slice(0, 4); // max 4
    const activePanels = panels.slice(0, panelCount);
    const accent = overlayRef.current.querySelector('.transition-accent');

    // Force reflow
    void overlayRef.current.offsetHeight;

    activePanels.forEach((p, i) => {
      p.style.transitionDuration = `${duration}s`;
      p.style.transitionDelay = `${i * stagger}s`;
      p.classList.add('enter');
    });

    const totalTimeMs = (duration + (panelCount * stagger)) * 1000;

    setTimeout(() => {
      if (accent) accent.classList.add('flash');
      setTimeout(() => {
        if (accent) accent.classList.remove('flash');
      }, 150);
    }, totalTimeMs * 0.4);

    // Swap route instantly while screen is fully black
    setTimeout(() => {
      // Force scroll to top before mount
      window.scrollTo(0, 0);
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
      
      navigate(href);
      
      // Give React 50ms to instantly mount the new virtual DOM components
      setTimeout(() => {
         // Slide out to right
         activePanels.forEach((p, i) => {
            p.style.transitionDelay = `${(panelCount - 1 - i) * stagger}s`;
            p.classList.remove('enter');
            p.classList.add('exit');
         });

         // Catch hash routes on new page
         if (href.includes('#')) {
             setTimeout(() => {
                 const id = href.split('#')[1];
                 const el = document.getElementById(id);
                 if (el) {
                     if (window.lenis) window.lenis.scrollTo(el, { immediate: true });
                     else el.scrollIntoView();
                 }
             }, 100); // Add a 100ms buffer for layout paint
         }

         // Cleanup classes
         setTimeout(() => {
            activePanels.forEach(p => {
               p.style.transitionDelay = '0s';
               p.style.transitionDuration = '0s';
               p.classList.remove('exit');
            });
            setIsTransitioning(false);
         }, totalTimeMs + 100);

      }, 50);
    }, totalTimeMs + 50);
  };

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}
      <div 
        ref={overlayRef} 
        className="transition-overlay"
        style={{ pointerEvents: isTransitioning ? 'auto' : 'none' }}
      >
        <div className="transition-panel"></div>
        <div className="transition-panel"></div>
        <div className="transition-panel"></div>
        <div className="transition-panel"></div>
        <div className="transition-accent"></div>
      </div>
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);
