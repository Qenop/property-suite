import { useState } from 'react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function ReportsTab() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);
  const [chartData] = useState([
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Feb', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 2000, expenses: 9800 },
    { month: 'Apr', revenue: 2780, expenses: 3908 },
    { month: 'May', revenue: 1890, expenses: 4800 },
    { month: 'Jun', revenue: 2390, expenses: 3800 },
  ]);

  const [reportData] = useState({
    totalRevenue: 15000,
    totalExpenses: 10000,
    netProfit: 5000,
  });

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold">Filter Reports</h2>
        <DateRangePicker
          ranges={dateRange}
          onChange={item => setDateRange([item.selection])}
          months={1}
          direction="horizontal"
        />
      </div>

      {/* Property-wide Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">Property-wide Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <div className="bg-gray-50 p-4 rounded shadow">
            <h4>Total Revenue</h4>
            <p className="text-lg">KES {reportData.totalRevenue}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow">
            <h4>Total Expenses</h4>
            <p className="text-lg">KES {reportData.totalExpenses}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow">
            <h4>Net Profit</h4>
            <p className="text-lg">KES {reportData.netProfit}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Charts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="h-64">
            <h4 className="text-lg font-semibold mb-2">Revenue vs Expenses (Line Chart)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="h-64">
            <h4 className="text-lg font-semibold mb-2">Revenue Breakdown (Pie Chart)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="revenue"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Pie
                  data={chartData}
                  dataKey="expenses"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={120}
                  fill="#82ca9d"
                  label
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="h-64">
            <h4 className="text-lg font-semibold mb-2">Monthly Revenue (Bar Chart)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="expenses" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
