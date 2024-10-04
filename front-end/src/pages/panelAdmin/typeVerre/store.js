import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/solid';

function CreateTypeVerre() {
    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate("/admin/typeVerre")
    };

    const [typeVerre, setTypeVerre] = useState({
        libelle: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setTypeVerre({ ...typeVerre, [e.target.name]: e.target.value });
    };

    const token = localStorage.getItem('adminToken');
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/type-verres", typeVerre, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                alert("TypeVerre created successfully");
                navigate("/admin/typeVerre");
            })
            .catch((error) => {
                console.log("Error creating TypeVerre", error);
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
                        <span className="text-base font-medium" style={{ fontFamily: 'monospace' }}>Retour</span>
                    </button>
                </div>
                <div className='max-w-md mx-auto mt-10 bg-slate-50 shadow-lg rounded-lg overflow-hidden'>

                    <div style={{ fontFamily: "monospace" }} className="text-2xl py-4 px-6 mt-2 text-cyan-900 text-center font-bold uppercase">
                        Nouveau type de verre
                    </div>
                    <form className="py-4 px-6" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="libelle" style={{ fontFamily: "monospace" }} className="block text-gray-700 font-bold mb-2 text-base">Type de verre</label>
                            <input
                                type="text"
                                name="libelle"
                                value={typeVerre.libelle}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.libelle ? 'border-red-500' : ''}`}
                            />
                            {errors.libelle && <p className="text-red-500 text-xs italic">{errors.libelle[0]}</p>}
                        </div>
                        <div className="flex items-center justify-center mb-4">
                            <button
                                type="submit"
                                style={{ fontFamily: "monospace" }}
                                className="bg-cyan-800 text-white text-base py-2 px-4 rounded-xl hover:bg-cyan-900 focus:outline-none focus:shadow-outline"
                            >Créer un verre
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateTypeVerre;
