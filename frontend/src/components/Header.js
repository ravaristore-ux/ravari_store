import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX, FiHome, FiUser } from 'react-icons/fi';

const NAV = [
  { label: 'Home',       to: '/'         },
  { label: 'About Us',   to: '/about'    },
  { label: 'Shop',       to: '/products' },
  { label: 'Contact',    to: '/contact'  },
];

const GOLD   = '#C9A84C';
const TOP_BG = '#0D0B08';
const NAV_BG = '#1A1510';
const BORDER = 'rgba(201,168,76,0.18)';

export default function Header() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const location  = useLocation();
  const navigate  = useNavigate();
  const cartItems = useSelector(s => s.cart?.items || []);
  const isAuthenticated = useSelector(s => s.auth?.isAuthenticated);
  const cartCount = cartItems.reduce((n, i) => n + (i.quantity || 1), 0);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setSearchQuery(''); }, [location]);
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

  const doSearch = () => {
    const q = searchQuery.trim();
    if (q) { navigate(`/products?search=${encodeURIComponent(q)}`); setSearchOpen(false); setSearchQuery(''); }
  };

  const iconStyle = { color: 'rgba(255,255,255,0.88)', display: 'flex', transition: 'color 0.2s', cursor: 'pointer', background: 'none', border: 'none' };
  const iconHover = e => e.currentTarget.style.color = GOLD;
  const iconLeave = e => e.currentTarget.style.color = 'rgba(255,255,255,0.88)';

  return (
    <>
      <style>{`
        /* ── Desktop header ── */
        .hdr-top {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 76px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .hdr-left    { display: flex; align-items: center; }
        .hdr-icons   { display: flex; align-items: center; justify-content: flex-end; gap: 1.4rem; }
        .hdr-hamburger { display: none; }
        .hdr-nav { display: flex; }

        /* ── Mobile ≤ 768px ── */
        @media (max-width: 768px) {
          .hdr-top {
            grid-template-columns: 44px 1fr 44px;
            height: 60px;
            padding: 0 0.75rem;
          }
          .hdr-icons   { gap: 0.9rem; }
          .hdr-icons .hdr-search,
          .hdr-icons .hdr-wish  { display: none; }
          .hdr-hamburger { display: flex !important; align-items: center; justify-content: flex-start; }
          .ravari-wordmark { font-size: 1.55rem !important; letter-spacing: 0.4em !important; padding-left: 0.4em !important; }
          .ravari-tagline  { display: none !important; }
          .hdr-nav-bar { top: 60px !important; }
          .hdr-nav { display: none !important; }
        }
        @media (max-width: 768px) {
          .ravari-logo-icon { height: 28px !important; }
        }
        @media (max-width: 480px) {
          .ravari-wordmark { font-size: 1.3rem !important; letter-spacing: 0.3em !important; padding-left: 0.3em !important; }
          .ravari-logo-icon { height: 24px !important; }
        }
      `}</style>

      {/* ── TOP ROW ─────────────────────────────────────── */}
      <div style={{ backgroundColor: TOP_BG, borderBottom: `1px solid ${BORDER}`, position: 'sticky', top: 0, zIndex: 200 }}>
        <div className="hdr-top">

          {/* Left — hamburger (mobile only) */}
          <div className="hdr-left">
            <button className="hdr-hamburger" onClick={() => setMenuOpen(o => !o)}
              style={{ ...iconStyle, display: 'none', padding: '4px' }}
              onMouseEnter={iconHover} onMouseLeave={iconLeave}>
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>

          {/* Center — Logo + RAVARI + tagline */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>

            {/* Logo icon — vertically centered with RAVARI text only */}
            <img
              src="/logo.png"
              alt="RAVARI Logo"
              className="ravari-logo-icon"
              style={{ height: '38px', width: 'auto', opacity: 0.93, filter: 'drop-shadow(0 0 5px rgba(201,168,76,0.4))', flexShrink: 0 }}
            />

            {/* RAVARI wordmark + tagline stacked — tagline is only under RAVARI text */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <span className="ravari-wordmark" style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '2.5rem', fontWeight: 600,
                letterSpacing: '0.55em', color: GOLD,
                lineHeight: 1, paddingLeft: '0.55em',
              }}>RAVARI</span>
              <span className="ravari-tagline" style={{
                fontFamily: 'Jost, sans-serif', fontSize: '0.45rem',
                fontWeight: 500, letterSpacing: '0.22em',
                color: GOLD, opacity: 0.85, textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                DURABLE &nbsp;|&nbsp; TEXTURED &nbsp;|&nbsp; FULL GRAIN &nbsp;|&nbsp; STITCHED &nbsp;|&nbsp; REINFORCED
              </span>
            </div>
          </Link>

          {/* Right — icons */}
          <div className="hdr-icons">
            <Link to="/" aria-label="Home" style={iconStyle} onMouseEnter={iconHover} onMouseLeave={iconLeave}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <FiHome size={18} />
            </Link>
            <button aria-label="Search" className="hdr-search" style={iconStyle} onMouseEnter={iconHover} onMouseLeave={iconLeave}
              onClick={() => setSearchOpen(o => !o)}>
              {searchOpen ? <FiX size={19} /> : <FiSearch size={19} />}
            </button>
            <Link to={isAuthenticated ? '/account' : '/login'} aria-label="My Account" className="hdr-wish" style={iconStyle} onMouseEnter={iconHover} onMouseLeave={iconLeave}>
              <FiUser size={19} />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="hdr-wish" style={iconStyle} onMouseEnter={iconHover} onMouseLeave={iconLeave}>
              <FiHeart size={19} />
            </Link>
            <Link to="/cart" aria-label="Cart" style={{ ...iconStyle, position: 'relative' }} onMouseEnter={iconHover} onMouseLeave={iconLeave}>
              <FiShoppingBag size={19} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-7px', backgroundColor: GOLD, color: '#0D0D0D', fontSize: '0.48rem', fontWeight: 700, width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── NAV ROW ─────────────────────────────────────── */}
      <div className="hdr-nav-bar" style={{ backgroundColor: NAV_BG, borderBottom: `1px solid ${BORDER}`, position: 'sticky', top: '76px', zIndex: 199 }}>
        <div className="hdr-nav hide-scrollbar" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', alignItems: 'center', justifyContent: 'center', height: '44px', overflowX: 'auto' }}>
          {NAV.map((item, i) => (
            <React.Fragment key={item.label}>
              <Link to={item.to} style={{
                fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: location.pathname === item.to ? GOLD : 'rgba(255,255,255,0.82)',
                padding: '0 1.4rem', whiteSpace: 'nowrap',
                transition: 'color 0.2s', textDecoration: 'none',
              }}
                onClick={() => item.to === '/' && window.scrollTo({ top: 0, behavior: 'smooth' })}
                onMouseEnter={e => e.currentTarget.style.color = GOLD}
                onMouseLeave={e => e.currentTarget.style.color = location.pathname === item.to ? GOLD : 'rgba(255,255,255,0.82)'}>
                {item.label}
              </Link>
              {i < NAV.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem' }}>|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── SEARCH OVERLAY ─────────────────────────────── */}
      {searchOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(13,11,8,0.92)', zIndex: 400, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh' }}
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <div style={{ width: '100%', maxWidth: '600px', padding: '0 1.5rem' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '1.5rem' }}>Search RAVARI</p>
            <div style={{ display: 'flex', border: `1px solid ${GOLD}`, backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
                placeholder="Search bags, wallets, accessories…"
                style={{ flex: 1, padding: '1rem 1.25rem', background: 'none', border: 'none', fontFamily: 'Jost, sans-serif', fontSize: '1rem', color: '#FFFFFF', outline: 'none' }}
              />
              <button onClick={doSearch}
                style={{ padding: '0 1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: GOLD }}>
                <FiSearch size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '0.75rem', fontFamily: 'Jost, sans-serif' }}>
              Press Enter to search · Esc to close
            </p>
          </div>
        </div>
      )}

      {/* ── MOBILE FULLSCREEN MENU ──────────────────────── */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: TOP_BG, zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.2rem' }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', ...iconStyle }}>
            <FiX size={26} />
          </button>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600, letterSpacing: '0.5em', color: GOLD, paddingLeft: '0.5em' }}>RAVARI</span>
          <div style={{ height: '1px', width: '40px', background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
          {NAV.map(item => (
            <Link key={item.label} to={item.to}
              onClick={() => item.to === '/' && window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: location.pathname === item.to ? GOLD : 'rgba(255,255,255,0.88)', textDecoration: 'none' }}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
