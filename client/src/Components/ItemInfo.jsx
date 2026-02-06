import React from 'react'

const ItemInfo = ({ name, category, price, quantity }) => 
{
    return (
    <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-sm text-gray-500">{category}</p>
        <p className="text-xl text-green-600 font-semibold mt-2">${price}</p>
        <span
        className={`text-sm font-medium ${
            quantity > 0 ? 'text-green-700' : 'text-red-600'
        }`}
        >
        {quantity > 0 ? `${quantity} available` : 'Out of stock'}
        </span>
    </div>
    );
};


export default ItemInfo;
