import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Checkout() {
  const cartItems = useSelector(state => state.cart.items);
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    paymentMethod: 'stripe'
  });

  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    // TODO: Implement payment and order creation
    console.log('Processing order:', { formData, items: cartItems, total });
    setLoading(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/products" className="text-blue-600 hover:text-blue-800">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} className="col-span-2 md:col-span-1 px-4 py-2 border border-gray-300 rounded" />
                  <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} className="col-span-2 md:col-span-1 px-4 py-2 border border-gray-300 rounded" />
                  <input type="email" name="email" placeholder="Email" onChange={handleInputChange} className="col-span-2 px-4 py-2 border border-gray-300 rounded" />
                  <input type="text" name="phone" placeholder="Phone" onChange={handleInputChange} className="col-span-2 px-4 py-2 border border-gray-300 rounded" />
                  <input type="text" name="street" placeholder="Street" onChange={handleInputChange} className="col-span-2 px-4 py-2 border border-gray-300 rounded" />
                  <input type="text" name="city" placeholder="City" onChange={handleInputChange} className="col-span-2 md:col-span-1 px-4 py-2 border border-gray-300 rounded" />
                  <input type="text" name="state" placeholder="State" onChange={handleInputChange} className="col-span-2 md:col-span-1 px-4 py-2 border border-gray-300 rounded" />
                  <input type="text" name="postalCode" placeholder="Postal Code" onChange={handleInputChange} className="col-span-2 md:col-span-1 px-4 py-2 border border-gray-300 rounded" />
                  <input type="text" name="country" placeholder="Country" onChange={handleInputChange} className="col-span-2 md:col-span-1 px-4 py-2 border border-gray-300 rounded" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="paymentMethod" value="stripe" onChange={handleInputChange} className="mr-2" />
                    Credit/Debit Card (Stripe)
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="paymentMethod" value="razorpay" onChange={handleInputChange} className="mr-2" />
                    UPI/Card (Razorpay)
                  </label>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50">
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 pb-4 border-b">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-4 pb-4 border-b">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
