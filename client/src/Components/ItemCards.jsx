import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import { StarRating } from './StarRating';
import { formatPrice } from '../utils/format';

/** Product card. `actions` is an optional footer (e.g. Edit / Delete on "My Items"). */
const ItemCard = ({ item, actions }) => {
  const { _id, name, image, description, category, price, quantity, averageRating = 0, reviewCount = 0 } = item;
  const inStock = quantity > 0;

  return (
    <article className="card flex flex-col overflow-hidden transition hover:shadow-md">
      <Link to={`/items/${_id}`} className="block">
        <ProductImage src={image} alt={name} className="h-48 w-full" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 w-fit rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
          {category}
        </span>

        <h2 className="text-lg font-semibold text-gray-900">
          <Link to={`/items/${_id}`} className="hover:text-green-700">
            {name}
          </Link>
        </h2>

        <p className="mb-2 mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>

        <StarRating value={averageRating} count={reviewCount} />

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
            {inStock ? `${quantity} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      {actions && <div className="flex gap-2 border-t border-gray-100 p-3">{actions}</div>}
    </article>
  );
};

export default ItemCard;
