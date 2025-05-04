import { useState } from 'react';
import axios from 'axios';

const unitTypes = ['studio', '1br', '2br', '3br', '4br', '5br'];
const UNIT_STATUSES = ['vacant', 'occupied',];

export default function AddProperty() {
  const [property, setProperty] = useState(getInitialProperty());
  const [formErrors, setFormErrors] = useState([]);

  function getInitialProperty() {
    return {
      name: '',
      address: '',
      type: '',
      utilities: {
        water: { billing: 'fixed', amount: '', costPerUnit: '' },
        electricity: { billing: 'fixed', amount: '', costPerUnit: '' },
        garbage: { amount: '' },
      },
      serviceRate: { type: 'percentage', value: '' },
      paymentAccount: '',
      landlord: { name: '', phone: '' },
      caretaker: { name: '', phone: '' },
      units: [
        {
          type: '',
          rent: '',
          deposit: '',
          count: 1,
          unitNumbers: [{ number: '', status: 'vacant' }],
        },
      ],
    };
  }

  const handleChange = (path, value) => {
    const keys = path.split('.');
    setProperty((prev) => {
      const copy = structuredClone(prev);
      let ref = copy;
      keys.slice(0, -1).forEach((k) => (ref = ref[k]));
      ref[keys.at(-1)] = value;
      return copy;
    });
  };

  const addUnit = () => {
    setProperty((prev) => ({
      ...prev,
      units: [
        ...prev.units,
        {
          type: '',
          rent: '',
          deposit: '',
          count: 1,
          unitNumbers: [{ number: '', status: 'vacant' }],
        },
      ],
    }));
  };

  const updateUnitCount = (index, count) => {
    const unitCount = parseInt(count) || 0;
    setProperty((prev) => {
      const updatedUnits = [...prev.units];
      const currentUnit = updatedUnits[index];
      currentUnit.count = unitCount;
      currentUnit.unitNumbers = Array.from({ length: unitCount }, (_, i) => ({
        number: currentUnit.unitNumbers[i]?.number || '',
        status: currentUnit.unitNumbers[i]?.status || 'vacant',
      }));
      return { ...prev, units: updatedUnits };
    });
  };

  const updateUnitNumber = (unitIndex, numberIndex, value) => {
    setProperty((prev) => {
      const updatedUnits = [...prev.units];
      updatedUnits[unitIndex].unitNumbers[numberIndex].number = value;
      return { ...prev, units: updatedUnits };
    });
  };

  const updateUnitStatus = (unitIndex, numberIndex, value) => {
    setProperty((prev) => {
      const updatedUnits = [...prev.units];
      updatedUnits[unitIndex].unitNumbers[numberIndex].status = value;
      return { ...prev, units: updatedUnits };
    });
  };
  
  //validation
  const validateProperty = () => {
    const errors = [];
    const { water, electricity, garbage } = property.utilities;
  
    if (!property.name.trim()) errors.push("Property name is required.");
    if (!property.address.trim()) errors.push("Address is required.");
    if (!property.type) errors.push("Property type is required.");
  
    if (water.billing === 'fixed' && !water.amount) {
      errors.push("Water amount is required for fixed billing.");
    }
    if (water.billing === 'metered' && !water.costPerUnit) {
      errors.push("Water cost per unit is required for metered billing.");
    }
  
    if (electricity.billing === 'fixed' && !electricity.amount) {
      errors.push("Electricity amount is required for fixed billing.");
    }
    if (electricity.billing === 'metered' && !electricity.costPerUnit) {
      errors.push("Electricity cost per unit is required for metered billing.");
    }
  
    if (!garbage.amount) errors.push("Garbage amount is required.");
  
    if (!property.serviceRate.value) {
      errors.push("Service rate value is required.");
    }
  
    if (!property.paymentAccount.trim()) {
      errors.push("Payment account details are required.");
    }
  
    if (!property.landlord.name.trim()) {
      errors.push("Landlord name is required.");
    }
    if (!property.landlord.phone.trim()) {
      errors.push("Landlord phone is required.");
    }
  
    if (!property.caretaker.name.trim()) {
      errors.push("Caretaker name is required.");
    }
    if (!property.caretaker.phone.trim()) {
      errors.push("Caretaker phone is required.");
    }
  
    // ✅ Validate units and unitNumbers (including status)
    property.units.forEach((unit, unitIndex) => {
      if (!unit.type) errors.push(`Unit type is required for unit #${unitIndex + 1}.`);
      if (!unit.rent) errors.push(`Rent is required for unit #${unitIndex + 1}.`);
      if (!unit.deposit) errors.push(`Deposit is required for unit #${unitIndex + 1}.`);
      if (!unit.count || unit.count < 1) {
        errors.push(`Number of units must be at least 1 for unit #${unitIndex + 1}.`);
      }
  
      unit.unitNumbers.forEach((item, numIndex) => {
        if (!item.number.trim()) {
          errors.push(`Unit number ${numIndex + 1} is required for unit type #${unitIndex + 1}.`);
        }
        if (!item.status || !['vacant', 'occupied'].includes(item.status)) {
          errors.push(`Valid status (vacant/occupied) is required for unit number ${numIndex + 1} under unit type #${unitIndex + 1}.`);
        }
      });
    });
  
    return errors;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateProperty(property);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const flattenedUnits = property.units.flatMap(unit =>
      unit.unitNumbers.map(({ number, status }) => ({
        type: unit.type,
        rent: unit.rent,
        deposit: unit.deposit,
        unitNumber: number,
        status, // This includes the status in the payload
      }))
    );

    const payload = {
      ...property,
      units: flattenedUnits,
    };

    try {
      const response = await axios.post('https://pro-suite-server.onrender.com/api/properties', payload);
      console.log('✅ Property saved:', response.data);
      alert('✅ Property submitted successfully!');
      setProperty(getInitialProperty());
      setFormErrors([]);
    } catch (error) {
      console.error('❌ Failed to save property:', error);
      alert('❌ Submission failed. See console for details.');
    }
  };

  return (
    <div className="max-w-xs mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold">Add New Property</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formErrors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-4 rounded space-y-1">
            {formErrors.map((err, i) => <p key={i}>• {err}</p>)}
          </div>
        )}

        {/* Rest of property input fields... */}

        {/* Property Info */}
        <div className="space-y-4">
          <input type="text" placeholder="Property Name" className="w-full border p-2 rounded"
            value={property.name} onChange={(e) => handleChange('name', e.target.value)} />

          <input type="text" placeholder="Address" className="w-full border p-2 rounded"
            value={property.address} onChange={(e) => handleChange('address', e.target.value)} />

          <select value={property.type} onChange={(e) => handleChange('type', e.target.value)}
            className="w-full border p-2 rounded">
            <option value="">-- Select Property Type --</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed">Mixed Use</option>
          </select>
        </div>

        {/* Utility Billing */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Utility Billing</h3>

          {/* Water */}
          <div className="space-y-2">
            <label className="block font-medium">Water Billing</label>
            <select value={property.utilities.water.billing}
              onChange={(e) => handleChange('utilities.water.billing', e.target.value)}
              className="w-full border p-2 rounded">
              <option value="fixed">Fixed</option>
              <option value="metered">Metered</option>
            </select>
            {property.utilities.water.billing === 'fixed' && (
              <input type="number" min="0" placeholder="Amount (Kes.)"
                className="w-full border p-2 rounded"
                value={property.utilities.water.amount}
                onChange={(e) => handleChange('utilities.water.amount', e.target.value)} />
            )}
            {property.utilities.water.billing === 'metered' && (
              <input type="number" min="0" placeholder="Cost per kL (Kes./kL)"
                className="w-full border p-2 rounded"
                value={property.utilities.water.costPerUnit}
                onChange={(e) => handleChange('utilities.water.costPerUnit', e.target.value)} />
            )}
          </div>

          {/* Electricity */}
          <div className="space-y-2">
            <label className="block font-medium">Electricity Billing</label>
            <select value={property.utilities.electricity.billing}
              onChange={(e) => handleChange('utilities.electricity.billing', e.target.value)}
              className="w-full border p-2 rounded">
              <option value="fixed">Fixed</option>
              <option value="metered">Metered</option>
            </select>
            {property.utilities.electricity.billing === 'fixed' && (
              <input type="number" min="0" placeholder="Amount (Kes.)"
                className="w-full border p-2 rounded"
                value={property.utilities.electricity.amount}
                onChange={(e) => handleChange('utilities.electricity.amount', e.target.value)} />
            )}
            {property.utilities.electricity.billing === 'metered' && (
              <input type="number" min="0" placeholder="Cost per kWh (Kes./kWh)"
                className="w-full border p-2 rounded"
                value={property.utilities.electricity.costPerUnit}
                onChange={(e) => handleChange('utilities.electricity.costPerUnit', e.target.value)} />
            )}
          </div>

          {/* Garbage */}
          <div className="space-y-2">
            <label className="block font-medium">Garbage Billing</label>
            <input type="number" min="0" placeholder="Amount (Kes.)"
              className="w-full border p-2 rounded"
              value={property.utilities.garbage.amount}
              onChange={(e) => handleChange('utilities.garbage.amount', e.target.value)} />
          </div>
        </div>

        {/* Service Rate */}
        <div className="space-y-2">
          <label className="block font-medium">Service Rate Type</label>
          <select value={property.serviceRate.type}
            onChange={(e) => handleChange('serviceRate.type', e.target.value)}
            className="w-full border p-2 rounded">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
          <input type="number" min="0" placeholder={property.serviceRate.type === 'percentage' ? 'Value (%)' : 'Amount (Kes.)'}
            className="w-full border p-2 rounded"
            value={property.serviceRate.value}
            onChange={(e) => handleChange('serviceRate.value', e.target.value)} />
        </div>

        {/* Payment & Contacts */}
        <div className="space-y-4">
          <input type="text" placeholder="Payment Account Details"
            className="w-full border p-2 rounded"
            value={property.paymentAccount}
            onChange={(e) => handleChange('paymentAccount', e.target.value)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Landlord</h4>
              <input type="text" placeholder="Name"
                className="w-full border p-2 rounded"
                value={property.landlord.name}
                onChange={(e) => handleChange('landlord.name', e.target.value)} />
              <input type="tel" placeholder="Phone"
                className="w-full border p-2 rounded"
                value={property.landlord.phone}
                onChange={(e) => handleChange('landlord.phone', e.target.value)} />
            </div>
            <div>
              <h4 className="font-semibold">Caretaker</h4>
              <input type="text" placeholder="Name"
                className="w-full border p-2 rounded"
                value={property.caretaker.name}
                onChange={(e) => handleChange('caretaker.name', e.target.value)} />
              <input type="tel" placeholder="Phone"
                className="w-full border p-2 rounded"
                value={property.caretaker.phone}
                onChange={(e) => handleChange('caretaker.phone', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Units */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Units</h3>
          {property.units.map((unit, index) => (
            <div key={index} className="border border-gray-300 p-4 rounded space-y-2 bg-gray-50">
              <h4 className="font-medium">Unit Type {index + 1}</h4>

              <select value={unit.type}
                onChange={(e) => handleChange(`units.${index}.type`, e.target.value)}
                className="w-full border p-2 rounded">
                <option value="">-- Select Unit Type --</option>
                {unitTypes.map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>

              <input type="number" min="0" placeholder="Rent Amount (Kes.)"
                className="w-full border p-2 rounded"
                value={unit.rent}
                onChange={(e) => handleChange(`units.${index}.rent`, e.target.value)} />

              <input type="number" min="0" placeholder="Deposit Amount (Kes.)"
                className="w-full border p-2 rounded"
                value={unit.deposit}
                onChange={(e) => handleChange(`units.${index}.deposit`, e.target.value)} />

              <label className="block font-medium">Number of Units</label>
              <input type="number" min="1" placeholder="How many units of this type?"
                className="w-full border p-2 rounded"
                value={unit.count}
                onChange={(e) => updateUnitCount(index, e.target.value)} />


              {unit.unitNumbers.map((unitNumber, numIndex) => (
                <div key={numIndex} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder={`Unit Number ${numIndex + 1}`}
                    className="flex-1 border p-2 rounded"
                    value={unitNumber.number}
                    onChange={(e) => updateUnitNumber(index, numIndex, e.target.value)}
                  />
                  <select
                    className="w-40 border p-2 rounded"
                    value={unitNumber.status}
                    onChange={(e) => updateUnitStatus(index, numIndex, e.target.value)}
                  >
                    <option value="">Status</option>
                    <option value="vacant">Vacant</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>
              ))}

            </div>
          ))}
          <button type="button" onClick={addUnit} className="text-blue-600 hover:underline">
            + Add Unit
          </button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Submit Property
        </button>
      </form>
    </div>
  );
}
