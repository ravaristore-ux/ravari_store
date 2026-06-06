import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple hardcoded admin credentials
      if (email === 'admin@ravari.in' && password === 'admin123') {
        // Save to localStorage FIRST
        localStorage.setItem('user', JSON.stringify({
          _id: 'admin123',
          email: 'admin@ravari.in',
          firstName: 'Admin',
          lastName: 'RAVARI',
          role: 'admin'
        }));
        localStorage.setItem('token', 'admin-token-12345');

        // Set admin user in Redux
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: {
              _id: 'admin123',
              email: 'admin@ravari.in',
              firstName: 'Admin',
              lastName: 'RAVARI',
              role: 'admin'
            },
            token: 'admin-token-12345'
          }
        });

        // Small delay to ensure state updates, then redirect
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      } else {
        setError('❌ Invalid email or password');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-amber-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-600 mb-2">
              RAVARI
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
            <p className="text-sm text-gray-600">Access your product management dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ravari.in"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 bg-white font-semibold"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 bg-white font-semibold"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-lg font-black text-lg hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Logging in...' : '🔐 Login to Dashboard'}
            </button>
          </form>

          {/* Credentials Info */}
          <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6">
            <p className="text-sm font-bold text-gray-900 mb-3">📝 Demo Credentials:</p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-bold text-gray-900">Email:</span>
                <span className="text-amber-700 font-semibold ml-2">admin@ravari.in</span>
              </p>
              <p>
                <span className="font-bold text-gray-900">Password:</span>
                <span className="text-amber-700 font-semibold ml-2">admin123</span>
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <a href="/" className="text-amber-700 hover:text-orange-600 font-semibold transition">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
