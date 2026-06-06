const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 100000,
    search: ''
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0
  }
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_PRODUCTS_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        loading: false
      };

    case 'FETCH_PRODUCTS_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'SET_SELECTED_PRODUCT':
      return {
        ...state,
        selectedProduct: action.payload
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
        pagination: { ...state.pagination, page: 1 }
      };

    case 'SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload }
      };

    default:
      return state;
  }
};

export default productsReducer;
