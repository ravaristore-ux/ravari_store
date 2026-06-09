import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiInstagram, FiFacebook, FiLinkedin, FiPhone, FiMail } from 'react-icons/fi';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { to: '/products', label: 'Shop Collection' },
    { to: '/about', label: 'Our Story' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid rgba(229,211,179,0.5)', boxShadow: scrolled ? 'var(--shadow-sm)' : 'none', transition: 'box-shadow 0.3s ease' }}>

      {/* TOP BAR */}
      <div className="hidden md:block" style={{ backgroundColor: 'var(--charcoal)', padding: '0.45rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex items-center gap-6">
            <a href="tel:+919084260869" className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'rgba(248,248,244,0.7)' }}>
              <FiPhone size={11} style={{ color: 'var(--gold)' }} /> +91 90842 60869
            </a>
            <a href="mailto:ravari.store@gmail.com" className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'rgba(248,248,244,0.7)' }}>
              <FiMail size={11} style={{ color: 'var(--gold)' }} /> ravari.store@gmail.com
            </a>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>
            Purposefully Crafted. Redefine with Every Detail.
          </p>
          <div className="flex items-center gap-3">
            {[
              { href: 'https://www.instagram.com/ravari_store', Icon: FiInstagram },
              { href: 'https://www.facebook.com/profile.php?id=61585497611013', Icon: FiFacebook },
              { href: 'https://www.linkedin.com/in/ravari-store-854b98406', Icon: FiLinkedin },
            ].map(({ href, Icon }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(248,248,244,0.6)', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,248,244,0.6)'}>
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="container" style={{ padding: '1.1rem 2rem' }}>
        <div className="flex justify-between items-center">
          <Link to="/" onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'} style={{ display: 'flex', alignItems: 'center', transition: 'var(--transition)', opacity: 1 }}>
            <img src="/images/Ravari%20Logo%20Banner.jpeg" alt="RAVARI" style={{ height: '44px', maxWidth: '150px', objectFit: 'contain' }} />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: isActive(link.to) ? 'var(--gold)' : 'var(--charcoal)', borderBottom: isActive(link.to) ? '1px solid var(--gold)' : '1px solid transparent', paddingBottom: '2px', transition: 'var(--transition)' }}
                onMouseEnter={e => { if (!isActive(link.to)) { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderBottomColor = 'var(--gold)'; }}}
                onMouseLeave={e => { if (!isActive(link.to)) { e.currentTarget.style.color = 'var(--charcoal)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Search" style={{ color: 'var(--charcoal)', transition: 'var(--transition)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--charcoal)'}><FiSearch size={18} /></button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative" style={{ color: 'var(--charcoal)', transition: 'var(--transition)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--charcoal)'}><FiHeart size={18} /></Link>
            <Link to="/cart" aria-label="Cart" className="relative" style={{ color: 'var(--charcoal)', transition: 'var(--transition)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--charcoal)'}>
              <FiShoppingCart size={18} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center rounded-full" style={{ width: '16px', height: '16px', backgroundColor: 'var(--gold)', color: 'var(--white)', fontSize: '0.6rem', fontWeight: 700 }}>{cartItems.length}</span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link to="/account" style={{ color: 'var(--charcoal)', transition: 'var(--transition)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--charcoal)'}><FiUser size={18} /></Link>
            ) : (
              <Link to="/account" className="hidden md:inline-block btn-primary" style={{ padding: '0.5rem 1.4rem', fontSize: '0.65rem' }}>Sign In</Link>
            )}
            <button className="md:hidden" aria-label="Menu" style={{ color: 'var(--charcoal)' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      {mobileMenuOpen && (
        <nav className="md:hidden" style={{ borderTop: '1px solid var(--beige)', backgroundColor: 'var(--white)', padding: '1.5rem 2rem' }}>
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: isActive(link.to) ? 'var(--gold)' : 'var(--charcoal)', padding: '0.85rem 0', borderBottom: '1px solid rgba(229,211,179,0.3)' }}>{link.label}</Link>
          ))}
          <div className="flex items-center gap-4 mt-5">
            <a href="https://www.instagram.com/ravari_store" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}><FiInstagram size={18} /></a>
            <a href="https://www.facebook.com/profile.php?id=61585497611013" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}><FiFacebook size={18} /></a>
            <a href="https://www.linkedin.com/in/ravari-store-854b98406" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}><FiLinkedin size={18} /></a>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
