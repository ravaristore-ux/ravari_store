import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div
      className="group"
      style={{ background: '#fff' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link to={`/products/${product.slug}`}>
        <div className="relative overflow-hidden" style={{ height: '320px', backgroundColor: '#F4EFE6' }}>
          {imageLoading && <div className="absolute inset-0 skeleton" />}
          <img
            src={product.thumbnail || product.images?.[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            onLoad={() => setImageLoading(false)}
            onError={e => {
              e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23F4EFE6' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='18' fill='%236B3A2A'%3ERAVARI%3C/text%3E%3C/svg%3E`;
              setImageLoading(false);
            }}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span style={{ backgroundColor: '#1A0F0A', color: '#E8D5A3', fontFamily: 'Raleway, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', fontWeight: 600, padding: '3px 10px' }}>
                NEW
              </span>
            )}
            {hasDiscount && (
              <span style={{ backgroundColor: '#6B3A2A', color: '#fff', fontFamily: 'Raleway, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', fontWeight: 600, padding: '3px 10px' }}>
                SALE
              </span>
            )}
          </div>
          {/* Wishlist button */}
          <button
            onClick={e => { e.preventDefault(); onToggleWishlist(product._id); }}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-opacity duration-200"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', opacity: hovered || isInWishlist ? 1 : 0 }}
            aria-label="Add to wishlist"
          >
            <FiHeart size={15} style={{ color: isInWishlist ? '#6B3A2A' : '#1C1C1C', fill: isInWishlist ? '#6B3A2A' : 'none' }} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-4 pb-5 px-1">
        <p className="section-eyebrow mb-1" style={{ color: '#C9A84C' }}>{product.category}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1rem', fontWeight: 500, color: '#1A0F0A', marginBottom: '0.5rem', lineHeight: 1.3 }}
            className="line-clamp-2 hover:opacity-70 transition-opacity">
            {product.name}
          </h3>
        </Link>

        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill={i < Math.round(product.rating) ? '#C9A84C' : '#E8DDD4'}>
                  <polygon points="5,1 6.18,3.73 9.09,3.90 7,5.98 7.63,9 5,7.5 2.37,9 3,5.98 0.91,3.90 3.82,3.73" />
                </svg>
              ))}
            </div>
            <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.65rem', color: '#6B6560' }}>({product.reviewCount})</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.1rem', fontWeight: 600, color: '#1A0F0A' }}>
              ₹{(product.salePrice || product.price)?.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem', color: '#B8A89A', textDecoration: 'line-through' }}>
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: 600, color: '#6B3A2A', textTransform: 'uppercase' }}
          >
            <FiShoppingCart size={13} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
