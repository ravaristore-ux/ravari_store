import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useDispatch } from 'react-redux';
import { FiZoomIn, FiChevronLeft, FiChevronRight, FiStar, FiShare2 } from 'react-icons/fi';
import SEO from '../components/SEO';
import { SEO_CONFIG } from '../utils/seoConstants';
import { getProductSchema, getBreadcrumbSchema } from '../utils/schemaMarkup';
import { trackPageView, trackProductView } from '../utils/ga4Tracking';

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  useEffect(() => { fetchProduct(); }, [slug]);
  useEffect(() => { setSelectedImage(0); }, [selectedVariant]);
  useEffect(() => {
    if (product?.category && product?._id) {
      fetch(`/api/products/related?category=${encodeURIComponent(product.category)}&excludeId=${product._id}`)
        .then(r => r.json()).then(d => setRelatedProducts(d.products || [])).catch(() => {});
    }
  }, [product?.category, product?._id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/slug/${slug}`);
      const p = res.data.product;
      setProduct(p);
      setReviews(res.data.reviews || []);
      // Set default variant if product has variants
      if (p?.variants?.length) setSelectedVariant(p.variants[0]);
      if (p) trackProductView(p);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShopNow = () => {
    if (!product) return;
    const price = activeVariant ? (activeVariant.salePrice || activeVariant.price) : (product.salePrice || product.price);
    const thumb = activeVariant ? activeVariant.thumbnail : product.thumbnail;
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product._id,
        name: product.name + (activeVariant ? ` — ${activeVariant.label}` : ''),
        price,
        image: thumb || product.thumbnail,
        quantity,
        selectedOptions: activeVariant ? { ...selectedOptions, variant: activeVariant.label } : selectedOptions,
      }
    });
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (!product) return;
    const price = activeVariant ? (activeVariant.salePrice || activeVariant.price) : (product.salePrice || product.price);
    const thumb = activeVariant ? activeVariant.thumbnail : product.thumbnail;
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product._id,
        name: product.name + (activeVariant ? ` — ${activeVariant.label}` : ''),
        price,
        image: thumb || product.thumbnail,
        quantity,
        selectedOptions: activeVariant ? { ...selectedOptions, variant: activeVariant.label } : selectedOptions,
      }
    });
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

  const activeVariant = selectedVariant;
  const activeImages = (activeVariant ? activeVariant.images : product.images) || [];
  const images = activeImages.length > 0
    ? activeImages.map(i => ({ ...i, url: getImageUrl(i.url) }))
    : [{ url: getImageUrl(activeVariant?.thumbnail || product.thumbnail), alt: product.name }];
  const activePrice    = activeVariant ? activeVariant.price    : product.price;
  const activeSalePrice = activeVariant ? activeVariant.salePrice : product.salePrice;

  // Generate SEO data and schema
  const productTitle = `${product.name} | Premium ${product.category} | RAVARI`;
  const productDescription = `${product.description || product.name} - Premium handcrafted ${product.category.toLowerCase()}. Sustainable, artisan-made. Fast delivery across India.`;

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: product.category, path: `/products?category=${product.category.toLowerCase()}` },
    { name: product.name, path: `/products/${slug}` }
  ];

  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

  return (
    <div className="min-h-screen bg-white py-8">
      <SEO
        title={productTitle}
        description={productDescription}
        keywords={`${product.name}, ${product.category}, luxury leather, handcrafted`}
        canonical={`${SEO_CONFIG.site.url}/products/${slug}`}
        ogTitle={`${product.name} | RAVARI Luxury Leather Goods`}
        ogDescription={productDescription}
        ogImage={images[0]?.url || product.thumbnail}
        schemaMarkup={{
          '@context': 'https://schema.org',
          '@graph': [
            productSchema,
            breadcrumbSchema
          ]
        }}
      />
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#F8F7F5', borderBottom: '1px solid #E8E4DE', padding: '0.55rem 1.5rem', marginBottom: '0.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', fontFamily: 'Jost, sans-serif', fontSize: '0.62rem', color: '#8C8680' }}>
          <Link to="/" style={{ color: '#8C8680', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link to="/products" style={{ color: '#8C8680', textDecoration: 'none' }}>Shop</Link>
          <span>›</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: '#8C8680', textDecoration: 'none' }}>{product.category}</Link>
          <span>›</span>
          <span style={{ color: '#0D0D0D', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images Section */}
          <div>
            {/* Main Image */}
            <div className="mb-4" style={{ border: '1px solid #E8E4DE', backgroundColor: '#FAFAF8' }}>
              <div
                className="relative w-full cursor-zoom-in overflow-hidden"
                style={{ height: '520px' }}
                onMouseEnter={() => setZoomActive(true)}
                onMouseLeave={() => setZoomActive(false)}
                onMouseMove={handleZoom}
              >
                <img
                  src={images[selectedImage]?.url || product.thumbnail}
                  alt={product.name}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'contain', display: 'block',
                    ...(zoomActive ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {})
                  }}
                  className="transition-transform duration-300"
                />
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
                    <img src={img.url} alt={`View ${idx + 1}`} style={{ width: '100%', height: '80px', objectFit: 'contain', backgroundColor: '#FAFAF8' }} />
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

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4A4642', marginBottom: '0.75rem' }}>
                  Select {product.variantLabel || 'Option'}
                </p>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {product.variants.map(v => (
                    <button key={v.id} onClick={() => { setSelectedVariant(v); setSelectedImage(0); }}
                      style={{
                        fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', fontWeight: 600,
                        padding: '0.6rem 1.4rem', cursor: 'pointer', transition: 'all 0.2s',
                        border: `1.5px solid ${activeVariant?.id === v.id ? '#C9A84C' : '#D4CFC8'}`,
                        backgroundColor: activeVariant?.id === v.id ? '#0D0D0D' : '#FAFAF8',
                        color: activeVariant?.id === v.id ? '#C9A84C' : '#4A4642',
                      }}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-8" style={{ padding: '1.25rem 1.5rem', backgroundColor: '#F5F3EE', borderLeft: '3px solid #C9A84C' }}>
              <div className="flex items-baseline gap-4 mb-1">
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 600, color: '#0D0D0D' }}>
                  ₹{(activeSalePrice || activePrice)?.toLocaleString('en-IN')}
                </span>
                {activeSalePrice && activeSalePrice < activePrice && (
                  <>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '1rem', color: '#B8A89A', textDecoration: 'line-through' }}>
                      ₹{activePrice?.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#2E7D32' }}>
                      Save ₹{(activePrice - activeSalePrice)?.toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', color: '#8C8680' }}>Inclusive of all taxes</p>
              {product.stock > 0 && product.stock <= 5 && (
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', fontWeight: 600, color: '#C0392B', marginTop: '0.4rem' }}>
                  ⚡ Only {product.stock} left in stock — order soon!
                </p>
              )}
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', color: '#2E7D32', marginTop: '0.35rem' }}>
                🚚 Estimated delivery: {(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }); })()}
              </p>
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

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {product.stock === 0 ? (
                <div style={{ width: '100%', padding: '1rem', backgroundColor: '#F0EDE8', color: '#8C8680', fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', border: '1px solid #E8E4DE' }}>
                  Out of Stock — Notify me when available via WhatsApp
                </div>
              ) : (
                <>
                  {/* SHOP NOW — primary */}
                  <button onClick={handleShopNow}
                    style={{ width: '100%', padding: '1rem', backgroundColor: '#C9A84C', color: '#0D0D0D', fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B8962A'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C9A84C'}>
                    SHOP NOW — ₹{((activeSalePrice || activePrice) * quantity)?.toLocaleString('en-IN')}
                  </button>
                  {/* Add to Cart — secondary */}
                  <button onClick={handleAddToCart}
                    style={{ width: '100%', padding: '1rem', backgroundColor: 'transparent', color: '#0D0D0D', fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', border: '1.5px solid #0D0D0D', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0D0D0D'; e.currentTarget.style.color = '#FFF'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0D0D0D'; }}>
                    Add to Cart
                  </button>
                </>
              )}

              {/* WhatsApp Share */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out this ${product.name} from RAVARI — handcrafted luxury leather!\n₹${(activeSalePrice || activePrice)?.toLocaleString('en-IN')}\nhttps://ravari.in/products/${slug}`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ width: '100%', padding: '0.85rem', backgroundColor: '#25D366', color: '#fff', fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxSizing: 'border-box' }}>
                <FiShare2 size={15} /> Share on WhatsApp
              </a>
            </div>

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

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div style={{ borderTop: '1px solid #E8E4DE', paddingTop: '3rem', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.5rem', textAlign: 'center' }}>Continue Exploring</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 400, color: '#0D0B08', textAlign: 'center', marginBottom: '2rem' }}>You May Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {relatedProducts.map(p => (
                <Link key={p._id || p.id} to={`/products/${p.slug}`} style={{ textDecoration: 'none', border: '1px solid #E8E4DE', backgroundColor: '#FAFAF8', display: 'flex', flexDirection: 'column' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E8E4DE'}>
                  <div style={{ backgroundColor: '#F5F3EE', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={p.thumbnail} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                  </div>
                  <div style={{ padding: '0.85rem 1rem' }}>
                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8C8680', marginBottom: '0.25rem' }}>{p.category}</p>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 600, color: '#0D0B08', lineHeight: 1.3, marginBottom: '0.4rem' }}>{p.name}</p>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 600, color: '#C9A84C' }}>₹{(p.salePrice || p.price)?.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                        <p className="font-bold text-gray-900">
                          {review.userId?.firstName} {review.userId?.lastName}
                        </p>
                        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1B6C2F', backgroundColor: '#EAFBEF', border: '1px solid #A7D9B6', padding: '1px 6px' }}>
                          ✓ Verified Purchase
                        </span>
                      </div>
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
