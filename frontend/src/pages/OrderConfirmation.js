import React from 'react';
import { useParams, Link } from 'react-router-dom';

function OrderConfirmation() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-2">Order ID: {orderId}</p>
        <p className="text-gray-600 mb-8">Thank you for your purchase. Check your email for order details.</p>
        <Link to="/account" className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition mr-4">
          View Order
        </Link>
        <Link to="/" className="inline-block border border-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
