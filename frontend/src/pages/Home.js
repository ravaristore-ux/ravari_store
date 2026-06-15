import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { SEO_CONFIG } from '../utils/seoConstants';
import { getOrganizationSchema } from '../utils/schemaMarkup';
import { trackPageView } from '../utils/ga4Tracking';

/* ── Reel Carousel ─────────────────────────────────────── */
const REELS = [
  { type: 'video', src: '/static/videos/reel1.mp4'   },
  { type: 'img',   src: '/static/videos/model1.png'  },
  { type: 'video', src: '/static/videos/reel2.mp4'   },
  { type: 'img',   src: '/static/videos/model3.webp' },
  { type: 'video', src: '/static/videos/reel3.mp4'   },
  { type: 'img',   src: '/static/videos/model2.webp' },
];

const TILE_W = 300; // px per tile
const TILE_GAP = 10;

function ReelCarousel() {
  const scrollRef = useRef(null);

  const scroll = dir => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * (TILE_W + TILE_GAP) * 2, behavior: 'smooth' });
  };

  const arrowStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    zIndex: 10, width: '42px', height: '42px',
    background: 'rgba(13,11,8,0.75)', border: '1px solid rgba(201,168,76,0.5)',
    color: '#C9A84C', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s, border-color 0.2s',
    backdropFilter: 'blur(4px)',
  };

  return (
    <section style={{ backgroundColor: '#0D0B08', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', padding: '3.5rem 2rem 2rem' }}>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.6rem' }}>Behind The Craft</p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', fontWeight: 400, color: '#FFFFFF', lineHeight: 1.2 }}>Stories In Every Stitch</h2>
      </div>

      {/* Wrapper with arrows */}
      <div style={{ position: 'relative', padding: '0 3.5rem' }}>

        {/* Left arrow */}
        <button onClick={() => scroll(-1)} aria-label="Previous"
          style={{ ...arrowStyle, left: '0.5rem' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.25)'; e.currentTarget.style.borderColor = '#C9A84C'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(13,11,8,0.75)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; }}>
          <FiChevronLeft size={20} />
        </button>

        {/* Scrollable row */}
        <div ref={scrollRef} className="hide-scrollbar"
          style={{ display: 'flex', gap: `${TILE_GAP}px`, overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
          {REELS.map((item, i) => (
            <div key={i} style={{
              flexShrink: 0,
              width: `${TILE_W}px`,
              height: '400px',
              scrollSnapAlign: 'start',
              border: '1px solid rgba(201,168,76,0.15)',
              position: 'relative',
              backgroundColor: '#1a1008',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {item.type === 'video' ? (
                <video autoPlay muted loop playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <img src={item.src} alt={`Ravari ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(201,168,76,0.1) 0%, transparent 40%)', pointerEvents: 'none' }} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button onClick={() => scroll(1)} aria-label="Next"
          style={{ ...arrowStyle, right: '0.5rem' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.25)'; e.currentTarget.style.borderColor = '#C9A84C'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(13,11,8,0.75)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; }}>
          <FiChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}

/* ── Hero slides ───────────────────────────────────────── */
const SLIDES = [
  { img: '/static/videos/hero1.png', to: '/products?category=Jewellery+Box' },
  { img: '/static/videos/hero2.png', to: '/products?category=Watch+Box'     },
  { img: '/static/videos/hero3.png', to: '/products?category=Tote+Bags'     },
  { img: '/static/videos/hero4.png', to: '/products'                        },
  { img: '/static/videos/hero5.png', to: '/products'                        },
];

/* ── Categories ────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Sling Bags',    to: '/products?category=Sling+Bags',    img: '/static/videos/cat-sling.png' },
  { name: 'Watch Box',     to: '/products?category=Watch+Box',     img: '/static/videos/cat-watch.png' },
  { name: 'Tote Bags',     to: '/products?category=Tote+Bags',     img: '/static/videos/cat-tote.png' },
  { name: 'Jewellery Box', to: '/products?category=Jewellery+Box', img: '/static/videos/cat-jewellery.png' },
];

/* ── Hero image slider (Nappa Dori style) ──────────────── */
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback(idx => {
    setCurrent((idx + SLIDES.length) % SLIDES.length);
  }, []);

  /* Auto-advance every 5s */
  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [current, goTo]);

  return (
    <section style={{ position: 'relative', width: '100%', backgroundColor: '#1a1008', lineHeight: 0 }}>

      {/* Slides — stacked, only current visible */}
      <div style={{ position: 'relative', width: '100%' }}>
        {SLIDES.map((slide, i) => (
          <div key={i} style={{
            position: i === 0 ? 'relative' : 'absolute',
            top: 0, left: 0, width: '100%',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.9s ease-in-out',
            zIndex: i === current ? 1 : 0,
            lineHeight: 0,
          }}>
            <img
              src={slide.img}
              alt={`Slide ${i + 1}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 45%)' }} />
          </div>
        ))}
      </div>

      {/* SHOP NOW button — bottom left */}
      <div style={{ position: 'absolute', bottom: '8%', left: '5%', zIndex: 10 }}>
        <Link
          to={SLIDES[current].to}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.7rem',
            fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', fontWeight: 500,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#FFFFFF',
            backgroundColor: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.6)',
            padding: '0.8rem 2rem',
            backdropFilter: 'blur(4px)',
            transition: 'background 0.3s, border-color 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A84C'; e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#0D0D0D'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = '#FFFFFF'; }}>
          SHOP NOW <FiArrowRight size={13} />
        </Link>
      </div>

      {/* Prev / Next arrows */}
      {[
        { dir: -1, side: 'left',  icon: <FiChevronLeft  size={22} /> },
        { dir:  1, side: 'right', icon: <FiChevronRight size={22} /> },
      ].map(({ dir, side, icon }) => (
        <button key={side} onClick={() => goTo(current + dir)}
          style={{
            position: 'absolute', top: '50%', [side]: '1.5rem',
            transform: 'translateY(-50%)',
            zIndex: 10, background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#FFFFFF', width: '42px', height: '42px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.2s',
            backdropFilter: 'blur(4px)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.7)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}>
          {icon}
        </button>
      ))}

      {/* Dot navigation — bottom center */}
      <div style={{ position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{
              width: i === current ? '28px' : '8px', height: '8px',
              borderRadius: '4px',
              backgroundColor: i === current ? '#C9A84C' : 'rgba(255,255,255,0.45)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.4s ease', padding: 0,
            }} />
        ))}
      </div>
    </section>
  );
}

/* ── Main ──────────────────────────────────────────────── */
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArr,   setNewArr]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    trackPageView('/', 'Home - RAVARI');
    (async () => {
      try {
        const [fRes, nRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/new'),
        ]);
        setFeatured(fRes.data.products || fRes.data || []);
        setNewArr(nRes.data.products   || nRes.data   || []);
      } catch { setFeatured([]); setNewArr([]); }
      finally  { setLoading(false); }
    })();
  }, []);

  const addToCart = p => dispatch({
    type: 'ADD_TO_CART',
    payload: { productId: p._id, name: p.name, price: p.salePrice || p.price, image: p.thumbnail, quantity: 1, selectedOptions: {} },
  });

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <SEO
        title={SEO_CONFIG.pages.home.title}
        description={SEO_CONFIG.pages.home.description}
        keywords={SEO_CONFIG.pages.home.keywords}
        canonical={SEO_CONFIG.site.url}
        schemaMarkup={getOrganizationSchema()}
      />

      <HeroSlider />

      {/* ── BRAND VIDEO ──────────────────────────────────── */}
      <section style={{ backgroundColor: '#0D0B08' }}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem 2.5rem' }}>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.7rem' }}>Crafted With Purpose</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 400, color: '#FFFFFF', lineHeight: 1.2 }}>
            The Art of Leather
          </h2>
        </div>
        {/* Full-width video — no container constraints */}
        <div style={{ position: 'relative', width: '100%', lineHeight: 0 }}>
          <video
            autoPlay muted loop playsInline
            style={{ width: '100%', display: 'block', maxHeight: '90vh', objectFit: 'cover' }}
          >
            <source src="/static/videos/brand-video.mp4" type="video/mp4" />
          </video>
          {/* Dark gradient overlay at bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, #0D0B08, transparent)', pointerEvents: 'none' }} />
          {/* CTA button over video */}
          <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)' }}>
            <Link to="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.7rem',
              fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', fontWeight: 500,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: '#0D0D0D', backgroundColor: '#C9A84C',
              padding: '0.9rem 2.5rem', border: '1px solid #C9A84C',
              transition: 'all 0.3s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#C9A84C'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C9A84C'; e.currentTarget.style.color = '#0D0D0D'; }}>
              Explore Collection <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CRAFT REEL CAROUSEL ──────────────────────────── */}
      <ReelCarousel />

      {/* ── OUR BESTSELLERS ──────────────────────────────── */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.6rem' }}>Handpicked For You</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 400, color: '#0D0D0D' }}>Our Bestsellers</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {featured.length === 0 && !loading ? null : featured.map(p => (
              <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0D0D0D', border: '1px solid #0D0D0D', padding: '0.9rem 2.5rem', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0D0D0D'; e.currentTarget.style.color = '#FFF'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0D0D0D'; }}>
              View All Products <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────── */}
      {newArr.length > 0 && (
        <section style={{ backgroundColor: '#0D0B08', padding: '5rem 0' }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.6rem' }}>Just Dropped</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 400, color: '#FFFFFF' }}>New Arrivals</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {newArr.map(p => (
                <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/products?sort=newest" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', border: '1px solid #C9A84C', padding: '0.9rem 2.5rem', transition: 'all 0.3s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A84C'; e.currentTarget.style.color = '#0D0B08'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#C9A84C'; }}>
                See All New Arrivals <FiArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── BRAND STORY ──────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F3EE' }}>
        <div className="brand-story-grid" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="brand-story-image" style={{ backgroundColor: '#E8E4DE', overflow: 'hidden', minHeight: '520px', position: 'relative' }}>
            <img src="/static/videos/model2.webp" alt="RAVARI craftsmanship"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {/* Subtle overlay label */}
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', background: 'rgba(13,11,8,0.65)', padding: '0.6rem 1.25rem', backdropFilter: 'blur(4px)' }}>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', fontWeight: 600 }}>Est. 2023 · Lucknow, India</span>
            </div>
          </div>

          <div className="brand-story-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4.5rem 4rem', backgroundColor: '#F5F3EE' }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '28px', height: '1px', backgroundColor: '#C9A84C' }} />
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C' }}>Our Story</span>
            </div>

            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 400, color: '#0D0B08', lineHeight: 1.12, marginBottom: '0.5rem' }}>
              Craftsmanship
            </h2>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 600, fontStyle: 'italic', color: '#C9A84C', lineHeight: 1.12, marginBottom: '2rem' }}>
              with Purpose
            </h2>

            {/* Body paragraphs */}
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', fontWeight: 300, color: '#4A4642', lineHeight: 2, marginBottom: '1.1rem' }}>
              RAVARI was born from a simple conviction — that everyday objects deserve extraordinary care. We craft leather goods that are not merely purchased, but chosen for life.
            </p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', fontWeight: 300, color: '#4A4642', lineHeight: 2, marginBottom: '2.5rem' }}>
              Every stitch, every edge, every grain of leather reflects our obsession with quality. Full-grain hides, reinforced seams, and hand-finished details — made to accompany you with confidence and enduring style.
            </p>

            {/* Divider */}
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C9A84C', marginBottom: '2rem', opacity: 0.6 }} />

            {/* Three pillars */}
            <div className="brand-story-pillars" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {[
                { num: '100%',  label: 'Full-Grain\nLeather' },
                { num: 'Hand',  label: 'Stitched\n& Finished' },
                { num: '∞',     label: 'Built to\nLast' },
              ].map(({ num, label }) => (
                <div key={num} style={{ textAlign: 'left', paddingLeft: '1rem', borderLeft: '1px solid rgba(201,168,76,0.35)' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, color: '#0D0B08', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', color: '#8C8680', letterSpacing: '0.06em', lineHeight: 1.5, marginTop: '4px', whiteSpace: 'pre-line' }}>{label}</div>
                </div>
              ))}
            </div>

            <Link to="/about" style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0D0B08', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid #0D0B08', paddingBottom: '4px', width: 'fit-content', transition: 'color 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color='#C9A84C'; e.currentTarget.style.borderColor='#C9A84C'; }}
              onMouseLeave={e => { e.currentTarget.style.color='#0D0B08'; e.currentTarget.style.borderColor='#0D0B08'; }}>
              Discover Our Story <FiArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CRAFT QUALITIES STRIP ────────────────────────── */}
      <section style={{ backgroundColor: '#0D0D0D' }}>
        <div className="craft-grid" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          {[
            { label: 'Full Grain',  desc: 'Highest quality leather' },
            { label: 'Durable',     desc: 'Built to last decades'   },
            { label: 'Reinforced',  desc: 'Double-stitched seams'   },
            { label: 'Textured',    desc: 'Rich natural grain'       },
            { label: 'Handcrafted', desc: 'Made by skilled artisans' },
          ].map(({ label, desc }, i) => (
            <div key={label} className="craft-item" style={{ padding: '2.5rem 1.25rem', textAlign: 'center', borderRight: i < 4 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ width: '1px', height: '24px', backgroundColor: '#C9A84C', margin: '0 auto 1rem' }} />
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 500, color: '#FFFFFF', marginBottom: '0.3rem' }}>{label}</h4>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.04em' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
