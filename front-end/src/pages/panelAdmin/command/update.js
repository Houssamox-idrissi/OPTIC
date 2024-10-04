import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/solid';



function UpdateCommand() {
    const { id } = useParams();
    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate("/admin/commands")
    };
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        assurance: '',
        date: '',
        medecin: '',
        prix: '',
        avance: '',
        notes: '',
        remise: '',
        reste: '',
        type_verre_id: '',
        nature_de_glasse: '',
        vision: '',
        og_sph: '',
        og_cyl: '',
        og_axe: '',
        og_addition: '',
        od_sph: '',
        od_cyl: '',
        od_axe: '',
        od_addition: '',
        fournisseur_id: '',
        ordonnance: null,
    });

    const [loading, setLoading] = useState(true);
    const [typeVerres, setTypeVerres] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typeVerresRes, fournisseursRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/type-verres", { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get("http://127.0.0.1:8000/api/fournisseurs", { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                setTypeVerres(typeVerresRes.data);
                setFournisseurs(fournisseursRes.data || []);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };
        fetchData();
    }, []);
    


    const token = localStorage.getItem('adminToken');
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/client-command-glasses/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => {
                console.log(response.data); // Check the structure of the response

                const command = response.data.command;
                const client = command.clients[0]; // Assuming one client per command
                const glasses = command.glasses[0]; // Assuming one pair of glasses per command

                // Populate the form with existing data
                setFormData({
                    nom: client.nom,
                    prenom: client.prenom,
                    telephone: client.telephone,
                    assurance: client.assurance,
                    date: command.date,
                    medecin: command.medecin,
                    prix: command.prix,
                    avance: command.avance,
                    notes: command.notes,
                    remise: command.remise,
                    reste: command.reste,
                    type_verre_id: glasses.type_verre_id,
                    nature_de_glasse: glasses.nature_de_glasse,
                    vision: glasses.vision,
                    og_sph: glasses.og_sph,
                    og_cyl: glasses.og_cyl,
                    og_axe: glasses.og_axe,
                    og_addition: glasses.og_addition,
                    od_sph: glasses.od_sph,
                    od_cyl: glasses.od_cyl,
                    od_axe: glasses.od_axe,
                    od_addition: glasses.od_addition,
                    fournisseur_id: glasses.fournisseur_id,
                });
                setLoading(false);
            })
            .catch(error => console.error(error));
    }, [id]);


    const handleChange = (e) => {
        if (e.target.name === 'ordonnance') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0], 
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://127.0.0.1:8000/api/commands/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then((response) => {
                console.log('Command updated successfully:', response.data);
                navigate('/admin/commands'); // Navigate back to commands list after successful update
            })
            .catch((error) => console.error('Error updating command:', error));
    };






    return (
        <>
            <div className="background-image" />
            <div className="dashboard-container">
                <div className='mt-2 ml-80 '>
                    <h2 className="text-5xl font-bold text-white mb-6 text-center" style={{ fontFamily: "sans-serif" }}>Modifier la commande</h2>
                    <div className="" >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <section className="">
                                <div className="flex items-center mb-4 cursor-pointer" onClick={handleBackClick}>
                                    <ArrowLeftIcon className="h-5 w-5 text-white mr-2" />
                                    <span className="text-white" style={{ fontFamily: "monospace", fontSize: "16px" }}>Back</span>
                                </div>

                                <h3 className="text-xl font-semibold mb-3 text-white" style={{ fontFamily: "monospace" }}>Informations sur le client</h3>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                    <div>
                                        <input
                                            placeholder="Nom"
                                            type="text"
                                            name="nom"
                                            value={formData.nom} onChange={handleChange}
                                            style={{ fontFamily: "monospace", fontSize: "16px" }}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-500"
                                        />
                                        {errors.nom && <p className="text-red-500 text-sm">{errors.nom[0]}</p>}
                                    </div>

                                    <div>
                                        <input
                                            placeholder="Prenom"
                                            type="text"
                                            name="prenom"
                                            value={formData.prenom} onChange={handleChange}
                                            style={{ fontFamily: "monospace", fontSize: "16px" }}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-500"
                                        />
                                        {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom[0]}</p>}
                                    </div>

                                    <div>
                                        <input
                                            placeholder="Telephone"
                                            type="tel"
                                            name="telephone"
                                            value={formData.telephone} onChange={handleChange}
                                            style={{ fontFamily: "monospace", fontSize: "16px" }}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-500"
                                        />
                                        {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone[0]}</p>}
                                    </div>

                                    <div>
                                        <input
                                            placeholder="Assurance"
                                            type="text"
                                            name="assurance"
                                            value={formData.assurance} onChange={handleChange}
                                            style={{ fontFamily: "monospace", fontSize: "16px" }}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-500"
                                        />
                                        {errors.assurance && <p className="text-red-500 text-sm">{errors.assurance[0]}</p>}
                                    </div>
                                </div>
                            </section>

                            <section className="">
                                <h3 className="text-xl font-semibold mb-1 text-white " style={{ fontFamily: "monospace" }}>Détail de la commande</h3>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                    <div className="">
                                        <input
                                            placeholder="Select a date"
                                            type="date"
                                            name="date"
                                            value={formData.date} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-400"
                                        />
                                        {errors.date && <p className="text-red-500 text-sm">{errors.date[0]}</p>}
                                    </div>

                                    <div >
                                        <input
                                            placeholder="Medecin"
                                            type="text"
                                            name="medecin"
                                            value={formData.medecin} onChange={handleChange}
                                            style={{ fontFamily: "monospace", fontSize: "16px" }}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-500"
                                        />
                                        {errors.medecin && <p className="text-red-500 text-sm">{errors.medecin[0]}</p>}
                                    </div>

                                    <div >
                                        <input
                                            placeholder="Prix"
                                            type="number"
                                            step="10"
                                            name="prix"
                                            value={formData.prix} onChange={handleChange}
                                            style={{ fontFamily: "monospace", fontSize: "16px" }}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-500"
                                        />
                                        {errors.prix && <p className="text-red-500 text-sm">{errors.prix[0]}</p>}
                                    </div>

                                    <div >
                                        <input
                                            placeholder="Avance"
                                            type="number"
                                            step="10"
                                            name="avance"
                                            value={formData.avance} onChange={handleChange}
                                            style={{ fontFamily: "monospace", fontSize: "16px" }}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-500"
                                        />
                                        {errors.avance && <p className="text-red-500 text-sm">{errors.avance[0]}</p>}
                                    </div>

                                    <div>
                                        <input
                                            placeholder="Remise"
                                            type="number"
                                            step="10"
                                            name="remise"
                                            value={formData.remise} onChange={handleChange}
                                            style={{ fontFamily: "monospace", fontSize: "16px" }}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-500"
                                        />
                                        {errors.remise && <p className="text-red-500 text-sm">{errors.remise[0]}</p>}
                                    </div>

                                    <div>
                                        <input
                                            placeholder="Reste"
                                            type="number"
                                            name="reste"
                                            value={formData.reste} onChange={handleChange}
                                            style={{ fontFamily: "monospace", fontSize: "16px" }}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-500"
                                        />
                                        {errors.reste && <p className="text-red-500 text-sm">{errors.reste[0]}</p>}
                                    </div>
                                </div>
                            </section>


                            <section className="">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="">
                                    <label
                                        htmlFor="ordonnance"
                                        className="text-xl font-semibold mb-1 text-white" style={{ fontFamily: "monospace" }}
                                    >
                                        Ordonnance
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            name="ordonnance"
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm text-gray-900 placeholder-gray-800 file:border-0 file:bg-blue-50 file:text-slate-950 file:text-base file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-600 shadow-sm transition duration-300 ease-in-out"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v8l5 5M19 9h-4a4 4 0 00-4-4H6a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4V9a4 4 0 00-4-4z"></path>
                                            </svg>
                                        </span>
                                    </div>
                                    {errors.ordonnance && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {errors.ordonnance[0]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                            <section className="">
                                <h3 className="text-xl font-semibold mb-5 text-white" style={{ fontFamily: "monospace" }}>Détail de la lunette</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="flex flex-col">
                                        <select
                                            id="type_verre_id"
                                            name="type_verre_id"
                                            value={formData.type_verre_id} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-slate-600 shadow-sm transition duration-300 ease-in-out hover:border-slate-500"
                                        >
                                            <option value="" style={{ fontFamily: "monospace" }}>Sélectionner le type de Verre</option>
                                            {typeVerres.map((typeVerre) => (
                                                <option style={{ fontFamily: "monospace" }} key={typeVerre.id} value={typeVerre.id}>
                                                    {typeVerre.libelle}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.type_verre_id && <p className="text-red-500 text-sm mt-1">{errors.type_verre_id[0]}</p>}
                                    </div>

                                    <div className="flex flex-col">
                                        <select
                                            id="nature_de_glasse"
                                            name="nature_de_glasse"
                                            value={formData.nature_de_glasse} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-slate-600 shadow-sm transition duration-300 ease-in-out hover:border-slate-500"
                                        >
                                            <option style={{ fontFamily: "monospace" }} value="">Sélectionner la monture</option>
                                            <option style={{ fontFamily: "monospace" }} value="Avec">Avec monture</option>
                                            <option style={{ fontFamily: "monospace" }} value="Sans">Sans monture</option>
                                        </select>
                                        {errors.nature_de_glasse && <p className="text-red-500 text-sm mt-1">{errors.nature_de_glasse[0]}</p>}
                                    </div>
                                    <div className="flex flex-col">
                                        <select
                                            id="vision"
                                            name="vision"
                                            value={formData.vision} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-slate-600 shadow-sm transition duration-300 ease-in-out hover:border-slate-500"
                                        >
                                            <option value="" style={{ fontFamily: "monospace" }}>Sélectionner la vision</option>
                                            <option style={{ fontFamily: "monospace" }} value="Prés">Prés</option>
                                            <option style={{ fontFamily: "monospace" }} value="Loins">Loins</option>
                                            <option style={{ fontFamily: "monospace" }} value="Progressif">Progressif</option>
                                        </select>
                                        {errors.vision && <p className="text-red-500 text-sm mt-1">{errors.vision[0]}</p>}
                                    </div>

                                    <div className="flex flex-col">
                                        <select
                                            id="fournisseur_id"
                                            name="fournisseur_id"
                                            value={formData.fournisseur_id} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-slate-600 shadow-sm transition duration-300 ease-in-out hover:border-slate-500"
                                        >
                                            <option value="" style={{ fontFamily: "monospace" }}>Sélectionner le fournisseur</option>
                                            {fournisseurs.map((fourn) => (
                                                <option style={{ fontFamily: "monospace" }} key={fourn.id} value={fourn.id}>
                                                    {fourn.marque}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.fournisseur_id && <p className="text-red-500 text-sm mt-1">{errors.fournisseur_id[0]}</p>}
                                    </div>
                                </div>
                                <div className="mt-8"></div>
                                <div className="w-10/12 overflow-x-hidden">
                                    <table className="divide-y divide-gray-300 bg-white shadow-md">
                                        <thead className="bg-slate-700 text-white">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-white font-bold tracking-wider">Oueil</th>
                                                <th className="px-6 py-3 text-left text-white font-bold tracking-wider">Sph</th>
                                                <th className="px-6 py-3 text-left text-white font-bold tracking-wider">Cyl</th>
                                                <th className="px-6 py-3 text-left text-white font-bold tracking-wider">Axe</th>
                                                <th className="px-6 py-3 text-left text-white font-bold tracking-wider">Addition</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr className="hover:bg-blue-50 transition duration-200 ease-in-out">
                                                <td className="px-6 py-4 text-gray-700 font-semibold">OG</td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="og_sph"
                                                        step="0.25"
                                                        value={formData.og_sph} onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.og_sph && <p className="text-red-500 text-sm mt-1">{errors.og_sph[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="og_cyl"
                                                        step="0.25"
                                                        value={formData.og_cyl} onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.og_cyl && <p className="text-red-500 text-sm mt-1">{errors.og_cyl[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        step="0.25"
                                                        name="og_axe"
                                                        value={formData.og_axe} onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.og_axe && <p className="text-red-500 text-sm mt-1">{errors.og_axe[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="og_addition"
                                                        step="0.25"
                                                        value={formData.og_addition} onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.og_addition && <p className="text-red-500 text-sm mt-1">{errors.og_addition[0]}</p>}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-blue-50 transition duration-200 ease-in-out">
                                                <td className="px-6 py-4 text-gray-700 font-semibold">OD</td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="od_sph"
                                                        step="0.25"
                                                        value={formData.od_sph} onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.od_sph && <p className="text-red-500 text-sm mt-1">{errors.od_sph[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="od_cyl"
                                                        step="0.25"
                                                        value={formData.od_cyl} onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.od_cyl && <p className="text-red-500 text-sm mt-1">{errors.od_cyl[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="od_axe"
                                                        step="0.25"
                                                        value={formData.od_axe} onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.od_axe && <p className="text-red-500 text-sm mt-1">{errors.od_axe[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="od_addition"
                                                        step="0.25"
                                                        value={formData.od_addition} onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.od_addition && <p className="text-red-500 text-sm mt-1">{errors.od_addition[0]}</p>}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <textarea
                                    placeholder="Notes"
                                    name="notes"
                                    value={formData.notes} onChange={handleChange}
                                    style={{ fontFamily: "monospace", fontSize: "16px", resize: "none" }}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-500"
                                    rows={3}
                                />
                                {errors.notes && <p className="text-red-500 text-sm">{errors.notes[0]}</p>}
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    style={{ fontFamily: "monospace" }}
                                    className="bg-slate-700 text-white px-6 py-3 text-bold text-lg rounded-full hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </>
    );
};

export default UpdateCommand;
