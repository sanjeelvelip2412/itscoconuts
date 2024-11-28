import React from 'react';
import { Order } from '../lib/api/orders';

interface OrderListProps {
  orders: Order[];
  isSeller?: boolean;
}

export default function OrderList({ orders, isSeller = false }: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">Order #{order.id?.slice(-6)}</h3>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {isSeller && (
            <div className="mb-4">
              <h4 className="font-medium">Buyer Details</h4>
              <p className="text-sm">Name: {order.buyerName}</p>
              <p className="text-sm">Email: {order.buyerEmail}</p>
            </div>
          )}

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{item.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Delivery Address:</p>
                <p className="text-sm">{order.deliveryAddress}</p>
                <p className="text-sm">Pincode: {order.pincode}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-bold">₹{order.total}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}