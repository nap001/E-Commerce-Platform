import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // ⬅️ Import useAuth to get token

const SellItem = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // ⬅️ Get the token

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Please log in to add item.');
      return;
    }

    const itemData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/items`, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Item listed successfully!');
      setError('');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
    console.log(formData)
  console.error('Error response:', err.response);
  console.error('Error message:', err.message);
  console.error('Full error:', err);
  setError(err.message);
  setSuccess('');
}

  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Sell an Item</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Item
        </button>
      </form>
    </div>
  );
};

export default SellItem;
