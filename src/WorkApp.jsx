import React, { useRef, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Box } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from './components/SEO.jsx';

gsap.registerPlugin(ScrollTrigger);

function FloatingCubes() {
  const group = useRef();
  
  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={group}>
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={3}>
          <Box args={[0.5, 0.5, 0.5]} position={[(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4]}>
            <meshStandardMaterial 
              color="#ff3cac"
              transparent={true}
              opacity={0.3}
              roughness={0.1}
              metalness={0.8}
            />
          </Box>
        </Float>
      ))}
      <Environment preset="night" />
    </group>
  );
}

function WorkApp() {
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

      const cards = gsap.utils.toArray('.work-card-react');
      
      ScrollTrigger.create({
        trigger: '.work-grid-react',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.fromTo(cards, {
            y: 100, opacity: 0, scale: 0.9
          }, {
            y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: 'power3.out'
          });
        }
      });
      
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const projects = [
    { title: 'SHAJAMX (THIS SITE)', tags: 'REACT · 3D · GSAP', desc: 'Our flagship digital agency platform. Engineered from scratch without bloated templates, featuring a custom React Three Fiber 3D engine, Lenis smooth scrolling, and hardcore GPU-accelerated GSAP animations. This is the ultimate proof of fluid kinetic design and bleeding-edge web performance designed to wow clients.', color: '#c8ff00', image: 'https://ik.imagekit.io/ioktbcewp/enhanced_image.png?tr=w-1000,q-80,f-auto' },
    { title: 'AURA X', tags: 'UI/UX · MOTION · WEBGL', desc: 'A conceptual interface for next-generation spatial computing. Built with Next.js, featuring heavy GSAP timeline scrubbing and immersive Three.js abstract environments that react to user scroll velocity.', color: '#ff3cac', image: 'https://ik.imagekit.io/ioktbcewp/AURA%20X%20spatial%20computing%20interface%20concept.png?tr=w-1000,q-80,f-auto' },
    { title: 'NEURAL KINETICS', tags: 'BRANDING · DIGITAL EXPERIENCE', desc: 'A complete branding and digital rollout for an AI startup. Leveraged Vite and custom Shaders alongside Cannon.js physics to create interactive, dynamic fluid simulations directly in the browser.', color: '#00e5ff', image: 'https://ik.imagekit.io/ioktbcewp/ChatGPT%20Image%20Mar%2028,%202026,%2009_39_53%20PM.png?tr=w-1000,q-80,f-auto' },
    { title: 'LUMINA', tags: 'E-COMMERCE · STRATEGY', desc: 'An ultra-premium Headless Shopify storefront. We used Shopify Liquid APIs intertwined with GSAP to create a seamless, app-like shopping experience with zero-reload page transitions.', color: '#bc13fe', image: 'https://ik.imagekit.io/ioktbcewp/ChatGPT%20Image%20Mar%2028,%202026,%2009_54_54%20PM.png?tr=w-1000,q-80,f-auto' },
    { title: 'NEXUS CORE', tags: 'SaaS · PLATFORM', desc: 'A high-performance B2B SaaS dashboard. Built on React and Node.js with complex data virtualization, custom D3.js charting, and dark-mode exclusive brutalist component libraries.', color: '#ffa500', image: 'https://ik.imagekit.io/ioktbcewp/Nexus%20core%20in%20binary%20hands.png?tr=w-1000,q-80,f-auto' },
    { title: 'SYNESTHESIA', tags: 'INTERACTION · ANIMATION', desc: 'An experimental web audio visualizer built for a music festival. Using P5.js and the Web Audio API to generate real-time 3D fractals based on microphone frequency inputs.', color: '#00ff7f', image: 'https://ik.imagekit.io/ioktbcewp/ChatGPT%20Image%20Mar%2028,%202026,%2009_45_35%20PM.png?tr=w-1000,q-80,f-auto' }
  ];

  return (
    <div ref={containerRef} style={{ width: '100vw', overflow: 'hidden' }}>
      <SEO
        title="Our Work — Portfolio & Case Studies"
        description="Explore ShajamX's portfolio of premium web development projects including immersive 3D experiences, SaaS platforms, e-commerce stores, and brand identities built with React and Three.js."
        path="/work"
      />
      
      {/* Hero */}
      <section style={{ padding: '15vmax 5% 5vmax', textAlign: 'center', position: 'relative' }}>
        <div style={{ overflow: 'hidden' }}>
          <h1 className="hero-headline react-hero-title" style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', letterSpacing: '-0.02em', margin: 0 }}>SELECTED WORK</h1>
        </div>
        <p className="react-hero-subtext" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: '#f0f0f0', maxWidth: '800px', margin: '1rem auto' }}>
          Discover the immersive digital worlds we've created for leading brands and innovative startups.
        </p>
      </section>

      {/* Grid with 3D Background */}
      <section style={{ padding: '5vmax 5% 10vmax', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.7 }}>
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5] }}>
            <FloatingCubes />
          </Canvas>
        </div>
        
        <div className="work-grid-react" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem 3rem', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {projects.map((proj, i) => (
            <div key={i} className="work-card-react" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Floating VISUAL Card */}
              {proj.image ? (
                <div style={{ 
                      width: '100%', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(255,255,255,0.05)', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)', 
                      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                      overflow: 'hidden',
                      display: 'flex'
                     }} 
                     onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = `0 30px 60px ${proj.color}20`; }}
                     onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)'; }}>
                  <img src={proj.image} alt={proj.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              ) : (
                <div style={{ 
                      width: '100%', 
                      height: 'clamp(280px, 40vw, 420px)',
                      background: `linear-gradient(135deg, ${proj.color}, #0d0d14)`, 
                      borderRadius: '12px', 
                      border: '1px solid rgba(255,255,255,0.05)', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)', 
                      transition: 'transform 0.4s ease, box-shadow 0.4s ease' 
                     }} 
                     onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = `0 30px 60px ${proj.color}20`; }}
                     onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)'; }}>
                </div>
              )}
              
              {/* OUTSIDE Information Section (Editorial Feel) */}
              <div style={{ paddingTop: '1.8rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: proj.color, boxShadow: `0 0 10px ${proj.color}` }}></div>
                  <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.75rem', color: '#f0f0f0', letterSpacing: '0.1em' }}>{proj.tags}</div>
                </div>
                <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#ffffff' }}>{proj.title}</h3>
                <p style={{ fontSize: '1rem', color: '#a0a0b0', lineHeight: 1.7, margin: 0 }}>{proj.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default WorkApp;
