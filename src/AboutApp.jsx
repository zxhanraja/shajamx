import React, { useRef, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from './components/SEO.jsx';

gsap.registerPlugin(ScrollTrigger);

function CoreOrb() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 16, 16]} scale={1.8}>
        <MeshDistortMaterial
          color="#c8ff00"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.3}
          metalness={0.7}
          wireframe={false}
        />
      </Sphere>
    </Float>
  );
}

function AboutApp() {
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

      // Mission section animation
      gsap.set('.mission-title', { opacity: 0, y: 30 });
      gsap.set('.mission-text', { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: '.mission-section',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to('.mission-title', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
          gsap.to('.mission-text', { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
        }
      });

      // Pre-hide vertically stacked sections
      gsap.set('.team-row-react', { opacity: 0, y: 80, visibility: 'hidden' });

      // Clean up previous team grid scroll trigger code and animate new rows vertically
      gsap.utils.toArray('.team-row-react').forEach((row) => {
        const img = row.querySelector('.team-img-react');
        const textElements = row.querySelectorAll('.team-info-react > *');

        if (img) gsap.set(img, { scale: 0.85, opacity: 0 });
        if (textElements.length) gsap.set(textElements, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: row,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            tl.to(row, { y: 0, opacity: 1, visibility: 'visible', duration: 0.6, ease: 'power3.out' });
            
            if (img) {
              tl.to(img, { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }, "-=0.4");
            }
            if (textElements.length) {
              tl.to(textElements, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, "-=0.8");
            }
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', overflow: 'hidden' }}>
      <SEO
        title="About Us — Meet the ShajamX Team"
        description="ShajamX is a team of designers and developers obsessed with building things that move. Meet our core team and learn about our mission."
        path="/about"
      />
      
      {/* 3D Hero */}
      <section style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00e5ff" />
            <CoreOrb />
          </Canvas>
        </div>
        
        <div style={{ zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ overflow: 'hidden' }}>
            <h1 className="hero-headline react-hero-title" style={{ fontSize: 'clamp(2.5rem, 10vw, 8rem)', letterSpacing: '-0.02em', mixBlendMode: 'difference', margin: 0 }}>WHO WE ARE</h1>
          </div>
          <p className="react-hero-subtext" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', marginTop: '1rem', color: '#f0f0f0', maxWidth: '600px', margin: '1rem auto 0' }}>
            We are ShajamX — A team of designers and developers obsessed with building things that move.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mission-section" style={{ padding: '10vmax 5%', background: '#0d0d14' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="section-title mission-title" style={{ marginBottom: '2rem' }}>OUR MISSION</h2>
          <p className="mission-text" style={{ fontSize: 'clamp(1.2rem, 3vw, 2.5rem)', lineHeight: 1.4, color: '#f0f0f0' }}>
            To push the boundaries of the web through <span style={{ color: '#c8ff00' }}>innovative engineering</span> and <span style={{ color: '#ff3cac' }}>bold aesthetics</span>. We believe the internet should be an experience, not just a destination.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="team-section" style={{ padding: '10vmax 0', overflow: 'hidden' }}>
        <h2 className="section-title" style={{ marginBottom: '4rem', textAlign: 'center', padding: '0 5%' }}>THE CORE TEAM</h2>
        
        <style>{`
          .team-container-react {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 5%;
            display: flex;
            flex-direction: column;
            gap: 6rem;
          }
          .team-row-react {
            display: flex;
            align-items: center;
            gap: 4rem;
            background: rgba(13, 13, 20, 0.4);
            padding: 3rem;
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,0.05);
          }
          .team-row-react:nth-child(even) {
            flex-direction: row-reverse;
          }
          .team-img-react {
            flex: 0 0 30%;
            max-width: 320px;
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            border-radius: 20px;
          }
          .team-info-react {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          @media (max-width: 768px) {
            .team-section {
              padding: 4rem 0 !important;
            }
            .team-container-react {
              gap: 4rem;
            }
            .team-row-react {
              flex-direction: column !important;
              gap: 2rem;
              padding: 2rem;
              text-align: center;
            }
            .team-img-react {
              flex: 0 0 auto;
              width: 100%;
              max-width: 250px;
              margin: 0 auto;
            }
            .section-title {
              margin-bottom: 3rem !important;
            }
          }
        `}</style>

        <div className="team-container-react">
          {[
            { 
              name: 'SHAISTA HANIF', 
              role: 'Creative Director & Lead Dev', 
              image: 'https://ik.imagekit.io/ioktbcewp/ChatGPT%20Image%20Mar%2027,%202026,%2005_26_34%20PM.png',
              bio: 'The visionary behind ShajamX. Blending high-performance engineering with avant-garde aesthetics to craft unforgettable digital experiences.',
              bio2: 'Shaista drives the core creative direction, ensuring that every project not only meets technical standards but pushes the boundaries of modern web design.'
            },
            { 
              name: 'ZUBBER AKHTAR', 
              role: 'Senior UI/UX Designer', 
              image: 'https://ik.imagekit.io/ioktbcewp/ChatGPT%20Image%20Mar%2027,%202026,%2005_15_41%20PM.png?updatedAt=1774612198693',
              bio: 'Master of user journeys. Zubber transforms complex flows into intuitive, seamless, and visually stunning interfaces with pixel-perfect precision.',
              bio2: 'His approach combines deep user empathy with striking visual design, resulting in products that users love to interact with on a daily basis.'
            },
            { 
              name: 'ZEESHAN RAZA', 
              role: 'WebGL Engineer', 
              image: 'https://ik.imagekit.io/ioktbcewp/ChatGPT%20Image%20Dec%2015,%202025,%2009_35_49%20AM.png?updatedAt=1765772371409',
              bio: 'Architect of immersive 3D content. Zeeshan leverages WebGL and Three.js to deliver buttery-smooth, interactive graphical worlds straight to your browser.',
              bio2: 'From creative coding to rendering optimizations, he breathes life into static pages, turning them into unforgettable, interactive storytelling experiences.'
            }
          ].map((member, i) => (
            <div key={i} className="team-row-react">
              <img src={member.image} alt={member.name} className="team-img-react" />
              <div className="team-info-react">
                <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>{member.name}</h3>
                <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '1rem', color: '#c8ff00', marginBottom: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{member.role}</p>
                <p style={{ fontSize: '1.1rem', color: '#d0d0dc', lineHeight: 1.6, marginBottom: '1rem' }}>{member.bio}</p>
                <p style={{ fontSize: '1.1rem', color: '#8a8a9e', lineHeight: 1.6 }}>{member.bio2}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default AboutApp;
