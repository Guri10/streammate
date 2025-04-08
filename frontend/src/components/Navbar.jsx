import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, token } = useAuth();

  if (!token) return null;

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between">
      <div className="space-x-4">
        <Link to="/watchlist">Watchlist</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/search">Search</Link>
      </div>
      <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
