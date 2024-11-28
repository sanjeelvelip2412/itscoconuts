import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../lib/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { addProduct, getSellerProducts, Product } from '../lib/api/products';
import { getUser } from '../lib/api/users';

export default function SellerDashboard() {
  const { user } = useAuthContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    pincode: '',
    imageFile: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadSellerData();
    }
  }, [user]);

  const loadSellerData = async () => {
    try {
      const userData = await getUser(user!.uid);
      setProfileData(userData);
      const sellerProducts = await getSellerProducts(user!.uid);
      setProducts(sellerProducts);
    } catch (error) {
      console.error('Error loading seller data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        setFormData(prev => ({
          ...prev,
          imageFile: fileInput.files![0]
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.pincode) {
        throw new Error('Pincode is required for delivery area');
      }

      const imageUrl = formData.imageUrl || 'https://via.placeholder.com/400';

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl,
        pincode: formData.pincode,
        sellerId: user!.uid,
        createdAt: new Date().toISOString()
      };

      await addProduct(productData);
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        pincode: '',
        imageFile: null
      });
      loadSellerData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller Profile</h2>
          {profileData && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{profileData.firstName} {profileData.lastName}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{profileData.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{profileData.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">Address</p>
                <p className="font-medium">{profileData.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Add Product Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Product</h2>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                Delivery Pincode
              </label>
              <input
                type="text"
                name="pincode"
                id="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter delivery area pincode"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="imageUrl" className="block text-sm text-gray-500 mb-1">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-xl font-bold text-indigo-600">${product.price}</p>
                <p className="text-sm text-gray-500 mt-2">Delivery Area: {product.pincode}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}