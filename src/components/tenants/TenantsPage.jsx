// src/pages/TenantsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get('/api/tenants');
        setTenants(res.data);
      } catch (err) {
        console.error('Failed to fetch tenants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  if (loading) return <div className="p-4">Loading tenants...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tenants</h2>
      {tenants.length === 0 ? (
        <p>No tenants found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Lease Start</th>
                <th className="p-2">Rent</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Property</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant._id} className="border-t">
                  <td className="p-2">{tenant.name}</td>
                  <td className="p-2">{tenant.phone}</td>
                  <td className="p-2">{new Date(tenant.leaseStartDate).toLocaleDateString()}</td>
                  <td className="p-2">KES {tenant.rent}</td>
                  <td className="p-2">{tenant.unitName || tenant.unitId}</td>
                  <td className="p-2">{tenant.propertyName || tenant.propertyId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenantsPage;
