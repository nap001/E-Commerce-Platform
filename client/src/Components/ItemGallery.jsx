import ProductImage from './ProductImage';

const ItemImageGallery = ({ image, name }) => (
  <div className="card p-4">
    <ProductImage src={image} alt={name} className="h-80 w-full rounded-lg" />
  </div>
);

export default ItemImageGallery;
