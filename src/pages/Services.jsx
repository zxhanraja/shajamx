import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO.jsx';
import BackgroundKnot from '../components/BackgroundKnot.jsx';
import AccordionItem from '../components/AccordionItem.jsx';

gsap.registerPlugin(ScrollTrigger);

function Services() {
  const containerRef = useRef();

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Web Development & Design",
    "provider": { "@type": "Organization", "name": "ShajamX" },
    "areaServed": [
      { "@type": "City", "name": "Kolkata" },
      { "@type": "City", "name": "Mumbai" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web Development Tiers",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Starter Website Package" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Growth Business Package" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Professional Domination Package" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Enterprise Custom Solutions" } }
      ]
    }
  };

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

      const tiers = gsap.utils.toArray('.tier-card');
      // Pre-hide IMMEDIATELY
      gsap.set(tiers, { opacity: 0, y: 80, visibility: 'hidden' });
      ScrollTrigger.create({
        trigger: '.tiers-grid',
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(tiers, {
            y: 0, opacity: 1, visibility: 'visible', duration: 1, stagger: 0.15, ease: 'back.out(1.2)'
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', overflow: 'hidden' }}>
      <SEO
        title="Premium Web Development Services in Kolkata & Mumbai"
        description="ShajamX offers high-end web development, 3D design, and motion design services for businesses in Kolkata and Mumbai. Custom React & Three.js solutions."
        path="/services"
        structuredData={servicesSchema}
      />
      
      {/* Hero */}
      <section style={{ height: '70vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <BackgroundKnot />
          </Canvas>
        </div>
        
        <div style={{ zIndex: 10, textAlign: 'center', padding: '0 5%' }}>
          <div style={{ overflow: 'hidden' }}>
            <h1 className="hero-headline react-hero-title" style={{ fontSize: 'clamp(2rem, 10vw, 8rem)', letterSpacing: '-0.02em', mixBlendMode: 'difference', margin: 0 }}>SERVICES</h1>
          </div>
          <p className="react-hero-subtext" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', marginTop: '1rem', color: '#f0f0f0', maxWidth: '800px', margin: '1rem auto 0' }}>
            Premier digital engineering for Kolkata & Mumbai. From brand identity to complex 3D WebGL interactions and high-performance engineering.
          </p>
        </div>
      </section>

      {/* Expertise */}
      <section style={{ padding: '10vmax 5%', background: '#050508' }}>
        <style>{`
          .service-stripe {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            cursor: pointer;
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
          }
          .service-stripe:first-of-type {
            border-top: 1px solid rgba(255,255,255,0.05);
          }
          .service-stripe::before {
            content: '';
            position: absolute;
            bottom: -1px; left: 0; right: 0;
            height: 2px;
            background: #00e5ff;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 10;
          }
          .service-stripe:hover {
            padding: 4rem 2rem;
            background: linear-gradient(90deg, rgba(0, 229, 255, 0.05) 0%, transparent 100%);
          }
          .service-stripe:hover::before {
            transform: scaleX(1);
          }
          .stripe-left {
            display: flex;
            align-items: center;
            gap: 4rem;
          }
          .stripe-num {
            font-size: 1.2rem;
            font-family: 'Space Mono', monospace;
            font-weight: 800;
            color: rgba(255,255,255,0.2);
            transition: color 0.4s ease;
          }
          .service-stripe:hover .stripe-num {
            color: #00e5ff;
          }
          .stripe-title {
            font-size: clamp(2rem, 5vw, 4.5rem);
            font-weight: 800;
            letter-spacing: -0.02em;
            margin: 0;
            color: #4a4a60;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .service-stripe:hover .stripe-title {
            color: #fff;
            transform: translateX(10px);
          }
          .stripe-desc {
            max-width: 400px;
            color: #a0a0b0;
            font-size: 1.1rem;
            line-height: 1.6;
            text-align: right;
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .service-stripe:hover .stripe-desc {
            opacity: 1;
            transform: translateX(0);
          }
          @media (max-width: 1024px) {
            .service-stripe {
              flex-direction: column;
              align-items: flex-start;
              gap: 1.5rem;
              padding: 3rem 0;
            }
            .service-stripe:hover {
              padding: 3rem 1rem;
            }
            .stripe-desc {
              text-align: left;
              opacity: 1;
              transform: translateX(0);
              padding-left: 5rem;
            }
            .stripe-left {
              gap: 2rem;
            }
          }
          @media (max-width: 768px) {
            .stripe-title {
              font-size: clamp(1.5rem, 8vw, 2.8rem);
              overflow-wrap: break-word;
              word-break: break-word;
              hyphens: auto;
            }
            .stripe-desc {
              padding-left: 3rem;
              font-size: 0.95rem;
            }
            .service-stripe {
              overflow: hidden;
            }
            .stripe-left {
              gap: 1.5rem;
            }
          }
        `}</style>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <h2 className="section-title" style={{ color: '#00e5ff', margin: 0, fontSize: '1.2rem', letterSpacing: '4px' }}>// CORE CAPABILITIES</h2>
            <div style={{ fontSize: '1.1rem', color: '#4a4a60', textAlign: 'right', maxWidth: '300px' }}>What we do best, engineered to absolute perfection.</div>
          </div>
          
          <div className="services-list-container">
            {[
              { id: '01', title: 'Web Design & Dev', desc: 'Custom UI/UX Design mapped to high-conversion user flows, engineered with React, Next.js, and Framer Motion.' },
              { id: '02', title: 'Motion & Interaction', desc: 'Advanced GSAP logic, micro-interactions, scroll-based storytelling, and physics-based fluid UI movements.' },
              { id: '03', title: 'Three.js / WebGL', desc: 'Bespoke custom GLSL shaders, optimized 3D model rendering, and immersive in-browser environments.' },
              { id: '04', title: 'Performance Eng.', desc: 'Ruthless Lighthouse score optimization, dynamic lazy loading, and flawless Core Web Vitals compliance.' },
            ].map((srv, i) => (
              <div key={i} className="service-stripe">
                <div className="stripe-left">
                  <div className="stripe-num">{srv.id}</div>
                  <h3 className="stripe-title">{srv.title}</h3>
                </div>
                <div className="stripe-desc">{srv.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section style={{ padding: '10vmax 2%', background: '#07070a', position: 'relative' }}>
        <style>{`
          .tier-card-new {
            background: linear-gradient(160deg, rgba(20,20,30,0.7) 0%, rgba(8,8,12,0.95) 100%);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 24px;
            padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2.5rem);
            position: relative;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            backdrop-filter: blur(20px);
            display: flex;
            flex-direction: column;
          }
          .tier-card-new:hover {
            transform: translateY(-8px);
            border-color: rgba(255,255,255,0.12);
            box-shadow: 0 30px 60px rgba(0,0,0,0.8);
          }
          .tier-card-new.popular {
            border: 1px solid rgba(200,255,0,0.35);
            background: linear-gradient(160deg, rgba(200,255,0,0.05) 0%, rgba(8,8,12,0.97) 100%);
          }
          .tier-card-new.popular:hover {
            box-shadow: 0 30px 80px rgba(200,255,0,0.12);
          }
          .tier-glow {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 180px;
            background: radial-gradient(ellipse at top, var(--tc) 0%, transparent 70%);
            opacity: 0.12;
            pointer-events: none;
            transition: opacity 0.5s ease;
          }
          .tier-card-new:hover .tier-glow { opacity: 0.3; }
          .tier-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.3rem 0.9rem;
            border-radius: 100px;
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
            width: fit-content;
          }
          .tier-badge.popular-badge {
            background: rgba(200,255,0,0.12);
            color: #c8ff00;
            border: 1px solid rgba(200,255,0,0.25);
          }
          .tier-badge.comprehensive-badge {
            background: rgba(188,19,254,0.12);
            color: #bc13fe;
            border: 1px solid rgba(188,19,254,0.25);
          }
          .tier-name {
            font-size: clamp(1.4rem, 3vw, 2rem);
            font-weight: 800;
            letter-spacing: -0.02em;
            margin-bottom: 0.5rem;
          }
          .tier-price {
            font-size: clamp(1.8rem, 4vw, 2.8rem);
            font-weight: 800;
            letter-spacing: -0.03em;
            margin: 0.8rem 0 0.3rem;
          }
          .tier-subtitle {
            font-family: 'Space Mono', monospace;
            font-size: 0.78rem;
            color: #a0a0b0;
            margin-bottom: 0.4rem;
          }
          .tier-delivery {
            font-family: 'Space Mono', monospace;
            font-size: 0.72rem;
            color: var(--tc);
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .tier-section-label {
            font-family: 'Space Mono', monospace;
            font-size: 0.65rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--tc);
            margin: 1.4rem 0 0.7rem;
            opacity: 0.8;
          }
          .tier-list {
            list-style: none;
            padding: 0;
            margin: 0;
            flex-grow: 1;
          }
          .tier-list li {
            position: relative;
            padding-left: 1.6rem;
            margin-bottom: 0.8rem;
            color: #b0b0c0;
            font-size: clamp(0.82rem, 1.5vw, 0.95rem);
            line-height: 1.5;
          }
          .tier-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--tc);
            font-weight: 800;
          }
          .tier-btn-primary {
            display: block;
            text-align: center;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 800;
            font-size: 0.88rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-decoration: none;
            margin-top: 2rem;
            transition: all 0.3s ease;
            background: var(--tc);
            color: #050508;
            border: none;
            cursor: pointer;
          }
          .tier-btn-primary:hover {
            filter: brightness(1.15);
            transform: translateY(-2px);
          }
          .tier-btn-secondary {
            display: block;
            text-align: center;
            padding: 0.8rem 1.5rem;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.82rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-decoration: none;
            margin-top: 0.8rem;
            transition: all 0.3s ease;
            background: transparent;
            color: rgba(255,255,255,0.4);
            border: 1px solid rgba(255,255,255,0.08);
            cursor: pointer;
          }
          .tier-btn-secondary:hover {
            border-color: var(--tc);
            color: var(--tc);
          }
          .comp-table-wrap {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 1.5rem;
            margin: 0 -5vw;
            padding: 0 5vw;
          }
          .comp-table-wrap::-webkit-scrollbar {
            height: 6px;
          }
          .comp-table-wrap::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
          }
          .comp-table-wrap::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
          }
          .comp-table {
            width: 100%;
            min-width: 700px;
            border-collapse: collapse;
            font-size: clamp(0.78rem, 1.3vw, 0.92rem);
          }
          .comp-table th {
            padding: 1.2rem 1rem;
            text-align: center;
            font-weight: 800;
            font-size: 0.85rem;
            letter-spacing: 1px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .comp-table th:first-child { text-align: left; }
          .comp-table td {
            padding: 0.9rem 1rem;
            text-align: center;
            color: #a0a0b0;
            border-bottom: 1px solid rgba(255,255,255,0.04);
          }
          .comp-table td:first-child {
            text-align: left;
            color: #e0e0f0;
            font-weight: 600;
          }
          .comp-table tr:hover td {
            background: rgba(255,255,255,0.02);
          }
          .ct-check { color: #c8ff00; font-weight: 800; font-size: 1rem; }
          .ct-dash  { color: rgba(255,255,255,0.15); }
          .ct-popular-col { background: rgba(200,255,0,0.03); }
          .tiers-grid-new {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .mobile-swipe-hint {
            display: none;
          }
          @media (max-width: 768px) {
            .mobile-swipe-hint {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              color: #a0a0b0;
              font-family: 'Space Mono', monospace;
              font-size: 0.75rem;
              margin-top: 1.5rem;
              opacity: 0.8;
              animation: hintPulse 2s infinite ease-in-out;
            }
            @keyframes hintPulse {
              0%, 100% { opacity: 0.4; transform: translateX(0); }
              50% { opacity: 1; transform: translateX(5px); }
            }
            .comp-table-wrap {
              border-right: 2px solid rgba(0, 229, 255, 0.3); /* Visual hint on the right edge */
            }
          }
          @media (min-width: 768px) {
            .tiers-grid-new { grid-template-columns: repeat(2, 1fr); }
          }
          @media (min-width: 1100px) {
            .tiers-grid-new { grid-template-columns: repeat(4, 1fr); }
          }
        `}</style>

        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', margin: 0 }}>SERVICE TIERS</h2>
            <p style={{ color: '#a0a0b0', fontSize: '1.1rem', marginTop: '1rem', fontFamily: 'Space Mono, monospace' }}>
              Custom pricing · 50–50 payment · Optimized for Indian Markets
            </p>
          </div>

          {/* Cards Grid */}
          <div className="tiers-grid tiers-grid-new" style={{ alignItems: 'start' }}>

            {/* STARTER */}
            <div className="tier-card tier-card-new" style={{ '--tc': '#00e5ff' }}>
              <div className="tier-glow"></div>
              <div className="tier-badge" style={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)' }}>STARTER</div>
              <div className="tier-name">Starter</div>
              <div className="tier-price" style={{ color: '#00e5ff' }}>Custom</div>
              <div className="tier-subtitle">Complete Custom Website</div>
              <div className="tier-delivery">10 pages · 1–5 days · 50-50 payment</div>
              <div className="tier-section-label">Pages &amp; Content</div>
              <ul className="tier-list">
                <li>10 Custom Pages — Home, About, Services, Contact + 6 of your choice</li>
                <li>AI-Ready Content — written by experts, optimised by AI</li>
                <li>Hindi + English Ready</li>
                <li>Your Brand, Your Colours — no templates, ever</li>
              </ul>
              <div className="tier-section-label">Tech &amp; SEO</div>
              <ul className="tier-list">
                <li>Next.js — 95+ Google PageSpeed guaranteed</li>
                <li>SEO + GEO + AEO — rank on Google, ChatGPT, Gemini</li>
                <li>Schema Markup — rich results in Google</li>
                <li>SSL + 99.99% Uptime — global CDN</li>
              </ul>
              <div className="tier-section-label">What's Included</div>
              <ul className="tier-list">
                <li>WhatsApp + Call Button</li>
                <li>Google Maps Embed</li>
                <li>Client Portal Access</li>
                <li>1 Round of Revisions</li>
              </ul>
              <a href="/#contact" className="tier-btn-primary">Start My Website →</a>
              <a href="/#contact" className="tier-btn-secondary">See Full Details →</a>
            </div>

            {/* GROWTH */}
            <div className="tier-card tier-card-new" style={{ '--tc': '#ff3cac' }}>
              <div className="tier-glow"></div>
              <div className="tier-badge" style={{ background: 'rgba(255,60,172,0.1)', color: '#ff3cac', border: '1px solid rgba(255,60,172,0.2)' }}>GROWTH</div>
              <div className="tier-name">Growth</div>
              <div className="tier-price" style={{ color: '#ff3cac' }}>Custom</div>
              <div className="tier-subtitle">Double the Pages. Double the Reach.</div>
              <div className="tier-delivery">20 pages · Priority 1–3 day delivery · 50-50 payment</div>
              <div className="tier-section-label">Everything in Starter, Plus</div>
              <ul className="tier-list">
                <li>20 Custom Pages — double the content, double the ranking power</li>
                <li>Blog Setup + 5 Articles — AI-written, SEO-optimised</li>
                <li>Advanced Local SEO — city-targeted pages, Google My Business</li>
                <li>Logo Design Included — professional brand identity</li>
              </ul>
              <div className="tier-section-label">Marketing &amp; Integrations</div>
              <ul className="tier-list">
                <li>Contact Form + Email Alerts</li>
                <li>Instagram Feed Integration</li>
                <li>Google Analytics Setup</li>
                <li>Google Search Console — connected on launch day</li>
              </ul>
              <div className="tier-section-label">Support</div>
              <ul className="tier-list">
                <li>3 Rounds of Revisions</li>
                <li>1 Month Post-Launch Support</li>
                <li>WhatsApp Direct Support</li>
              </ul>
              <a href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-contact')); }} className="tier-btn-primary">Get Growth Package →</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-contact')); }} className="tier-btn-secondary">See Full Details →</a>
            </div>

            {/* PROFESSIONAL — MOST POPULAR */}
            <div className="tier-card tier-card-new popular" style={{ '--tc': '#c8ff00' }}>
              <div className="tier-glow"></div>
              <div className="tier-badge popular-badge">⭐ MOST POPULAR</div>
              <div className="tier-name" style={{ color: '#c8ff00' }}>Professional</div>
              <div className="tier-price" style={{ color: '#c8ff00' }}>Custom</div>
              <div className="tier-subtitle">Built to Dominate Your Category.</div>
              <div className="tier-delivery">30 pages · Dedicated Project Manager · 50-50 payment</div>
              <div className="tier-section-label">Everything in Growth, Plus</div>
              <ul className="tier-list">
                <li>30 Custom Pages — comprehensive coverage of every service</li>
                <li>15 Blog Articles — authority content that ranks for months</li>
                <li>Product/Service Gallery — up to 50 items with descriptions</li>
                <li>Multi-City SEO Pages — rank across multiple cities</li>
              </ul>
              <div className="tier-section-label">Advanced SEO &amp; Marketing</div>
              <ul className="tier-list">
                <li>Competitor Keyword Research</li>
                <li>Advanced Schema Markup — multiple schema types</li>
                <li>Newsletter Integration</li>
                <li>Video Section Support</li>
              </ul>
              <div className="tier-section-label">Premium Support</div>
              <ul className="tier-list">
                <li>5 Rounds of Revisions — until 100% satisfied</li>
                <li>Google Business Profile Setup</li>
                <li>3 Months Post-Launch Support</li>
                <li>Monthly SEO Report — 3 months of data</li>
              </ul>
              <a href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-contact')); }} className="tier-btn-primary">Get Professional Package →</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-contact')); }} className="tier-btn-secondary">See Full Details →</a>
            </div>

            {/* ENTERPRISE */}
            <div className="tier-card tier-card-new" style={{ '--tc': '#bc13fe' }}>
              <div className="tier-glow"></div>
              <div className="tier-badge comprehensive-badge">MOST COMPREHENSIVE</div>
              <div className="tier-name">Enterprise</div>
              <div className="tier-price" style={{ color: '#bc13fe' }}>Custom</div>
              <div className="tier-subtitle">Total Digital Market Domination.</div>
              <div className="tier-delivery">Up to 50 pages · Custom payment plan available</div>
              <div className="tier-section-label">Everything in Professional, Plus</div>
              <ul className="tier-list">
                <li>Up to 50 Custom Pages — complete digital presence</li>
                <li>25 Blog Articles — 6+ months of content on day one</li>
                <li>City × Industry Landing Pages — local SEO across India</li>
                <li>Multilingual — Hindi + English</li>
              </ul>
              <div className="tier-section-label">Advanced Features</div>
              <ul className="tier-list">
                <li>Custom Animations — micro-interactions &amp; scroll effects</li>
                <li>Advanced Lead Capture — CRM-ready forms</li>
                <li>WhatsApp Business Integration — automated enquiry handling</li>
                <li>Photography Direction — professional shot list + stock curation</li>
              </ul>
              <div className="tier-section-label">Enterprise Support</div>
              <ul className="tier-list">
                <li>Dedicated WhatsApp Channel — senior developer direct line</li>
                <li>6 Months Post-Launch Support</li>
                <li>Quarterly SEO Reports — 12 months of tracking</li>
                <li>Annual Vercel Hosting Included</li>
              </ul>
              <a href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-contact')); }} className="tier-btn-primary">Discuss Enterprise →</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-contact')); }} className="tier-btn-secondary">See Full Details →</a>
            </div>

          </div>

          {/* FEATURE COMPARISON TABLE */}
          <div style={{ marginTop: '8rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em', margin: 0 }}>FEATURE COMPARISON</h2>
              <p style={{ color: '#4a4a60', fontSize: '1rem', marginTop: '1rem', fontFamily: 'Space Mono, monospace' }}>What's in each plan?</p>
              <div className="mobile-swipe-hint">
                <span>Swipe to compare</span>
                <span>→</span>
              </div>
            </div>
            <div className="comp-table-wrap">
              <table className="comp-table">
                <thead>
                  <tr>
                    <th style={{ color: '#4a4a60', width: '28%' }}>FEATURE</th>
                    <th style={{ color: '#00e5ff' }}>STARTER</th>
                    <th style={{ color: '#ff3cac' }}>GROWTH</th>
                    <th className="ct-popular-col" style={{ color: '#c8ff00' }}>PROFESSIONAL</th>
                    <th style={{ color: '#bc13fe' }}>ENTERPRISE</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Pages',                   '10',    '20',    '30',        'Up to 50'],
                    ['Blog Articles',            '—',     '5',     '15',        '25'],
                    ['Logo Design',              '—',     '✓',     '✓',         '✓'],
                    ['Local SEO + GMB',          '—',     '✓',     '✓',         '✓'],
                    ['Multi-City SEO Pages',     '—',     '—',     '✓',         '✓'],
                    ['Competitor Research',      '—',     '—',     '✓',         '✓'],
                    ['Product/Service Gallery',  '—',     '—',     '✓',         '✓'],
                    ['City × Industry Pages',    '—',     '—',     '—',         '✓'],
                    ['Hindi + English',          '—',     '—',     '—',         '✓'],
                    ['Custom Animations',        '—',     '—',     '—',         '✓'],
                    ['WhatsApp Business Setup',  '—',     '—',     '—',         '✓'],
                    ['Revisions',                '1',     '3',     '5',         'Unlimited'],
                    ['Post-Launch Support',      '—',     '1 mo',  '3 mo',      '6 mo'],
                    ['SEO Reports',              '—',     '—',     '3 mo',      '12 mo'],
                    ['Delivery',                 '1–5 d', '1–3 d', 'Priority',  'Dedicated PM'],
                  ].map(([feature, s, g, p, e], i) => (
                    <tr key={i}>
                      <td>{feature}</td>
                      <td>{s === '✓' ? <span className="ct-check">✓</span> : s === '—' ? <span className="ct-dash">—</span> : <span style={{ color: '#e0e0f0' }}>{s}</span>}</td>
                      <td>{g === '✓' ? <span className="ct-check">✓</span> : g === '—' ? <span className="ct-dash">—</span> : <span style={{ color: '#e0e0f0' }}>{g}</span>}</td>
                      <td className="ct-popular-col">{p === '✓' ? <span className="ct-check">✓</span> : p === '—' ? <span className="ct-dash">—</span> : <span style={{ color: '#c8ff00', fontWeight: 700 }}>{p}</span>}</td>
                      <td>{e === '✓' ? <span className="ct-check">✓</span> : e === '—' ? <span className="ct-dash">—</span> : <span style={{ color: '#e0e0f0' }}>{e}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '10vmax 5%', background: '#050508' }}>
        <h2 className="section-title" style={{ marginBottom: '4rem', textAlign: 'center' }}>FREQUENT QUESTIONS</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <AccordionItem question="How long does a typical project take?" answer="Starter projects are delivered in 1–5 days, Growth in 1–3 days, Professional gets Priority delivery with a dedicated PM, and Enterprise timelines are scoped per project." />
          <AccordionItem question="What does 50-50 payment mean?" answer="You pay 50% upfront to start the project, and the remaining 50% on delivery. No hidden charges." />
          <AccordionItem question="Do you build in Hindi and English?" answer="Yes! Growth and Professional tiers include bilingual-ready content. Enterprise includes full Multilingual (Hindi + English) setup." />
          <AccordionItem question="What happens after launch?" answer="Starter gets post-launch fixes, Growth gets 1 month support, Professional gets 3 months, and Enterprise gets 6 months of comprehensive ongoing support." />
          <AccordionItem question="Can I upgrade my plan later?" answer="Absolutely. You can upgrade from Starter to Growth or Professional at any time. We'll scope the additional work and credit your initial investment." />
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '5vmax 5% 10vmax', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '2rem' }}>READY TO START?</h2>
        <Link to="/work" className="cta-link-react" style={{ fontSize: '1.2rem' }} title="Explore our Portfolio of 3D Web Projects">
          Explore Our Portoflio <span style={{ marginLeft: '10px' }}>→</span>
        </Link>
      </section>

    </div>
  );
}

export default Services;
