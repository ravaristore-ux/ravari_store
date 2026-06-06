import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useDispatch } from 'react-redux';
import { FiZoomIn, FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/slug/${slug}`);
      setProduct(res.data.product);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${url}`;
      };

      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          productId: product._id,
          name: product.name,
          price: product.salePrice || product.price,
          image: getImageUrl(product.thumbnail),
          quantity,
          selectedOptions
        }
      });
      alert('✅ Added to cart!');
    }
  };

  const handleZoom = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleSubmitReview = async () => {
    try {
      if (!newReview.title || !newReview.comment) {
        alert('Please fill in all fields');
        return;
      }
      await api.post('/reviews', {
        productId: product._id,
        ...newReview
      });
      setNewReview({ rating: 5, title: '', comment: '' });
      alert('✅ Review submitted for moderation!');
      fetchProduct();
    } catch (error) {
      alert('Error submitting review');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Loading product...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-2xl">Product not found</div>;

  // Convert image URLs to full backend URLs
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${url}`;
  };

  const images = product.images && product.images.length > 0
    ? product.images.map(img => ({
        ...img,
        url: getImageUrl(img.url)
      }))
    : [{ url: getImageUrl(product.thumbnail), alt: product.name }];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images Section */}
          <div>
            {/* Main Image with Zoom */}
            <div className="mb-6 relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl overflow-hidden border-4 border-amber-200">
              <div
                className="relative w-full h-96 md:h-[500px] cursor-zoom-in overflow-hidden group"
                onMouseEnter={() => setZoomActive(true)}
                onMouseLeave={() => setZoomActive(false)}
                onMouseMove={handleZoom}
              >
                <img
                  src={images[selectedImage]?.url || product.thumbnail}
                  alt={product.name}
                  style={zoomActive ? {
                    transform: `scale(2)`,
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                  } : {}}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
                {zoomActive && (
                  <div className="absolute top-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <FiZoomIn /> Zoomed
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-amber-100 p-3 rounded-full shadow-lg transition"
                  >
                    <FiChevronLeft className="w-6 h-6 text-amber-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-amber-100 p-3 rounded-full shadow-lg transition"
                  >
                    <FiChevronRight className="w-6 h-6 text-amber-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-3 rounded-lg overflow-hidden hover:border-amber-600 transition ${
                      idx === selectedImage ? 'border-amber-600 shadow-lg' : 'border-amber-200'
                    }`}
                  >
                    <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <p className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-2">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-yellow-400">
                  {'⭐'.repeat(Math.round(product.rating))}
                </div>
                <span className="text-gray-700 font-bold">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600">
                  ₹{product.salePrice || product.price}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">₹{product.price}</span>
                    <span className="text-lg font-black text-green-600">
                      Save ₹{product.price - product.salePrice}
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-600 font-semibold">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed mb-8 font-semibold">
              {product.description}
            </p>

            {/* Options */}
            {product.size && product.size.length > 0 && (
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-900 mb-3">Choose Size:</label>
                <div className="flex gap-3 flex-wrap">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedOptions({ ...selectedOptions, size })}
                      className={`px-6 py-3 border-2 font-bold rounded-lg transition ${
                        selectedOptions.size === size
                          ? 'bg-amber-600 text-white border-amber-700'
                          : 'border-amber-300 text-gray-900 hover:border-amber-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.color && product.color.length > 0 && (
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-900 mb-3">Choose Color:</label>
                <div className="flex gap-3 flex-wrap">
                  {product.color.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedOptions({ ...selectedOptions, color })}
                      className={`px-6 py-3 border-2 font-bold rounded-lg transition ${
                        selectedOptions.color === color
                          ? 'bg-amber-600 text-white border-amber-700'
                          : 'border-amber-300 text-gray-900 hover:border-amber-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-3">Quantity:</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-amber-300 rounded-lg hover:bg-amber-50 font-bold text-xl"
                >
                  −
                </button>
                <span className="text-3xl font-black text-amber-700 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border-2 border-amber-300 rounded-lg hover:bg-amber-50 font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl font-black text-lg hover:shadow-2xl transition transform hover:scale-105 mb-4"
            >
              🛒 ADD TO CART - ₹{(product.salePrice || product.price) * quantity}
            </button>

            {/* Product Info */}
            {product.material && product.material.length > 0 && (
              <div className="border-t-2 border-amber-200 pt-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-2">📦 Materials:</h3>
                <p className="text-gray-700">{product.material.join(', ')}</p>
              </div>
            )}

            {product.careInstructions && (
              <div className="border-t-2 border-amber-200 pt-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-2">✨ Care Instructions:</h3>
                <p className="text-gray-700">{product.careInstructions}</p>
              </div>
            )}

            {product.artisanStory && (
              <div className="border-t-2 border-amber-200 pt-6 mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="font-bold text-gray-900 mb-2">👨‍🎨 Artisan Story:</h3>
                <p className="text-gray-700 italic">{product.artisanStory}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t-4 border-amber-200 pt-12">
          <h2 className="text-3xl font-black text-gray-900 mb-8">⭐ Customer Reviews</h2>

          {/* Review Stats */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-xl border-2 border-amber-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-5xl font-black text-amber-700">{product.rating}</p>
                <p className="text-gray-600 font-semibold">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-black text-orange-600">{product.reviewCount}</p>
                <p className="text-gray-600 font-semibold">Total Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-black text-green-600">98%</p>
                <p className="text-gray-600 font-semibold">Recommended</p>
              </div>
            </div>
          </div>

          {/* Write Review Form */}
          <div className="bg-white border-2 border-amber-200 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Write Your Review</h3>

            <div className="mb-6">
              <label className="block text-gray-900 font-bold mb-3">Rating:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-4xl transition ${
                      star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Review Title (e.g., Amazing Quality!)"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg mb-4 font-semibold focus:outline-none focus:border-amber-600"
            />

            <textarea
              placeholder="Write your detailed review here..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg mb-4 font-semibold focus:outline-none focus:border-amber-600 h-24"
            ></textarea>

            <button
              onClick={handleSubmitReview}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition"
            >
              ✅ Submit Review
            </button>
          </div>

          {/* Existing Reviews */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="bg-white border-2 border-amber-100 p-6 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-900">
                        {review.userId?.firstName} {review.userId?.lastName}
                      </p>
                      <div className="flex text-yellow-400">
                        {'⭐'.repeat(review.rating)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 mb-2">{review.title}</p>
                  <p className="text-gray-700">{review.comment}</p>
                  <div className="flex gap-4 mt-4 text-sm text-gray-600">
                    <button className="hover:text-green-600 font-semibold">👍 Helpful ({review.helpful})</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8 font-semibold">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
