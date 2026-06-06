const initialState = {
  items: [],
  loading: false,
  error: null
};

const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_WISHLIST_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_WISHLIST_SUCCESS':
      return {
        ...state,
        items: action.payload.items || [],
        loading: false
      };

    case 'FETCH_WISHLIST_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.productId._id !== action.payload)
      };

    default:
      return state;
  }
};

export default wishlistReducer;
