import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/solid';

function CreateFournisseur() {
    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate("/admin/fournisseurs")
    };
    const [fournisseur, setFournisseur] = useState({
        marque: "",
        telephone: "",
        address: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFournisseur({ ...fournisseur, [e.target.name]: e.target.value });
    };

    const token = localStorage.getItem('adminToken');
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/fournisseurs", fournisseur, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                alert("Fournisseur created successfully");
                navigate("/admin/fournisseurs");
            })
            .catch((error) => {
                console.log("Error creating fournisseur", error);
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
                        Nouveau fournisseur
                    </div>

                    {/* Form */}
                    <form className="py-4 px-6" onSubmit={handleSubmit}>
                        {/* Marque Input */}
                        <div className="mb-4">
                            <label htmlFor="marque" className="block text-gray-700 font-bold mb-2 text-base" style={{ fontFamily: "monospace" }}>Marque</label>
                            <input
                                type="text"
                                name="marque"
                                value={fournisseur.marque}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.marque ? 'border-red-500' : ''}`}
                            />
                            {errors.marque && <p className="text-red-500 text-xs italic">{errors.marque[0]}</p>}
                        </div>

                        {/* Telephone Input */}
                        <div className="mb-4">
                            <label htmlFor="telephone" className="block text-gray-700 font-bold mb-2 text-base" style={{ fontFamily: "monospace" }}>Téléphone</label>
                            <input
                                type="text"
                                name="telephone"
                                value={fournisseur.telephone}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.telephone ? 'border-red-500' : ''}`}
                            />
                            {errors.telephone && <p className="text-red-500 text-xs italic">{errors.telephone[0]}</p>}
                        </div>

                        {/* Address Input */}
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-gray-700 font-bold mb-2 text-base" style={{ fontFamily: "monospace" }}>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={fournisseur.address}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.address ? 'border-red-500' : ''}`}
                            />
                            {errors.address && <p className="text-red-500 text-xs italic">{errors.address[0]}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-center mb-4">
                            <button
                                type="submit"
                                style={{ fontFamily: "monospace" }}
                                className="bg-cyan-800 text-white text-base py-2 px-4 rounded-xl hover:bg-cyan-900 focus:outline-none focus:shadow-outline"
                            >
                                Créer un Fournisseur
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );

}

export default CreateFournisseur;
