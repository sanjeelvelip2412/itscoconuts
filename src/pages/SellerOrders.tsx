import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../lib/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getSellerOrders, Order } from '../lib/api/orders';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function SellerOrders() {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const sellerOrders = await getSellerOrders(user!.uid);
      setOrders(sellerOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      loadOrders(); // Reload orders after update
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Order Management</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">Order #{order.id?.slice(-6)}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id!, e.target.value as Order['status'])}
                  className="border rounded-md px-3 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Buyer Details</h4>
                <p className="text-sm">Name: {order.buyerName}</p>
                <p className="text-sm">Email: {order.buyerEmail}</p>
                <p className="text-sm">Address: {order.deliveryAddress}</p>
                <p className="text-sm">Pincode: {order.pincode}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold">₹{order.total}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}