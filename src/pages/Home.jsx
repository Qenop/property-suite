// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-50 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Welcome to Property Suite
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-6">
          {/* Property Management */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center text-center">
            <div className="text-blue-500 mb-4">
              <i className="fas fa-building fa-3x"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Manage Properties
            </h3>
            <p className="text-gray-600 mb-6">
              Add and manage properties, tenants, units, billing, and maintenance tasks with ease.
            </p>
            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Get Started
            </Link>
          </div>

          {/* Property Selling */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center text-center">
            <div className="text-green-500 mb-4">
              <i className="fas fa-home fa-3x"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Sell Properties
            </h3>
            <p className="text-gray-600 mb-6">
              Track listings, manage interested buyers, communicate with agents, and handle post-sale invoicing.
            </p>
            <Link to="/selling" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-900">
              Explore Selling
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}
