import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import PriceTag from '../components/PriceTag';
import EmptyState from '../components/EmptyState';
import { PLACEHOLDER_IMAGE } from '../utils/constants';

const Wishlist = () => {
  const { items, loading, fetchWishlist, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMoveToCart = async (productId) => {
    const success = await moveToCart(productId);
    if (success !== false) {
      await addToCart(productId, 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">My Wishlist ({items.length})</h1>
            <p className="text-sm text-gray-500">Save items you love and buy them anytime.</p>
          </div>
          <Link to="/" className="text-[#2874f0] text-sm font-medium">Continue Shopping</Link>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Add products to your wishlist to see them here."
            actionText="Shop Now"
            actionLink="/"
            icon={
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-sm shadow-sm p-4 flex gap-4">
                <img
                  src={item.image || PLACEHOLDER_IMAGE}
                  alt={item.title}
                  className="w-32 h-32 object-contain border border-gray-100 rounded"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div className="flex-1">
                  <Link to={`/product/${item.productId}`} className="text-gray-900 font-medium line-clamp-2">
                    {item.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
                  <div className="mt-2">
                    <PriceTag price={item.price} finalPrice={item.finalPrice} size="md" />
                  </div>
                  {item.stock === 0 ? (
                    <p className="text-sm text-red-500 font-medium mt-1">Currently out of stock</p>
                  ) : item.stock <= 5 ? (
                    <p className="text-sm text-orange-500 font-medium mt-1">
                      Only {item.stock} left in stock
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 font-medium mt-1">In stock</p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => handleMoveToCart(item.productId)}
                      className="flex-1 min-w-[140px] bg-[#ff9f00] text-white text-sm font-medium py-2 rounded-sm hover:bg-[#e68f00] transition"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="flex-1 min-w-[140px] border border-gray-200 text-sm font-medium py-2 rounded-sm hover:bg-gray-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
