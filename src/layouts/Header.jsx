import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../auth/auth-context';
import { useNavigate, Link } from 'react-router-dom';  // Import Link from react-router-dom

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white shadow-md p-4">
      <div className="flex items-center justify-between">
        {/* Logo or title */}
        <h1 className="text-xl font-bold text-blue-600">Property Suite</h1>

        {/* Toggle button for mobile view */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-blue-600 p-2 rounded-md focus:outline-none bg-white shadow"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Horizontal alignment of menu items to the right, for desktop */}
      <nav className="hidden md:flex md:items-center md:space-x-8 md:ml-auto">
        <ul className="flex space-x-8 ml-auto">
          <li>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md"
            >
              Manage
            </Link>
          </li>
          <li>
            <Link
              to="/selling"
              className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md"
            >
              Sell
            </Link>
          </li>
          <li>
            <a
              href="https://qenops.co.ke/contact"
              className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md"
            >
              Contact Us
            </a>
          </li>
        </ul>
      </nav>

      {/* Mobile menu: shown when menuOpen is true */}
      <div
        className={`md:hidden ${menuOpen ? 'block' : 'hidden'} bg-white shadow-md py-4 mt-2`}
      >
        <ul className="space-y-4 px-4">
          <li>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 block"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 block"
            >
              Manage
            </Link>
          </li>
          <li>
            <Link
              to="/selling"
              className="text-blue-600 hover:text-blue-800 block"
            >
              Sell
            </Link>
          </li>
          <li>
            <a
              href="https://qenops.co.ke/contact"
              className="text-blue-600 hover:text-blue-800 block"
            >
              Contact Us
            </a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
