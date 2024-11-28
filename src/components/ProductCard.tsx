import React from 'react';
import { Product } from '../lib/api/products';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative pb-[100%]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-1 text-gray-600 line-clamp-2">{product.description}</p>
        <p className="mt-2 text-xl font-bold text-gray-900">${product.price}</p>
      </div>
    </div>
  );
}