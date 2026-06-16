import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const GOLD = '#C9A84C';
const DARK = '#0D0B08';
const inp = {
  width: '100%', padding: '0.85rem 1rem',
  border: '1px solid #D4CFC8', backgroundColor: '#FAFAF8',
  fontFamily: 'Jost, sans-serif', fontSize: '0.85rem',
  color: DARK, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

export default function Login() {
  const [step, setStep] = useState(1); // 1=email, 2=otp
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const requestOtp = async (e) => {
    e?.preventDefault();
    if (!email.includes('@')) { setError('Enter a valid email address.'); return; }
    setLoading(true); setError(''); setResent(false);
    try {
      await api.post('/customer/auth/request-otp', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send OTP. Please try again.');
    }
    setLoading(false);
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { setError('Enter the 6-digit code.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/customer/auth/verify-otp', { email, otp });
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user, token: data.token } });
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  const resendOtp = async () => {
    await requestOtp();
    setResent(true);
    setTimeout(() => setResent(false), 30000);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F7F5', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600, letterSpacing: '0.4em', color: GOLD, textDecoration: 'none', paddingLeft: '0.4em', display: 'block', marginBottom: '0.5rem' }}>
            RAVARI
          </Link>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680' }}>
            {step === 1 ? 'Sign in to your account' : 'Enter verification code'}
          </p>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #E8E4DE', padding: '2.5rem' }}>
          {step === 1 ? (
            <form onSubmit={requestOtp}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.78rem', color: '#4A4642', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Enter your email to receive a one-time login code. No password needed.
              </p>
              <label style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="your@email.com"
                style={inp}
                onFocus={e => e.target.style.borderColor = GOLD}
                onBlur={e => e.target.style.borderColor = '#D4CFC8'}
              />
              {error && <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#C0392B', marginTop: '0.75rem' }}>{error}</p>}
              <button type="submit" disabled={loading}
                style={{ marginTop: '1.25rem', width: '100%', padding: '0.9rem', backgroundColor: loading ? '#D4CFC8' : DARK, color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending…' : 'Send Login Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp}>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.78rem', color: '#4A4642', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
              </p>
              <label style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.5rem' }}>
                Verification Code
              </label>
              <input
                type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000" maxLength={6} required inputMode="numeric"
                style={{ ...inp, fontSize: '1.5rem', letterSpacing: '0.5em', textAlign: 'center' }}
                onFocus={e => e.target.style.borderColor = GOLD}
                onBlur={e => e.target.style.borderColor = '#D4CFC8'}
              />
              {error && <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', color: '#C0392B', marginTop: '0.75rem' }}>{error}</p>}
              <button type="submit" disabled={loading}
                style={{ marginTop: '1.25rem', width: '100%', padding: '0.9rem', backgroundColor: loading ? '#D4CFC8' : GOLD, color: DARK, fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Verifying…' : 'Verify & Sign In'}
              </button>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }}
                  style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', color: '#8C8680', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  ← Change email
                </button>
                <button type="button" onClick={resendOtp} disabled={resent}
                  style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', color: resent ? '#B0A89E' : GOLD, background: 'none', border: 'none', cursor: resent ? 'default' : 'pointer', padding: 0 }}>
                  {resent ? 'Code sent!' : 'Resend code'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', color: '#8C8680', textAlign: 'center', marginTop: '1.25rem' }}>
          New here?{' '}
          <Link to="/products" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>Start shopping</Link>
          {' '}— your account is created automatically on first order.
        </p>
      </div>
    </div>
  );
}
