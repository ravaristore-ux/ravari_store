import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="group bg-white border border-amber-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      {/* Product Image */}
      <Link to={`/products/${product.slug}`}>
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 h-72">
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-100 animate-pulse"></div>
          )}
          <img
            src={`${product.thumbnail || product.images?.[0]?.url || '/placeholder.jpg'}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23FEF3C7%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23B45309%22%3E' + product.name + '%3C/text%3E%3C/svg%3E';
              setImageLoading(false);
            }}
          />
          {product.isNew && (
            <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-700 to-amber-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              🆕 NEW
            </span>
          )}
          {product.salePrice && product.salePrice < product.price && (
            <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ✨ SALE
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-bold text-gray-900 group-hover:text-amber-700 transition text-base line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        <p className="text-xs font-semibold text-amber-700 mb-3 uppercase tracking-wide">{product.category}</p>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {'⭐'.repeat(Math.round(product.rating))}
            </div>
            <span className="text-xs text-gray-600 font-semibold">({product.reviewCount} reviews)</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600">
            ₹{product.salePrice || product.price}
          </span>
          {product.salePrice && product.salePrice < product.price && (
            <span className="text-sm text-gray-400 line-through font-semibold">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-2.5 rounded-lg text-sm font-bold hover:shadow-lg transition flex items-center justify-center gap-2 transform hover:scale-105"
          >
            <FiShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button
            onClick={() => onToggleWishlist(product._id)}
            className={`px-4 py-2.5 rounded-lg border-2 transition font-bold ${
              isInWishlist
                ? 'bg-red-50 border-red-400 text-red-600 hover:bg-red-100'
                : 'border-amber-300 text-gray-600 hover:border-amber-500 hover:bg-amber-50'
            }`}
          >
            <FiHeart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
