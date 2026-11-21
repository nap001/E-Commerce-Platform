import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

/** Renders its children only for logged-in users; otherwise redirects to /login and back. */
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Checking your session..." />;
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
};

export default ProtectedRoute;
