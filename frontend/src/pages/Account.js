import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiLogOut, FiUser, FiShoppingBag, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../api/axiosConfig';
import { trackPageView } from '../utils/ga4Tracking';

const GOLD = '#C9A84C';
const DARK = '#0D0B08';

const STATUS_COLORS = {
  pending:     { bg: '#FEF3C7', color: '#92400E' },
  cod_pending: { bg: '#FEF3C7', color: '#92400E' },
  processing:  { bg: '#DBEAFE', color: '#1E40AF' },
  shipped:     { bg: '#D1FAE5', color: '#065F46' },
  delivered:   { bg: '#D1FAE5', color: '#065F46' },
  cancelled:   { bg: '#FEE2E2', color: '#991B1B' },
};

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
  const label = { pending: 'Order Placed', cod_pending: 'COD — Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }[order.status] || order.status;
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ border: '1px solid #E8E4DE', backgroundColor: '#fff', marginBottom: '1rem' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <FiPackage size={16} style={{ color: GOLD, flexShrink: 0 }} />
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: DARK }}>Order #RAV{order.id}</p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', color: '#8C8680', marginTop: '2px' }}>{date}</p>
          </div>
          <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', backgroundColor: sc.bg, color: sc.color }}>
            {label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', fontWeight: 600, color: DARK }}>₹{Number(order.total).toLocaleString('en-IN')}</span>
          {open ? <FiChevronUp size={14} style={{ color: '#8C8680' }} /> : <FiChevronDown size={14} style={{ color: '#8C8680' }} />}
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #F0EDE8', padding: '1.25rem 1.5rem' }}>
          {(order.items || []).map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
              {item.image && <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'contain', border: '1px solid #E8E4DE', backgroundColor: '#FAFAF8', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', fontWeight: 500, color: DARK, lineHeight: 1.3 }}>{item.name}</p>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', color: '#8C8680', marginTop: '2px' }}>Qty: {item.quantity || 1} × ₹{Number(item.price).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: '0.85rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to={`/track-order`}
              style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: DARK, border: `1px solid ${DARK}`, padding: '0.45rem 1rem', textDecoration: 'none' }}>
              Track Order
            </Link>
            {order.status === 'delivered' && (
              <Link to="/return-policy#return-form"
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6560', border: '1px solid #D4CFC8', padding: '0.45rem 1rem', textDecoration: 'none' }}>
                Return / Exchange
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Account() {
  const { isAuthenticated, user, token } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [tab, setTab] = useState('orders');

  useEffect(() => { trackPageView('/account', 'My Account — RAVARI'); }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    setOrdersLoading(true);
    api.get('/customer/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOrders(r.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated, token]);

  const logout = () => { dispatch({ type: 'LOGOUT' }); navigate('/'); };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', fontFamily: 'Jost, sans-serif' }}>
        <FiUser size={40} style={{ color: '#D4CFC8' }} />
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: DARK }}>Sign in to view your account</p>
        <p style={{ fontSize: '0.75rem', color: '#8C8680' }}>Track orders, manage returns, and more.</p>
        <Link to="/login" style={{ backgroundColor: GOLD, color: DARK, padding: '0.9rem 2.5rem', fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F7F5', minHeight: '100vh', fontFamily: 'Jost, sans-serif' }}>

      {/* Header */}
      <div style={{ backgroundColor: DARK, padding: '2.5rem 2rem', textAlign: 'center' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.15)', border: `1.5px solid rgba(201,168,76,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <FiUser size={22} style={{ color: GOLD }} />
        </div>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 400, color: '#fff', marginBottom: '0.25rem' }}>{user?.name || user?.email?.split('@')[0]}</p>
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>{user?.email}</p>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E8E4DE', marginBottom: '2rem' }}>
          {[{ key: 'orders', label: 'My Orders', icon: <FiShoppingBag size={14} /> }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.5rem', fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: tab === t.key ? `2px solid ${GOLD}` : '2px solid transparent', color: tab === t.key ? DARK : '#8C8680', cursor: 'pointer', marginBottom: '-1px' }}>
              {t.icon}{t.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.5rem', fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', color: '#8C8680', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
            <FiLogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Orders */}
        {ordersLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8C8680' }}>Loading orders…</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', border: '1px solid #E8E4DE' }}>
            <FiShoppingBag size={36} style={{ color: '#D4CFC8', marginBottom: '1rem' }} />
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: DARK, marginBottom: '0.5rem' }}>No orders yet</p>
            <p style={{ fontSize: '0.75rem', color: '#8C8680', marginBottom: '1.5rem' }}>Your orders will appear here once you place one.</p>
            <Link to="/products" style={{ backgroundColor: GOLD, color: DARK, padding: '0.8rem 2rem', fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.65rem', color: '#8C8680', marginBottom: '1rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </>
        )}
      </div>
    </div>
  );
}
