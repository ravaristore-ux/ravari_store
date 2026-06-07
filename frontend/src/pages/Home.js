import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { FiAward, FiHeart, FiTruck, FiStar } from 'react-icons/fi';
import SEO from '../components/SEO';
import { SEO_CONFIG } from '../utils/seoConstants';
import { getOrganizationSchema } from '../utils/schemaMarkup';
import { trackPageView } from '../utils/ga4Tracking';

// Interactive Video Card Component
function VideoCard({ videoNum }) {
  const videoRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = async () => {
    setIsHovering(true);
    if (videoRef.current) {
      try {
        // Try to play with sound
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              // Ensure volume is on
              videoRef.current.volume = 1;
            })
            .catch((error) => {
              console.log('Autoplay failed:', error);
            });
        }
      } catch (error) {
        console.log('Play error:', error);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.volume = 1;
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl border-4 border-amber-300 hover:border-amber-600 transition duration-300 cursor-pointer group bg-black h-64 shadow-lg hover:shadow-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video - WITH SOUND */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover bg-gray-800"
        preload="auto"
        playsInline
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%23333' width='16' height='9'/%3E%3C/svg%3E"
      >
        <source
          src={`/videos/Ravari%20Product%20Video%20-%20${videoNum}.mp4`}
          type="video/mp4"
        />
      </video>



      {/* Center Camera Icon (always visible as visual indicator) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
          <div className="text-6xl opacity-30">🎥</div>
        </div>
      )}

      {/* Sound Indicator (when playing) */}
      {isPlaying && (
        <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg z-20 flex items-center gap-1 animate-pulse">
          <span>🔊</span> Playing with Sound
        </div>
      )}

      {/* Bottom gradient (when hovering) */}
      {isHovering && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent z-5"></div>
      )}
    </div>
  );
}

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    trackPageView('/', 'Home - RAVARI');
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const [featuredRes, newRes] = await Promise.all([
        api.get('/products/featured'),
        api.get('/products/new')
      ]);
      setFeaturedProducts(featuredRes.data.products || featuredRes.data);
      setNewArrivals(newRes.data.products || newRes.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setFeaturedProducts([]);
      setNewArrivals([]);
    } finally {
      setLoading(false);
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

  const handleToggleWishlist = (productId) => {
    // TODO: Implement wishlist toggle
    console.log('Toggle wishlist for:', productId);
  };

  return (
    <div className="bg-white">
      <SEO
        title={SEO_CONFIG.pages.home.title}
        description={SEO_CONFIG.pages.home.description}
        keywords={SEO_CONFIG.pages.home.keywords}
        canonical={SEO_CONFIG.site.url}
        schemaMarkup={getOrganizationSchema()}
      />
      {/* Hero Section with Vertical Videos */}
      <section className="relative bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-600 mb-4">
              ✨ Timeless Luxury Leather ✨
            </h1>
            <p className="text-lg text-gray-700 font-semibold max-w-2xl mx-auto mb-10">
              Handcrafted leather goods that combine elegance with functionality
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              🛍️ Explore Our Collection
            </Link>
          </div>

          {/* Vertical Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {['01', '02', '03', '04'].map((videoNum, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden border-4 border-amber-200 hover:border-amber-600 transition shadow-lg hover:shadow-2xl group"
              >
                <video
                  className="w-full h-96 object-cover bg-gray-800 group-hover:scale-105 transition duration-300"
                  loop
                  preload="metadata"
                  playsInline
                  poster={`/images/p${idx + 1}-a.png`}
                  onMouseEnter={(e) => {
                    const v = e.currentTarget;
                    v.muted = false;
                    v.volume = 1;
                    const p = v.play();
                    if (p && p.catch) p.catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    const v = e.currentTarget;
                    v.pause();
                    v.muted = true;
                    try { v.currentTime = 0; } catch (_) {}
                  }}
                >
                  <source
                    src={`/videos/Ravari%20Product%20Video%20-%20${videoNum}.mp4`}
                    type="video/mp4"
                  />
                </video>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-600 mb-4">
            ⭐ Featured Collection ⭐
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-semibold">
            Our most coveted pieces, handpicked for you
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading premium collection...</p>
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-600 mb-4">
              🆕 Latest Arrivals 🆕
            </h2>
            <p className="text-lg text-gray-600 font-semibold">Newest additions to our exclusive collection</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isInWishlist={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading new arrivals...</p>
            </div>
          )}
        </div>
      </section>




    </div>
  );
}

export default Home;
