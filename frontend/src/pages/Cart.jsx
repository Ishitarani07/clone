import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/QuantitySelector';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/constants';

const Cart = () => {
  const navigate = useNavigate();
  const { items, subtotal, loading, updateQuantity, removeItem } = useCart();

  const shippingFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + shippingFee;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-sm shadow-sm">
            <EmptyState
              icon={
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Your cart is empty!"
              description="Add items to it now."
              actionText="Shop Now"
              actionLink="/"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h1 className="text-lg font-medium">
                  My Cart ({items.length})
                </h1>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.productId} className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <Link to={`/product/${item.productId}`} className="shrink-0">
                        <img
                          src={item.image || PLACEHOLDER_IMAGE}
                          alt={item.title}
                          className="w-24 h-24 object-contain"
                          onError={(e) => {
                            e.target.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-sm text-gray-800 hover:text-[#2874f0] line-clamp-2"
                        >
                          {item.title}
                        </Link>

                        <p className="text-lg font-medium text-gray-900 mt-2">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity & Remove */}
                        <div className="flex items-center gap-4 mt-3">
                          <QuantitySelector
                            quantity={item.quantity}
                            max={item.stock}
                            onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
                            onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
                          />
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-sm font-medium text-gray-600 hover:text-red-500 transition"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="text-right shrink-0">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-base font-medium text-gray-900">
                          {formatPrice(item.lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Place Order Button (Mobile) */}
              <div className="p-4 border-t border-gray-100 lg:hidden">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-medium hover:bg-[#e55a18] transition"
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-sm sticky top-20">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-gray-500 font-medium uppercase text-sm">
                  Price Details
                </h2>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Price ({items.length} items)
                  </span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span className="text-gray-900">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-3">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">{formatPrice(total)}</span>
                  </div>
                </div>

                {shippingFee === 0 && (
                  <p className="text-sm text-green-600">
                    You will save {formatPrice(40)} on delivery charges
                  </p>
                )}
              </div>

              {/* Place Order Button (Desktop) */}
              <div className="p-4 border-t border-gray-100 hidden lg:block">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-medium hover:bg-[#e55a18] transition"
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
