import { useEffect, useState } from "react";

export default function TenantsTab({ property }) {
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState({
    name: "",
    phone: "",
    unit: "",
  });

  useEffect(() => {
    // Only generate if tenants are empty and property.units exist
    if (property?.units?.length) {
      const dummyTenants = property.units.map((unit, i) => ({
        id: `t-${i + 1}`,
        name: `Tenant ${i + 1}`,
        phone: `07${i}${i}${i}${i}${i}${i}${i}${i}`,
        unitName: unit.name || `Unit ${i + 1}`,
        leaseStart: "2024-01-01",
        rent: unit.customRent || 15000,
      }));
      setTenants(dummyTenants);
    }
  }, [property]);

  const filteredTenants = tenants.filter((tenant) => {
    const { name, phone, unit } = search;
    const isNameMatch = tenant.name.toLowerCase().includes(name.toLowerCase());
    const isPhoneMatch = tenant.phone.includes(phone);
    const isUnitMatch = tenant.unitName.toLowerCase().includes(unit.toLowerCase());

    return isNameMatch && isPhoneMatch && isUnitMatch;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tenants</h2>

      {/* Search Filters */}
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Tenant Name</label>
          <input
            type="text"
            placeholder="Search by name..."
            className="border p-2 rounded w-full md:w-1/2"
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            placeholder="Search by phone..."
            className="border p-2 rounded w-full md:w-1/2"
            value={search.phone}
            onChange={(e) => setSearch({ ...search, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Unit</label>
          <input
            type="text"
            placeholder="Search by unit..."
            className="border p-2 rounded w-full md:w-1/2"
            value={search.unit}
            onChange={(e) => setSearch({ ...search, unit: e.target.value })}
          />
        </div>
      </div>

      {/* Tenant List Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Phone</th>
              <th className="text-left p-2">Unit</th>
              <th className="text-left p-2">Lease Start</th>
              <th className="text-left p-2">Rent</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant) => (
              <tr key={tenant.id} className="border-t">
                <td className="p-2">{tenant.name}</td>
                <td className="p-2">{tenant.phone}</td>
                <td className="p-2">{tenant.unitName}</td>
                <td className="p-2">{tenant.leaseStart}</td>
                <td className="p-2">Ksh {tenant.rent.toLocaleString()}</td>
              </tr>
            ))}
            {filteredTenants.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No tenants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
