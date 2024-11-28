import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../lib/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getUserOrders, Order } from '../lib/api/orders';
import OrderList from '../components/OrderList';

export default function MyOrders() {
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
      const userOrders = await getUserOrders(user!.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <OrderList orders={orders} />
        )}
      </div>
    </div>
  );
}