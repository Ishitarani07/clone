import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as wishlistApi from '../api/wishlistApi';

const WishlistContext = createContext();

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const normalizeId = (id) => (typeof id === 'string' ? id : id?.toString());

const extractItems = (response) => {
  if (!response) return [];
  if (Array.isArray(response.items)) return response.items;
  if (response.data && Array.isArray(response.data.items)) return response.data.items;
  return [];
};

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_WISHLIST':
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  const fetchWishlist = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const response = await wishlistApi.getWishlist();
      const items = extractItems(response);
      dispatch({ type: 'SET_WISHLIST', payload: items });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error, 'Failed to fetch wishlist') });
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await wishlistApi.addToWishlist(productId);
      toast.success('Added to wishlist');
      await fetchWishlist();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to add to wishlist'));
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistApi.removeFromWishlist(productId);
      toast.success('Removed from wishlist');
      await fetchWishlist();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to remove from wishlist'));
      return false;
    }
  };

  const moveToCart = async (productId) => {
    try {
      await wishlistApi.moveWishlistItemToCart(productId);
      toast.success('Moved to cart');
      await fetchWishlist();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to move to cart'));
      return false;
    }
  };

  const isInWishlist = (productId) =>
    state.items.some((item) => normalizeId(item.productId) === normalizeId(productId));

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
