import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div
      className="group"
      style={{
        background: '#fff',
        border: '1px solid #E8E4DE',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? '0 4px 24px rgba(0,0,0,0.07)' : 'none',
        borderColor: hovered ? '#C9A84C' : '#E8E4DE',
      }}
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
            className="w-full h-full transition-transform duration-700"
            style={{ objectFit: 'contain', padding: '8px', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.7s' }}
            onLoad={() => setImageLoading(false)}
            onError={e => {
              e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23F4EFE6' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='18' fill='%236B3A2A'%3ERAVARI%3C/text%3E%3C/svg%3E`;
              setImageLoading(false);
            }}
          />
          {/* Wishlist button — always visible */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleWishlist && onToggleWishlist(product._id); }}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '34px', height: '34px',
              borderRadius: '50%',
              backgroundColor: isInWishlist ? '#C9A84C' : 'rgba(255,255,255,0.95)',
              border: isInWishlist ? '1.5px solid #C9A84C' : '1.5px solid #E0D8CE',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
              zIndex: 2,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24"
              fill={isInWishlist ? '#fff' : 'none'}
              stroke={isInWishlist ? '#fff' : '#C9A84C'}
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

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
            {product.stock === 0 && (
              <span style={{ backgroundColor: '#4A4642', color: '#E8E4DE', fontFamily: 'Raleway, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', fontWeight: 600, padding: '3px 10px' }}>
                SOLD OUT
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }} />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="pt-4 pb-5 px-3">
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

        {product.stock > 0 && product.stock <= 5 && (
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.58rem', fontWeight: 600, color: '#C0392B', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
            ⚡ Only {product.stock} left
          </p>
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
            onClick={() => product.stock !== 0 && onAddToCart(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: 600, color: product.stock === 0 ? '#B8A89A' : '#6B3A2A', textTransform: 'uppercase', cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
          >
            <FiShoppingCart size={13} />
            {product.stock === 0 ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
