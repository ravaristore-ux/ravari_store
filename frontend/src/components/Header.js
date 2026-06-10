import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiInstagram, FiFacebook } from 'react-icons/fi';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartItems = useSelector(state => state.cart.items);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div style={{ backgroundColor: '#1A0F0A' }} className="text-center py-2 px-4">
        <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#E8D5A3', fontWeight: 500 }}>
          FREE SHIPPING ON ORDERS ABOVE ₹2,000 &nbsp;·&nbsp; HANDCRAFTED IN INDIA
        </p>
      </div>

      {/* Main Header */}
      <header
        className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-none'}`}
        style={{ borderBottom: '1px solid #E8DDD4' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">

            {/* Left — Social + Mobile toggle */}
            <div className="flex items-center gap-4">
              <button
                className="md:hidden"
                style={{ color: '#1A0F0A' }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
              <div className="hidden md:flex items-center gap-3">
                <a href="https://www.instagram.com/ravari_store" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#6B3A2A' }} className="hover:opacity-60 transition-opacity">
                  <FiInstagram size={16} />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61585497611013" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#6B3A2A' }} className="hover:opacity-60 transition-opacity">
                  <FiFacebook size={16} />
                </a>
              </div>
            </div>

            {/* Center — Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img
                src="/images/Ravari%20Logo%20Banner.jpeg"
                alt="RAVARI"
                style={{ height: '44px', maxWidth: '160px', objectFit: 'contain' }}
              />
            </Link>

            {/* Right — Icons */}
            <div className="flex items-center gap-4">
              <button aria-label="Search" style={{ color: '#1C1C1C' }} className="hover:opacity-60 transition-opacity hidden md:block">
                <FiSearch size={18} />
              </button>

              <Link to="/wishlist" className="relative" style={{ color: '#1C1C1C' }}>
                <FiHeart size={18} className="hover:opacity-60 transition-opacity" />
              </Link>

              <Link to="/cart" className="relative" style={{ color: '#1C1C1C' }}>
                <FiShoppingCart size={18} className="hover:opacity-60 transition-opacity" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold"
                    style={{ backgroundColor: '#6B3A2A', fontSize: '0.6rem' }}>
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {!isAuthenticated ? (
                <Link to="/account"
                  style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 600, color: '#1A0F0A' }}
                  className="hidden md:flex items-center gap-1 uppercase hover:opacity-60 transition-opacity">
                  <FiUser size={15} />
                  Login
                </Link>
              ) : (
                <Link to="/account" style={{ color: '#1C1C1C' }} className="hidden md:block hover:opacity-60 transition-opacity">
                  <FiUser size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center gap-10 mt-4 pt-4" style={{ borderTop: '1px solid #E8DDD4' }}>
            {[
              { to: '/products', label: 'Shop Collection' },
              { to: '/about',    label: 'Our Story' },
              { to: '/contact',  label: 'Contact' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="nav-link pb-1">{label}</Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: '#E8DDD4', backgroundColor: '#FAF7F2' }}>
            <nav className="flex flex-col px-6 py-6 gap-5">
              {[
                { to: '/products', label: 'Shop Collection' },
                { to: '/about',    label: 'Our Story' },
                { to: '/contact',  label: 'Contact' },
                { to: '/account',  label: 'My Account' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)} className="nav-link">{label}</Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
