const load = () => { try { return JSON.parse(localStorage.getItem('ravari_cart') || '[]'); } catch { return []; } };
const save = items => { try { localStorage.setItem('ravari_cart', JSON.stringify(items)); } catch {} };

const initialState = { items: load(), total: 0, coupon: null };

const cartReducer = (state = initialState, action) => {
  let items;
  switch (action.type) {
    case 'ADD_TO_CART':
      const existing = state.items.find(i => i.productId === action.payload.productId);
      items = existing
        ? state.items.map(i => i.productId === action.payload.productId ? { ...i, quantity: i.quantity + action.payload.quantity } : i)
        : [...state.items, action.payload];
      save(items);
      return { ...state, items };

    case 'REMOVE_FROM_CART':
      items = state.items.filter(i => i.productId !== action.payload);
      save(items);
      return { ...state, items };

    case 'UPDATE_QUANTITY':
      items = state.items.map(i => i.productId === action.payload.productId ? { ...i, quantity: action.payload.quantity } : i).filter(i => i.quantity > 0);
      save(items);
      return { ...state, items };

    case 'SET_COUPON':
      return { ...state, coupon: action.payload };

    case 'CLEAR_CART':
      save([]);
      return { items: [], total: 0, coupon: null };

    case 'SET_CART_TOTAL':
      return { ...state, total: action.payload };

    default:
      return state;
  }
};

export default cartReducer;
