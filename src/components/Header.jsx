import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useTransition } from '../context/TransitionContext.jsx';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { navigateTo } = useTransition();

  const toggleMenu = () => {
    if (!menuOpen) {
      setMenuOpen(true);
      gsap.to('.line-1', { y: 7, rotation: 45, duration: 0.3 });
      gsap.to('.line-2', { opacity: 0, duration: 0.3 });
      gsap.to('.line-3', { y: -7, rotation: -45, duration: 0.3 });
      gsap.to('.mobile-menu-overlay', { 
        autoAlpha: 1, duration: 0.5, ease: "power3.out", onStart: () => {
          const el = document.querySelector('.mobile-menu-overlay');
          if(el) el.style.pointerEvents = "auto";
        }
      });
      gsap.fromTo('.mobile-nav-links a', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)", delay: 0.1 }
      );
    } else {
      setMenuOpen(false);
      gsap.to('.line-1', { y: 0, rotation: 0, duration: 0.3 });
      gsap.to('.line-2', { opacity: 1, duration: 0.3 });
      gsap.to('.line-3', { y: 0, rotation: 0, duration: 0.3 });
      gsap.to('.mobile-menu-overlay', { 
        autoAlpha: 0, duration: 0.4, ease: "power3.in", onComplete: () => {
          const el = document.querySelector('.mobile-menu-overlay');
          if(el) el.style.pointerEvents = "none";
        }
      });
    }
  };

  const closeMenu = () => {
    if (menuOpen) toggleMenu();
  };

  const NavLink = ({ to, children, className = '' }) => {
    const isActive = location.pathname === to || (to === '/' && location.hash === '');

    const handleClick = (e) => {
      e.preventDefault();
      closeMenu();
      if (to === '/#contact' || to === '#contact') {
        window.dispatchEvent(new Event('open-contact'));
        return;
      }
      if(navigateTo) navigateTo(to);
    };

    return (
      <a href={to} onClick={handleClick} className={`nav-link ${isActive ? 'active' : ''} ${className}`} aria-label={`Navigate to ${children}`}>
        {children}
      </a>
    );
  };

  return (
    <header id="header">
      <NavLink to="/" className="nav-logo">SHAJAMX</NavLink>
      <nav className="nav-links" aria-label="Main Navigation">
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/why-us">Why Us</NavLink>
        <NavLink to="/work">Work</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <div className="header-right">
        <NavLink to="/#contact" className="nav-cta">Let's Talk</NavLink>
        <button 
          className="hamburger-menu" 
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
          aria-expanded={menuOpen}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <span className="line-1"></span>
          <span className="line-2"></span>
          <span className="line-3"></span>
        </button>
      </div>
      
      <div className="mobile-menu-overlay" aria-hidden={!menuOpen}>
        <nav className="mobile-nav-links" aria-label="Mobile Navigation">
          <NavLink to="/">HOME</NavLink>
          <NavLink to="/services">SERVICES</NavLink>
          <NavLink to="/why-us">WHY US</NavLink>
          <NavLink to="/work">WORK</NavLink>
          <NavLink to="/about">ABOUT</NavLink>
          <NavLink to="/#contact" className="mobile-nav-cta">LET'S TALK</NavLink>
        </nav>
      </div>
    </header>
  );
}
