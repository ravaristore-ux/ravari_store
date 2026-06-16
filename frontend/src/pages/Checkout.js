import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiArrowLeft, FiCheckCircle, FiTruck, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import api from '../api/axiosConfig';
import { trackPageView } from '../utils/ga4Tracking';

const GOLD = '#C9A84C';
const inp = {
  width: '100%', padding: '0.75rem 1rem',
  border: '1px solid #E0DBD4', outline: 'none',
  fontFamily: 'Jost, sans-serif', fontSize: '0.82rem',
  color: '#0D0D0D', backgroundColor: '#FAFAF8',
  transition: 'border-color 0.2s', borderRadius: '1px',
};

const PAYMENT_OPTIONS = [
  { id: 'razorpay', label: 'Pay Online', sub: 'UPI · Credit/Debit Card · Net Banking · Wallets', icon: <FiCreditCard size={18} /> },
  { id: 'cod',      label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: <FiTruck size={18} /> },
];

export default function Checkout() {
  const cartItems  = useSelector(s => s.cart?.items || []);
  const { user }   = useSelector(s => s.auth || {});
  const dispatch   = useDispatch();

  const navigate = useNavigate();
  const [step,    setStep]    = useState(1); // 1=address, 2=payment
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', street: '', city: '', state: '',
    postalCode: '', country: 'India',
    paymentMethod: 'razorpay', orderNotes: '', giftWrap: false,
  });

  useEffect(() => {
    trackPageView('/checkout', 'Checkout | RAVARI');
    if (!document.getElementById('razorpay-sdk')) {
      const s = document.createElement('script');
      s.id  = 'razorpay-sdk';
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(s);
    }
  }, []);

  const coupon   = useSelector(s => s.cart?.coupon || null);
  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const discount = coupon
    ? coupon.discountType === 'percent'
      ? Math.round(subtotal * coupon.discountValue / 100)
      : Math.min(coupon.discountValue, subtotal)
    : 0;
  const shipping = subtotal > 5000 ? 0 : 100;
  const giftWrapFee = form.giftWrap ? 49 : 0;
  const total    = subtotal - discount + shipping + giftWrapFee;

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const requiredAddr = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'postalCode'];
  const addrValid = requiredAddr.every(k => form[k].trim());

  /* ── Razorpay ── */
  async function payWithRazorpay() {
    setLoading(true); setError('');
    // Ensure Razorpay SDK is loaded
    if (!window.Razorpay) {
      setError('Payment gateway is loading, please wait a moment and try again.');
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.post('/payment/razorpay/create', { amount: total, receipt: `rcpt_${Date.now()}` });
      if (!data.order) throw new Error(data.error || 'Could not create payment order');

      const options = {
        key:         data.key,
        amount:      data.order.amount,
        currency:    data.order.currency,
        name:        'RAVARI',
        description: 'Handcrafted Leather Goods',
        order_id:    data.order.id,
        prefill:     { name: `${form.firstName} ${form.lastName}`, email: form.email, contact: form.phone },
        theme:       { color: GOLD },
        handler: function(response) {
          api.post('/payment/razorpay/verify', response)
            .then(v => {
              if (v.data.success) placeOrder('razorpay', response.razorpay_payment_id);
              else { setError('Payment verification failed. Please contact support.'); setLoading(false); }
            })
            .catch(() => { setError('Verification error. Please contact support.'); setLoading(false); });
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  }

  /* ── COD ── */
  async function payWithCOD() {
    setLoading(true); setError('');
    try {
      const payload = buildPayload('cod');
      const { data } = await api.post('/orders/cod', payload);
      if (data.success) {
        dispatch({ type: 'CLEAR_CART' });
        navigate(`/order-confirmation/${data.orderId}`);
      } else throw new Error(data.error);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Order placement failed');
    }
    setLoading(false);
  }

  function buildPayload(method) {
    return {
      customerName:  `${form.firstName} ${form.lastName}`,
      customerEmail: form.email,
      customerPhone: form.phone,
      address:       `${form.street}, ${form.city}, ${form.state} - ${form.postalCode}, ${form.country}`,
      items:         cartItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      subtotal, discount, shipping, total,
      paymentMethod: method,
    };
  }

  async function placeOrder(method, txnId) {
    const payload = { ...buildPayload(method), transactionId: txnId };
    const { data } = await api.post('/orders', payload);
    dispatch({ type: 'CLEAR_CART' });
    navigate(`/order-confirmation/RAV${data.orderId || Date.now()}`);
    setLoading(false);
  }

  async function handlePay() {
    if (form.paymentMethod === 'razorpay') await payWithRazorpay();
    else await payWithCOD();
  }

  /* ── Empty cart ── */
  if (cartItems.length === 0 && step !== 3) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#0D0D0D' }}>Your cart is empty</p>
        <Link to="/products" style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, borderBottom: `1px solid ${GOLD}`, paddingBottom: '2px' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ── Main layout ── */
  return (
    <>
      <div style={{ backgroundColor: '#F5F3EE', minHeight: '100vh', padding: '3rem 0 5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <Link to="/cart" style={{ color: '#8C8680', display: 'flex' }}><FiArrowLeft size={18} /></Link>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 400, color: '#0D0D0D' }}>Checkout</h1>
          </div>

          {/* Steps indicator */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
            {['Delivery', 'Payment'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontFamily: 'Jost, sans-serif', fontWeight: 600, backgroundColor: step > i + 1 ? GOLD : step === i + 1 ? '#0D0D0D' : '#D4CFC8', color: '#FFF' }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: step === i + 1 ? '#0D0D0D' : '#8C8680' }}>{s}</span>
              </div>
            ))}
          </div>

          <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

            {/* ── Left panel ── */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid #E8E4DE' }}>

              {/* STEP 1 — Address */}
              {step === 1 && (
                <>
                  <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0D0D0D', marginBottom: '1.5rem' }}>Delivery Address</h2>
                  <div className="address-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    {[
                      { name: 'firstName', placeholder: 'First Name *', col: 1 },
                      { name: 'lastName',  placeholder: 'Last Name *',  col: 1 },
                      { name: 'email',     placeholder: 'Email Address *', col: 2 },
                      { name: 'phone',     placeholder: 'Phone Number *',  col: 2 },
                      { name: 'street',    placeholder: 'Street Address *', col: 2 },
                      { name: 'city',      placeholder: 'City *',       col: 1 },
                      { name: 'state',     placeholder: 'State *',      col: 1 },
                      { name: 'postalCode',placeholder: 'PIN Code *',   col: 1 },
                      { name: 'country',   placeholder: 'Country',      col: 1 },
                    ].map(f => (
                      <input key={f.name} name={f.name} placeholder={f.placeholder}
                        value={form[f.name]} onChange={set}
                        style={{ ...inp, gridColumn: f.col === 2 ? 'span 2' : 'span 1' }}
                        onFocus={e => e.target.style.borderColor = GOLD}
                        onBlur={e => e.target.style.borderColor = '#E0DBD4'} />
                    ))}
                  </div>
                  {/* Gift wrap */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '1rem', padding: '0.85rem 1rem', border: `1.5px solid ${form.giftWrap ? GOLD : '#E0DBD4'}`, cursor: 'pointer', backgroundColor: form.giftWrap ? '#FDFBF6' : '#FFF', transition: 'border-color 0.2s' }}>
                    <input type="checkbox" checked={form.giftWrap} onChange={e => setForm(f => ({ ...f, giftWrap: e.target.checked }))} style={{ accentColor: GOLD, marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#0D0D0D' }}>🎁 Gift Wrap — ₹49</p>
                      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', color: '#8C8680', marginTop: '2px' }}>Premium tissue wrap with a RAVARI ribbon. Add a personalised note in Order Instructions below.</p>
                    </div>
                  </label>

                  {/* Order notes */}
                  <div style={{ marginTop: '0.85rem' }}>
                    <textarea name="orderNotes" value={form.orderNotes} onChange={set} rows={2}
                      placeholder="Delivery instructions (optional) — e.g. call before delivery, leave at door..."
                      style={{ ...inp, resize: 'none', fontSize: '0.78rem' }}
                      onFocus={e => e.target.style.borderColor = '#C9A84C'}
                      onBlur={e => e.target.style.borderColor = '#E0DBD4'} />
                  </div>

                  <button onClick={() => addrValid && setStep(2)} disabled={!addrValid}
                    style={{ marginTop: '1.5rem', width: '100%', padding: '0.9rem', backgroundColor: addrValid ? '#0D0D0D' : '#D4CFC8', color: '#FFF', fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: addrValid ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>
                    Continue to Payment
                  </button>
                </>
              )}

              {/* STEP 2 — Payment */}
              {step === 2 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button onClick={() => setStep(1)} style={{ color: '#8C8680', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><FiArrowLeft size={16} /></button>
                    <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0D0D0D' }}>Payment Method</h2>
                  </div>

                  {/* Delivery summary */}
                  <div style={{ background: '#F5F3EE', padding: '0.85rem 1rem', marginBottom: '1.5rem', borderLeft: `3px solid ${GOLD}` }}>
                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#4A4642', lineHeight: 1.7 }}>
                      <strong>{form.firstName} {form.lastName}</strong> · {form.phone}<br />
                      {form.street}, {form.city}, {form.state} — {form.postalCode}
                    </p>
                  </div>

                  {/* Payment options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {PAYMENT_OPTIONS.map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', border: `1.5px solid ${form.paymentMethod === opt.id ? GOLD : '#E0DBD4'}`, cursor: 'pointer', transition: 'border-color 0.2s', backgroundColor: form.paymentMethod === opt.id ? '#FDFBF6' : '#FFF' }}>
                        <input type="radio" name="paymentMethod" value={opt.id} checked={form.paymentMethod === opt.id} onChange={set} style={{ accentColor: GOLD }} />
                        <span style={{ color: GOLD }}>{opt.icon}</span>
                        <div>
                          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#0D0D0D' }}>{opt.label}</p>
                          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', color: '#8C8680', marginTop: '2px' }}>{opt.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {error && <p style={{ color: '#C0392B', fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', marginBottom: '1rem' }}>{error}</p>}

                  <button onClick={handlePay} disabled={loading}
                    style={{ width: '100%', padding: '0.95rem', backgroundColor: loading ? '#D4CFC8' : GOLD, color: '#0D0D0D', fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
                    {loading ? 'Processing…' : form.paymentMethod === 'cod' ? `Place COD Order — ₹${total.toLocaleString('en-IN')}` : `Pay ₹${total.toLocaleString('en-IN')}`}
                  </button>

                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', color: '#8C8680', textAlign: 'center', marginTop: '1rem' }}>
                    🔒 Secure checkout · Payments powered by Razorpay
                  </p>
                </>
              )}
            </div>

            {/* ── Order Summary ── */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', border: '1px solid #E8E4DE', position: 'sticky', top: '6rem' }}>
              <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0D0D0D', marginBottom: '1.25rem' }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E8E4DE' }}>
                {cartItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', flexShrink: 0, backgroundColor: '#F0EDE8', overflow: 'hidden' }}>
                      {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#0D0D0D', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', color: '#8C8680', marginTop: '2px' }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#0D0D0D', flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              {[
                { label: 'Subtotal',  val: `₹${subtotal.toLocaleString('en-IN')}` },
                { label: 'Shipping',  val: shipping === 0 ? 'FREE' : `₹${shipping}` },
                ...(giftWrapFee > 0 ? [{ label: 'Gift Wrap', val: '₹49' }] : []),
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#4A4642' }}>{r.label}</span>
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#0D0D0D' }}>{r.val}</span>
                </div>
              ))}
              <div style={{ height: '1px', backgroundColor: '#E8E4DE', margin: '0.85rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 600, color: '#0D0D0D' }}>Total</span>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 600, color: GOLD }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
              {shipping === 0 && <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', color: '#C9A84C', marginTop: '0.5rem', textAlign: 'right' }}>✓ Free shipping applied</p>}

              {/* Payment trust logos */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E8E4DE' }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B0A89E', textAlign: 'center', marginBottom: '0.75rem' }}>Secure & Trusted Payments</p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {['UPI', 'Visa', 'Mastercard', 'RuPay', 'Net Banking'].map(m => (
                    <span key={m} style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.05em', color: '#6B6560', border: '1px solid #E0DBD4', padding: '3px 8px', borderRadius: '3px', backgroundColor: '#FAFAF8' }}>{m}</span>
                  ))}
                </div>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', color: '#B0A89E', textAlign: 'center', marginTop: '0.6rem' }}>🔒 256-bit SSL · Powered by Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
