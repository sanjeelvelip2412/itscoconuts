import React, { useState } from 'react';
import { useCartStore } from '../lib/stores/cartStore';
import { ShoppingCart, Minus, Plus, X, Truck, CreditCard } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthContext } from '../lib/contexts/AuthContext';

export default function Cart() {
  const { user } = useAuthContext();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    pincode: '',
    paymentMethod: 'cod' as 'cod' | 'payu'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <ShoppingCart className="mx-auto h-12 w-12 mb-2" />
        <p>Your cart is empty</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!deliveryInfo.address || !deliveryInfo.pincode) {
      setError('Please fill in all delivery details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = {
        userId: user?.uid,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: total(),
        deliveryAddress: deliveryInfo.address,
        pincode: deliveryInfo.pincode,
        paymentMethod: deliveryInfo.paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'orders'), order);
      clearCart();
      alert('Order placed successfully!');
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {!showCheckout ? (
        <>
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-2 border-b">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-500">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id!, Math.max(0, item.quantity - 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeItem(item.id!)}
                  className="p-1 hover:bg-gray-100 rounded text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-lg font-medium">Total</p>
              <p className="text-2xl font-bold">${total().toFixed(2)}</p>
            </div>
            <button 
              onClick={() => setShowCheckout(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address
            </label>
            <textarea
              value={deliveryInfo.address}
              onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
              className="w-full border rounded-md p-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <input
              type="text"
              value={deliveryInfo.pincode}
              onChange={(e) => setDeliveryInfo(prev => ({ ...prev, pincode: e.target.value }))}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={deliveryInfo.paymentMethod === 'cod'}
                  onChange={() => setDeliveryInfo(prev => ({ ...prev, paymentMethod: 'cod' }))}
                  className="text-indigo-600"
                />
                <Truck className="h-5 w-5" />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={deliveryInfo.paymentMethod === 'payu'}
                  onChange={() => setDeliveryInfo(prev => ({ ...prev, paymentMethod: 'payu' }))}
                  className="text-indigo-600"
                />
                <CreditCard className="h-5 w-5" />
                <span>PayU</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={() => setShowCheckout(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}