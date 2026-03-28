import { useEffect, useState } from 'react';
import { getOrders } from '../api/checkoutApi';
import { formatPrice } from '../utils/formatPrice';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Orders</h1>

        {loading ? (
          <div className="bg-white p-6 rounded-sm shadow-sm text-center">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-6 rounded-sm shadow-sm text-center text-gray-600">
            No orders placed yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-sm shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-lg font-semibold text-[#2874f0]">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placed On</p>
                    <p className="text-gray-800">
                      {new Date(order.placedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-gray-800 font-semibold">
                      {formatPrice(order.pricing?.total || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-sm font-semibold text-green-600 capitalize">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 text-sm text-gray-700">
                      <span className="text-gray-500">{item.quantity}x</span>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-gray-500">{formatPrice(item.lineTotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
