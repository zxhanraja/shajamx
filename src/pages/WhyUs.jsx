import React, { useRef, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO.jsx';
import AbstractCore from '../components/AbstractCore.jsx';

gsap.registerPlugin(ScrollTrigger);

function WhyUs() {
  const containerRef = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.react-hero-title', {
        yPercent: 100, 
        duration: 1.5, 
        ease: 'expo.out',
        delay: 0.2
      });

      gsap.from('.react-hero-subtext', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.8
      });

      // Pre-hide
      gsap.set(['.comp-cell-react', '.usp-card'], { opacity: 0, y: 30, visibility: 'hidden' });

      ScrollTrigger.create({
        trigger: '.comp-container-react',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to('.comp-cell-react', {
            y: 0, opacity: 1, visibility: 'visible', duration: 0.8, stagger: 0.05, ease: 'power3.out'
          });
        }
      });

      ScrollTrigger.create({
        trigger: '.usp-grid-react',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to('.usp-card', {
            y: 0, opacity: 1, visibility: 'visible', duration: 1, stagger: 0.15, ease: 'expo.out'
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', overflow: 'hidden' }}>
      <SEO
        title="Why Choose ShajamX — Digital Agency"
        description="Discover why ShajamX outperforms typical agencies. Bespoke 3D web experiences, hand-coded React architecture, 95+ performance scores, and zero-friction communication."
        path="/why-us"
      />
      
      {/* Hero */}
      <section style={{ height: '80vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <AbstractCore />
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          </Canvas>
        </div>
        
        <div style={{ zIndex: 10, textAlign: 'center', padding: '0 5%', pointerEvents: 'none' }}>
          <div style={{ overflow: 'hidden' }}>
            <h1 className="hero-headline react-hero-title" style={{ fontSize: 'clamp(2.5rem, 10vw, 8rem)', letterSpacing: '-0.02em', mixBlendMode: 'difference', margin: 0 }}>WHY CHOOSE US</h1>
          </div>
          <p className="react-hero-subtext" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', marginTop: '1rem', color: '#f0f0f0', maxWidth: '700px', margin: '1rem auto 0', background: 'rgba(5, 5, 8, 0.5)', padding: '1rem', borderRadius: '8px' }}>
            We don't just build websites. We engineer high-performance digital engines wrapped in award-winning aesthetics that drive real business growth.
          </p>
        </div>
      </section>

      {/* Comparison Grid */}
      <section style={{ padding: '10vmax 5%', background: '#050508' }}>
        <h2 className="section-title" style={{ marginBottom: '4rem', textAlign: 'center' }}>SHAJAMX VS. THE OTHERS</h2>
        
        <div className="comp-container-react" style={{ maxWidth: '1000px', margin: '0 auto', background: '#0d0d14', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e1e2e' }}>
          <style>{`
            .comp-grid-react {
              display: grid;
              grid-template-columns: 1.2fr 1fr 1fr;
              background: #1e1e2e;
              padding: 1rem;
              font-weight: 800;
              font-size: 0.75rem;
              letter-spacing: 1px;
            }
            .comp-row-react {
              display: grid;
              grid-template-columns: 1.2fr 1fr 1fr;
              padding: 1rem;
              border-bottom: 1px solid #1e1e2e;
              font-size: 0.85rem;
            }
            @media (max-width: 600px) {
              .comp-grid-react, .comp-row-react {
                grid-template-columns: 1fr 1fr;
              }
              .comp-header-others, .comp-cell-others {
                display: none;
              }
            }
          `}</style>
          <div className="comp-grid-react">
            <div className="comp-cell-react">FEATURE</div>
            <div className="comp-cell-react" style={{ color: '#c8ff00' }}>SHAJAMX</div>
            <div className="comp-cell-react comp-header-others" style={{ color: '#4a4a60' }}>TYPICAL</div>
          </div>
          
          {[
            ['Approach', 'Bespoke 3D & GSAP', 'Templates'],
            ['Stack', 'React, Next, WebGL', 'Wix / WP'],
            ['Perf', '95+ Score', 'Bloated'],
            ['Speed', '4-8 Weeks', 'Months'],
            ['Support', '24/7 Slack', 'Tickets']
          ].map((row, i) => (
            <div key={i} className="comp-row-react">
              <div className="comp-cell-react" style={{ fontWeight: 700 }}>{row[0]}</div>
              <div className="comp-cell-react" style={{ color: '#f0f0f0' }}>✓ {row[1]}</div>
              <div className="comp-cell-react comp-cell-others" style={{ color: '#4a4a60' }}>✕ {row[2]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Agency Manifesto / Philosophy */}
      <section style={{ padding: '10vmax 5%', background: '#050508', borderTop: '1px solid #1e1e2e' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '8rem', overflow: 'hidden' }}>
            <h2 className="manifesto-title" style={{ fontSize: 'clamp(2rem, 8vw, 5.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
              WE DON'T DO <span style={{ color: 'transparent', WebkitTextStroke: '2px #4a4a60' }}>ORDINARY.</span>
            </h2>
            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.8rem)', color: '#a0a0b0', maxWidth: '800px', lineHeight: 1.6 }}>
              Most agencies use templates to build digital brochures. We write raw code to engineer <strong style={{ color: '#fff' }}>high-performance digital engines</strong> that dominate markets. here is our philosophy:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            <div style={{ borderLeft: '2px solid #c8ff00', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '1rem', color: '#c8ff00', fontWeight: 800, letterSpacing: '4px', marginBottom: '1.5rem' }}>// 01 ARCHITECTURE</div>
              <h3 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Built from Scratch.</h3>
              <p style={{ color: '#a0a0b0', lineHeight: 1.8, fontSize: '1.1rem' }}>
                We refuse to use bloated builders like WordPress or Wix. Every pixel is hand-coded using modern React architectures to guarantee millisecond performance and absolute creative freedom.
              </p>
            </div>

            <div style={{ borderLeft: '2px solid #ff3cac', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '1rem', color: '#ff3cac', fontWeight: 800, letterSpacing: '4px', marginBottom: '1.5rem' }}>// 02 AESTHETICS</div>
              <h3 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Unfair Visual Advantage.</h3>
              <p style={{ color: '#a0a0b0', lineHeight: 1.8, fontSize: '1.1rem' }}>
                We blend raw brutalism with hyper-smooth WebGL motion. The result is a digital experience that instantly positions your brand as a premium authority.
              </p>
            </div>

            <div style={{ borderLeft: '2px solid #00e5ff', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '1rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '4px', marginBottom: '1.5rem' }}>// 03 EXECUTION</div>
              <h3 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Zero Friction.</h3>
              <p style={{ color: '#a0a0b0', lineHeight: 1.8, fontSize: '1.1rem' }}>
                No endless meetings. No middle-men. You communicate directly with the elite engineers and designers executing your vision, ensuring a ruthlessly efficient launch.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '5vmax 5% 10vmax', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '2rem' }}>READY TO ELEVATE?</h2>
        <a 
          href="#contact" 
          className="cta-link-react" 
          style={{ fontSize: '1.2rem', cursor: 'none' }} 
          title="Contact ShajamX to start your Project"
          onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(new Event('open-contact'));
          }}
        >
          Let's Build Something <span style={{ marginLeft: '10px' }}>→</span>
        </a>
      </section>

    </div>
  );
}

export default WhyUs;
