// SEO Constants and Configuration
export const SEO_CONFIG = {
  site: {
    name: 'RAVARI',
    url: 'https://ravari.in',
    description: 'Premium handcrafted luxury leather bags and accessories from India',
    logo: 'https://ravari.in/logo.png',
    foundingDate: '2018',
    address: {
      streetAddress: 'Delhi, India',
      addressLocality: 'Delhi',
      addressRegion: 'Delhi',
      postalCode: 'Delhi',
      addressCountry: 'IN'
    },
    contactPoint: {
      contactType: 'Customer Service',
      telephone: '+91-90842-60869',
      email: 'Ravari.store@gmail.com'
    },
    sameAs: [
      'https://instagram.com/ravari',
      'https://facebook.com/ravari',
      'https://twitter.com/ravari'
    ]
  },

  pages: {
    home: {
      title: 'Luxury Handcrafted Leather Bags & Accessories | RAVARI',
      description: 'Discover premium handcrafted leather handbags, wallets & accessories. Artisan-made luxury leather goods from India. Explore RAVARI\'s exclusive collection.',
      path: '/',
      keywords: 'luxury leather handbags, handcrafted leather bags, premium accessories'
    },
    products: {
      title: 'Premium Leather Products | RAVARI',
      description: 'Shop our complete collection of luxury handcrafted leather handbags, accessories, and organizers. Sustainable, artisan-made leather goods.',
      path: '/products',
      keywords: 'luxury leather handbags, handcrafted bags, artisan accessories'
    },
    handbags: {
      title: 'Luxury Leather Handbags | Handcrafted Premium Bags | RAVARI',
      description: 'Shop luxury leather handbags from RAVARI. Handcrafted premium bags, sustainable materials. Fast delivery across India.',
      path: '/products?category=handbags',
      keywords: 'luxury leather handbags, handcrafted bags, premium handbags'
    },
    accessories: {
      title: 'Premium Leather Accessories | RAVARI',
      description: 'Explore premium handcrafted leather accessories including wallets, belts, and card holders. Artisan-made, sustainable leather goods.',
      path: '/products?category=accessories',
      keywords: 'leather wallets, luxury accessories, handcrafted leather'
    },
    organizers: {
      title: 'Leather Desk Organizers & Storage | RAVARI',
      description: 'Premium handcrafted leather organizers and storage solutions. Luxury desk organizers and document holders for professional use.',
      path: '/products?category=organizers',
      keywords: 'leather organizers, desk organizers, luxury storage'
    },
    about: {
      title: 'About RAVARI | Premium Handcrafted Leather Goods',
      description: 'Learn about RAVARI\'s commitment to sustainable, artisan-made luxury leather goods. Discover our craftsmanship and story.',
      path: '/about',
      keywords: 'about RAVARI, handcrafted leather, artisan, sustainable'
    },
    contact: {
      title: 'Contact RAVARI | Luxury Leather Goods',
      description: 'Get in touch with RAVARI for inquiries, custom orders, or support. We\'re here to help.',
      path: '/contact',
      keywords: 'contact RAVARI, customer support, inquiries'
    }
  },

  social: {
    twitter: '@ravari_leather',
    facebook: 'RAVARI.official',
    instagram: '@ravari_leather'
  }
};

export const PRODUCT_CATEGORIES = {
  handbags: {
    name: 'Handbags',
    slug: 'handbags',
    description: 'Luxury handcrafted leather handbags',
    keywords: ['luxury leather handbags', 'handcrafted bags', 'premium shoulder bags', 'leather crossbody bags', 'tote bags']
  },
  accessories: {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Premium leather accessories and wallets',
    keywords: ['leather wallets', 'luxury accessories', 'handcrafted belts', 'leather keychains']
  },
  organizers: {
    name: 'Organizers',
    slug: 'organizers',
    description: 'Luxury leather organizers and storage',
    keywords: ['leather organizers', 'desk organizers', 'leather portfolios', 'document holders']
  }
};
