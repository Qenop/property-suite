import React from "react";
import WaterMeterReadingForm from '../components/billing/WaterMeterReadingForm';

const BillingPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>
      <WaterMeterReadingForm />
    </div>
  );
};

export default BillingPage;
