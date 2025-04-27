import React, { useState, useEffect } from "react";

const WaterMeterReadingForm = ({ propertyId }) => {  // propertyId passed as prop
  const [units, setUnits] = useState([]);  // List of units based on the selected property
  const [formData, setFormData] = useState({
    unitId: "",
    reading: "",
    timestamp: new Date().toISOString().slice(0, 16), // default to now
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch units based on the propertyId
    const fetchUnits = async () => {
      if (!propertyId) return;

      try {
        const res = await fetch(`/api/units?propertyId=${propertyId}&waterType=metered`);
        const data = await res.json();
        setUnits(data);
      } catch (err) {
        console.error("Error fetching units:", err);
        setError("Failed to load units. Please try again later.");
      }
    };

    fetchUnits();
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    setError(""); // Reset error state
    try {
      const res = await fetch("/api/meter-readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Reading submitted successfully!");
        setFormData((prev) => ({ ...prev, reading: "" }));
      } else {
        setError("Failed to submit reading. Please try again.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("An error occurred while submitting the reading.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md">
      <h2 className="text-xl font-semibold mb-4">Enter Water Meter Reading</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error message */}

      {/* Unit Selection */}
      <label className="block mb-2">
        Unit
        <select
          name="unitId"
          value={formData.unitId}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="">Select a unit</option>
          {units.map((unit) => (
            <option key={unit._id} value={unit._id}>
              {unit.name} (Property: {unit.propertyName})
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-2">
        Reading (m³)
        <input
          type="number"
          name="reading"
          value={formData.reading}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded"
          min="0"
        />
      </label>

      <label className="block mb-4">
        Timestamp
        <input
          type="datetime-local"
          name="timestamp"
          value={formData.timestamp}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <button
        type="submit"
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading || !formData.unitId}
      >
        {loading ? "Submitting..." : "Submit Reading"}
      </button>
    </form>
  );
};

export default WaterMeterReadingForm;
