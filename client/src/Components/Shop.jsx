import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import ItemCard from './ItemCards';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar';
import Spinner from './Spinner';

const PAGE_SIZE = 12;

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: '', sort: 'newest', inStock: false });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    api
      .get('/items/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => {}); // the filter just stays empty
  }, []);

  // Debounce typing so we do not hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    api
      .get('/items', {
        params: {
          search,
          category: filters.category,
          sort: filters.sort,
          inStock: filters.inStock || undefined,
          page,
          limit: PAGE_SIZE,
        },
      })
      .then(({ data }) => !cancelled && setResult(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Failed to load items.')))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [search, filters, page, reloadKey]);

  const handleFilterChange = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const goToPage = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section>
      <div className="card mb-6 space-y-4 p-4">
        <SearchBar searchQuery={searchInput} onSearchChange={setSearchInput} />
        <FilterBar categories={categories} filters={filters} onChange={handleFilterChange} />
      </div>

      {error && (
        <div className="alert-error mb-6 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button className="btn-secondary" onClick={() => setReloadKey((k) => k + 1)}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <Spinner label="Loading items..." />
      ) : (
        !error &&
        (result.items.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">
            No items match your search. Try changing the filters.
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">
              {result.total} item{result.total === 1 ? '' : 's'} found
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>

            {result.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button className="btn-secondary" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {result.pages}
                </span>
                <button className="btn-secondary" disabled={page >= result.pages} onClick={() => goToPage(page + 1)}>
                  Next
                </button>
              </div>
            )}
          </>
        ))
      )}
    </section>
  );
};

export default Shop;
