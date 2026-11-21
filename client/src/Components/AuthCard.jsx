import { Link } from 'react-router-dom';

/** Shared centred card used by the Login and Register pages. */
const AuthCard = ({ title, subtitle, children, footer }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-gray-50 px-4 py-10">
    <Link to="/" className="mb-6 text-3xl font-bold text-green-600">
      E_NapMerce
    </Link>
    <div className="card w-full max-w-md p-8">
      <h1 className="text-center text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mb-6 mt-1 text-center text-sm text-gray-500">{subtitle}</p>}
      {children}
    </div>
    <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>
  </div>
);

export default AuthCard;
