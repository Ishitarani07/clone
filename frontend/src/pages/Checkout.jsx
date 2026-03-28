import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createRazorpayOrder, verifyPayment } from '../api/checkoutApi';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/constants';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    pincode: '',
    city: '',
    state: '',
    line1: '',
    line2: '',
    landmark: '',
  });

  const shippingFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    const required = ['fullName', 'mobile', 'pincode', 'city', 'state', 'line1'];
    for (const field of required) {
      if (!address[field]?.trim()) {
        toast.error(`Please enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/^\d{10}$/.test(address.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateAddress()) return;

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      // Create Razorpay order
      const orderResponse = await createRazorpayOrder();
      const { orderId, amount, currency } = orderResponse.data;

      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Flipkart Clone',
        description: 'Order Payment',
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: address,
            });

            toast.success('Order placed successfully!');
            await fetchCart();
            navigate(`/order/${verifyResponse.data.orderId}/confirmation`);
          } catch (error) {
            toast.error(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.mobile,
        },
        theme: {
          color: '#2874f0',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#2874f0] text-white px-6 py-2 rounded-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm shadow-sm">
              <div className="p-4 border-b border-gray-100 bg-[#2874f0]">
                <h2 className="text-white font-medium">Delivery Address</h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={address.mobile}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]"
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={address.landmark}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="line1"
                      value={address.line1}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]"
                      placeholder="House No., Building Name, Street"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="line2"
                      value={address.line2}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]"
                      placeholder="Area, Colony"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-sm shadow-sm mt-4">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-medium text-gray-800">
                  Order Summary ({items.length} items)
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.productId} className="p-4 flex gap-4">
                    <img
                      src={item.image || PLACEHOLDER_IMAGE}
                      alt={item.title}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatPrice(item.lineTotal)}
                      </p>
                    </div>
                  </div>
                ))}
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
                  <div className="flex justify-between font-medium text-lg">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-medium hover:bg-[#e55a18] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      PAY {formatPrice(total)}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
