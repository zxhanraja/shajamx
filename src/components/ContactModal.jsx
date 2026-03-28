import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const formWrapperRef = useRef(null);
  const successWrapperRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-contact', handleOpen);
    return () => window.removeEventListener('open-contact', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // document.body.style.overflow = 'hidden'; // Ensure lenis doesn't mess up
      gsap.to(modalRef.current, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(contentRef.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "back.out(1.2)" }
      );
    } else {
      // document.body.style.overflow = '';
      gsap.to(contentRef.current, { y: 20, opacity: 0, duration: 0.3, ease: "power2.in" });
      gsap.to(modalRef.current, { autoAlpha: 0, duration: 0.4, delay: 0.1, ease: "power2.in" });
    }
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const onSubmit = async (event) => {
    // Exact same submit logic as Home.jsx
    event.preventDefault();
    setFormStatus("Sending...");
    
    const formTarget = event.target;
    const formData = new FormData(formTarget);
    formData.append("access_key", "2a3e3b3e-c365-4dbb-b8a9-386ed001d25f");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        gsap.to(formWrapperRef.current, { 
          opacity: 0, y: -20, duration: 0.4, ease: "power2.in",
          onComplete: () => {
             setFormStatus("SUCCESS");
             formTarget.reset();
             
             gsap.fromTo(successWrapperRef.current,
               { opacity: 0, scale: 0.8, y: 20 },
               { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }
             );

             setTimeout(() => {
               gsap.to(successWrapperRef.current, {
                 opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.in",
                 onComplete: () => {
                   setFormStatus("");
                   gsap.fromTo(formWrapperRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
                 }
               });
             }, 5000);
          }
        });
      } else {
        setFormStatus(data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      setFormStatus("Failed to send message. Please check your connection.");
    }
  };

  // Close when clicking outside of the content
  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      closeMenu();
    }
  };

  return (
    <div 
      className="global-contact-modal" 
      ref={modalRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99999,
        background: 'rgba(5, 5, 5, 0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        visibility: 'hidden',
        opacity: 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* Close Button */}
      <button 
        onClick={closeMenu}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '2rem',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#c8ff00'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
      >
        ✕
      </button>

      <div 
        ref={contentRef}
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '2rem',
        }}
      >
         <div style={{ position: 'relative', width: '100%' }}>
            {/* THE FORM ITSELF */}
            <div ref={formWrapperRef} style={{ display: formStatus === 'SUCCESS' ? 'none' : 'block' }}>
              <h2 className="contact-h2 contact-header-anim" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', marginBottom: '2rem' }}>LET'S BUILD SOMETHING WILD</h2>
              <form className="contact-form" onSubmit={onSubmit}>
                <div className="input-group">
                  <input type="text" name="name" placeholder="Name" required />
                  <span className="focus-border"></span>
                </div>
                <div className="input-group">
                  <input type="email" name="email" placeholder="Email" required />
                  <span className="focus-border"></span>
                </div>
                <div className="input-group">
                  <textarea name="message" placeholder="Project Brief" required rows="3"></textarea>
                  <span className="focus-border"></span>
                </div>
                <button type="submit" className="cta-button" disabled={formStatus === "Sending..."} style={{ width: '100%' }}>
                  {formStatus === "Sending..." ? "ENCRYPTING & SENDING..." : "SEND ORBITAL MESSAGE"}
                </button>
                {formStatus && formStatus !== "Sending..." && formStatus !== "SUCCESS" && (
                  <div style={{ marginTop: '1rem', color: '#ff3cac', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                    {formStatus}
                  </div>
                )}
              </form>
            </div>

            {/* GSAP SUCCESS OVERLAY STATE */}
            <div ref={successWrapperRef} style={{ 
              display: formStatus === 'SUCCESS' ? 'flex' : 'none',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: 'clamp(3rem, 10vw, 6rem) 1.5rem',
              background: 'rgba(200, 255, 0, 0.02)',
              border: '1px solid rgba(200, 255, 0, 0.08)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              margin: '0 auto',
            }}>
              <div style={{ fontSize: 'clamp(3rem, 8vw, 4rem)', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(200, 255, 0, 0.4))' }}>🛰️</div>
              <h3 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: '#c8ff00', fontWeight: 800, margin: 0, textAlign: 'center', lineHeight: 1.1, letterSpacing: '-0.02em' }}>TRANSMISSION RECEIVED</h3>
              <p style={{ color: '#a0a0b0', marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.85rem, 2vw, 1rem)', textAlign: 'center', maxWidth: '400px', lineHeight: 1.6 }}>
                Awaiting coordinates. <br />We will establish secure comms shortly.
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}
