import { SEO_CONFIG } from './seoConstants';

// Organization Schema
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SEO_CONFIG.site.name,
  url: SEO_CONFIG.site.url,
  logo: SEO_CONFIG.site.logo,
  description: SEO_CONFIG.site.description,
  foundingDate: SEO_CONFIG.site.foundingDate,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SEO_CONFIG.site.address.streetAddress,
    addressLocality: SEO_CONFIG.site.address.addressLocality,
    addressRegion: SEO_CONFIG.site.address.addressRegion,
    postalCode: SEO_CONFIG.site.address.postalCode,
    addressCountry: SEO_CONFIG.site.address.addressCountry
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: SEO_CONFIG.site.contactPoint.contactType,
    telephone: SEO_CONFIG.site.contactPoint.telephone,
    email: SEO_CONFIG.site.contactPoint.email
  },
  sameAs: SEO_CONFIG.site.sameAs
});

// LocalBusiness Schema
export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SEO_CONFIG.site.name,
  image: SEO_CONFIG.site.logo,
  description: SEO_CONFIG.site.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SEO_CONFIG.site.address.streetAddress,
    addressLocality: SEO_CONFIG.site.address.addressLocality,
    addressRegion: SEO_CONFIG.site.address.addressRegion,
    postalCode: SEO_CONFIG.site.address.postalCode,
    addressCountry: SEO_CONFIG.site.address.addressCountry
  },
  telephone: SEO_CONFIG.site.contactPoint.telephone,
  url: SEO_CONFIG.site.url,
  priceRange: '₹5000-₹50000',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '156'
  }
});

// Product Schema
export const getProductSchema = (product) => {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [product.image],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: SEO_CONFIG.site.name
    },
    offers: {
      '@type': 'Offer',
      url: `${SEO_CONFIG.site.url}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price?.toString(),
      priceValidUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SEO_CONFIG.site.name
      }
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating?.toString(),
        reviewCount: product.reviewCount?.toString() || '0'
      }
    }),
    ...(product.reviews && product.reviews.length > 0 && {
      review: product.reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.authorName || 'Anonymous'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating?.toString()
        },
        reviewBody: review.text,
        datePublished: review.date
      }))
    })
  };
};

// BreadcrumbList Schema
export const getBreadcrumbSchema = (breadcrumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: (index + 1).toString(),
    name: item.name,
    item: `${SEO_CONFIG.site.url}${item.path}`
  }))
});

// Review Schema
export const getReviewSchema = (review) => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  author: {
    '@type': 'Person',
    name: review.authorName || 'Anonymous'
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: review.rating.toString(),
    bestRating: '5',
    worstRating: '1'
  },
  reviewBody: review.text,
  datePublished: review.date
});

// Aggregate Rating Schema
export const getAggregateRatingSchema = (rating) => ({
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  ratingValue: rating.value.toString(),
  ratingCount: rating.count.toString(),
  reviewCount: rating.reviewCount?.toString() || rating.count.toString(),
  bestRating: '5',
  worstRating: '1'
});
