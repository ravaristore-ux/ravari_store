import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Wishlist() {
  const wishlistItems = useSelector(state => state.wishlist.items);

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
          <Link to="/products" className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
            <div key={item.productId._id} className="bg-white rounded-lg shadow-sm p-4">
              <img src={item.productId.thumbnail} alt={item.productId.name} className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="font-semibold text-gray-900">{item.productId.name}</h3>
              <p className="text-lg font-bold text-gray-900 mt-2">₹{item.productId.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
