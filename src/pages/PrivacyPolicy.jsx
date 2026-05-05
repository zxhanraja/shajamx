import React, { useLayoutEffect, useRef, Suspense } from 'react';
import { useTransition } from '../context/TransitionContext.jsx';
import SEO from '../components/SEO.jsx';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function Scene() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[1, 64, 64]} scale={2.5}>
        <MeshDistortMaterial
          color="#c8ff00"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.15}
        />
      </Sphere>
    </Float>
  );
}

const PolicyCard = ({ num, title, children }) => (
  <div className="policy-card">
    <div className="card-num">{num}</div>
    <h3 className="card-title">{title}</h3>
    <div className="card-body">{children}</div>
  </div>
);

export default function PrivacyPolicy() {
  const { navigateTo } = useTransition();
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.policy-title-main', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'expo.out'
      });

      gsap.from('.policy-card', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const privacyStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy — ShajamX",
    "description": "Premium data protection and privacy policy of ShajamX Digital Agency.",
    "url": "https://shajamx.com/privacy-policy"
  };

  return (
    <div ref={containerRef} className="policy-page">
      <SEO 
        title="Privacy Policy | Data Protection"
        description="ShajamX Privacy Policy. We take your digital security and data protection seriously. Read how we handle your information with premium care."
        path="/privacy-policy"
        structuredData={privacyStructuredData}
      />

      <div className="policy-3d-bg">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="policy-container">
        <div className="policy-header">
          <button 
            className="back-btn-premium" 
            onClick={() => navigateTo('/')}
          >
            <span className="btn-icon">←</span>
            <span className="btn-text">RETURN TO BASE</span>
          </button>
          
          <div className="policy-title-main">
            <span className="policy-label">// SECURITY PROTOCOL</span>
            <h1 className="main-headline">PRIVACY <br/>POLICY</h1>
            <div className="last-updated">VERSION 2.0.4 — MAY 2026</div>
          </div>
        </div>

        <div className="policy-grid">
          <PolicyCard num="01" title="Data Encryption">
            <p>Every transmission sent to ShajamX is encrypted using 256-bit SSL protocols. Your data isn't just stored; it's fortified behind multi-layer security walls.</p>
          </PolicyCard>

          <PolicyCard num="02" title="Client Confidentiality">
            <p>We operate on a zero-leak policy. Your project briefs, intellectual property, and communication history are strictly confidential and never shared with third parties without express legal consent.</p>
          </PolicyCard>

          <PolicyCard num="03" title="Usage Information">
            <p>We analyze browser fingerprints and interaction maps to optimize UI/UX. This includes device type, OS, and navigation paths—all anonymized to improve your experience.</p>
          </PolicyCard>

          <PolicyCard num="04" title="Digital Cookies">
            <p>We use session tokens and tracking pixels to remember your preferences. You can terminate these signals at any time via your browser settings.</p>
          </PolicyCard>

          <PolicyCard num="05" title="Data Sovereignty">
            <p>You own your data. At any point, you can request a full "Digital Erasure" of your records from our systems. We comply with GDPR, CCPA, and global privacy standards.</p>
          </PolicyCard>

          <PolicyCard num="06" title="Contact System">
            <p>When you reach out via our contact portal, we store your identity markers to facilitate communication. We never sell your contact info to marketing conglomerates.</p>
          </PolicyCard>
        </div>

        <div className="policy-footer-text">
          <p>By interacting with ShajamX, you acknowledge our security protocols. For deep-dive legal inquiries, please transmit an orbital message via our home page contact form.</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .policy-page {
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          position: relative;
          padding: 140px 0 100px;
          overflow: hidden;
        }
        .policy-3d-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.4;
        }
        .policy-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 5%;
          position: relative;
          z-index: 1;
        }
        .policy-header {
          margin-bottom: 80px;
        }
        .back-btn-premium {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 12px 24px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          margin-bottom: 60px;
          letter-spacing: 2px;
        }
        .back-btn-premium:hover {
          background: var(--accent);
          color: var(--bg);
          border-color: var(--accent);
          transform: translateX(-5px);
        }
        .policy-label {
          font-family: var(--font-mono);
          color: var(--accent);
          font-size: 12px;
          letter-spacing: 3px;
          display: block;
          margin-bottom: 10px;
        }
        .main-headline {
          font-size: clamp(40px, 10vw, 100px);
          font-weight: 800;
          line-height: 0.9;
          text-transform: uppercase;
          margin-bottom: 20px;
          letter-spacing: -0.04em;
        }
        .last-updated {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 1px;
        }
        .policy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          margin-bottom: 80px;
        }
        .policy-card {
          background: rgba(13, 13, 20, 0.4);
          border: 1px solid var(--border);
          padding: 40px;
          border-radius: 4px;
          backdrop-filter: blur(10px);
          transition: border-color 0.4s ease, transform 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .policy-card:hover {
          border-color: var(--accent);
          transform: translateY(-5px);
        }
        .card-num {
          font-family: var(--font-mono);
          color: var(--accent);
          font-size: 14px;
          margin-bottom: 20px;
          opacity: 0.6;
        }
        .card-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 15px;
          color: #fff;
        }
        .card-body p {
          font-size: 15px;
          line-height: 1.6;
          color: var(--muted);
        }
        .policy-footer-text {
          max-width: 600px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--muted);
          line-height: 1.8;
          opacity: 0.5;
        }
        @media (max-width: 768px) {
          .main-headline { font-size: 60px; }
          .policy-grid { grid-template-columns: 1fr; }
          .policy-card { padding: 30px; }
        }
      `}} />
    </div>
  );
}
