import { useState, useEffect } from 'react';
import axios from 'axios';
//import { useParams } from 'react-router-dom';

export default function EditPropertyTab({ propertyId, closeTab }) {
  //const { id } = useParams();
  const [formData, setFormData] = useState(null);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  const [property, setProperty] = useState({
    name: '',
    address: '',
    type: '',
    utilities: {},
    serviceRate: {},
    paymentAccount: '',
    landlord: {},
    caretaker: {},
    units: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`https://pro-suite-server.onrender.com/api/properties/${propertyId}`)
      .then((res) => {
        setProperty(res.data)
        setFormData(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Error loading property data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [propertyId]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/api/properties/${propertyId}`, property)
      .then(() => {
        alert('Property updated successfully');
        closeTab(); // Close the tab after successful save
      })
      .catch(() => {
        setError('Error updating property');
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Edit Property</h2>

      <div>
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={property.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Address</label>
        <input
          type="text"
          name="address"
          value={property.address}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Type</label>
        <select
          name="type"
          value={property.type}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
        </select>
      </div>

      {/* Utilities */}
      <div className="space-y-2">
        <h3 className="font-semibold">Utilities</h3>
        {Object.entries(property.utilities).map(([key, util]) => (
          <div key={key} className="grid grid-cols-3 gap-2 items-end">
            <label className="capitalize">{key}</label>
            <select
              name={`utilities.${key}.billing`}
              value={util.billing}
              onChange={handleChange}
              className="border p-2 col-span-1"
            >
              <option value="metered">Metered</option>
              {/*<option value="fixed">Fixed</option>*/}
              <option value="free">Free</option>
            </select>
            {util.billing === 'metered' ? (
              <input
                type="number"
                name={`utilities.${key}.costPerUnit`}
                value={util.costPerUnit || ''}
                onChange={handleChange}
                placeholder="Cost per unit"
                className="border p-2 col-span-2"
              />
            ) : (
              <input
                type="number"
                name={`utilities.${key}.amount`}
                value={util.amount || ''}
                onChange={handleChange}
                placeholder="Amount"
                className="border p-2 col-span-2"
              />
            )}
          </div>
        ))}
      </div>

      {/* Service Rate */}
      <div className="mt-4">
        <label className="block font-semibold mb-1">Service Rate Type</label>
        <select
          value={formData.serviceRate?.type || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              serviceRate: {
                ...prev.serviceRate,
                type: e.target.value,
              },
            }))
          }
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Select type</option>
          <option value="fixed">Fixed</option>
          <option value="percentage">Percentage</option>
        </select>
      </div>

      <div className="mt-2">
        <label className="block font-semibold mb-1">Value</label>
        <input
          type="number"
          value={formData.serviceRate?.value || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              serviceRate: {
                ...prev.serviceRate,
                value: e.target.value,
              },
            }))
          }
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Enter value"
        />
      </div>


      {/* Payment Account */}
      <div>
        <label className="block font-semibold">Payment Account</label>
        <input
          type="text"
          name="paymentAccount"
          value={property.paymentAccount}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      {/* Landlord */}
      <div>
        <label className="block font-semibold">Landlord Name</label>
        <input
          type="text"
          name="landlord.name"
          value={property.landlord?.name || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <label className="block font-semibold">Landlord Phone</label>
        <input
          type="text"
          name="landlord.phone"
          value={property.landlord?.phone || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      {/* Caretaker */}
      <div>
        <label className="block font-semibold">Caretaker Name</label>
        <input
          type="text"
          name="caretaker.name"
          value={property.caretaker?.name || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <label className="block font-semibold">Caretaker Phone</label>
        <input
          type="text"
          name="caretaker.phone"
          value={property.caretaker?.phone || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      {/* Units (Add/Edit Units) */}
      <div>
        <label className="block font-semibold">Units</label>
        {property.units.map((unit, idx) => (
          <div key={idx} className="space-y-2">
            <input
              type="text"
              name={`units[${idx}].unitNumber`}
              placeholder="Unit Number"
              value={unit.unitNumber}
              onChange={handleChange}
              className="border p-2 w-full"
            />
            <input
              type="text"
              name={`units[${idx}].rent`}
              placeholder="Rent"
              value={unit.rent}
              onChange={handleChange}
              className="border p-2 w-full"
            />
            <input
              type="text"
              name={`units[${idx}].deposit`}
              placeholder="Deposit"
              value={unit.deposit}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
