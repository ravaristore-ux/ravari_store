import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiX, FiSend, FiChevronDown } from 'react-icons/fi';

const GOLD = '#C9A84C';
const DARK = '#0D0B08';

const FAQS = [
  {
    patterns: ['shipping', 'delivery', 'deliver', 'days', 'how long', 'when will'],
    answer: '🚚 We deliver across India in **5–7 business days**. Free shipping on orders above ₹5,000. Below that, flat ₹100 shipping charge.',
    quick: ['Track my order', 'Return policy', 'Talk to us'],
  },
  {
    patterns: ['return', 'exchange', 'refund', 'replace', 'back'],
    answer: '↩️ We have a **7-day easy return policy**. If you\'re not happy with your purchase, WhatsApp us within 7 days of delivery with your order ID and photos.',
    quick: ['How to return', 'Contact support', 'Track my order'],
  },
  {
    patterns: ['payment', 'pay', 'upi', 'card', 'cod', 'cash', 'online', 'razorpay', 'net banking'],
    answer: '💳 We accept **UPI, Credit/Debit Cards, Net Banking, Wallets** (via Razorpay) and **Cash on Delivery**. All online payments are 256-bit SSL secured.',
    quick: ['Place an order', 'Shipping info', 'Talk to us'],
  },
  {
    patterns: ['track', 'tracking', 'order status', 'where is my order', 'order id'],
    answer: '📦 You can track your order at our **Track Order** page. You\'ll need your Order ID (starts with RAV) and email address.',
    quick: ['Go to Track Order', 'Contact support', 'Return policy'],
  },
  {
    patterns: ['price', 'cost', 'how much', 'rate', 'discount', 'offer', 'sale', 'coupon'],
    answer: '🏷️ Our prices range from **₹999 to ₹4,999**. We regularly offer discounts — subscribe to our newsletter for 10% off your first order!',
    quick: ['Shop now', 'Shipping info', 'Talk to us'],
  },
  {
    patterns: ['material', 'leather', 'quality', 'genuine', 'real', 'full grain', 'made of'],
    answer: '✨ All RAVARI products are made from **Full Grain Leather** — the highest quality leather available. Durable, textured, and reinforced stitching for lasting elegance.',
    quick: ['Shop now', 'Return policy', 'Contact support'],
  },
  {
    patterns: ['bag', 'wallet', 'handbag', 'tote', 'sling', 'purse', 'product', 'collection'],
    answer: '👜 We offer **Tote Bags, Sling Bags, Handbags, Wallets** and Accessories — all handcrafted in full grain leather. Visit our Shop to explore the full collection.',
    quick: ['Shop now', 'Pricing', 'Shipping info'],
  },
  {
    patterns: ['contact', 'support', 'help', 'human', 'agent', 'whatsapp', 'call', 'email', 'talk'],
    answer: '📞 Our team is here to help!\n\n📱 **WhatsApp:** +91 90842 60869\n📧 **Email:** ravari.store@gmail.com\n📍 **Address:** 4A Prakash Apartment, 44A Cantt Road, Lucknow — 226001',
    quick: ['WhatsApp us now', 'Track my order', 'Return policy'],
  },
  {
    patterns: ['location', 'address', 'lucknow', 'where', 'store', 'shop'],
    answer: '📍 RAVARI is based in **Lucknow, India**. We ship across all of India. Currently we are an online-only store.',
    quick: ['Shop now', 'Shipping info', 'Contact support'],
  },
  {
    patterns: ['cancel', 'cancellation', 'cancel order'],
    answer: '❌ To cancel an order, please **WhatsApp us immediately** at +91 90842 60869 with your Order ID. We can cancel before it ships. Once shipped, you can return it within 7 days.',
    quick: ['WhatsApp us now', 'Return policy', 'Track my order'],
  },
  {
    patterns: ['gift', 'wrap', 'wrapping', 'gifting', 'present'],
    answer: '🎁 Yes! We offer **premium gift wrapping** (tissue paper + ribbon) for just ₹49 extra. You can add it at checkout.',
    quick: ['Shop now', 'Shipping info', 'Contact support'],
  },
  {
    patterns: ['hi', 'hello', 'hey', 'helo', 'namaste', 'hii', 'good morning', 'good evening'],
    answer: '👋 Hello! Welcome to **RAVARI** — Luxury Handcrafted Leather Goods.\n\nHow can I help you today?',
    quick: ['Shipping info', 'Return policy', 'Track my order', 'Shop now'],
  },
];

const QUICK_ACTIONS = [
  { label: '🚚 Shipping info', msg: 'shipping' },
  { label: '↩️ Return policy', msg: 'return policy' },
  { label: '📦 Track my order', msg: 'track my order' },
  { label: '💳 Payment options', msg: 'payment options' },
  { label: '📞 Contact support', msg: 'contact support' },
  { label: '👜 View products', msg: 'products' },
];

