import React, { useState } from 'react';
import { ShoppingBag, LogOut, ShoppingCart, Package } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../lib/contexts/AuthContext';
import { auth } from '../lib/firebase';
import Cart from './Cart';
import { useCartStore } from '../lib/stores/cartStore';
import { getUser } from '../lib/api/users';

export default function Header() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userType, setUserType] = useState<'buyer' | 'seller' | null>(null);
  const cartItems = useCartStore((state) => state.items);

  React.useEffect(() => {
    if (user) {
      getUserType();
    }
  }, [user]);

  const getUserType = async () => {
    if (user) {
      const userData = await getUser(user.uid);
      if (userData) {
        setUserType(userData.accountType);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Hide shop link for sellers
  const showShopLink = userType !== 'seller';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <ShoppingBag className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">ShopNow</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {showShopLink && (
              <Link to="/shop" className="text-gray-600 hover:text-gray-900">
                Shop
              </Link>
            )}
            {user && userType === 'buyer' && (
              <Link to="/my-orders" className="text-gray-600 hover:text-gray-900">
                My Orders
              </Link>
            )}
            {user && userType === 'seller' && (
              <>
                <Link to="/seller-dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/seller-orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {userType === 'buyer' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsCartOpen(!isCartOpen)}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItems.length}
                        </span>
                      )}
                    </button>
                    {isCartOpen && (
                      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg">
                        <Cart />
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}