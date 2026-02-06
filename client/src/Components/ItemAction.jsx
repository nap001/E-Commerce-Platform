import React from 'react';
import { useCart } from '../context/CartContext'; // Adjust path as needed

const ItemActions = ({ item, stock }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {

    addToCart({
      id: item.id || item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleAddToCart}
        disabled={stock <= 0}
        className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
          stock > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ItemActions;
