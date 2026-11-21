const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name (A-Z)' },
];

const FilterBar = ({ categories, filters, onChange }) => (
  <div className="flex flex-wrap items-end gap-4">
    <div className="min-w-40 flex-1">
      <label htmlFor="category" className="label">
        Category
      </label>
      <select
        id="category"
        value={filters.category}
        onChange={(e) => onChange({ category: e.target.value })}
        className="input"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    <div className="min-w-40 flex-1">
      <label htmlFor="sort" className="label">
        Sort by
      </label>
      <select id="sort" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })} className="input">
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    <label className="flex items-center gap-2 pb-2 text-sm font-medium text-gray-700">
      <input
        type="checkbox"
        checked={filters.inStock}
        onChange={(e) => onChange({ inStock: e.target.checked })}
        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
      />
      In stock only
    </label>
  </div>
);

export default FilterBar;
