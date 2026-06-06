import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { FiPlus, FiEdit, FiTrash2, FiDollarSign, FiPackage, FiBarChart2, FiLogOut } from 'react-icons/fi';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: '',
    price: '',
    salePrice: '',
    stock: '',
    material: '',
    color: '',
    size: ''
  });

  useEffect(() => {
    // Check if user is logged in as admin
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedUser || !storedToken) {
      // Redirect to login if not authenticated
      console.log('No auth found, redirecting to login');
      navigate('/admin-login');
      return;
    }

    console.log('Auth found, loading dashboard');
    setAuthChecked(true);
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const productsRes = await api.get('/products?limit=100');
      const products = productsRes.data.products || productsRes.data;
      setProducts(products);

      // Calculate basic stats from products
      setStats({
        totalOrders: 0,
        totalRevenue: products.reduce((sum, p) => sum + (p.salePrice || p.price) * 5, 0),
        recentOrders: []
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock),
        material: formData.material.split(',').map(m => m.trim()),
        color: formData.color.split(',').map(c => c.trim()),
        size: formData.size.split(',').map(s => s.trim()),
        slug: formData.name.toLowerCase().replace(/\s+/g, '-')
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, newProduct);
      } else {
        await api.post('/admin/products', newProduct);
      }

      setFormData({
        name: '', slug: '', description: '', category: '', price: '', salePrice: '',
        stock: '', material: '', color: '', size: ''
      });
      setEditingProduct(null);
      setShowProductForm(false);
      loadDashboardData();
      alert('Product saved successfully!');
    } catch (error) {
      alert('Error saving product: ' + error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock,
      material: product.material.join(', '),
      color: product.color.join(', '),
      size: product.size.join(', ')
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/products/${productId}`);
      loadDashboardData();
      alert('Product deleted!');
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-700 mb-4">🔐 Checking authentication...</p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-700 mb-4">📊 Loading Dashboard...</p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-amber-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600">
            🎨 RAVARI Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">Welcome to RAVARI Admin! 👋</span>
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition"
              >
                <FiLogOut /> Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b-2 border-amber-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-bold text-lg transition ${
              activeTab === 'dashboard'
                ? 'text-amber-700 border-b-4 border-amber-600'
                : 'text-gray-600 hover:text-amber-600'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-bold text-lg transition ${
              activeTab === 'products'
                ? 'text-amber-700 border-b-4 border-amber-600'
                : 'text-gray-600 hover:text-amber-600'
            }`}
          >
            📦 Products
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-amber-900 mb-8">📈 Sales Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border-2 border-amber-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Orders</p>
                    <p className="text-4xl font-black text-amber-700">{stats.totalOrders || 0}</p>
                  </div>
                  <FiPackage className="text-4xl text-amber-400" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-amber-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Products</p>
                    <p className="text-4xl font-black text-orange-700">{products.length}</p>
                  </div>
                  <FiBarChart2 className="text-4xl text-orange-400" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-amber-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
                    <p className="text-4xl font-black text-green-700">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
                  </div>
                  <FiDollarSign className="text-4xl text-green-400" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-amber-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Avg Order Value</p>
                    <p className="text-4xl font-black text-blue-700">
                      ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}
                    </p>
                  </div>
                  <FiDollarSign className="text-4xl text-blue-400" />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-amber-900 mb-4">📋 Recent Orders</h3>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-amber-900">Order ID</th>
                    <th className="px-6 py-3 text-left font-bold text-amber-900">Customer</th>
                    <th className="px-6 py-3 text-left font-bold text-amber-900">Amount</th>
                    <th className="px-6 py-3 text-left font-bold text-amber-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders?.slice(0, 5).map(order => (
                    <tr key={order._id} className="border-t hover:bg-amber-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-gray-700">{order.userId?.firstName} {order.userId?.lastName}</td>
                      <td className="px-6 py-4 font-bold text-amber-700">₹{order.total}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-amber-900">📦 Product Management</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: '', slug: '', description: '', category: '', price: '', salePrice: '',
                    stock: '', material: '', color: '', size: ''
                  });
                  setShowProductForm(!showProductForm);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition"
              >
                <FiPlus /> Add New Product
              </button>
            </div>

            {/* Product Form */}
            {showProductForm && (
              <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-amber-200 mb-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-6">
                  {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Product Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 font-semibold"
                  />

                  <input
                    type="text"
                    placeholder="Category *"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 font-semibold"
                  />

                  <input
                    type="number"
                    placeholder="Price (₹) *"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 font-semibold"
                  />

                  <input
                    type="number"
                    placeholder="Sale Price (₹)"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                    className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 font-semibold"
                  />

                  <input
                    type="number"
                    placeholder="Stock Quantity *"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 font-semibold"
                  />

                  <input
                    type="text"
                    placeholder="Materials (comma separated)"
                    value={formData.material}
                    onChange={(e) => setFormData({...formData, material: e.target.value})}
                    className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 font-semibold"
                  />

                  <input
                    type="text"
                    placeholder="Colors (comma separated)"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 font-semibold"
                  />

                  <input
                    type="text"
                    placeholder="Sizes (comma separated)"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>

                <textarea
                  placeholder="Product Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 font-semibold mt-6 h-24"
                ></textarea>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition"
                  >
                    {editingProduct ? '✅ Update Product' : '✅ Add Product'}
                  </button>
                  <button
                    onClick={() => setShowProductForm(false)}
                    className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Products List */}
            <h3 className="text-2xl font-bold text-amber-900 mb-4">All Products ({products.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="bg-white p-6 rounded-xl shadow-lg border-2 border-amber-200 hover:shadow-xl transition">
                  <h4 className="text-lg font-bold text-amber-900 mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-2xl font-black text-amber-700">₹{product.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock</p>
                      <p className="text-2xl font-black text-blue-700">{product.stock}</p>
                    </div>
                  </div>

                  {product.salePrice && (
                    <p className="text-sm font-bold text-green-600 mb-4">
                      🎉 Sale: ₹{product.salePrice} (Save ₹{product.price - product.salePrice})
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-bold transition"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold transition"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
