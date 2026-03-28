import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api/checkoutApi';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/constants';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(id);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link to="/" className="bg-[#2874f0] text-white px-6 py-2 rounded-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Banner */}
        <div className="bg-white rounded-sm shadow-sm p-8 text-center mb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. Your order has been confirmed.
          </p>
          <div className="bg-gray-50 rounded px-4 py-3 inline-block">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-lg font-medium text-[#2874f0]">{order.orderNumber}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-sm shadow-sm mb-4">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Order Details</h2>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="text-gray-800">
                  {new Date(order.placedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Payment Status</p>
                <p className="text-green-600 font-medium capitalize">
                  {order.payment?.status}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Order Status</p>
                <p className="text-[#2874f0] font-medium capitalize">
                  {order.orderStatus}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="text-gray-800 capitalize">
                  {order.payment?.method}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-sm shadow-sm mb-4">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Delivery Address</h2>
          </div>

          <div className="p-4 text-sm">
            <p className="font-medium text-gray-800">{order.shippingAddress?.fullName}</p>
            <p className="text-gray-600 mt-1">
              {order.shippingAddress?.line1}
              {order.shippingAddress?.line2 && `, ${order.shippingAddress.line2}`}
            </p>
            <p className="text-gray-600">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
            <p className="text-gray-600 mt-1">
              Mobile: {order.shippingAddress?.mobile}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-sm shadow-sm mb-4">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">
              Items ({order.items?.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {order.items?.map((item, index) => (
              <div key={index} className="p-4 flex gap-4">
                <img
                  src={item.image || PLACEHOLDER_IMAGE}
                  alt={item.title}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatPrice(item.lineTotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-sm shadow-sm mb-4">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Price Summary</h2>
          </div>

          <div className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatPrice(order.pricing?.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              {order.pricing?.shippingFee === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                <span className="text-gray-900">{formatPrice(order.pricing?.shippingFee)}</span>
              )}
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatPrice(order.pricing?.total)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to="/"
            className="flex-1 bg-[#2874f0] text-white py-3 rounded-sm font-medium text-center hover:bg-blue-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
