import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/solid';

function CreateClient() {
    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate("/admin/client")
    };
    const [client, setClient] = useState({
        nom: "",
        prenom: "",
        telephone: "",
        assurance: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const token = localStorage.getItem('adminToken');
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/clients", client, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                alert("Client created successfully");
                navigate("/admin/client");
            })
            .catch((error) => {
                console.log("Error creating client", error);
                if (error.response && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                }
            });
    };

    return (
        <>
            <div className="background-image" />
            <div className="dashboard-container">
                <div className="flex justify-start p-4">
                    <button
                        className="max-w-md mx-auto mt-10  text-white hover:text-cyan-100 focus:outline-none"
                        onClick={handleBackClick}
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        <span className="text-base font-medium text-white hover:text-cyan-100 focus:outline-none" style={{ fontFamily: 'monospace' }}>Retour</span>
                    </button>
                </div>
                <div className='max-w-md mx-auto mt-10 bg-slate-50 shadow-lg rounded-lg overflow-hidden'>
                    {/* Form Title */}
                    <div className="text-2xl py-4 px-6 mt-2 text-cyan-900 text-center font-bold uppercase" style={{ fontFamily: "monospace" }}>
                        Nouveau client
                    </div>

                    {/* Form */}
                    <form className="py-4 px-6" onSubmit={handleSubmit}>
                        {/* Nom Input */}
                        <div className="mb-4">
                            <label htmlFor="nom" className="block text-gray-700 font-bold mb-2 text-base" style={{ fontFamily: "monospace" }}>Nom</label>
                            <input
                                type="text"
                                name="nom"
                                value={client.nom}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.marque ? 'border-red-500' : ''}`}
                            />
                            {errors.client && <p className="text-red-500 text-xs italic">{errors.client[0]}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="prenom" className="block text-gray-700 font-bold mb-2 text-base" style={{ fontFamily: "monospace" }}>Prenom</label>
                            <input
                                type="text"
                                name="prenom"
                                value={client.prenom}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.marque ? 'border-red-500' : ''}`}
                            />
                            {errors.client && <p className="text-red-500 text-xs italic">{errors.client[0]}</p>}
                        </div>

                        {/* Telephone Input */}
                        <div className="mb-4">
                            <label htmlFor="telephone" className="block text-gray-700 font-bold mb-2 text-base" style={{ fontFamily: "monospace" }}>Téléphone</label>
                            <input
                                type="text"
                                name="telephone"
                                value={client.telephone}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.telephone ? 'border-red-500' : ''}`}
                            />
                            {errors.telephone && <p className="text-red-500 text-xs italic">{errors.telephone[0]}</p>}
                        </div>

                        {/* Address Input */}
                        <div className="mb-4">
                            <label htmlFor="assurance" className="block text-gray-700 font-bold mb-2 text-base" style={{ fontFamily: "monospace" }}>Assurance</label>
                            <input
                                type="text"
                                name="assurance"
                                value={client.assurance}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.address ? 'border-red-500' : ''}`}
                            />
                            {errors.assurance && <p className="text-red-500 text-xs italic">{errors.assurance[0]}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-center mb-4">
                            <button
                                type="submit"
                                style={{ fontFamily: "monospace" }}
                                className="bg-cyan-800 text-white text-base py-2 px-4 rounded-xl hover:bg-cyan-900 focus:outline-none focus:shadow-outline"
                            >
                                Créer un Client
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );

}

export default CreateClient;
