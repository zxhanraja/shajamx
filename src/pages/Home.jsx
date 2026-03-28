import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { initHome, cleanupHome } from '../utils/homeAnimations.js';
import SEO from '../components/SEO.jsx';

export default function Home() {
  const containerRef = useRef(null);
  const [formStatus, setFormStatus] = useState("");
  const formWrapperRef = useRef(null);
  const successWrapperRef = useRef(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormStatus("Sending...");
    
    // Copy the form target references before the async fetch begins
    const formTarget = event.target;
    const formData = new FormData(formTarget);

    // Provide the correct API key
    formData.append("access_key", "2a3e3b3e-c365-4dbb-b8a9-386ed001d25f");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Animate the form out quickly
        gsap.to(formWrapperRef.current, { 
          opacity: 0, 
          y: -20, 
          duration: 0.4, 
          ease: "power2.in",
          onComplete: () => {
             setFormStatus("SUCCESS");
             formTarget.reset();
             
             // Immediate entrance animation for the success overlay
             gsap.fromTo(successWrapperRef.current,
               { opacity: 0, scale: 0.8, y: 20 },
               { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }
             );

             // Auto reset to form state after 5 seconds to provide continuous interaction flow
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
        console.log("Error", data);
        setFormStatus(data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      setFormStatus("Failed to send message. Please check your connection.");
    }
  };

  useEffect(() => {
    // Initialize home animations immediately to ensure smooth scroll (Lenis) and ScrollTrigger sync
    initHome();
    
    return () => {
      cleanupHome();
    };
  }, []);

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "ShajamX — Premium Web Development & Digital Agency",
    "description": "ShajamX builds stunning, high-performance websites and digital experiences using React, GSAP animations, and Three.js.",
    "url": "https://shajamx.com/",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shajamx.com/" }]
    }
  };

  return (
    <div ref={containerRef} id="home-wrapper">
      <SEO
        title="ShajamX — Premium Web Development & Digital Agency"
        description="We build immersive, high-performance websites using React, GSAP, and Three.js. Stunning UI/UX, lightning-fast code, and bold design that converts."
        path="/"
        structuredData={homeStructuredData}
      />
      <div id="preloader">
        <div className="preloader-overlay"></div>
        <div className="preloader-content">
          <div className="preloader-text" id="preloader-text"></div>
          <div className="preloader-bar-wrapper">
            <div className="preloader-bar" id="preloader-bar"></div>
          </div>
        </div>
      </div>

      <section id="hero">
        <canvas id="hero-canvas"></canvas>
        <div className="hero-content">
          <div className="hero-mono-text" id="hero-mono"></div>
          <h1 className="hero-headline">
            <div className="split-wrapper"><div className="hero-line">WE BUILD</div></div>
            <div className="split-wrapper"><div className="hero-line">DIGITAL</div></div>
            <div className="split-wrapper"><div className="hero-line">WORLDS</div></div>
          </h1>
          <div className="hero-accent-line"></div>
          <p className="hero-body-text">
            Not just websites.<br/>
            Experiences that convert.
          </p>
        </div>
        <div className="scroll-cta">
          <span>SCROLL TO EXPLORE</span>
          <div className="arrow-down">↓</div>
        </div>
      </section>

      <section id="marquee">
        <div className="marquee-track row-1">
          <div className="marquee-inner">
            INNOVATIVE DESIGN · DIGITAL EXPERIENCES · STRATEGIC BRANDING · CREATIVE DEV · INNOVATIVE DESIGN · DIGITAL EXPERIENCES · STRATEGIC BRANDING · CREATIVE DEV · 
          </div>
        </div>
        <div className="marquee-track row-2">
          <div className="marquee-inner">
            UI/UX DESIGN · MOTION · BRANDING · E-COMMERCE · SaaS · ANIMATION · UI/UX DESIGN · MOTION · BRANDING · E-COMMERCE · SaaS · ANIMATION · 
          </div>
        </div>
      </section>

      <section id="services">
        <div className="services-left">
          <h2 className="section-title services-title">OUR EXPERTISE</h2>
        </div>
        <div className="services-right">
          <div className="service-card">
            <div className="service-number">01</div>
            <div className="service-name">Web Design &amp; Development</div>
            <div className="service-desc">Crafting pixel-perfect, responsive, and accessible digital experiences.</div>
          </div>
          <div className="service-card">
            <div className="service-number">02</div>
            <div className="service-name">Motion &amp; Interaction Design</div>
            <div className="service-desc">Bringing interfaces to life with fluid animations.</div>
          </div>
          <div className="service-card">
            <div className="service-number">03</div>
            <div className="service-name">Three.js / WebGL Experiences</div>
            <div className="service-desc">Immersive 3D environments that run directly in the browser.</div>
          </div>
          <div className="service-card">
            <div className="service-number">04</div>
            <div className="service-name">Performance Optimization</div>
            <div className="service-desc">Making things lightning-fast, optimizing critical rendering paths.</div>
          </div>
          <div className="service-card">
            <div className="service-number">05</div>
            <div className="service-name">CMS &amp; E-commerce</div>
            <div className="service-desc">Scalable platforms tailored to your business needs.</div>
          </div>
          <div className="service-card">
            <div className="service-number">06</div>
            <div className="service-name">Brand Identity &amp; UI Systems</div>
            <div className="service-desc">Cohesive design languages across all touchpoints.</div>
          </div>
        </div>
      </section>

      <section id="why-us" className="comparison-section">
        <canvas id="why-us-canvas"></canvas>
        <h2 className="section-title">SHAJAMX VS. THE OTHERS</h2>
        
        <div className="comparison-grid">
          <div className="comp-row">
            <div className="comp-cell feature-name">Immersive 3D & WebGL</div>
            <div className="comp-values">
              <div className="comp-cell shajamx"><span className="check-icon">✓</span></div>
              <div className="comp-cell others"><span className="cross-icon">✕</span></div>
            </div>
          </div>

          <div className="comp-row">
            <div className="comp-cell feature-name">Fluid Motion & Micro-interactions</div>
            <div className="comp-values">
              <div className="comp-cell shajamx"><span className="check-icon">✓</span></div>
              <div className="comp-cell others"><span className="cross-icon">✕</span></div>
            </div>
          </div>

          <div className="comp-row">
            <div className="comp-cell feature-name">Performance Optimization (&gt;90 Score)</div>
            <div className="comp-values">
              <div className="comp-cell shajamx"><span className="check-icon">✓</span></div>
              <div className="comp-cell others">Limited</div>
            </div>
          </div>

          <div className="comp-row">
            <div className="comp-cell feature-name">Custom Creative Engineering</div>
            <div className="comp-values">
              <div className="comp-cell shajamx"><span className="check-icon">✓</span></div>
              <div className="comp-cell others">Template Based</div>
            </div>
          </div>

          <div className="comp-row">
            <div className="comp-cell feature-name">Direct Dev-to-Client Comm</div>
            <div className="comp-values">
              <div className="comp-cell shajamx"><span className="check-icon">✓</span></div>
              <div className="comp-cell others">Gatekept by PMs</div>
            </div>
          </div>
        </div>

        <div className="usp-grid">
          <div className="usp-card">
            <div className="usp-info-wrapper">
              <span className="usp-num">// 01 ARCHITECTURE</span>
              <h3 className="usp-title">Engineered <br/>for Performance</h3>
            </div>
            <p className="usp-text">We don't settle for "good enough." Every line of code is optimized for millisecond response times and flawless execution, ensuring your brand never lags behind the competition.</p>
          </div>

          <div className="usp-card">
            <div className="usp-info-wrapper">
              <span className="usp-num">// 02 AESTHETICS</span>
              <h3 className="usp-title">Unrivaled <br/>Digital Identity</h3>
            </div>
            <p className="usp-text">Blending raw brutalism with hyper-smooth motion. We create digital identities that command attention, define premium standards, and convert visitors into believers.</p>
          </div>

          <div className="usp-card">
            <div className="usp-info-wrapper">
              <span className="usp-num">// 03 EXECUTION</span>
              <h3 className="usp-title">Dynamic <br/>Narratives</h3>
            </div>
            <p className="usp-text">Interfaces that breathe. We use WebGL and immersive interactions to turn standard websites into interactive narratives that users dont just browse—they experience.</p>
          </div>
        </div>
      </section>

      <section id="work">
        <div className="work-container">
          <div className="work-track">
            <div className="work-card">
              <div className="work-img" style={{ background: 'linear-gradient(135deg, var(--accent), var(--surface))' }}></div>
              <div className="work-info">
                <h3 className="work-title">AURA X</h3>
                <div className="work-tags">UI/UX · MOTION · WEBGL</div>
                <div className="work-arrow">↗</div>
              </div>
            </div>
            <div className="work-card">
              <div className="work-img" style={{ background: 'linear-gradient(135deg, var(--accent2), var(--surface))' }}></div>
              <div className="work-info">
                <h3 className="work-title">NEURAL KINETICS</h3>
                <div className="work-tags">BRANDING · DIGITAL EXPERIENCE</div>
                <div className="work-arrow">↗</div>
              </div>
            </div>
            <div className="work-card">
              <div className="work-img" style={{ background: 'linear-gradient(135deg, var(--accent3), var(--surface))' }}></div>
              <div className="work-info">
                <h3 className="work-title">LUMINA</h3>
                <div className="work-tags">E-COMMERCE · UI/UX</div>
                <div className="work-arrow">↗</div>
              </div>
            </div>
            <div className="work-card">
              <div className="work-img" style={{ background: 'linear-gradient(135deg, var(--muted), var(--bg))' }}></div>
              <div className="work-info">
                <h3 className="work-title">NEXUS CORE</h3>
                <div className="work-tags">SaaS · PLATFORM</div>
                <div className="work-arrow">↗</div>
              </div>
            </div>
            <div className="work-card">
              <div className="work-img" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}></div>
              <div className="work-info">
                <h3 className="work-title">SYNESTHESIA</h3>
                <div className="work-tags">INTERACTION · ANIMATION</div>
                <div className="work-arrow">↗</div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section id="stats">
        <div className="stats-bg-dots"></div>
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number"><span className="counter" data-target="147">0</span>+</div>
            <div className="stat-label">Projects Delivered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number"><span className="counter" data-target="3.2">0</span>M</div>
            <div className="stat-label">Users Reached</div>
          </div>
          <div className="stat-item">
            <div className="stat-number"><span className="counter" data-target="99">0</span>%</div>
            <div className="stat-label">Client Satisfaction</div>
          </div>
          <div className="stat-item">
            <div className="stat-number"><span className="counter" data-target="08">00</span></div>
        <div className="stat-label">Years of Excellence</div>
          </div>
        </div>
      </section>

      <section id="about">
        <div className="about-container">
          <div className="about-left">
            <canvas id="about-canvas"></canvas>
          </div>
          <div className="about-right">
            <div className="about-quote">
              <span className="about-bracket">[</span>
              <div className="about-text-wrapper">
                <div className="about-line-wrap"><div className="about-line">We are ShajaмX —</div></div>
                <div className="about-line-wrap"><div className="about-line">A team of designers and</div></div>
                <div className="about-line-wrap"><div className="about-line">developers obsessed with</div></div>
                <div className="about-line-wrap"><div className="about-line">building things that move.</div></div>
              </div>
              <span className="about-bracket">]</span>
            </div>
            <div className="about-loc">KOLKATA · INDIA · GLOBAL</div>
          </div>
        </div>
      </section>

      <section id="testimonials">
        <canvas id="testimonials-canvas"></canvas>
        <div className="testimonials-header">
          <h2 className="section-title">CLIENT REVIEWS</h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="test-num">01</div>
            <div className="test-stars">★★★★★</div>
            <div className="test-quote">"They completely transformed our digital presence. The combination of 3D and storytelling is unmatched."</div>
            <div className="test-author-box">
              <div className="test-author">Elena Rostova</div>
              <div className="test-company">Aura Dynamics</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="test-num">02</div>
            <div className="test-stars">★★★★★</div>
            <div className="test-quote">"Technically brilliant and creatively fearless. ShajaмX built us an experience that crushes our competitors."</div>
            <div className="test-author-box">
              <div className="test-author">Marcus Chen</div>
              <div className="test-company">Nexus Ventures</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="test-num">03</div>
            <div className="test-stars">★★★★★</div>
            <div className="test-quote">"Working with this agency feels like stepping into the future. Precise, smooth, and flawlessly executed."</div>
            <div className="test-author-box">
              <div className="test-author">Sarah Jenkins</div>
              <div className="test-company">Lumina Co.</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="test-num">04</div>
            <div className="test-stars">★★★★★</div>
            <div className="test-quote">"The animations are mind-blowing. Our user engagement shot up by 300% after the web app launch."</div>
            <div className="test-author-box">
              <div className="test-author">David K.</div>
              <div className="test-company">NeuralTech</div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="contact-bg-text">SHAJAMX</div>
        <div className="contact-container">
          
          <div style={{ position: 'relative', width: '100%' }}>
            {/* THE FORM ITSELF */}
            <div ref={formWrapperRef} style={{ display: formStatus === 'SUCCESS' ? 'none' : 'block' }}>
              <h2 className="contact-h2 contact-header-anim">LET'S BUILD SOMETHING WILD</h2>
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
                <button type="submit" className="cta-button" disabled={formStatus === "Sending..."}>
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
          <div className="social-links">
            <a href="#" className="social-icon">GitHub</a>
            <a href="#" className="social-icon">LinkedIn</a>
            <a href="#" className="social-icon">Behance</a>
            <a href="#" className="social-icon">Twitter</a>
          </div>
        </div>
      </section>
    </div>
  );
}