function findAnswer(text) {
  const lower = text.toLowerCase();
  for (const faq of FAQS) {
    if (faq.patterns.some(p => lower.includes(p))) return faq;
  }
  return null;
}

function formatMsg(text) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    {
      from: 'bot',
      text: '👋 Hi! I\'m RAVARI\'s virtual assistant.\n\nHow can I help you today?',
      quick: ['Shipping info', 'Return policy', 'Track my order', 'Payment options'],
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  function handleQuick(label) {
    if (label === 'WhatsApp us now') {
      window.open('https://wa.me/919084260869?text=Hi%20RAVARI%2C%20I%20need%20help%20with%20my%20order', '_blank');
      return;
    }
    if (label === 'Go to Track Order') { navigate('/track-order'); setOpen(false); return; }
    if (label === 'Shop now') { navigate('/products'); setOpen(false); return; }
    sendMsg(label);
  }

  function sendMsg(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMsgs(m => [...m, { from: 'user', text: msg }]);
    setTyping(true);

    setTimeout(() => {
      const faq = findAnswer(msg);
      const reply = faq
        ? { from: 'bot', text: faq.answer, quick: faq.quick }
        : {
            from: 'bot',
            text: "I'm not sure about that, but our team can help! 😊\n\nContact us on **WhatsApp** at +91 90842 60869 or email **ravari.store@gmail.com**",
            quick: ['WhatsApp us now', 'Return policy', 'Track my order'],
          };
      setTyping(false);
      setMsgs(m => [...m, reply]);
    }, 800);
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px',
          width: '340px', maxHeight: '520px',
          backgroundColor: '#fff', borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          zIndex: 9999, overflow: 'hidden',
          fontFamily: 'Jost, sans-serif',
        }}>
          {/* Header */}
          <div style={{ background: DARK, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>R</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: GOLD, fontWeight: 600, fontSize: '14px', letterSpacing: '1px' }}>RAVARI Support</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>● Online • Replies instantly</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              <FiChevronDown size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#F9F7F4' }}>
            {msgs.map((m, i) => (
              <div key={i}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: m.from === 'bot' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                  background: m.from === 'bot' ? '#fff' : GOLD,
                  color: m.from === 'bot' ? '#222' : '#fff',
                  fontSize: '13px', lineHeight: '1.5',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  alignSelf: m.from === 'bot' ? 'flex-start' : 'flex-end',
                  marginLeft: m.from === 'user' ? 'auto' : '0',
                }}>
                  {formatMsg(m.text)}
                </div>
                {m.quick && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {m.quick.map((q, qi) => (
                      <button key={qi} onClick={() => handleQuick(q)} style={{
                        padding: '5px 10px', border: `1px solid ${GOLD}`, borderRadius: '20px',
                        background: 'transparent', color: GOLD, fontSize: '11px', cursor: 'pointer',
                        fontFamily: 'Jost, sans-serif', letterSpacing: '0.5px',
                      }}>{q}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '4px 14px 14px 14px', width: '60px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <span style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  {[0,1,2].map(j => <span key={j} style={{ width: '6px', height: '6px', borderRadius: '50%', background: GOLD, animation: `bounce 1s ${j*0.2}s infinite` }} />)}
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick actions row */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #f0ede8', display: 'flex', gap: '6px', overflowX: 'auto', background: '#fff' }}>
            {QUICK_ACTIONS.map((a, i) => (
              <button key={i} onClick={() => sendMsg(a.msg)} style={{
                whiteSpace: 'nowrap', padding: '4px 10px', border: '1px solid #e0dbd4',
                borderRadius: '20px', background: '#fafaf8', fontSize: '11px',
                cursor: 'pointer', fontFamily: 'Jost, sans-serif', color: '#555',
              }}>{a.label}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', borderTop: '1px solid #f0ede8', background: '#fff' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
              placeholder="Type your question..."
              style={{
                flex: 1, padding: '12px 16px', border: 'none', outline: 'none',
                fontSize: '13px', fontFamily: 'Jost, sans-serif', background: 'transparent',
              }}
            />
            <button onClick={() => sendMsg()} style={{ padding: '0 16px', background: 'none', border: 'none', cursor: 'pointer', color: GOLD }}>
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '20px', right: '80px',
          width: '52px', height: '52px', borderRadius: '50%',
          background: DARK, border: `2px solid ${GOLD}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Chat support"
      >
        {open ? <FiX size={22} color={GOLD} /> : <FiMessageSquare size={22} color={GOLD} />}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
