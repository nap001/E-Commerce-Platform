const ItemDescription = ({ text }) => (
  <div className="card p-6">
    <h2 className="mb-3 text-xl font-semibold text-gray-800">Product Description</h2>
    <p className="whitespace-pre-line leading-relaxed text-gray-700">{text}</p>
  </div>
);

export default ItemDescription;
