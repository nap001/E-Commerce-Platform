import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

/** Read-only star display, optionally followed by the numeric rating and review count. */
export const StarRating = ({ value = 0, count, className = '' }) => (
  <span className={`inline-flex items-center gap-1 ${className}`} title={`${value} out of 5`}>
    <span className="inline-flex" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={n} className={n <= Math.round(value) ? 'text-yellow-400' : 'text-gray-300'} />
      ))}
    </span>
    <span className="sr-only">{value} out of 5 stars</span>
    {count !== undefined && (
      <span className="text-xs text-gray-500">
        {count > 0 ? `${value.toFixed(1)} (${count})` : 'No reviews'}
      </span>
    )}
  </span>
);

/** Clickable 1-5 star picker for forms. */
export const StarInput = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="rounded p-0.5 text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          <FaStar className={n <= active ? 'text-yellow-400' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  );
};
