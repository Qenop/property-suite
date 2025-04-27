import { useState, useMemo } from 'react';

export default function WaterReadingsTab() {
  const [readings, setReadings] = useState([
    { id: 1, unit: 'A1', reading: 1230, date: '2025-04-01' },
    { id: 2, unit: 'B3', reading: 1150, date: '2025-04-01' },
    { id: 3, unit: 'A1', reading: 1200, date: '2025-03-01' },
  ]);

  const [filters, setFilters] = useState({
    unit: '',
    from: '',
    to: '',
  });

  const [newReading, setNewReading] = useState({
    unit: '',
    reading: '',
    date: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredReadings = useMemo(() => {
    return readings.filter((r) => {
      const matchUnit = filters.unit ? r.unit === filters.unit : true;
      const matchFrom = filters.from ? new Date(r.date) >= new Date(filters.from) : true;
      const matchTo = filters.to ? new Date(r.date) <= new Date(filters.to) : true;
      return matchUnit && matchFrom && matchTo;
    });
  }, [readings, filters]);

  const handleNewReadingChange = (e) => {
    const { name, value } = e.target;
    setNewReading((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReadings((prev) => [
      ...prev,
      {
        ...newReading,
        id: Date.now(),
        reading: parseFloat(newReading.reading),
      },
    ]);
    setNewReading({ unit: '', reading: '', date: '' });
  };

  const uniqueUnits = [...new Set(readings.map((r) => r.unit))];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Water Meter Readings</h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 border rounded">
        <select
          name="unit"
          value={filters.unit}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Units</option>
          {uniqueUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleFilterChange}
          className="border p-2 rounded"
          placeholder="From"
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleFilterChange}
          className="border p-2 rounded"
          placeholder="To"
        />
      </div>

      {/* Form to add new reading */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded shadow">
        <input
          type="text"
          name="unit"
          placeholder="Unit"
          value={newReading.unit}
          onChange={handleNewReadingChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="reading"
          placeholder="Current Reading"
          value={newReading.reading}
          onChange={handleNewReadingChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={newReading.date}
          onChange={handleNewReadingChange}
          className="border p-2 rounded"
          required
        />
        <div className="md:col-span-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Reading
          </button>
        </div>
      </form>

      {/* Filtered readings list */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Unit</th>
              <th className="border px-4 py-2 text-left">Reading</th>
              <th className="border px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReadings.length > 0 ? (
              filteredReadings
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((r) => (
                  <tr key={r.id}>
                    <td className="border px-4 py-2">{r.unit}</td>
                    <td className="border px-4 py-2">{r.reading}</td>
                    <td className="border px-4 py-2">{r.date}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">No readings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
