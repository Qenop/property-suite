// === Imports & Setup ===
import { useState, useEffect } from 'react';
import axios from 'axios';

// === Component ===
export default function AssignTenant() {
  // === State: General ===
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // === State: Selections ===
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');

  // === State: Form ===
  const [formData, setFormData] = useState({
    tenantName: '',
    tenantPhone: '',
    leaseStartDate: '',
    rent: '',
    deposit: '',
    initialWaterReading: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // === Effect: Fetch Properties ===
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        setProperties(response.data || []);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // === Derived Data ===
  const selectedProperty = properties.find((p) => p._id === selectedPropertyId) || null;
  const units = selectedProperty?.units ?? [];
  const vacantUnits = units.filter((unit) => unit.status === 'vacant');
  const selectedUnit = vacantUnits.find((unit) => unit._id === selectedUnitId) || null;

   // === Effect: Auto-fill Rent & Deposit ===
  useEffect(() => {
    if (selectedUnit) {
      setFormData((prev) => ({
        ...prev,
        rent: selectedUnit.rent || '',
        deposit: selectedUnit.deposit || '',
      }));
    }
  }, [selectedUnit]);

  // === Handlers: Field Change ===
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

   // === Handler: Form Submit ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Basic Validation(optional)
    if (!formData.tenantName?.trim() || !formData.tenantPhone?.trim()) {
      setMessage('Tenant name and phone are required.');
      return;
    }

    // Ensure initialWaterReading is provided if water billing is metered
    if (selectedProperty?.utilities?.water?.billing === 'metered' && !formData.initialWaterReading) {
      setMessage('Please provide the initial water meter reading.');
      return;
    }

    const payload = {
      propertyId: selectedPropertyId,
      unitId: selectedUnitId,
      tenant: {
        name: formData.tenantName.trim(),
        phone: formData.tenantPhone.trim(),
        leaseStartDate: formData.leaseStartDate,
        rent: Number(formData.rent),
        deposit: Number(formData.deposit),
        ...(selectedProperty?.utilities?.water?.billing === 'metered' && {
          initialWaterReading: Number(formData.initialWaterReading),
        }),
      },
    };

    try {
      setSubmitting(true);
      setMessage('');
      const response = await axios.post('http://localhost:5000/api/leases', payload);
      setMessage('✅ Tenant assigned successfully!');
      console.log('Lease created:', response.data);

      // Reset form
      setSelectedPropertyId('');
      setSelectedUnitId('');
      setFormData({
        tenantName: '',
        tenantPhone: '',
        leaseStartDate: '',
        rent: '',
        deposit: '',
        initialWaterReading: '',
      });
    } catch (error) {
      console.error('Lease creation failed:', error.response?.data || error.message);
      setMessage(`❌ Failed to assign tenant: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // === UI: Loading State ===
  if (loading) {
    return <div className="p-4 text-center">Loading properties...</div>;
  }

  // === Render ===
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold">Assign Tenant</h2>

      {message && (
        <div
          className={`p-2 text-center rounded ${
            message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      {/* === Form === */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tenant Info */}
        <div>
          <label className="block font-medium mb-1">Tenant Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.tenantName}
            onChange={(e) => handleChange('tenantName', e.target.value.trimStart())}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Tenant Phone</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formData.tenantPhone}
            onChange={(e) => handleChange('tenantPhone', e.target.value.trimStart())}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Lease Start Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={formData.leaseStartDate}
            onChange={(e) => handleChange('leaseStartDate', e.target.value)}
            required
          />
        </div>

        {/* Property Selector */}
        <div>
          <label className="block font-medium mb-1">Property</label>
          <select
            className="w-full border rounded p-2"
            value={selectedPropertyId}
            onChange={(e) => {
              setSelectedPropertyId(e.target.value);
              setSelectedUnitId('');
              setFormData((prev) => ({
                ...prev,
                rent: '',
                deposit: '',
                initialWaterReading: '',
              }));
            }}
            required
          >
            <option value="">Select a property</option>
            {properties.map((property) => (
              <option key={property._id} value={property._id}>
                {property.name} - {property.address}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Selector */}
        {selectedPropertyId && (
          <>
            {vacantUnits.length > 0 ? (
              <div>
                <label className="block font-medium mb-1">Unit</label>
                <select
                  className="w-full border rounded p-2"
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  required
                >
                  <option value="">Select a unit</option>
                  {vacantUnits.map((unit) => (
                    <option key={unit._id} value={unit._id}>
                      {unit.unitNumber || 'Unit'} ({unit.type})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-sm text-red-500">No vacant units available in this property.</p>
            )}
          </>
        )}

        {/* Rent & Deposit */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Rent</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={formData.rent}
              onChange={(e) => handleChange('rent', e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Deposit</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={formData.deposit}
              onChange={(e) => handleChange('deposit', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Water Meter Reading */}
        {selectedProperty?.utilities?.water?.billing === 'metered' && (
          <div>
            <label className="block font-medium mb-1">Initial Water Meter Reading</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={formData.initialWaterReading}
              onChange={(e) => handleChange('initialWaterReading', e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={
            submitting ||
            !selectedPropertyId ||
            !selectedUnitId ||
            !formData.tenantName.trim() ||
            !formData.tenantPhone.trim() ||
            !formData.leaseStartDate
          }
        >
          {submitting ? 'Assigning...' : 'Assign Tenant'}
        </button>
      </form>
    </div>
  );
}
