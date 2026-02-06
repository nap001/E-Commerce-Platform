// src/components/ItemCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ id, name, image, description, category, price, quantity }) => {
  return (
    <Link to={`/items/${id}`} className="block">
      <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Product Image */}
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-contain bg-gray-100"
        />

        {/* Card Content */}
        <div className="p-4">
          {/* Category Tag */}
          <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full mb-2">
            {category}
          </span>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-1 mb-2">{description}</p>

          {/* Price & Quantity */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-800 font-medium">Price: ${price}</span>
            <span
              className={`${
                quantity > 0 ? 'text-green-600' : 'text-red-500'
              } font-medium`}
            >
              {quantity > 0 ? `${quantity} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
