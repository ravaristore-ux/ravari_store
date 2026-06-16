import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const GOLD = '#C9A84C';
const link = { fontFamily: 'Jost, sans-serif', fontSize: '0.76rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.52)', transition: 'color 0.2s', textDecoration: 'none' };
const hoverOn  = e => e.currentTarget.style.color = '#FFFFFF';
const hoverOff = e => e.currentTarget.style.color = 'rgba(255,255,255,0.52)';

function Footer() {
  const [email, setEmail] = useState('');
  const [subDone, setSubDone] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubDone(true);
    setEmail('');
    setTimeout(() => setSubDone(false), 4000);
  };

  return (
    <footer style={{ backgroundColor: '#0A0806', color: '#FFFFFF', borderTop: `1px solid rgba(201,168,76,0.18)` }}>

      {/* ── Gold rule ── */}
      <div style={{ height: '2px', background: `linear-gradient(90deg, transparent 0%, ${GOLD} 40%, ${GOLD} 60%, transparent 100%)` }} />

      {/* ── Trust strip ── */}
      <div style={{ backgroundColor: '#0D0B08', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.4rem 2rem', display: 'flex', justifyContent: 'center', gap: '3.5rem', flexWrap: 'wrap' }}>
          {[
            { icon: '🔒', text: 'Secure Payments' },
            { icon: '↩', text: '7-Day Easy Returns' },
            { icon: '🚚', text: 'Free Shipping above ₹5,000' },
            { icon: '✦', text: '100% Handcrafted Leather' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{icon}</span>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '5rem 2rem 3.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1.6fr', gap: '3rem', marginBottom: '4rem' }}>

          {/* Brand column */}
          <div>
            <div style={{ marginBottom: '1.6rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2rem', fontWeight: 600, letterSpacing: '0.35em', color: GOLD, lineHeight: 1, paddingLeft: '0.35em' }}>RAVARI</div>
              <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.45rem', fontWeight: 500, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', marginTop: '5px' }}>Purposefully Crafted</div>
            </div>

            <div style={{ width: '32px', height: '1px', backgroundColor: GOLD, marginBottom: '1.5rem', opacity: 0.6 }} />

            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.02rem', fontStyle: 'italic', lineHeight: 1.9, color: 'rgba(255,255,255,0.48)', maxWidth: '270px', marginBottom: '0.75rem' }}>
              Born from a devotion to timeless elegance, each RAVARI piece is a testament to enduring artisan craft.
            </p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em', marginBottom: '2rem' }}>
              Lucknow, India · Est. 2023
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              {[
                { href: 'https://www.instagram.com/ravari_store?igsh=MXNkdjBmZnFnMjAwcg==', icon: <FiInstagram size={15} />, label: 'Instagram' },
                { href: 'https://www.facebook.com/profile.php?id=61585497611013',             icon: <FiFacebook size={15} />,  label: 'Facebook' },
                { href: 'https://www.linkedin.com/in/ravari-store-854b98406',                icon: <FiLinkedin size={15} />,  label: 'LinkedIn' },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{ width: '34px', height: '34px', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.borderColor = GOLD; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD, marginBottom: '1.75rem' }}>Shop</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { to: '/products',                         label: 'All Products'  },
                { to: '/products?category=Sling+Bags',    label: 'Sling Bags'    },
                { to: '/products?category=Tote+Bags',     label: 'Tote Bags'     },
                { to: '/products?category=Handbags',      label: 'Handbags'      },
                { to: '/products?category=Organizers',    label: 'Accessories'   },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} style={link} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD, marginBottom: '1.75rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { to: '/about',            label: 'Our Story'       },
                { to: '/contact',          label: 'Contact Us'      },
                { to: '/return-policy',    label: 'Return Policy'   },
                { to: '/shipping-policy',  label: 'Shipping Policy' },
                { to: '/track-order',      label: 'Track Order'     },
                { to: '/products',         label: 'Collections'     },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} style={link} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD, marginBottom: '1.75rem' }}>Get in Touch</h4>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '2rem' }}>
              <li>
                <a href="tel:+919084260869"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', ...link }}
                  onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                  <FiPhone size={13} style={{ color: GOLD, flexShrink: 0 }} />
                  +91 90842 60869
                </a>
              </li>
              <li>
                <a href="mailto:ravari.store@gmail.com"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', ...link }}
                  onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                  <FiMail size={13} style={{ color: GOLD, flexShrink: 0 }} />
                  ravari.store@gmail.com
                </a>
              </li>
              <li>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <FiMapPin size={13} style={{ color: GOLD, flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                    4A Prakash Apartment,<br />
                    44A Cantt Road,<br />
                    Lucknow – 226001
                  </span>
                </div>
              </li>
            </ul>

            {/* Newsletter signup */}
            <div style={{ padding: '1.4rem 1.25rem', border: '1px solid rgba(201,168,76,0.22)', background: 'rgba(201,168,76,0.04)' }}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.4rem' }}>
                Get 10% Off Your First Order
              </p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Subscribe for exclusive offers, new arrivals & craft stories.
              </p>
              {subDone ? (
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', color: GOLD, fontWeight: 500 }}>✓ Check your email for your 10% off code!</p>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0' }}>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com" required
                    style={{ flex: 1, padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.3)', borderRight: 'none', color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', outline: 'none', minWidth: 0 }}
                  />
                  <button type="submit"
                    style={{ padding: '0.6rem 1rem', backgroundColor: GOLD, border: 'none', color: '#0D0B08', fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    JOIN
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── Payment logos ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.55rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: '0.5rem' }}>Secure payments via</span>
          {['UPI', 'Visa', 'Mastercard', 'RuPay', 'Net Banking', 'Razorpay'].map(m => (
            <span key={m} style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.55rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '3px', letterSpacing: '0.04em' }}>{m}</span>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em' }}>
            &copy; {new Date().getFullYear()} RAVARI. All rights reserved. &nbsp;·&nbsp; Handcrafted in India.
          </p>
          <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { to: '/track-order',     label: 'Track Order' },
              { to: '/shipping-policy', label: 'Shipping Policy' },
              { to: '/return-policy',   label: 'Return Policy' },
            ].map(({ to, label }) => (
              <Link key={label} to={to}
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}>
                {label}
              </Link>
            ))}
            {['Privacy Policy', 'Terms of Service'].map(label => (
              <a key={label} href="#"
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
