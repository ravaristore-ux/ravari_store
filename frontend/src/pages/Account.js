import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function Account() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your account</p>
          <Link to="/login" className="text-blue-600 hover:text-blue-800">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full mb-4"></div>
                <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded bg-gray-100 text-gray-900 font-medium">Profile</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-600">Orders</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-600">Addresses</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-600">Wishlist</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-600">Logout</button>
              </nav>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Orders</h2>
              <p className="text-gray-600">You haven't placed any orders yet.</p>
              <Link to="/products" className="inline-block mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
