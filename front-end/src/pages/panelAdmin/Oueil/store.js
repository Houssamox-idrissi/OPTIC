import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateOueil() {
    const navigate = useNavigate();
    const [oueil, setOueil] = useState({
        og_sph: "",
        og_cyl: "",
        og_axe: "",
        og_addition: "",
        od_sph: "",
        od_cyl: "",
        od_axe: "",
        od_addition: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setOueil({ ...oueil, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/oueils", oueil)
            .then((res) => {
                alert("Oueil created successfully");
                navigate("/admin/oueils");
            })
            .catch((error) => {
                console.log("Error creating oueil", error);
                if (error.response && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                }
            });
    };

    return (
        <div className='max-w-md mx-auto mt-10 bg-slate-50 shadow-lg rounded-lg overflow-hidden'>
            <div className="text-xl py-4 px-6 bg-gray-900 text-white text-center font-bold uppercase">
                Create Oueil
            </div>
            <form className="py-4 px-6" onSubmit={handleSubmit}>
                <div className="flex">
                    {/* OG Fields */}
                    <div className="w-1/2 pr-4">
                        {/* OG Sph */}
                        <div className="mb-4">
                            <label htmlFor="og_sph" className="block text-gray-700 font-bold mb-2">OG Sph</label>
                            <input
                                type="number"
                                step="0.01"
                                name="og_sph"
                                value={oueil.og_sph}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.og_sph ? 'border-red-500' : ''}`}
                            />
                            {errors.og_sph && <p className="text-red-500 text-xs italic">{errors.og_sph[0]}</p>}
                        </div>
                        {/* OG Cyl */}
                        <div className="mb-4">
                            <label htmlFor="og_cyl" className="block text-gray-700 font-bold mb-2">OG Cyl</label>
                            <input
                                type="number"
                                step="0.01"
                                name="og_cyl"
                                value={oueil.og_cyl}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.og_cyl ? 'border-red-500' : ''}`}
                            />
                            {errors.og_cyl && <p className="text-red-500 text-xs italic">{errors.og_cyl[0]}</p>}
                        </div>
                        {/* OG Axe */}
                        <div className="mb-4">
                            <label htmlFor="og_axe" className="block text-gray-700 font-bold mb-2">OG Axe</label>
                            <input
                                type="number"
                                name="og_axe"
                                value={oueil.og_axe}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.og_axe ? 'border-red-500' : ''}`}
                            />
                            {errors.og_axe && <p className="text-red-500 text-xs italic">{errors.og_axe[0]}</p>}
                        </div>
                        {/* OG Addition */}
                        <div className="mb-4">
                            <label htmlFor="og_addition" className="block text-gray-700 font-bold mb-2">OG Addition</label>
                            <input
                                type="number"
                                step="0.01"
                                name="og_addition"
                                value={oueil.og_addition}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.og_addition ? 'border-red-500' : ''}`}
                            />
                            {errors.og_addition && <p className="text-red-500 text-xs italic">{errors.og_addition[0]}</p>}
                        </div>
                    </div>

                    {/* OD Fields */}
                    <div className="w-1/2 pl-4">
                        {/* OD Sph */}
                        <div className="mb-4">
                            <label htmlFor="od_sph" className="block text-gray-700 font-bold mb-2">OD Sph</label>
                            <input
                                type="number"
                                step="0.01"
                                name="od_sph"
                                value={oueil.od_sph}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.od_sph ? 'border-red-500' : ''}`}
                            />
                            {errors.od_sph && <p className="text-red-500 text-xs italic">{errors.od_sph[0]}</p>}
                        </div>
                        {/* OD Cyl */}
                        <div className="mb-4">
                            <label htmlFor="od_cyl" className="block text-gray-700 font-bold mb-2">OD Cyl</label>
                            <input
                                type="number"
                                step="0.01"
                                name="od_cyl"
                                value={oueil.od_cyl}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.od_cyl ? 'border-red-500' : ''}`}
                            />
                            {errors.od_cyl && <p className="text-red-500 text-xs italic">{errors.od_cyl[0]}</p>}
                        </div>
                        {/* OD Axe */}
                        <div className="mb-4">
                            <label htmlFor="od_axe" className="block text-gray-700 font-bold mb-2">OD Axe</label>
                            <input
                                type="number"
                                name="od_axe"
                                value={oueil.od_axe}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.od_axe ? 'border-red-500' : ''}`}
                            />
                            {errors.od_axe && <p className="text-red-500 text-xs italic">{errors.od_axe[0]}</p>}
                        </div>
                        {/* OD Addition */}
                        <div className="mb-4">
                            <label htmlFor="od_addition" className="block text-gray-700 font-bold mb-2">OD Addition</label>
                            <input
                                type="number"
                                step="0.01"
                                name="od_addition"
                                value={oueil.od_addition}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.od_addition ? 'border-red-500' : ''}`}
                            />
                            {errors.od_addition && <p className="text-red-500 text-xs italic">{errors.od_addition[0]}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center mb-4">
                    <button
                        type="submit"
                        className="bg-gray-900 text-white py-2 px-4 rounded-full hover:bg-gray-800 focus:outline-none focus:shadow-outline"
                    >
                        Create Oueil
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateOueil;
