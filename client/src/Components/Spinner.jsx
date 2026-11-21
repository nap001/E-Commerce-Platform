const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500" role="status">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
    <p className="text-sm">{label}</p>
  </div>
);

export default Spinner;
