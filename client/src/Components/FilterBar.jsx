// src/components/FilterBar.jsx
import React from 'react';

const FilterBar = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-white shadow-md rounded-md mb-6">
      <label className="text-gray-700 font-medium">
        Filter by Category:
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="ml-2 px-3 py-1 border border-gray-300 rounded-md"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default FilterBar;
