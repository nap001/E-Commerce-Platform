import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ searchQuery, onSearchChange }) => (
  <div className="relative">
    <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="search"
      placeholder="Search items..."
      aria-label="Search items"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="input pl-9"
    />
  </div>
);

export default SearchBar;
