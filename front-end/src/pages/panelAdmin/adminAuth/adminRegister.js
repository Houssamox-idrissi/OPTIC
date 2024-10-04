import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/admin/register', formData);
      localStorage.setItem('adminToken', response.data.token);
      navigate('/login');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800 py-2 px-4 sm:px-6 lg:px-8">

      <div className="max-w-md mx-auto mt-4 p-8 bg-white rounded-lg shadow-2xl transform transition-transform duration-500 hover:shadow-xl hover:-translate-x-3">
      <h2
      style={{fontFamily:'monospace'}}
      className="text-center text-3xl font-extrabold mb-6 text-cyan-800 hover:text-cyan-600 transition duration-300 ease-in-out">Admin Inscription</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <label
            style={{ fontFamily: 'monospace' }}
            className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="name">Nom</label>
          <input
          placeholder='Insérez votre nom'
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out transform group-hover:scale-105"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative group">
          <label
            style={{ fontFamily: 'monospace' }}
            className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="prenom">Prenom</label>
          <input
          placeholder='Insérez votre prenoml'
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out transform group-hover:scale-105"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative group">
          <label
            style={{ fontFamily: 'monospace' }}
            className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="name">Email</label>
          <input
          placeholder="Insérez votre email"
            type="email"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out transform group-hover:scale-105"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="relative group">
          <label
            style={{ fontFamily: 'monospace' }}
            className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="name">Mot de passe</label>
          <input
            type="password"
             placeholder='********'
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out transform group-hover:scale-105"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="relative group">
          <label
            style={{ fontFamily: 'monospace' }}
            className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="name">Confirmer le mot de passe</label>
          <input
            type="password"
            placeholder='********'
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out transform group-hover:scale-105"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>
        <p className="px-2 mt-2 text-gray-600 text-sm" style={{fontFamily:'sans-serif'}}>
        Vous avez un compte?{' '}
          <Link to="/login" className="text-sky-600">
            Login
          </Link>
        </p>
        <button
          type="submit"
          style={{fontFamily:'monospace'}}
          className={`w-full  text-base px-6 py-3 rounded-full text-white font-bold bg-cyan-600 hover:bg-cyan-700 transition duration-300 ease-in-out transform hover:scale-105 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
    </div>
    
  );
};

export default AdminRegister;
