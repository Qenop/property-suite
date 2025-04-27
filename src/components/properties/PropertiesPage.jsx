import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/properties')
      .then(res => setProperties(res.data))
      .catch(err => console.error('Error fetching properties:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading properties...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Properties</h2>
        <Link
          to="/add-property"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
        >
          + Create New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="text-gray-500">No properties added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold">{property.name}</h3>
              <p className="text-gray-600">{property.address}</p>
              <p className="text-sm text-gray-500">Type: {property.type}</p>

              <Link
                to={`/properties/${property._id}`}
                className="mt-4 inline-block text-blue-600 hover:underline text-sm"
              >
                View More →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
