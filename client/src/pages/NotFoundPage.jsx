import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="card mx-auto max-w-xl p-10 text-center">
    <p className="text-5xl font-bold text-green-600">404</p>
    <h1 className="mt-2 text-xl font-semibold text-gray-900">Page not found</h1>
    <p className="mb-6 mt-1 text-gray-600">The page you are looking for does not exist or has moved.</p>
    <Link to="/" className="btn-primary">
      Go home
    </Link>
  </div>
);

export default NotFoundPage;
