import { createContext, useContext, useReducer, useEffect } from 'react';
import * as cartApi from '../api/cartApi';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        itemCount: action.payload.itemCount,
        subtotal: action.payload.subtotal,
        loading: false,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_CART':
      return { ...initialState };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const fetchCart = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const response = await cartApi.getCart();
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartApi.addToCart(productId, quantity);
      toast.success('Added to cart');
      await fetchCart();
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await cartApi.updateCartItem(productId, quantity);
      await fetchCart();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartApi.removeCartItem(productId);
      toast.success('Item removed');
      await fetchCart();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
