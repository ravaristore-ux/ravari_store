import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiTruck, FiMapPin, FiPhone, FiMail, FiRotateCcw, FiPrinter } from 'react-icons/fi';

const GOLD = '#C9A84C';
const DARK = '#0D0B08';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_LABELS = { pending: 'Order Placed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cod_pending: 'Order Placed', cancelled: 'Cancelled' };

function getDeliveryEstimate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = String(orderId || '').replace(/^RAV/i, '');
    if (!id) { setLoading(false); return; }
    fetch('/api/orders/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id }),
    })
      .then(r => r.json())
      .then(d => { if (d.found) setOrder(d.order); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const statusIdx = order ? STATUS_STEPS.indexOf(order.status === 'cod_pending' ? 'pending' : order.status) : 0;

  return (
    <div style={{ backgroundColor: '#F8F7F5', minHeight: '100vh', fontFamily: 'Jost, sans-serif' }}>

      {/* Hero */}
      <div style={{ backgroundColor: DARK, padding: '3rem 2rem', textAlign: 'center' }}>
        <FiCheckCircle size={44} style={{ color: GOLD, marginBottom: '1rem' }} />
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Order Confirmed
        </h1>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em' }}>
          Order ID: <strong style={{ color: GOLD }}>{orderId}</strong>
        </p>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8C8680' }}>Loading order details…</div>
        ) : (
          <>
            {/* Status tracker */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E4DE', padding: '1.75rem 2rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '1.25rem', fontWeight: 600 }}>Order Status</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {STATUS_STEPS.map((s, i) => {
                  const done = statusIdx >= i;
                  const active = statusIdx === i;
                  return (
                    <React.Fragment key={s}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: '0 0 auto' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: done ? GOLD : '#E8E4DE', display: 'flex', alignItems: 'center', justifyContent: 'center', border: active ? `2px solid ${DARK}` : 'none', transition: 'background 0.3s' }}>
                          {done ? <span style={{ color: DARK, fontSize: '0.6rem', fontWeight: 700 }}>✓</span> : <span style={{ color: '#8C8680', fontSize: '0.55rem', fontWeight: 600 }}>{i + 1}</span>}
                        </div>
                        <span style={{ fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: done ? DARK : '#8C8680', fontWeight: done ? 600 : 400, whiteSpace: 'nowrap' }}>
                          {STATUS_LABELS[s]}
                        </span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div style={{ flex: 1, height: '2px', backgroundColor: statusIdx > i ? GOLD : '#E8E4DE', margin: '0 0.5rem', marginBottom: '1.2rem', transition: 'background 0.3s' }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', backgroundColor: '#F8F5EF', border: `1px solid rgba(201,168,76,0.3)`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiTruck size={16} style={{ color: GOLD, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, color: DARK }}>Estimated Delivery by {getDeliveryEstimate()}</p>
                  <p style={{ fontSize: '0.62rem', color: '#6B6560', marginTop: '2px' }}>5–7 business days · Free shipping on orders above ₹5000</p>
                </div>
              </div>
            </div>

            {/* Order items + summary */}
            {order && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

                {/* Items */}
                <div style={{ backgroundColor: '#fff', border: '1px solid #E8E4DE', padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '1rem', fontWeight: 600 }}>Items Ordered</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {(order.items || []).map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        {item.image && <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'contain', border: '1px solid #E8E4DE', backgroundColor: '#FAFAF8', flexShrink: 0 }} />}
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 500, color: DARK, lineHeight: 1.3 }}>{item.name}</p>
                          <p style={{ fontSize: '0.65rem', color: '#8C8680', marginTop: '2px' }}>Qty: {item.quantity || 1} × ₹{Number(item.price).toLocaleString('en-IN')}</p>
                        </div>
                        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem', fontWeight: 600, color: DARK, flexShrink: 0 }}>₹{(Number(item.price) * (item.quantity || 1)).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                    {(!order.items || order.items.length === 0) && <p style={{ fontSize: '0.75rem', color: '#8C8680' }}>No item details available</p>}
                  </div>

                  <div style={{ borderTop: '1px solid #E8E4DE', marginTop: '1rem', paddingTop: '1rem' }}>
                    {[
                      { label: 'Subtotal', val: `₹${Number(order.subtotal || 0).toLocaleString('en-IN')}` },
                      { label: 'Shipping', val: Number(order.subtotal || 0) >= 5000 ? 'FREE' : '₹100' },
                      ...(Number(order.discount) > 0 ? [{ label: `Discount`, val: `−₹${Number(order.discount).toLocaleString('en-IN')}`, green: true }] : []),
                    ].map(({ label, val, green }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: green ? '#16A34A' : '#6B6560', marginBottom: '0.35rem' }}>
                        <span>{label}</span><span>{val}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid #E8E4DE', paddingTop: '0.5rem', marginTop: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', color: DARK }}>Total Paid</span>
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: GOLD }}>₹{Number(order.total).toLocaleString('en-IN')}</span>
                    </div>
                    <p style={{ fontSize: '0.6rem', color: '#8C8680', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Via: {order.paymentMethod || 'COD'}</p>
                  </div>
                </div>

                {/* Customer + address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ backgroundColor: '#fff', border: '1px solid #E8E4DE', padding: '1.5rem' }}>
                    <p style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.85rem', fontWeight: 600 }}>Contact</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: DARK }}>{order.customerName}</p>
                      {order.customerEmail && <p style={{ fontSize: '0.72rem', color: '#4A4642', display: 'flex', gap: '0.4rem', alignItems: 'center' }}><FiMail size={11} style={{ color: GOLD }} />{order.customerEmail}</p>}
                      {order.customerPhone && <p style={{ fontSize: '0.72rem', color: '#4A4642', display: 'flex', gap: '0.4rem', alignItems: 'center' }}><FiPhone size={11} style={{ color: GOLD }} />{order.customerPhone}</p>}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#fff', border: '1px solid #E8E4DE', padding: '1.5rem' }}>
                    <p style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.85rem', fontWeight: 600 }}>Delivery Address</p>
                    <p style={{ fontSize: '0.75rem', color: '#4A4642', lineHeight: 1.7, display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                      <FiMapPin size={12} style={{ color: GOLD, marginTop: '3px', flexShrink: 0 }} />{order.address}
                    </p>
                  </div>
                  {order.paymentMethod === 'cod' && (
                    <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', padding: '1rem 1.25rem' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#92400E', marginBottom: '0.25rem' }}>Cash on Delivery</p>
                      <p style={{ fontSize: '0.68rem', color: '#92400E' }}>Please keep <strong>₹{Number(order.total).toLocaleString('en-IN')}</strong> ready at delivery.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Return policy banner */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E4DE', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiRotateCcw size={18} style={{ color: GOLD, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, color: DARK }}>7-Day Return Window Starts Today</p>
                  <p style={{ fontSize: '0.62rem', color: '#6B6560', marginTop: '2px' }}>Not satisfied? You can return this order within 7 days of delivery.</p>
                </div>
              </div>
              <Link to="/return-policy#return-form" style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: DARK, backgroundColor: 'transparent', border: `1px solid ${DARK}`, padding: '0.5rem 1.25rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Initiate Return
              </Link>
            </div>

            {/* Cancel order */}
            {order && (order.status === 'pending' || order.status === 'cod_pending') && (
              <div style={{ backgroundColor: '#fff', border: '1px solid #E8E4DE', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, color: DARK }}>Need to cancel?</p>
                  <p style={{ fontSize: '0.62rem', color: '#6B6560', marginTop: '2px' }}>You can cancel within 1 hour of placing the order. Contact us on WhatsApp.</p>
                </div>
                <a href={`https://wa.me/919084260869?text=Hi%20RAVARI%2C%20I%20want%20to%20cancel%20my%20order%20${orderId}`}
                  target="_blank" rel="noreferrer"
                  style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C0392B', backgroundColor: 'transparent', border: '1px solid #C0392B', padding: '0.5rem 1.25rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Cancel Order
                </a>
              </div>
            )}

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products" style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: DARK, backgroundColor: GOLD, padding: '0.9rem 2rem', textDecoration: 'none', border: `1px solid ${GOLD}` }}>
                Continue Shopping
              </Link>
              <Link to="/track-order" style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: DARK, backgroundColor: 'transparent', padding: '0.9rem 2rem', textDecoration: 'none', border: `1px solid #D4CFC8` }}>
                Track My Order
              </Link>
              {order && (
                <button onClick={() => window.print()}
                  style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: DARK, backgroundColor: 'transparent', padding: '0.9rem 2rem', border: `1px solid #D4CFC8`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FiPrinter size={14} /> Print Invoice
                </button>
              )}
              <a href="https://wa.me/919084260869?text=Hi%20RAVARI%2C%20I%20placed%20an%20order%20and%20need%20help.%20Order%20ID%3A%20" target="_blank" rel="noreferrer"
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#16A34A', backgroundColor: 'transparent', padding: '0.9rem 2rem', textDecoration: 'none', border: '1px solid #16A34A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                WhatsApp Support
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
