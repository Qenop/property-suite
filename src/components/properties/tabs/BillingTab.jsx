// src/components/properties/tabs/BillingTab.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

export default function BillingTab({ propertyId }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(() => format(new Date(), 'yyyy-MM'));

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/bills', {
        params: { propertyId, month },
      });
      console.log('Fetched bills:', res.data);
      setBills(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setBills([]);
    } finally {
      setLoading(false);
    }
  }, [propertyId, month]);

  const generateBills = async () => {
    try {
      setLoading(true);
      await axios.post('/api/bills/generate', {
        propertyId,
        period: month,
      });
      await fetchBills(); // Refresh list after generation
    } catch (err) {
      console.error('Error generating bills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchBills();
    }
  }, [propertyId, month, fetchBills]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="text-xl font-semibold">Monthly Bills</h2>
        <div className="flex gap-2 items-center">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded p-1"
          />
          <button
            onClick={generateBills}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Bills'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-md">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="p-2">Unit</th>
              <th className="p-2">Tenant</th>
              <th className="p-2">Rent</th>
              <th className="p-2">Water</th>
              <th className="p-2">Garbage</th>
              <th className="p-2">Electricity</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No bills found for this month.
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill._id} className="border-t text-sm">
                  <td className="p-2">{bill.unitLabel || '—'}</td>
                  <td className="p-2">{bill.tenantName || '—'}</td>
                  <td className="p-2">Ksh {bill.rentAmount?.toLocaleString() || 0}</td>
                  <td className="p-2">Ksh {bill.waterCharge?.toLocaleString() || 0}</td>
                  <td className="p-2">Ksh {bill.garbageCharge?.toLocaleString() || 0}</td>
                  <td className="p-2">Ksh {bill.electricityCharge?.toLocaleString() || 0}</td>
                  <td className="p-2 font-semibold">
                    Ksh {bill.totalAmount?.toLocaleString() || 0}
                  </td>
                  <td className="p-2 capitalize">{bill.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
