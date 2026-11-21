import { useState } from 'react';
import { FiImage } from 'react-icons/fi';

/** <img> that falls back to a neutral placeholder when the URL is missing or broken. */
const ProductImage = ({ src, alt, className = '' }) => {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-300 ${className}`} role="img" aria-label={alt}>
        <FiImage className="h-10 w-10" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={`bg-gray-50 object-contain ${className}`}
    />
  );
};

export default ProductImage;
