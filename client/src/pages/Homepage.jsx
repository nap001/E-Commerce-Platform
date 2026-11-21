import { Link } from 'react-router-dom';
import Shop from '../Components/Shop';
import { useAuth } from '../context/AuthContext';

const Homepage = () => {
  const { token } = useAuth();

  return (
    <div>
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-10 text-white shadow-sm sm:px-10">
        <h1 className="text-3xl font-bold sm:text-4xl">Find great items. Sell what you no longer need.</h1>
        <p className="mt-2 max-w-xl text-green-50">
          Browse listings from our community, or put your own items up for sale in a minute.
        </p>
        <Link
          to={token ? '/sell' : '/register'}
          className="mt-5 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          {token ? 'Sell an item' : 'Get started'}
        </Link>
      </section>

      <Shop />
    </div>
  );
};

export default Homepage;
