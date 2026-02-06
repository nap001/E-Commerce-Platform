// components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      />
    </div>
  );
};

export default SearchBar;
