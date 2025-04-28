import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function OverviewTab() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://pro-suite-server.onrender.com/api/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(err => console.error('Error fetching property:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading property...</div>;
  if (!property) return <div className="p-6">Property not found.</div>;

  const {
    name,
    address,
    type,
    utilities,
    serviceRate,
    paymentAccount,
    landlord,
    caretaker,
    units,
  } = property;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-gray-600"><strong>Address:</strong> {address}</p>
      <p><strong>Type:</strong> {type}</p>

      {/* Utilities */}
      <div>
        <h3 className="font-bold mt-4">Utilities</h3>
        {Object.entries(utilities || {}).map(([key, value]) => (
          <p key={key}>
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
            {value.billing}
            {value.billing === 'metered' && value.costPerUnit && (
              <span> (KES {value.costPerUnit} per unit)</span>
            )}
            {value.billing !== 'metered' && value.amount && (
              <span> (KES {value.amount})</span>
            )}
          </p>
        ))}
      </div>


      {/* Service Rate */}
      <div>
        <h3 className="font-semibold mt-4">Service Rate</h3>
        {serviceRate && (
          <p>
            {serviceRate.type} - {serviceRate.value}
            {serviceRate.type === 'fixed' ? ' KES' : '%'}
          </p>
        )}
      </div>

      {/* Payment Account */}
      <div>
        <h3 className="font-semibold mt-4">Payment Details</h3>
        {/* Renders Account as an Object
        <p>{paymentAccount?.accountName}</p>
        <p>{paymentAccount?.accountNumber}</p>
        <p>{paymentAccount?.bankName}</p>*/}
        <p>{paymentAccount}</p> {/*Renders as a string*/ }
      </div>

      {/* Landlord */}
      <div>
        <h3 className="font-semibold mt-4">Landlord</h3>
        <p>{landlord?.name}</p>
        <p>{landlord?.phone}</p>
        <p>{landlord?.email}</p>
      </div>

      {/* Caretaker */}
      <div>
        <h3 className="font-semibold mt-4">Caretaker</h3>
        <p>{caretaker?.name}</p>
        <p>{caretaker?.phone}</p>
        <p>{caretaker?.email}</p>
      </div>

        {/* Units (if any) */}
        {units?.length > 0 && (
          <div>
            <h3 className="font-semibold mt-4">Units</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {units.map(unit => (
                <div key={unit._id || unit.unitNumber} className="border p-4 rounded shadow-sm">
                  <p><strong>Unit Number:</strong> {unit.unitNumber}</p>
                  <p><strong>Type:</strong> {unit.type}</p>
                  <p><strong>Rent:</strong> KES. {unit.rent}</p>
                  <p><strong>Deposit:</strong> KES. {unit.deposit}</p>
                  <p><strong>Status:</strong> {unit.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  );
}

