import React, { useState } from 'react';
import SEO from '../components/SEO';

const GOLD = '#C9A84C';
const DARK = '#0D0B08';

const RETURN_REASONS = [
  'Product received is damaged',
  'Wrong product delivered',
  'Product not as described',
  'Quality not as expected',
  'Size/fit issue',
  'Missing parts or accessories',
  'Defective product',
  'Changed my mind',
  'Other',
];

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '2.5rem' }}>
    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 500, color: DARK, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E8E4DE' }}>
      {title}
    </h2>
    <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', lineHeight: 1.9, color: '#4A4642' }}>
      {children}
    </div>
  </div>
);

const Bullet = ({ children }) => (
  <li style={{ marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
    <span style={{ color: GOLD, marginRight: '0.5rem' }}>—</span>{children}
  </li>
);

export default function ReturnPolicy() {
  const [form, setForm] = useState({ orderId: '', customerName: '', customerEmail: '', customerPhone: '', reason: '', description: '' });
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.orderId || !form.reason) { setError('Order ID and reason are required.'); return; }
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('photos', f));
      const res = await fetch('/api/returns/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { setSubmitted(true); }
      else { setError(data.error || 'Something went wrong. Please try again.'); }
    } catch (e) { setError('Connection error. Please email us at ravari.store@gmail.com'); }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', padding: '0.75rem 1rem',
    border: '1px solid #D4CFC8', backgroundColor: '#FAFAF8', color: '#2A2320', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <SEO title="Return & Refund Policy — RAVARI" description="RAVARI's 7-day return policy. Learn how to return products, eligibility conditions, and refund timelines." />

      {/* Header */}
      <div style={{ backgroundColor: DARK, padding: '4rem 2rem 3.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.7rem' }}>Customer First</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 400, color: '#FFFFFF', lineHeight: 1.2 }}>Return & Refund Policy</h1>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '1rem', letterSpacing: '0.05em' }}>Effective Date: June 2026 · Last Updated: June 2026</p>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

        {/* Quick summary banner */}
        <div style={{ backgroundColor: '#F8F5EF', border: '1px solid rgba(201,168,76,0.3)', padding: '1.5rem 2rem', marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.25rem' }}>
          {[
            { label: 'Return Window', value: '7 Days' },
            { label: 'Refund Method', value: 'Original Payment' },
            { label: 'Refund Timeline', value: '5–7 Business Days' },
            { label: 'Exchange', value: 'Available' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 600, color: DARK, lineHeight: 1 }}>{value}</p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680', marginTop: '0.25rem' }}>{label}</p>
            </div>
          ))}
        </div>

        <Section title="1. Overview">
          <p>At RAVARI, we stand behind the quality of every handcrafted product. If you are not completely satisfied with your purchase, we offer a <strong>7-day return window</strong> from the date of delivery. We are committed to making the return process as smooth and transparent as possible.</p>
        </Section>

        <Section title="2. Return Eligibility">
          <p style={{ marginBottom: '0.75rem' }}>To be eligible for a return, the following conditions must be met:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Bullet>Return request must be initiated within <strong>7 days</strong> of delivery date.</Bullet>
            <Bullet>Product must be <strong>unused, unworn, and in its original condition</strong> with no signs of use or damage caused by the customer.</Bullet>
            <Bullet>Product must be returned in its <strong>original packaging</strong> including dust bag, tags, and any accessories included.</Bullet>
            <Bullet>A valid <strong>proof of purchase</strong> (order ID or invoice) must be provided.</Bullet>
            <Bullet>Photos of the product and packaging must be shared at the time of return request submission.</Bullet>
            <Bullet>Items must not have been <strong>personalised, engraved, or customised</strong>.</Bullet>
          </ul>
        </Section>

        <Section title="3. Non-Returnable Items">
          <p style={{ marginBottom: '0.75rem' }}>The following items are <strong>NOT eligible for return or exchange</strong>:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Bullet>Products that have been used, worn, washed, or altered.</Bullet>
            <Bullet>Items with removed or missing tags.</Bullet>
            <Bullet>Personalised or custom-made products.</Bullet>
            <Bullet>Products damaged due to misuse, negligence, or improper care.</Bullet>
            <Bullet>Sale items marked as "Final Sale" or purchased during clearance.</Bullet>
            <Bullet>Gift cards and vouchers.</Bullet>
            <Bullet>Products without original packaging.</Bullet>
          </ul>
        </Section>

        <Section title="4. Valid Reasons for Return">
          <p style={{ marginBottom: '0.75rem' }}>We accept returns for the following reasons:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Bullet>Product received is damaged or defective.</Bullet>
            <Bullet>Wrong product was delivered.</Bullet>
            <Bullet>Product is significantly different from the description or photographs on the website.</Bullet>
            <Bullet>Missing parts, accessories, or components.</Bullet>
            <Bullet>Manufacturing defects found upon first use.</Bullet>
          </ul>
          <p style={{ marginTop: '0.75rem', color: '#6B6560', fontSize: '0.8rem' }}>
            <em>Note: "Change of mind" returns may be accepted at our discretion and may be subject to a restocking fee of up to 10% of the product value.</em>
          </p>
        </Section>

        <Section title="5. How to Initiate a Return">
          <p style={{ marginBottom: '0.75rem' }}>To initiate a return, please follow these steps:</p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'Fill out the Return Request Form below on this page.',
              'Include your Order ID, reason for return, and clear photographs of the product and its packaging.',
              'Our team will review your request within 24–48 business hours.',
              'If approved, you will receive a return confirmation email with pickup/drop-off instructions.',
              'Pack the product securely in its original packaging and hand it to our courier partner.',
              'Once we receive and inspect the product, your refund or exchange will be processed.',
            ].map((step, i) => (
              <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, color: GOLD, lineHeight: 1.4, flexShrink: 0 }}>{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="6. Refund Policy">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Bullet>Once the returned product is received and inspected, we will notify you of the approval or rejection of your refund.</Bullet>
            <Bullet>If approved, refunds are processed to your <strong>original payment method</strong> within <strong>5–7 business days</strong>.</Bullet>
            <Bullet>For Cash on Delivery (COD) orders, refunds will be transferred to your bank account via NEFT/IMPS. Bank account details will be collected at the time of return approval.</Bullet>
            <Bullet>Razorpay/UPI payments are refunded to the original source account.</Bullet>
            <Bullet>Original shipping charges are <strong>non-refundable</strong> unless the return is due to a defect or wrong product.</Bullet>
            <Bullet>If the returned product is found to be used or damaged by the customer, no refund will be issued and the product will be returned to the customer.</Bullet>
          </ul>
        </Section>

        <Section title="7. Exchange Policy">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Bullet>Exchanges are available for a different variant (size, colour, slot) of the same product, subject to availability.</Bullet>
            <Bullet>Exchange requests must be made within the 7-day return window.</Bullet>
            <Bullet>No additional charges for exchange if the product value is the same.</Bullet>
            <Bullet>If the exchange product has a higher value, the price difference must be paid before dispatch.</Bullet>
            <Bullet>If the exchange product has a lower value, the difference will be refunded.</Bullet>
          </ul>
        </Section>

        <Section title="8. Return Shipping">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Bullet>For returns due to damaged, defective, or wrong products — return shipping is <strong>borne by RAVARI</strong>. We will arrange a pickup at no cost to you.</Bullet>
            <Bullet>For all other returns (e.g., change of mind) — return shipping charges are borne by the customer.</Bullet>
            <Bullet>We recommend using a trackable shipping method for self-shipped returns. RAVARI is not responsible for items lost in transit.</Bullet>
          </ul>
        </Section>

        <Section title="9. Damaged or Defective Products">
          <p>If you receive a product that is damaged in transit or has a manufacturing defect:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0' }}>
            <Bullet>Take photographs/video immediately upon opening the package.</Bullet>
            <Bullet>Submit a return request within <strong>48 hours</strong> of delivery (for transit damage).</Bullet>
            <Bullet>We will prioritise these cases and arrange a replacement or full refund at no cost to you.</Bullet>
          </ul>
        </Section>

        <Section title="10. Contact Us for Returns">
          <p>For any return-related queries, reach out to us:</p>
          <ul style={{ listStyle: 'none', padding: '0.5rem 0 0', margin: 0 }}>
            <Bullet><strong>Email:</strong> ravari.store@gmail.com</Bullet>
            <Bullet><strong>Phone / WhatsApp:</strong> +91 90842 60869</Bullet>
            <Bullet><strong>Business Hours:</strong> Monday – Saturday, 10:00 AM – 6:00 PM IST</Bullet>
          </ul>
        </Section>

        {/* ── Return Request Form ── */}
        <div id="return-form" style={{ backgroundColor: '#F8F7F5', border: '1px solid #E8E4DE', padding: '2.5rem', marginTop: '1rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.5rem' }}>Start Your Return</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 500, color: DARK }}>Return Request Form</h2>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: GOLD, marginBottom: '0.75rem' }}>✓</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 500, color: DARK, marginBottom: '0.5rem' }}>Return Request Submitted</h3>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', color: '#6B6560', lineHeight: 1.7 }}>We have received your return request. Our team will review it and contact you at your provided email/phone within <strong>24–48 business hours</strong>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem 1rem', fontSize: '0.78rem', marginBottom: '1.25rem', fontFamily: 'Jost, sans-serif' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.4rem' }}>Order ID *</label>
                  <input type="text" placeholder="e.g. RAV123 or 45" value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = '#D4CFC8'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.4rem' }}>Full Name *</label>
                  <input type="text" placeholder="Your name" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = '#D4CFC8'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.4rem' }}>Email *</label>
                  <input type="email" placeholder="your@email.com" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = '#D4CFC8'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.4rem' }}>Phone / WhatsApp</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = '#D4CFC8'} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.4rem' }}>Reason for Return *</label>
                <select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = '#D4CFC8'}>
                  <option value="">Select a reason</option>
                  {RETURN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.4rem' }}>Additional Details</label>
                <textarea rows={4} placeholder="Describe the issue in detail — what happened, when you noticed it..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical', height: '100px' }} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = '#D4CFC8'} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.4rem' }}>
                  Product Photos <span style={{ color: '#B0A89E', fontWeight: 400 }}>(recommended — up to 5 images)</span>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1.5rem', border: `1.5px dashed ${files.length ? GOLD : '#D4CFC8'}`, backgroundColor: files.length ? '#FDFBF6' : '#FAFAF8', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => setFiles(Array.from(e.target.files).slice(0, 5))} />
                  <span style={{ fontSize: '1.5rem' }}>📷</span>
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#4A4642' }}>
                    {files.length ? `${files.length} photo${files.length > 1 ? 's' : ''} selected` : 'Click to attach photos'}
                  </span>
                  <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', color: '#8C8680' }}>JPG, PNG · Max 5 files · Sent directly with your request</span>
                </label>
                {files.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {files.map((f, i) => (
                      <span key={i} style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', color: '#4A4642', backgroundColor: '#F0EDE8', padding: '3px 10px', borderRadius: '2px' }}>
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading}
                style={{ backgroundColor: DARK, color: '#fff', padding: '0.9rem 3rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: loading ? 0.7 : 1, transition: 'background-color 0.2s' }}
                onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = '#2A1F18'; }}
                onMouseLeave={e => e.target.style.backgroundColor = DARK}>
                {loading ? 'Submitting…' : 'Submit Return Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
