import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiInstagram, FiFacebook, FiLinkedin } from 'react-icons/fi';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItems = useSelector(state => state.cart.items);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b-2 border-amber-200">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-75 transition">
            <img
              src="/images/Ravari%20Logo%20Banner.jpeg"
              alt="RAVARI Logo"
              className="h-12"
              style={{ maxWidth: '140px' }}
            />
          </Link>

          {/* Right icons */}
          <div className="flex gap-4 items-center">
            {/* Social Icons - Compact */}
            <div className="hidden md:flex gap-2">
              <a href="https://www.instagram.com/ravari_store" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-orange-600 transition text-sm">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61585497611013" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-orange-600 transition text-sm">
                <FiFacebook className="w-5 h-5" />
              </a>
            </div>

            {/* Search - Mobile Toggle */}
            <button className="text-gray-700 hover:text-amber-700 transition">
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative text-gray-700 hover:text-amber-700 transition">
              <FiHeart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-amber-700 transition">
              <FiShoppingCart className="w-5 h-5" />
              <span className={`absolute -top-2 -right-2 ${cartItems.length > 0 ? 'bg-red-500 text-white' : 'hidden'} text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold`}>
                {cartItems.length}
              </span>
            </Link>

            {/* Login */}
            {!isAuthenticated && (
              <Link to="/account" className="text-sm font-semibold px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition">
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-amber-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex gap-12 mt-4 text-sm font-semibold text-gray-800 border-t border-amber-100 pt-4">
          <Link to="/products" className="hover:text-amber-700 transition border-b-2 border-transparent hover:border-amber-600">Shop Collection</Link>
          <Link to="/about" className="hover:text-amber-700 transition border-b-2 border-transparent hover:border-amber-600">About Us</Link>
          <Link to="/contact" className="hover:text-amber-700 transition border-b-2 border-transparent hover:border-amber-600">Contact</Link>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-3 mt-4 text-sm font-semibold text-gray-700 border-t border-gray-200 pt-4">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-700 py-2">Shop Collection</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-700 py-2">About Us</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-700 py-2">Contact</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
