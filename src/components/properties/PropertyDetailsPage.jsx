import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Tab imports (adjust paths if needed)
import OverviewTab from './tabs/OverviewTab';
import EditPropertyTab from './tabs/EditPropertyTab';
import PaymentsTab from './tabs/PaymentsTab';
import WaterReadingsTab from './tabs/WaterReadingsTab';
import InvoicesTab from './tabs/InvoicesTab';
import ReportsTab from './tabs/ReportsTab';
import BillingTab from './tabs/BillingTab';
import TenantsTab from './tabs/TenantsTab';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Update to use live URL for API
    axios.get(`https://pro-suite-server.onrender.com/api/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(err => console.error('Error fetching property:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading property...</div>;
  if (!property) return <div className="p-6">Property not found.</div>;

  // Define all tabs
  const tabs = [
    { key: 'overview', label: 'Overview', content: <OverviewTab property={property} /> },
    { key: 'edit',     label: 'Edit Property',   content: <EditPropertyTab propertyId={id} /> },
    { key: 'payments', label: 'Payments',        content: <PaymentsTab propertyId={id} /> },
    { key: 'water',    label: 'Water Readings',  content: <WaterReadingsTab propertyId={id} /> },
    { key: 'invoices', label: 'Invoices',        content: <InvoicesTab propertyId={id} /> },
    { key: 'reports',  label: 'Reports',         content: <ReportsTab propertyId={id} /> },
    { key: 'billing', label: 'Billing',          content: <BillingTab propertyId={id} /> },
    { key: 'tenants', label: 'Tenants',          content: <TenantsTab property={property} /> },
  ];

  // Find content for the active tab
  const ActiveTabContent = tabs.find(t => t.key === activeTab)?.content;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      {/* Tab Navigation */}
      <div className="border-b mb-4">
        <nav className="flex space-x-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-2 px-4 text-sm font-medium ${
                activeTab === tab.key
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Tab Content */}
      <div>
        {ActiveTabContent}
      </div>
    </div>
  );
}
