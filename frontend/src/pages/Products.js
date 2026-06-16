import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import { useDispatch } from 'react-redux';
import SEO from '../components/SEO';
import { SEO_CONFIG } from '../utils/seoConstants';
import { trackPageView } from '../utils/ga4Tracking';
import { FiChevronDown } from 'react-icons/fi';

const GOLD = '#C9A84C';

function Products() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters,    setFilters]    = useState({ category: '', sort: 'newest', search: '' });
  const [loading,    setLoading]    = useState(true);
  const [wishlist,   setWishlist]   = useState(() => { try { return JSON.parse(localStorage.getItem('ravari_wishlist') || '[]'); } catch { return []; } });
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => { trackPageView('/products', 'Shop — RAVARI'); }, []);

  useEffect(() => {
    const urlSearch   = searchParams.get('search')   || '';
    const urlCategory = searchParams.get('category') || '';
    setFilters(f => ({ ...f, search: urlSearch, category: urlCategory }));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/products', { params: filters }),
      api.get('/products/categories/list'),
    ]).then(([pRes, cRes]) => {
      setProducts(pRes.data.products || pRes.data || []);
      setCategories(cRes.data.categories || []);
    }).catch(() => {
      setProducts([]); setCategories([]);
    }).finally(() => setLoading(false));
  }, [filters]);

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const addToCart = p => dispatch({
    type: 'ADD_TO_CART',
    payload: { productId: p._id, name: p.name, price: p.salePrice || p.price, image: p.thumbnail, quantity: 1, selectedOptions: {} },
  });

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('ravari_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const selectStyle = {
    appearance: 'none', WebkitAppearance: 'none',
    fontFamily: 'Jost, sans-serif', fontSize: '0.68rem',
    letterSpacing: '0.08em', color: '#0D0D0D',
    border: '1px solid #D4CFC8', backgroundColor: '#FAFAF8',
    padding: '0.6rem 2.5rem 0.6rem 1rem',
    cursor: 'pointer', outline: 'none',
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <SEO
        title="Shop — RAVARI | Handcrafted Leather Goods"
        description="Shop RAVARI's collection of handcrafted leather bags, totes, and accessories. Premium artisan leather goods from India."
        keywords={SEO_CONFIG.pages.products?.keywords}
        canonical={`${SEO_CONFIG.site.url}/products`}
      />

      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#F8F7F5', borderBottom: '1px solid #E8E4DE', padding: '0.55rem 2rem' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', color: '#8C8680' }}>
          <Link to="/" style={{ color: '#8C8680', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <span style={{ color: '#0D0D0D', fontWeight: 500 }}>Shop</span>
          {filters.category && <><span>›</span><span style={{ color: '#0D0D0D', fontWeight: 500 }}>{filters.category}</span></>}
        </div>
      </div>

      {/* Page Header */}
      <div style={{ backgroundColor: '#0D0B08', padding: '4rem 2rem 3.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.7rem' }}>Handcrafted Leather</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, color: '#FFFFFF', lineHeight: 1.15 }}>Our Collection</h1>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2.5rem 2rem 6rem' }}>

        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E8E4DE' }}>
          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['', ...categories].map(cat => (
              <button key={cat || 'all'} onClick={() => set('category', cat)}
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.45rem 1.1rem', border: `1px solid ${filters.category === cat ? '#0D0D0D' : '#D4CFC8'}`, backgroundColor: filters.category === cat ? '#0D0D0D' : 'transparent', color: filters.category === cat ? '#FFF' : '#4A4642', cursor: 'pointer', transition: 'all 0.2s' }}>
                {cat || 'All'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <select value={filters.sort} onChange={e => set('sort', e.target.value)} style={selectStyle}>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <FiChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8C8680' }} />
          </div>
        </div>

        {/* Product count + search label */}
        {!loading && products.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', color: '#8C8680' }}>
              Showing <strong style={{ color: '#0D0D0D' }}>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
              {filters.category ? <span> in <strong style={{ color: GOLD }}>{filters.category}</strong></span> : ''}
              {filters.search ? <span> for <strong style={{ color: GOLD }}>"{filters.search}"</strong></span> : ''}
            </p>
            {filters.search && (
              <button onClick={() => set('search', '')} style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', color: '#8C8680', border: '1px solid #D4CFC8', padding: '2px 10px', background: 'none', cursor: 'pointer' }}>
                ✕ Clear search
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ backgroundColor: '#F0EDE8', height: '380px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#8C8680', marginBottom: '1rem' }}>No products yet</p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: '#8C8680' }}>New arrivals coming soon</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {products.map(p => (
              <ProductCard key={p._id} product={p} onAddToCart={() => addToCart(p)} onToggleWishlist={toggleWishlist} isInWishlist={wishlist.includes(p._id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
