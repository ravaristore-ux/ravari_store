import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import { useDispatch } from 'react-redux';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 100000,
    search: '',
    sort: 'newest'
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products', { params: { ...filters, page: pagination.page } });
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories/list');
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleAddToCart = (product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.thumbnail,
        quantity: 1,
        selectedOptions: {}
      }
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <p className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-2">🛍️ Collections</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">Shop Collection</h1>
          <p className="text-lg text-gray-600 font-semibold">Discover our curated selection of luxury handcrafted leather goods</p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200 shadow-sm">
              <h3 className="font-black text-gray-900 mb-6 text-lg uppercase tracking-wider">🔍 Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-900 block mb-3 uppercase tracking-wider">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg text-sm focus:outline-none focus:border-amber-600 bg-white font-semibold"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-900 block mb-3 uppercase tracking-wider">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg text-sm focus:outline-none focus:border-amber-600 bg-white font-semibold"
                >
                  <option value="">All Categories</option>
                  {categories && categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-900 block mb-3 uppercase tracking-wider">Price Range</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 border-2 border-amber-200 rounded-lg text-sm font-semibold bg-white focus:outline-none focus:border-amber-600"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 border-2 border-amber-200 rounded-lg text-sm font-semibold bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-3 uppercase tracking-wider">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg text-sm font-semibold bg-white focus:outline-none focus:border-amber-600"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {products.map(product => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={() => {}}
                      isInWishlist={false}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPagination({ ...pagination, page: i + 1 })}
                        className={`px-4 py-2 rounded-lg font-bold transition ${
                          pagination.page === i + 1
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-2 border-amber-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
