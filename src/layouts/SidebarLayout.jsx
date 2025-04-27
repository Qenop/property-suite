import { useState } from 'react';
import { useAuth } from '../auth/auth-context';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function SidebarLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = {
    admin: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Add Property', to: '/add-property' },
      { label: 'View Properties', to: '/properties' },
      { label: 'Assign Tenant', to: '/assign-tenant' },
      //{ label: 'Billing', to: '/billing' },
      { label: 'Reports', to: '#' },
      { label: 'Payments', to: '#' },
    ],
    manager: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Add Property', to: '/add-property' },
      { label: 'View Properties', to: '/properties' },
      { label: 'Assign Tenant', to: '/assign-tenant' },
      //{ label: 'Billing', to: '/billing' },
      { label: 'Reports', to: '#' },
      { label: 'Payments', to: '#' },
    ],
  };

  const links = navItems[user?.role] || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-blue-600 p-2 rounded-md focus:outline-none bg-white shadow"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-10md:top-0 left-0 h-full w-64 bg-white shadow-md p-4 z-40 transition-transform duration-200
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        >
          <h2 className="text-lg font-bold mb-4">Navigation</h2>
          <ul className="space-y-2 text-sm">
            {links.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-2 py-1 rounded ${
                    location.pathname === item.to
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 transition-all duration-300 md:ml-50">
          {children}
        </main>
      </div>
    </div>
  );
}
