import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';

const EMPTY = { name: '', image: '', description: '', category: '', price: '', quantity: '' };

/**
 * Create/edit form shared by the Sell and Edit pages.
 * `onSubmit` receives the validated payload and should throw/reject on failure.
 */
const ItemForm = ({ title, submitLabel, initialValues, onSubmit }) => {
  const [formData, setFormData] = useState({ ...EMPTY, ...initialValues });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/items/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const price = parseFloat(formData.price);
    const quantity = parseInt(formData.quantity, 10);
    if (Number.isNaN(price) || price < 0) return setError('Price must be a positive number.');
    if (Number.isNaN(quantity) || quantity < 0) return setError('Quantity must be a whole number (0 or more).');

    setSubmitting(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        image: formData.image.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price,
        quantity,
      });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save the item.'));
      setSubmitting(false);
    }
  };

  return (
    <div className="card mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-green-700">{title}</h1>

      {error && <p className="alert-error mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Item name
          </label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} className="input" maxLength={120} required />
        </div>

        <div>
          <label htmlFor="image" className="label">
            Image URL
          </label>
          <input id="image" name="image" type="url" placeholder="https://..." value={formData.image} onChange={handleChange} className="input" required />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-2 h-32 rounded-lg border border-gray-200 bg-gray-50 object-contain"
              onError={(e) => (e.currentTarget.style.display = 'none')}
              onLoad={(e) => (e.currentTarget.style.display = '')}
            />
          )}
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="input" maxLength={5000} required />
        </div>

        <div>
          <label htmlFor="category" className="label">
            Category
          </label>
          <input id="category" name="category" list="category-options" value={formData.category} onChange={handleChange} className="input" required />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="label">
              Price (USD)
            </label>
            <input id="price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label htmlFor="quantity" className="label">
              Quantity
            </label>
            <input id="quantity" name="quantity" type="number" min="0" step="1" value={formData.quantity} onChange={handleChange} className="input" required />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </form>
    </div>
  );
};

export default ItemForm;
