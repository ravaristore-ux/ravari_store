import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiTag, FiTruck, FiShoppingBag, FiPlus, FiMinus, FiArrowRight } from 'react-icons/fi';
import { trackPageView } from '../utils/ga4Tracking';

const GOLD = '#C9A84C';
const DARK = '#0D0B08';
const FREE_SHIP_THRESHOLD = 5000;
const SHIP_COST = 100;

export default function Cart() {
  const cartItems = useSelector(s => s.cart.items);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [couponCode, setCouponCode]   = useState('');
  const [coupon, setCoupon]           = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => { trackPageView('/cart', 'Shopping Cart'); }, []);

  const subtotal = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.quantity, 0), [cartItems]);
  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discountType === 'percent') return Math.round(subtotal * coupon.discountValue / 100);
    return Math.min(coupon.discountValue, subtotal);
  }, [coupon, subtotal]);
  const shipping  = subtotal - discount >= FREE_SHIP_THRESHOLD ? 0 : SHIP_COST;
  const total     = subtotal - discount + shipping;
  const toFreeShip = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);

  const remove = id => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  const qty    = (id, q) => { if (q > 0) dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: id, quantity: q } }); };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true); setCouponError(''); setCoupon(null);
    try {
      const res  = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        const c = { code: data.code, discountType: data.type, discountValue: data.value };
        setCoupon(c);
        dispatch({ type: 'SET_COUPON', payload: c });
      } else { setCouponError(data.error || 'Invalid coupon code.'); }
    } catch {
      setCouponError('Could not apply coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => { setCoupon(null); setCouponCode(''); setCouponError(''); dispatch({ type: 'SET_COUPON', payload: null }); };

  /* ── Empty cart ── */
  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F7F5', padding: '3rem 1.5rem', fontFamily: 'Jost, sans-serif' }}>
        <Helmet><title>Shopping Cart | RAVARI</title></Helmet>
        <FiShoppingBag size={48} style={{ color: '#D4CFC8', marginBottom: '1.5rem' }} />
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 400, color: DARK, marginBottom: '0.75rem' }}>Your cart is empty</h2>
        <p style={{ fontSize: '0.78rem', color: '#8C8680', marginBottom: '2rem', textAlign: 'center', maxWidth: '300px' }}>Discover our collection of handcrafted leather goods.</p>
        <Link to="/products" style={{ backgroundColor: GOLD, color: DARK, padding: '0.9rem 2.5rem', fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', border: `1px solid ${GOLD}` }}>
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F7F5', minHeight: '100vh', fontFamily: 'Jost, sans-serif' }}>
      <Helmet><title>Shopping Cart | RAVARI</title></Helmet>

      {/* Hero strip */}
      <div style={{ backgroundColor: DARK, padding: '2.25rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 400, color: '#FFFFFF', margin: 0 }}>
          Your Cart
        </h1>
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.4rem' }}>
          {cartItems.reduce((n, i) => n + i.quantity, 0)} item{cartItems.reduce((n, i) => n + i.quantity, 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Free shipping progress */}
      {toFreeShip > 0 ? (
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E8E4DE', padding: '0.85rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <FiTruck size={15} style={{ color: GOLD, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.7rem', color: DARK, marginBottom: '0.35rem' }}>
              Add <strong style={{ color: GOLD }}>₹{toFreeShip.toLocaleString('en-IN')}</strong> more for <strong>FREE shipping</strong>
            </p>
            <div style={{ height: '3px', backgroundColor: '#E8E4DE', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100)}%`, backgroundColor: GOLD, transition: 'width 0.4s' }} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#F0FDF4', borderBottom: '1px solid #BBF7D0', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '1200px', margin: '0 auto' }}>
          <FiTruck size={14} style={{ color: '#16A34A', flexShrink: 0 }} />
          <p style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 600 }}>You qualify for FREE shipping!</p>
        </div>
      )}

      <div className="cart-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 5rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

        {/* ── Cart Items ── */}
        <div>
          <div style={{ backgroundColor: '#fff', border: '1px solid #E8E4DE' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem', borderBottom: idx < cartItems.length - 1 ? '1px solid #F0EDE8' : 'none', alignItems: 'flex-start' }}>
                {/* Image */}
                <div style={{ width: '88px', height: '88px', flexShrink: 0, border: '1px solid #E8E4DE', backgroundColor: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={item.image || '/placeholder.jpg'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', fontWeight: 600, color: DARK, marginBottom: '0.2rem', lineHeight: 1.3 }}>{item.name}</p>
                  {item.variant && <p style={{ fontSize: '0.65rem', color: '#8C8680', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{item.variant}</p>}
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: GOLD, fontWeight: 600 }}>₹{Number(item.price).toLocaleString('en-IN')}</p>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.75rem' }}>
                    <button onClick={() => qty(item.productId, item.quantity - 1)}
                      style={{ width: '28px', height: '28px', border: '1px solid #D4CFC8', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: DARK }}>
                      <FiMinus size={11} />
                    </button>
                    <span style={{ width: '28px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: DARK }}>{item.quantity}</span>
                    <button onClick={() => qty(item.productId, item.quantity + 1)}
                      style={{ width: '28px', height: '28px', border: '1px solid #D4CFC8', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: DARK }}>
                      <FiPlus size={11} />
                    </button>
                  </div>
                </div>

                {/* Price + remove */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700, color: DARK }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  <button onClick={() => remove(item.productId)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B0A89E', padding: '4px' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
                    onMouseLeave={e => e.currentTarget.style.color = '#B0A89E'}>
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/products" style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6560', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div style={{ position: 'sticky', top: '130px' }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid #E8E4DE', padding: '1.75rem' }}>
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '1.5rem', fontWeight: 600 }}>Order Summary</p>

            {/* Coupon input */}
            {!coupon ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6560', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                  <FiTag size={11} /> Coupon Code
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    placeholder="Enter code"
                    style={{ flex: 1, padding: '0.6rem 0.75rem', border: '1px solid #D4CFC8', fontFamily: 'Jost, sans-serif', fontSize: '0.78rem', color: DARK, outline: 'none', backgroundColor: '#FAFAF8', letterSpacing: '0.06em' }}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    style={{ padding: '0.6rem 1rem', backgroundColor: DARK, color: '#fff', border: 'none', fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: couponLoading ? 'not-allowed' : 'pointer', opacity: couponLoading ? 0.7 : 1 }}>
                    {couponLoading ? '…' : 'Apply'}
                  </button>
                </div>
                {couponError && <p style={{ fontSize: '0.65rem', color: '#DC2626', marginTop: '0.4rem' }}>{couponError}</p>}
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem', padding: '0.65rem 0.85rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.68rem', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FiTag size={11} /> {coupon.code}
                  </p>
                  <p style={{ fontSize: '0.6rem', color: '#15803D', marginTop: '1px' }}>
                    {coupon.discountType === 'percent' ? `${coupon.discountValue}% off applied` : `₹${Number(coupon.discountValue).toLocaleString('en-IN')} off applied`}
                  </p>
                </div>
                <button onClick={removeCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.65rem', color: '#6B7280' }}>✕</button>
              </div>
            )}

            {/* Line items */}
            <div style={{ borderTop: '1px solid #E8E4DE', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B6560' }}>
                <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#16A34A' }}>
                  <span>Discount ({coupon?.code})</span><span>−₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: shipping === 0 ? '#16A34A' : '#6B6560' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: shipping === 0 ? 600 : 400 }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E8E4DE', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: DARK, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, color: GOLD }}>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { coupon, discount } })}
              style={{ width: '100%', backgroundColor: GOLD, color: DARK, border: 'none', padding: '1rem', fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Proceed to Checkout <FiArrowRight size={14} />
            </button>

            {/* Trust signals */}
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {['Secure Payment', '7-Day Return', 'Free Ship above ₹5000'].map(t => (
                <span key={t} style={{ fontSize: '0.55rem', color: '#8C8680', letterSpacing: '0.08em', textTransform: 'uppercase' }}>✓ {t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: sticky checkout */}
      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
