import '../../../assets/dashboard.css';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Select from 'react-select';
import { ChartBarIcon, ClipboardCheckIcon } from '@heroicons/react/outline'; // Importing icons
import { format } from 'date-fns';

const Dashboard = () => {
  const [earningsData, setEarningsData] = useState([]);
  const [totalCommands, setTotalCommands] = useState([]); // State to hold total commands data
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/earnings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        // Transform earnings data
        const formattedData = data.map(item => ({
          month: item.month_name,
          year: item.year,
          earnings: item.earnings,
          totalCommands: item.total_commands,  // Assuming your API sends total commands for each month
        }));

        const uniqueYears = [...new Set(formattedData.map(item => item.year))].sort((a, b) => b - a);
        const yearOptions = uniqueYears.map(year => ({ value: year, label: year }));

        setEarningsData(formattedData);
        setYears(yearOptions);
        setSelectedYear(yearOptions[0]?.value || '');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      const dataForSelectedYear = earningsData.filter(item => item.year === selectedYear);
      setFilteredData(dataForSelectedYear);
      const totalCommandsForYear = dataForSelectedYear.map(item => ({
        month: item.month,
        total: item.totalCommands,
      }));
      setTotalCommands(totalCommandsForYear);
    }
  }, [selectedYear, earningsData]);

  return (
    <>
      <div className="background-image" />

      <div className="dashboard-container">
        <div className='ml-72'>
          <h1
            style={{ fontFamily: 'monospace' }}
            className="mt-4 text-5xl font-extrabold text-center mb-8 text-gradient bg-clip-text text-transparent bg-white">
            Statistiques des Revenus
          </h1>

          <div className="mb-8 flex justify-center">
            <Select
              options={years}
              value={years.find(option => option.value === selectedYear)}
              onChange={(option) => setSelectedYear(option.value)}
              className="w-40"
              placeholder="Select Year"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#4A90E2',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#007AFF',
                  },
                }),
                singleValue: (base) => ({
                  ...base,
                  color: '#333',
                }),
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


            <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
              <h2 className="text-3xl font-semibold mb-4 text-slate-800">Revenus Mensuels - {selectedYear}</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#555' }} />
                  <YAxis tick={{ fontSize: 14, fill: '#555' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd' }} />
                  <Legend />
                  <Bar dataKey="earnings" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
              <h2 className="text-3xl font-semibold mb-4 text-slate-800">Tendance des Revenus - {selectedYear}</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#555' }} />
                  <YAxis tick={{ fontSize: 14, fill: '#555' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd' }} />
                  <Legend />
                  <Line type="monotone" dataKey="earnings" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl">
        <div className="flex items-center mb-4">
          <ClipboardCheckIcon className="h-12 w-12 text-blue-600 mr-4" />
          <h2 className="text-2xl font-bold text-slate-800">Commandes Mensuelles - {selectedYear}</h2>
        </div>
        {totalCommands.length > 0 ? (
          <div className="space-y-4">
            {totalCommands.map((item) => (
              <div key={item.month} className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full mr-4">
                    <span className="font-bold text-lg">{item.month.charAt(0)}</span>
                  </div>
                  <span className="text-lg font-semibold text-slate-700">{item.month}</span>
                </div>
                <span className="text-2xl text-blue-600 font-bold">{item.total}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Pas de données disponibles pour cette année.</p>
        )}
      </div>
    </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
