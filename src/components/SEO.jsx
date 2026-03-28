import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://shajamx.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * SEO component — drop this inside any page component.
 * Props:
 *  - title        string  — page title (appended with " | ShajamX")
 *  - description  string  — meta description
 *  - path         string  — canonical path e.g. "/about"
 *  - image        string  — OG image URL (defaults to global OG image)
 *  - type         string  — OG type (default "website")
 *  - structuredData  object — JSON-LD schema for this page
 */
export default function SEO({
  title = 'Premium Web Development & Digital Agency',
  description = 'ShajamX is a premium web development agency specializing in React, GSAP animations, Three.js, UI/UX design, and full-stack development.',
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  structuredData = null,
}) {
  const fullTitle = title.includes('ShajamX') ? title : `${title} | ShajamX`;
  const canonicalUrl = `${BASE_URL}${path}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
