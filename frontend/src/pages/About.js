import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiHeart, FiGlobe, FiUsers } from 'react-icons/fi';
import SEO from '../components/SEO';
import { SEO_CONFIG } from '../utils/seoConstants';
import { getOrganizationSchema, getLocalBusinessSchema } from '../utils/schemaMarkup';
import { trackPageView } from '../utils/ga4Tracking';

function About() {
  const seoConfig = SEO_CONFIG.pages.about;

  React.useEffect(() => { trackPageView('/about', 'About RAVARI'); }, []);

  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [getOrganizationSchema(), getLocalBusinessSchema()],
  };

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <SEO
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={`${SEO_CONFIG.site.url}${seoConfig.path}`}
        ogTitle="About RAVARI — Premium Handcrafted Leather"
        ogDescription="The story behind RAVARI — born from a devotion to artisan leather craft."
        ogImage="https://ravari.in/og-about.jpg"
        schemaMarkup={pageSchema}
      />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A0F0A', padding: '6rem 0' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="section-eyebrow mb-5" style={{ color: '#C9A84C' }}>Our Heritage</p>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#FAF7F2', lineHeight: 1.15, marginBottom: '1.5rem' }}>
            Crafted with Purpose.<br />
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#C9A84C' }}>Built to Last.</em>
          </h1>
          <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.15rem', color: '#B8A89A', lineHeight: 1.85, maxWidth: '540px', margin: '0 auto' }}>
            Since 2012, RAVARI has been creating handcrafted leather goods that transcend trends — rooted in artisan tradition, refined for modern living.
          </p>
        </div>
      </section>

      <div className="divider-gold" />

      {/* ── Story ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="section-eyebrow mb-5">The Beginning</p>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '1.5rem' }}>Our Story</h2>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem', color: '#6B6560', lineHeight: 1.9, marginBottom: '1rem' }}>
              Founded in 2012, RAVARI emerged from a passion for creating exceptional leather goods that transcend trends. We are dedicated to the art of handcraftsmanship, combining traditional techniques with modern design sensibilities.
            </p>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem', color: '#6B6560', lineHeight: 1.9, marginBottom: '1rem' }}>
              Every piece in our collection is meticulously handcrafted by skilled artisans who understand that luxury is not just about aesthetics — it's about durability, functionality, and the story behind each creation.
            </p>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem', color: '#6B6560', lineHeight: 1.9 }}>
              Our commitment to excellence has earned us a loyal following of discerning customers who appreciate the finer things in life and understand the value of authentic craftsmanship.
            </p>
          </div>

          <div style={{ backgroundColor: '#FAF7F2', padding: '4rem', textAlign: 'center' }}>
            <p className="section-eyebrow mb-3" style={{ color: '#C9A84C' }}>Est. 2012</p>
            <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '5rem', fontWeight: 700, color: '#1A0F0A', lineHeight: 1, marginBottom: '1rem' }}>12</div>
            <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.5rem', fontWeight: 400, color: '#6B3A2A', marginBottom: '0.5rem' }}>Years of Excellence</div>
            <div className="divider-gold w-12 mx-auto mt-4" />
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF7F2', padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-eyebrow mb-3">What We Stand For</p>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 600, color: '#1A0F0A' }}>Our Core Values</h2>
            <div className="divider-gold w-20 mx-auto mt-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <FiAward size={22} />,   title: 'Quality First',    body: 'We never compromise on quality, sourcing only the finest materials for our creations.' },
              { icon: <FiHeart size={22} />,   title: 'Passion Driven',   body: 'Our artisans pour heart and soul into every product, creating with unwavering dedication.' },
              { icon: <FiGlobe size={22} />,   title: 'Sustainability',   body: 'We believe in ethical sourcing and environmentally responsible manufacturing.' },
              { icon: <FiUsers size={22} />,   title: 'Customer First',   body: 'Your satisfaction is our highest priority, backed by exceptional service.' },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{ borderTop: '2px solid #C9A84C', paddingTop: '1.5rem' }}>
                <span style={{ color: '#C9A84C', display: 'block', marginBottom: '1rem' }}>{icon}</span>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.82rem', color: '#6B6560', lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A0F0A', padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '12+',    label: 'Years in Business' },
              { num: '10,000+', label: 'Happy Customers' },
              { num: '100%',   label: 'Handcrafted' },
              { num: '50+',    label: 'Artisan Partners' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>{num}</div>
                <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B8A89A', marginTop: '0.75rem' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="section-eyebrow mb-3">Behind Every Piece</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 600, color: '#1A0F0A' }}>Our Crafting Process</h2>
          <div className="divider-gold w-20 mx-auto mt-5" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {[
            { step: '01', name: 'Design',    desc: 'Conceptualised & sketched by hand' },
            { step: '02', name: 'Selection', desc: 'Premium leather carefully sourced' },
            { step: '03', name: 'Cutting',   desc: 'Precision pattern cutting' },
            { step: '04', name: 'Assembly',  desc: 'Hand-stitched construction' },
            { step: '05', name: 'Finishing', desc: 'Quality check & final polish' },
          ].map(({ step, name, desc }) => (
            <div key={step} className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ border: '1px solid #C9A84C' }}>
                <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#C9A84C' }}>{step}</span>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.4rem' }}>{name}</h3>
              <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.72rem', color: '#6B6560', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF7F2', padding: '5rem 0' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="section-eyebrow mb-4">Experience RAVARI</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '1rem' }}>
            Ready to find your perfect piece?
          </h2>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', color: '#6B6560', lineHeight: 1.8, marginBottom: '2rem' }}>
            Explore our curated collection of handcrafted leather goods — each one made to last generations.
          </p>
          <Link to="/products" className="btn-primary">Shop the Collection</Link>
        </div>
      </section>
    </div>
  );
}

export default About;
