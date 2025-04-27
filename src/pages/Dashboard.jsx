// src/pages/Dashboard.jsx
import { useAuth } from '../auth/auth-context';
import { Navigate } from 'react-router-dom';  // For redirecting to login if not authenticated

export default function Dashboard() {
  const { user, loading } = useAuth();  // Assuming `loading` state exists in the context
  
  if (loading) {
    // You could add a loading spinner or message here
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      <div className="text-gray-700">
        <p>
          Welcome, <strong>{user?.name}</strong>!
        </p>
        <p>
          Role: <span className="capitalize">{user?.role}</span>
        </p>
      </div>

      {/* 🔐 Admin-only content */}
      {user.role === 'admin' && (
        <section className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">Admin Panel</h3>
          <ul className="list-disc list-inside text-sm text-blue-800">
            <li>Manage users</li>
            <li>System settings</li>
            <li>View all properties</li>
            <li>Add Property</li>
            <li>Add Tenant</li>
            <li>Update Payments</li>
            <li>View Reports</li>
          </ul>
        </section>
      )}

      {/* 🧑‍💼 Property Manager content */}
      {user.role === 'manager' && (
        <section className="bg-green-50 border border-green-200 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2 text-green-700">Manager Tools</h3>
          <ul className="list-disc list-inside text-sm text-green-800">
            <li>Assigned properties</li>
            <li>Maintenance requests</li>
            <li>Tenant communication</li>
            <li>Add Tenant</li>
            <li>Update Payments</li>
            <li>View Reports</li>
          </ul>
        </section>
      )}
    </div>
  );
}
