import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/solid';



function CreateClientCommandGlasses() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/admin/commands")
    };

    const [client, setClient] = useState({
        nom: "",
        prenom: "",
        assurance: "",
        telephone: ""
    });

    const [command, setCommand] = useState({
        date: "",
        medecin: "",
        prix: "",
        avance: "",
        notes: "",
        remise: "",
        reste: "",
        ordonnance: null
    });

    const [glasses, setGlasses] = useState({
        type_verre_id: "",
        nature_de_glasse: "",
        og_sph: "",
        og_cyl: "",
        og_axe: "",
        og_addition: "",
        od_sph: "",
        od_cyl: "",
        od_axe: "",
        od_addition: "",
        fournisseur_id: "",
        vision: ""
    });

    const [typeVerres, setTypeVerres] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/type-verres", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                setTypeVerres(res.data);
            })
            .catch((error) => {
                console.log("Error fetching type_verres", error);
            });

        axios.get("http://127.0.0.1:8000/api/fournisseurs", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                console.log(res.data);
                setFournisseurs(res.data || []);
            })
            .catch(error => {
                console.log("Error fetching data", error);
            });
    }, [])




    const [errors, setErrors] = useState({});

    const handleClientChange = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const handleCommandChange = (e) => {
        if (e.target.name === "ordonnance") {
            setCommand({ ...command, ordonnance: e.target.files[0] });
        } else {
            setCommand({ ...command, [e.target.name]: e.target.value });
        }
    };
    useEffect(() => {
        const prix = parseFloat(command.prix) || 0;
        const avance = parseFloat(command.avance) || 0;
        const remise = parseFloat(command.remise);
        const reste = prix - (avance + remise);

        setCommand(prevState => ({
            ...prevState,
            reste: reste.toFixed(2)
        }));
    }, [command.prix, command.avance, command.remise]);

    const handleGlassesChange = (e) => {
        setGlasses({ ...glasses, [e.target.name]: e.target.value });
    };

    const token = localStorage.getItem('adminToken')
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("http://127.0.0.1:8000/api/check-client", {
            nom: client.nom,
            prenom: client.prenom,
            telephone: client.telephone
        },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                const clientId = response.data.client_id;
                const formData = new FormData();

                if (!clientId) {
                    formData.append('nom', client.nom);
                    formData.append('prenom', client.prenom);
                    formData.append('assurance', client.assurance);
                    formData.append('telephone', client.telephone);
                } else {
                    formData.append('client_id', clientId);
                }
                formData.append('date', command.date);
                formData.append('medecin', command.medecin);
                formData.append('prix', command.prix);
                formData.append('avance', command.avance);
                formData.append('notes', command.notes);
                formData.append('remise', command.remise);
                formData.append('reste', command.reste);
                formData.append('ordonnance', command.ordonnance); // File

                formData.append('type_verre_id', glasses.type_verre_id);
                formData.append('vision', glasses.vision);
                formData.append('nature_de_glasse', glasses.nature_de_glasse);
                formData.append('og_sph', glasses.og_sph);
                formData.append('og_cyl', glasses.og_cyl);
                formData.append('og_axe', glasses.og_axe);
                formData.append('og_addition', glasses.og_addition);
                formData.append('od_sph', glasses.od_sph);
                formData.append('od_cyl', glasses.od_cyl);
                formData.append('od_axe', glasses.od_axe);
                formData.append('od_addition', glasses.od_addition);
                formData.append('fournisseur_id', glasses.fournisseur_id);

                axios.post("http://127.0.0.1:8000/api/store-client-command-glasses", formData, {

                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then((res) => {
                        alert("Client, Command, and Glasses created successfully");
                        navigate("/admin/commands");
                    })
                    .catch((error) => {
                        console.error("Error creating records", error);
                        if (error.response && error.response.data.errors) {
                            setErrors(error.response.data.errors);
                        }
                    });
            })
            .catch((error) => {
                console.error("Error checking client", error);
            });
    };




    return (
        <>
            <div className="background-image" />
            <div className="dashboard-container">
                <div className='mt-2 ml-80 '>
                    <h2 className="mt-4 text-5xl font-extrabold text-center mb-8 text-gradient bg-clip-text text-transparent bg-white"
                        style={{ fontFamily: 'Poppins, sans-serif' }}>Créer une commande</h2>
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
                                            value={client.nom}
                                            onChange={handleClientChange}
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
                                            value={client.prenom}
                                            onChange={handleClientChange}
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
                                            value={client.telephone}
                                            onChange={handleClientChange}
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
                                            value={client.assurance}
                                            onChange={handleClientChange}
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
                                            value={command.date}
                                            onChange={handleCommandChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-slate-600 shadow-sm hover:border-slate-400"
                                        />
                                        {errors.date && <p className="text-red-500 text-sm">{errors.date[0]}</p>}
                                    </div>

                                    <div >
                                        <input
                                            placeholder="Medecin"
                                            type="text"
                                            name="medecin"
                                            value={command.medecin}
                                            onChange={handleCommandChange}
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
                                            value={command.prix}
                                            onChange={handleCommandChange}
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
                                            value={command.avance}
                                            onChange={handleCommandChange}
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
                                            value={command.remise}
                                            onChange={handleCommandChange}
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
                                            value={command.reste}
                                            onChange={handleCommandChange}
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
                                                onChange={handleCommandChange}
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
                                            value={glasses.type_verre_id}
                                            onChange={handleGlassesChange}
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
                                            value={glasses.nature_de_glasse}
                                            onChange={handleGlassesChange}
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
                                            value={glasses.vision}
                                            onChange={handleGlassesChange}
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
                                            value={glasses.fournisseur_id}
                                            onChange={handleGlassesChange}
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
                                                        value={glasses.og_sph}
                                                        onChange={handleGlassesChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.og_sph && <p className="text-red-500 text-sm mt-1">{errors.og_sph[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="og_cyl"
                                                        step="0.25"
                                                        value={glasses.og_cyl}
                                                        onChange={handleGlassesChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.og_cyl && <p className="text-red-500 text-sm mt-1">{errors.og_cyl[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        step="0.25"
                                                        name="og_axe"
                                                        value={glasses.og_axe}
                                                        onChange={handleGlassesChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.og_axe && <p className="text-red-500 text-sm mt-1">{errors.og_axe[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="og_addition"
                                                        step="0.25"
                                                        value={glasses.og_addition}
                                                        onChange={handleGlassesChange}
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
                                                        value={glasses.od_sph}
                                                        onChange={handleGlassesChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.od_sph && <p className="text-red-500 text-sm mt-1">{errors.od_sph[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="od_cyl"
                                                        step="0.25"
                                                        value={glasses.od_cyl}
                                                        onChange={handleGlassesChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.od_cyl && <p className="text-red-500 text-sm mt-1">{errors.od_cyl[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="od_axe"
                                                        step="0.25"
                                                        value={glasses.od_axe}
                                                        onChange={handleGlassesChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition duration-300 ease-in-out"
                                                    />
                                                    {errors.od_axe && <p className="text-red-500 text-sm mt-1">{errors.od_axe[0]}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        name="od_addition"
                                                        step="0.25"
                                                        value={glasses.od_addition}
                                                        onChange={handleGlassesChange}
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
                                    value={command.notes}
                                    onChange={handleCommandChange}
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
                                    Enregistré
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </>
    );
}

export default CreateClientCommandGlasses;
