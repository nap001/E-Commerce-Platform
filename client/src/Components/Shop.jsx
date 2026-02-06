import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCards';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar'; // 🔽 import it here

const Shop = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/items`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error('Error fetching items:', err));
  }, []);

  const categories = [...new Set(items.map((item) => item.category))];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === '' || item.category === selectedCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6">
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* SearchBar component */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filteredItems.map((item) => (
          <ItemCard
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            description={item.description}
            category={item.category}
            price={item.price}
            quantity={item.quantity}
          />
        ))}
      </div>
    </div>
  );
};

export default Shop;
