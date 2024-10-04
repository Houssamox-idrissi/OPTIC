import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Select from 'react-select';
import axios from 'axios';

const frenchMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const StatisticsPage = () => {
    const [earningsData, setEarningsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [maxEarnings, setMaxEarnings] = useState(0);

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        console.log('Fetching data...');
        console.log('Token:', token);
    
        axios.get('http://127.0.0.1:8000/api/earnings', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                const data = res.data; // Use response.data directly
                console.log('API Response:', data); // Log the API response
    
                if (!data || data.length === 0) {
                    console.warn('No data returned from the API.');
                    return;
                }
    
                const formattedData = data.map(item => ({
                    month: frenchMonths[item.month - 1], // Ensure months are displayed in French
                    year: item.year,
                    earnings: item.earnings
                }));
    
                const uniqueYears = [...new Set(formattedData.map(item => item.year))].sort((a, b) => b - a);
                const yearOptions = uniqueYears.map(year => ({ value: year, label: year }));
    
                setEarningsData(formattedData);
                setYears(yearOptions);
                setSelectedYear(yearOptions[0]?.value || '');
                console.log('Selected Year after fetch:', yearOptions[0]?.value);
            })
            .catch(error => {
                console.error('Error fetching earnings:', error);
            });
    }, [token]);

    useEffect(() => {
        if (selectedYear) {
            const dataForSelectedYear = earningsData.filter(item => item.year === selectedYear);
            const maxEarningsValue = Math.max(...dataForSelectedYear.map(item => item.earnings)); // Calculate max earnings
            setMaxEarnings(maxEarningsValue);
            setFilteredData(dataForSelectedYear.reverse());
            console.log('Data for selected year:', dataForSelectedYear);
        }
    }, [selectedYear, earningsData]);

    return (
        <div className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 py-10 px-4 sm:px-6 lg:px-8">
            <div className='ml-72'>
                <h1 style={{ fontFamily: 'monospace' }} className="mt-4 text-5xl font-extrabold text-center mb-8 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-900 to-teal-500">
                    Statistiques des Revenus
                </h1>

                <div className="mb-8 flex justify-center">
                    <Select
                        options={years}
                        value={years.find(option => option.value === selectedYear)}
                        onChange={(option) => setSelectedYear(option.value)}
                        className="w-40"
                        placeholder="Sélectionnez une année"
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: '#4A90E2',
                                boxShadow: 'none',
                                '&:hover': { borderColor: '#007AFF' },
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
                        <h2 className="text-3xl font-semibold mb-4 text-gray-700" style={{ fontFamily: 'monospace' }}>Revenus Mensuels - {selectedYear}</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#555' }} />
                                <YAxis tick={{ fontSize: 14, fill: '#555' }} domain={[0, maxEarnings ? maxEarnings * 1.1 : 100]} />
                                <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd' }} />
                                <Legend />
                                <Bar dataKey="earnings" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200" style={{ fontFamily: 'monospace' }}>
                        <h2 className="text-3xl font-semibold mb-4 text-gray-700">Tendance des Revenus - {selectedYear}</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#555' }} />
                                <YAxis tick={{ fontSize: 14, fill: '#555' }} domain={[0, maxEarnings ? maxEarnings * 1.1 : 100]} />
                                <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd' }} />
                                <Legend />
                                <Line type="monotone" dataKey="earnings" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
