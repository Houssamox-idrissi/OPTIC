import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../../component/loading";
import {useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/solid';

function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    const handleBackClick = () => {
        navigate("/admin/AdminHome")
    };

    const token = localStorage.getItem('adminToken');
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/clients", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                console.log(res.data);
                setClients(res.data || []);
                setLoading(false);
            })
            .catch(error => {
                console.log("Error fetching data", error);
                setLoading(false);
            });
    }, []);

    const deleteClient = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/clients/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                setClients(clients.filter(client => client.id !== id));
                alert("Client deleted successfully");
            })
            .catch(error => {
                console.log("Error deleting client", error);
            });
    };

    return (
        <>
            <div className="background-image" />
            <div className="dashboard-container">
                <div className="mt-20 ml-80">
                    {loading ? (
                        <Loading />
                    ) : (
                        <div>
                            <div className="flex items-center mb-4 cursor-pointer" onClick={handleBackClick}>
                                <ArrowLeftIcon className="h-5 w-5 text-white mr-2" />
                                <span className="text-white font-mono text-lg">Retour</span>
                            </div>

                            <div className="mb-6">
                                <button
                                    onClick={() => navigate('/admin/clientStore')}
                                    style={{ fontFamily: "monospace" }}
                                    className="text-base flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                                >
                                    <PlusIcon className="h-6 w-6 mr-2" />
                                    <span className="font-semibold">Client</span>
                                </button>
                            </div>

                            {/* Client Table */}
                            <table className="table-auto w-full bg-white shadow-md  overflow-hidden">
                                <thead className="bg-slate-800 text-white">
                                    <tr>
                                        <th className="text-base px-4 py-2 font-medium" sstyle={{ fontFamily: "monospace" }}>ID</th>
                                        <th className=" text-base px-4 py-2 font-medium" style={{ fontFamily: "monospace" }}>Nom</th>
                                        <th className="text-base px-4 py-2 font-medium" style={{ fontFamily: "monospace" }}>Prénom</th>
                                        <th className="text-base px-4 py-2 font-medium" style={{ fontFamily: "monospace" }}>Téléphone</th>
                                        <th className="text-base px-4 py-2 font-medium" style={{ fontFamily: "monospace" }}>Assurance</th>
                                        <th className="text-base px-4 py-2 font-medium" style={{ fontFamily: "monospace" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-slate-900 text-white">
                                    {clients.length > 0 ? (
                                        clients.map((client, index) => (
                                            <tr key={index} className="text-center border-b last:border-b-0">
                                                <td style={{ fontFamily: "monospace" }} className=" text-base border px-4 py-2">{client.id}</td>
                                                <td style={{ fontFamily: "monospace" }} className="text-base border px-4 py-2">{client.nom}</td>
                                                <td style={{ fontFamily: "monospace" }} className="text-base border px-4 py-2">{client.prenom}</td>
                                                <td style={{ fontFamily: "monospace" }} className="text-base border px-4 py-2">{client.telephone}</td>
                                                <td style={{ fontFamily: "monospace" }} className="text-base border px-4 py-2">{client.assurance}</td>
                                                <td style={{ fontFamily: "monospace" }} className="text-base border px-4 py-2 flex justify-center space-x-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteClient(client.id)}
                                                        className="text-red-600 hover:text-red-700 transform transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
                                                    >
                                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">Aucun client disponible</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Clients;
