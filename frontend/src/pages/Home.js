import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { FiAward, FiRefreshCw, FiTruck, FiMessageCircle } from 'react-icons/fi';
import SEO from '../components/SEO';
import { SEO_CONFIG } from '../utils/seoConstants';
import { getOrganizationSchema } from '../utils/schemaMarkup';
import { trackPageView } from '../utils/ga4Tracking';

function VideoCard({ videoNum }) {
  const videoRef = useRef(null);
  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{ aspectRatio: '9/16', backgroundColor: '#1A0F0A' }}
      onMouseEnter={() => { if (videoRef.current) { videoRef.current.muted = false; videoRef.current.play().catch(() => {}); } }}
      onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; videoRef.current.muted = true; } }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        preload="auto"
        playsInline
        loop
        muted
      >
        <source src={`/videos/Ravari%20Product%20Video%20-%20${videoNum}.mp4#t=0.1`} type="video/mp4" />
      </video>
    </div>
  );
}

const TRUST_BADGES = [
  { icon: <FiTruck size={20} />,         label: 'Free Shipping',       sub: 'On orders above ₹2,000' },
  { icon: <FiRefreshCw size={20} />,     label: 'Easy Returns',        sub: '7-day hassle-free returns' },
  { icon: <FiAward size={20} />,         label: 'Genuine Leather',     sub: '100% authentic materials' },
  { icon: <FiMessageCircle size={20} />, label: 'Dedicated Support',   sub: 'Mon–Sat, 10am–7pm IST' },
];

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    trackPageView('/', 'Home - RAVARI');
    (async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/new'),
        ]);
        setFeaturedProducts(featuredRes.data.products || featuredRes.data || []);
        setNewArrivals(newRes.data.products || newRes.data || []);
      } catch {
        setFeaturedProducts([]);
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddToCart = product => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { productId: product._id, name: product.name, price: product.salePrice || product.price, image: product.thumbnail, quantity: 1, selectedOptions: {} },
    });
  };

  const handleToggleWishlist = productId => console.log('Toggle wishlist:', productId);

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <SEO
        title={SEO_CONFIG.pages.home.title}
        description={SEO_CONFIG.pages.home.description}
        keywords={SEO_CONFIG.pages.home.keywords}
        canonical={SEO_CONFIG.site.url}
        schemaMarkup={getOrganizationSchema()}
      />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF7F2', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p className="section-eyebrow mb-5">Handcrafted Since 2012</p>
              <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#1A0F0A', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Leather Crafted<br />
                <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#6B3A2A' }}>for a Lifetime</em>
              </h1>
              <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.2rem', color: '#6B6560', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '400px' }}>
                Every bag, wallet, and accessory is a testament to the artisan's hand — made with the finest leather, built to accompany you through every chapter.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary">Explore Collection</Link>
                <Link to="/about" className="btn-outline">Our Story</Link>
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-2 gap-3">
              {['01', '02', '03', '04'].map(num => (
                <VideoCard key={num} videoNum={num} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ─────────────────────────────────── */}
      <section style={{ borderTop: '1px solid #E8DDD4', borderBottom: '1px solid #E8DDD4' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <span style={{ color: '#C9A84C', marginTop: '2px' }}>{icon}</span>
                <div>
                  <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#1A0F0A', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</p>
                  <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.7rem', color: '#6B6560', marginTop: '2px' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Collection ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="section-eyebrow mb-3">Curated For You</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#1A0F0A' }}>
            Featured Collection
          </h2>
          <div className="divider-gold w-20 mx-auto mt-5" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '380px' }} />)}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map(p => (
              <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isInWishlist={false} />
            ))}
          </div>
        ) : (
          <p className="text-center" style={{ color: '#6B6560', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>
            Loading premium collection…
          </p>
        )}

        <div className="text-center mt-12">
          <Link to="/products" className="btn-outline">View All Products</Link>
        </div>
      </section>

      {/* ── Brand Banner ─────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A0F0A', padding: '5rem 0' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="section-eyebrow mb-5" style={{ color: '#C9A84C' }}>The RAVARI Promise</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 600, color: '#FAF7F2', lineHeight: 1.3, marginBottom: '1.5rem' }}>
            "Every stitch tells a story of<br /><em style={{ color: '#C9A84C' }}>uncompromising craft."</em>
          </h2>
          <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.05rem', color: '#B8A89A', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            We source only the finest full-grain leathers, hand-stitched by artisans who have spent decades perfecting their craft.
          </p>
          <Link to="/about" className="btn-outline" style={{ borderColor: '#C9A84C', color: '#C9A84C' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A84C'; e.currentTarget.style.color = '#1A0F0A'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#C9A84C'; }}>
            Discover Our Story
          </Link>
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF7F2', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-eyebrow mb-3">Just Arrived</p>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#1A0F0A' }}>
              New Arrivals
            </h2>
            <div className="divider-gold w-20 mx-auto mt-5" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '380px' }} />)}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {newArrivals.map(p => (
                <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isInWishlist={false} />
              ))}
            </div>
          ) : (
            <p className="text-center" style={{ color: '#6B6560', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>
              New pieces arriving soon…
            </p>
          )}
        </div>
      </section>

      {/* ── Craft Process ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="section-eyebrow mb-3">How We Make It</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#1A0F0A' }}>
            The Art of Craft
          </h2>
          <div className="divider-gold w-20 mx-auto mt-5" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {[
            { step: '01', name: 'Design',    desc: 'Sketched by hand' },
            { step: '02', name: 'Selection', desc: 'Premium leather sourced' },
            { step: '03', name: 'Cutting',   desc: 'Precision patterns' },
            { step: '04', name: 'Stitching', desc: 'Hand-sewn by artisans' },
            { step: '05', name: 'Finishing', desc: 'Polished & inspected' },
          ].map(({ step, name, desc }) => (
            <div key={step} className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ border: '1px solid #C9A84C' }}>
                <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#C9A84C' }}>{step}</span>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.35rem' }}>{name}</h3>
              <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.7rem', color: '#6B6560' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
