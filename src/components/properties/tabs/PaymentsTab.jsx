import { useState } from 'react';

export default function PaymentsTab() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      tenantName: 'John Doe',
      unit: 'A1',
      amount: 15000,
      method: 'M-Pesa',
      date: '2025-04-01',
    },
    {
      id: 2,
      tenantName: 'Jane Smith',
      unit: 'B3',
      amount: 14000,
      method: 'Bank Transfer',
      date: '2025-04-05',
    },
    {
      id: 3,
      tenantName: 'John Doe',
      unit: 'A1',
      amount: 15000,
      method: 'Cash',
      date: '2025-03-01',
    },
  ]);

  const [newPayment, setNewPayment] = useState({
    tenantName: '',
    unit: '',
    amount: '',
    method: '',
    date: '',
  });

  const [filters, setFilters] = useState({
    tenant: '',
    unit: '',
    from: '',
    to: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPayments((prev) => [...prev, { ...newPayment, id: Date.now() }]);
    setNewPayment({ tenantName: '', unit: '', amount: '', method: '', date: '' });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPayments = payments.filter((payment) => {
    const matchTenant =
      !filters.tenant || payment.tenantName.toLowerCase().includes(filters.tenant.toLowerCase());
    const matchUnit =
      !filters.unit || payment.unit.toLowerCase().includes(filters.unit.toLowerCase());
    const matchFrom = !filters.from || new Date(payment.date) >= new Date(filters.from);
    const matchTo = !filters.to || new Date(payment.date) <= new Date(filters.to);
    return matchTenant && matchUnit && matchFrom && matchTo;
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Payments</h3>

      {/* Filter section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded shadow border">
        <input
          type="text"
          name="tenant"
          placeholder="Filter by tenant name"
          value={filters.tenant}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="unit"
          placeholder="Filter by unit"
          value={filters.unit}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded shadow">
        <input
          type="text"
          name="tenantName"
          placeholder="Tenant Name"
          value={newPayment.tenantName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="unit"
          placeholder="Unit"
          value={newPayment.unit}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (KES)"
          value={newPayment.amount}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="method"
          placeholder="Payment Method"
          value={newPayment.method}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={newPayment.date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Record Payment
          </button>
        </div>
      </form>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Tenant</th>
              <th className="border px-4 py-2 text-left">Unit</th>
              <th className="border px-4 py-2 text-left">Amount</th>
              <th className="border px-4 py-2 text-left">Method</th>
              <th className="border px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="border px-4 py-2">{payment.tenantName}</td>
                  <td className="border px-4 py-2">{payment.unit}</td>
                  <td className="border px-4 py-2">KES {payment.amount}</td>
                  <td className="border px-4 py-2">{payment.method}</td>
                  <td className="border px-4 py-2">{payment.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
