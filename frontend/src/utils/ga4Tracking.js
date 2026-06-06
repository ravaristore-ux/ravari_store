// GA4 Tracking Event Manager
// Note: GA4 tag should be added to public/index.html with your measurement ID

export const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual ID

// Track page view
export const trackPageView = (path, title) => {
  if (window.gtag) {
    window.gtag('config', GA4_MEASUREMENT_ID, {
      'page_path': path,
      'page_title': title
    });
  }
};

// Track custom event
export const trackEvent = (eventName, eventData = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

// Track product view
export const trackProductView = (product) => {
  trackEvent('view_item', {
    currency: 'INR',
    value: product.price,
    items: [{
      item_id: product._id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: 1
    }]
  });
};

// Track add to cart
export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: product.price * quantity,
    items: [{
      item_id: product._id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: quantity
    }]
  });
};

// Track add to wishlist
export const trackAddToWishlist = (product) => {
  trackEvent('add_to_wishlist', {
    currency: 'INR',
    value: product.price,
    items: [{
      item_id: product._id,
      item_name: product.name,
      item_category: product.category,
      price: product.price
    }]
  });
};

// Track remove from cart
export const trackRemoveFromCart = (product, quantity = 1) => {
  trackEvent('remove_from_cart', {
    currency: 'INR',
    value: product.price * quantity,
    items: [{
      item_id: product._id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: quantity
    }]
  });
};

// Track purchase
export const trackPurchase = (order) => {
  trackEvent('purchase', {
    transaction_id: order._id,
    affiliation: 'RAVARI Online Store',
    value: order.totalAmount,
    currency: 'INR',
    tax: order.tax || 0,
    shipping: order.shippingCost || 0,
    items: order.items.map(item => ({
      item_id: item.product._id,
      item_name: item.product.name,
      item_category: item.product.category,
      price: item.price,
      quantity: item.quantity
    }))
  });
};

// Track form submission
export const trackFormSubmission = (formType) => {
  trackEvent('form_submit', {
    form_type: formType, // 'contact', 'newsletter', etc.
    form_destination: formType
  });
};

// Track search
export const trackSearch = (searchQuery, resultCount = 0) => {
  trackEvent('search', {
    search_term: searchQuery,
    result_count: resultCount
  });
};

// Track scroll depth
export const trackScrollDepth = (percentScrolled) => {
  trackEvent('scroll_depth', {
    percent_scrolled: percentScrolled
  });
};

// Track video watch
export const trackVideoWatch = (videoTitle, percentWatched) => {
  trackEvent('video_complete', {
    video_title: videoTitle,
    percent_watched: percentWatched
  });
};

// Track button click
export const trackButtonClick = (buttonName, buttonCategory) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_category: buttonCategory
  });
};

// Track review submission
export const trackReviewSubmission = (productId, rating) => {
  trackEvent('submit_review', {
    product_id: productId,
    rating: rating
  });
};
