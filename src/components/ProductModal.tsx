import React, { useState } from 'react';
import { Product } from '../lib/api/products';
import { useCartStore } from '../lib/stores/cartStore';
import { X, ShoppingCart, CreditCard, Truck } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthContext } from '../lib/contexts/AuthContext';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { user } = useAuthContext();
  const addToCart = useCartStore((state) => state.addItem);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    pincode: '',
    paymentMethod: 'cod' as 'cod' | 'payu'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  const handleBuyNow = async () => {
    if (!deliveryInfo.address || !deliveryInfo.pincode) {
      setError('Please fill in all delivery details');
      return;
    }

    if (deliveryInfo.pincode !== product.pincode) {
      setError('Sorry, delivery is not available in your area');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = {
        userId: user?.uid,
        items: [{
          productId: product.id,
          name: product.name,
          quantity: 1,
          price: product.price
        }],
        total: product.price,
        deliveryAddress: deliveryInfo.address,
        pincode: deliveryInfo.pincode,
        paymentMethod: deliveryInfo.paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'orders'), order);
      alert('Order placed successfully!');
      onClose();
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="relative pb-[100%] md:pb-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-3xl font-bold text-gray-900 mb-6">${product.price}</p>
            <p className="text-sm text-gray-500 mb-4">Delivery available in: {product.pincode}</p>

            {!showCheckout ? (
              <div className="space-y-4 mt-auto">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 py-3 px-4 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <CreditCard className="h-5 w-5" />
                  Buy Now
                </button>
              </div>
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
                    onClick={handleBuyNow}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}