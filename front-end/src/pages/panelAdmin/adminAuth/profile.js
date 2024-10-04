import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, PencilIcon, LogoutIcon } from '@heroicons/react/outline';
import prfl from '../../../component/img/prfl.jpeg'

const AdminProfile = () => {
    const [adminInfo, setAdminInfo] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/admin', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => setAdminInfo(res.data.admin))
            .catch(error => console.error('Error fetching admin info', error));
    }, []);

    if (!adminInfo) return <div>Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800">
            {/* Header */}
            <header className="bg-cyan-600 dark:bg-cyan-800 p-4 text-white shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Admin Profile</h1>
                    <button
                        onClick={() => {
                            localStorage.removeItem('adminToken');
                            navigate('/login');
                        }}
                        className="flex items-center p-2 rounded-full bg-red-600 hover:bg-red-700 transition"
                    >
                        <LogoutIcon className="h-6 w-6" />
                        <span className="ml-2">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-6">
                <div className="container mx-auto bg-gradient-to-r from-gray-900 via-black to-gray-800 rounded-lg shadow-md">
                    <div className="flex flex-col items-center p-6">
                        <div className="relative mb-4">
                            <img
                                src={prfl}
                                alt="Professional Glasses"
                                className="w-32 h-32 rounded-full border-4 border-cyan-600"
                            />
                        </div>

                        <h2 style={{ fontFamily: 'sans-serif' }} className="text-xl uppercase font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            {adminInfo.name}
                        </h2>

                        <div className="w-full max-w-md mx-auto">
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                                <ul style={{fontFamily:'monospace'}} className="space-y-2 text-gray-700 text-base dark:text-gray-300">
                                    <li className="flex justify-between"><strong className="text-gray-900 dark:text-gray-100">Nom:</strong> <span>{adminInfo.name}</span></li>
                                    <li className="flex justify-between"><strong className="text-gray-900 dark:text-gray-100">Prenom:</strong> <span>{adminInfo.prenom}</span></li>
                                    <li className="flex justify-between"><strong className="text-gray-900 dark:text-gray-100">Email:</strong> <span>{adminInfo.email}</span></li>
                                    <li className="flex justify-between"><strong className="text-gray-900 dark:text-gray-100">Rejoint:</strong> <span>{new Date(adminInfo.created_at).toLocaleDateString()}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminProfile;
