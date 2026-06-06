import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import wishlistReducer from './slices/wishlistSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  products: productsReducer,
  wishlist: wishlistReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
