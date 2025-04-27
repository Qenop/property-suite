import { useState } from 'react';

export default function InvoicesTab() {
  const [filters, setFilters] = useState({ tenant: '', unit: '', from: '', to: '' });
  const [invoices, setInvoices] = useState([
    {
      id: '1',
      date: '2025-04-01',
      tenant: 'Alice W.',
      unit: 'Unit A1',
      amount: 12000,
      status: 'Paid',
    },
    {
      id: '2',
      date: '2025-04-01',
      tenant: 'John K.',
      unit: 'Unit B2',
      amount: 14500,
      status: 'Unpaid',
    },
  ]);

  const [formData, setFormData] = useState({
    tenant: '',
    unit: '',
    amount: '',
    description: '',
    dueDate: '',
    status: 'Unpaid',
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const newInvoice = {
      ...formData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setInvoices([newInvoice, ...invoices]);
    setFormData({
      tenant: '',
      unit: '',
      amount: '',
      description: '',
      dueDate: '',
      status: 'Unpaid',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-lg mb-2">Filter Invoices</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="tenant"
            value={filters.tenant}
            onChange={handleFilterChange}
            placeholder="Tenant"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="unit"
            value={filters.unit}
            onChange={handleFilterChange}
            placeholder="Unit"
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            name="from"
            value={filters.from}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            name="to"
            value={filters.to}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-lg mb-2">Invoices</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Date</th>
              <th>Tenant</th>
              <th>Unit</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{invoice.date}</td>
                <td>{invoice.tenant}</td>
                <td>{invoice.unit}</td>
                <td>KES {invoice.amount}</td>
                <td>{invoice.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Invoice Form */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-lg mb-2">Create Invoice</h3>
        <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="tenant"
            value={formData.tenant}
            onChange={handleFormChange}
            placeholder="Tenant Name"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleFormChange}
            placeholder="Unit"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleFormChange}
            placeholder="Amount (KES)"
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleFormChange}
            className="border p-2 rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="Description"
            className="border p-2 rounded col-span-2"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleFormChange}
            className="border p-2 rounded"
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
          >
            Save Invoice
          </button>
        </form>
      </div>
    </div>
  );
}
