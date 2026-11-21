import { StarRating } from './StarRating';
import { formatPrice } from '../utils/format';

const ItemInfo = ({ name, category, price, quantity, averageRating, reviewCount }) => (
  <div className="space-y-2">
    <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
      {category}
    </span>
    <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
    <StarRating value={averageRating} count={reviewCount} />
    <p className="text-2xl font-semibold text-green-600">{formatPrice(price)}</p>
    <p className={`text-sm font-medium ${quantity > 0 ? 'text-green-700' : 'text-red-600'}`}>
      {quantity > 0 ? `${quantity} available` : 'Out of stock'}
    </p>
  </div>
);

export default ItemInfo;
