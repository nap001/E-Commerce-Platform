import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../Components/AuthCard';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { token, login } = useAuth();

  if (token && !submitting) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data } = await api.post('/auth/register', formData);
      login(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed. Please try again.'));
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start buying and selling in minutes"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-green-700 hover:underline">
            Login here
          </Link>
        </>
      }
    >
      {error && <p className="alert-error mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" type="text" autoComplete="name" required maxLength={60} value={formData.name} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
            className="input"
          />
          <p className="mt-1 text-xs text-gray-500">At least 6 characters.</p>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
