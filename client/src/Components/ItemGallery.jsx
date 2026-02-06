import React from 'react';

const ItemImageGallery = ({ image }) => (
  <div className="bg-gray-100 p-4 rounded-md">
    <img src={image} alt="Product" className="w-full h-80 object-contain" />
  </div>
);

export default ItemImageGallery;
