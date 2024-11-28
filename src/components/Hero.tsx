import React from 'react';

export default function Hero() {
  return (
    <div className="relative bg-gray-900 min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-50"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80"
          alt="Shopping"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Welcome to ShopNow
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
          Your one-stop destination for all your shopping needs. Join us today and discover amazing products at unbeatable prices.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Sign In
          </button>
          <button className="px-8 py-4 text-lg font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}