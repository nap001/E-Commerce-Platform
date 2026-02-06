import React from 'react';


const ItemDescription = ({ text }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Product Description</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
};

export default ItemDescription;
