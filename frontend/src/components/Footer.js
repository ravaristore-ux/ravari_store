import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#1A0F0A', color: '#E8DDD4' }}>
      {/* Gold divider */}
      <div className="divider-gold" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">

          {/* Brand Column */}
          <div className="md:col-span-1">
            <img
              src="/images/Ravari%20Logo%20Banner.jpeg"
              alt="RAVARI"
              style={{ height: '40px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9, marginBottom: '1rem' }}
            />
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '0.95rem', lineHeight: 1.75, color: '#B8A89A', fontStyle: 'italic' }}>
              Handcrafted leather goods, born from a devotion to timeless elegance and artisan precision.
            </p>
            <div className="flex gap-4 mt-5">
              {[
                { href: 'https://www.instagram.com/ravari_store?igsh=MXNkdjBmZnFnMjAwcg==', icon: <FiInstagram size={17} />, label: 'Instagram' },
                { href: 'https://www.facebook.com/profile.php?id=61585497611013',             icon: <FiFacebook size={17} />,  label: 'Facebook' },
                { href: 'https://www.linkedin.com/in/ravari-store-854b98406',                icon: <FiLinkedin size={17} />,  label: 'LinkedIn' },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{ color: '#C9A84C' }} className="hover:opacity-60 transition-opacity">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="section-eyebrow mb-5" style={{ color: '#C9A84C' }}>Shop</h4>
            <ul className="space-y-3">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/products?category=bags', label: 'Bags & Totes' },
                { to: '/products?category=wallets', label: 'Wallets' },
                { to: '/products?category=accessories', label: 'Accessories' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem', color: '#B8A89A', letterSpacing: '0.04em' }}
                    className="hover:opacity-70 transition-opacity">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="section-eyebrow mb-5" style={{ color: '#C9A84C' }}>Company</h4>
            <ul className="space-y-3">
              {[
                { to: '/about',   label: 'Our Story' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem', color: '#B8A89A', letterSpacing: '0.04em' }}
                    className="hover:opacity-70 transition-opacity">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="section-eyebrow mb-5" style={{ color: '#C9A84C' }}>Get in Touch</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919084260869" className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                  style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem', color: '#B8A89A' }}>
                  <FiPhone size={13} style={{ color: '#C9A84C' }} />
                  +91 90842 60869
                </a>
              </li>
              <li>
                <a href="mailto:Ravari.store@gmail.com" className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                  style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem', color: '#B8A89A' }}>
                  <FiMail size={13} style={{ color: '#C9A84C' }} />
                  Ravari.store@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(201,168,76,0.2)' }}>
          <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.7rem', color: '#6B6560', letterSpacing: '0.08em' }}>
            &copy; {currentYear} RAVARI. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map(label => (
              <a key={label} href="#"
                style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.7rem', color: '#6B6560', letterSpacing: '0.08em' }}
                className="hover:opacity-70 transition-opacity">{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
