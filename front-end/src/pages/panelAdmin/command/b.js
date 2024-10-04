import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TrashIcon, XIcon, PrinterIcon, CheckCircleIcon,
    ExclamationCircleIcon, ClipboardListIcon, UserIcon,
    EyeIcon, ArrowLeftIcon, PlusIcon
}
    from '@heroicons/react/solid';
import { useNavigate } from 'react-router-dom';
import '../../../assets/dashboard.css';

function CommandList() {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
    const [commands, setCommands] = useState([]);
    const [typeVerres, setTypeVerres] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [filteredCommands, setFilteredCommands] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('');
    const [selectedCommand, setSelectedCommand] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState('Pending');
    const [commandId, setCommandId] = useState(null);

    useEffect(() => {
        if (isModalOpen) {
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            };
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isModalOpen]);


    const token = localStorage.getItem('adminToken');

    const refresh = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/client-command-glasses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log("well")
            console.log("Response:", response.data);
            setCommands(response.data.commands);
            setFilteredCommands(response.data.commands);

        } catch (err) {
            console.error("Error:", err.response ? err.response.data : err.message);
            if (err.response) {
                if (err.response.status === 401) {
                    setError("Unauthorized. Please log in again.");
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                } else {
                    setError("Error fetching commands. Please try again.");
                }
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        const fetchTypeVerres = async () => {
            axios.get("http://127.0.0.1:8000/api/type-verres", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    console.log(res.data);
                    setTypeVerres(res.data || []);
                    setLoading(false);
                })
                .catch(error => {
                    console.log("Error fetching data", error);
                    setLoading(false);
                });
        };

        const fetchFournisseurs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/fournisseurs', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFournisseurs(response.data);
            } catch (err) {
                console.error("Error fetching fournisseurs", err);
            }
        };

        fetchTypeVerres();
        fetchFournisseurs();
    }, []);

    useEffect(() => {
        const applyFiltersAndSort = () => {
            let filtered = commands;


            if (searchQuery) {
                const lowercasedQuery = searchQuery.toLowerCase();
                filtered = filtered.filter(command =>
                    command.clients.some(client =>
                        client.nom.toLowerCase().includes(lowercasedQuery) ||
                        client.prenom.toLowerCase().includes(lowercasedQuery) ||
                        client.telephone.includes(searchQuery)
                    )
                );
            }

            if (startDate && endDate) {
                filtered = filtered.filter(command => {
                    const commandDate = new Date(command.date);
                    return commandDate >= new Date(startDate) && commandDate <= new Date(endDate);
                });
            }

            if (statusFilter) {
                filtered = filtered.filter(command => command.status === statusFilter);
            }

            if (paymentStatusFilter !== 'all') {
                if (paymentStatusFilter === 'paye') {
                    filtered = filtered.filter(command => Number(command.reste) === 0);
                } else if (paymentStatusFilter === 'non-paye') {
                    filtered = filtered.filter(command => Number(command.reste) > 0);
                }
            }

            if (sortOption) {
                if (sortOption === 'date-asc') {
                    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                } else if (sortOption === 'date-desc') {
                    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                } else if (sortOption === 'price-asc') {
                    filtered.sort((a, b) => a.prix - b.prix);
                } else if (sortOption === 'price-desc') {
                    filtered.sort((a, b) => b.prix - a.prix);
                }
            }

            setFilteredCommands(filtered);
        };

        applyFiltersAndSort();
    }, [searchQuery, startDate, endDate, sortOption, statusFilter, paymentStatusFilter, commands]);



    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const openModal = (command) => {
        setSelectedCommand(command);
        setCommandId(command.id);
        setStatus(command.status);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCommand(null);
        setCommandId(null);
        setStatus('Pending');
    };

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    const refreshCommands = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/client-command-glasses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCommands(response.data.commands);
            setFilteredCommands(response.data.commands);
        } catch (error) {
            console.error('Error fetching commands:', error);
        }
    };

    const handleDelete = async (commandId) => {
        try {
            if (window.confirm("Are you sure you want to delete this command?")) {
                await axios.delete(`http://127.0.0.1:8000/api/client-command-glasses/${commandId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                refreshCommands();
            }
        } catch (error) {
            console.error('Error deleting command:', error);
            alert('Failed to delete command');
        }
    };

    const handleStatusChange = async (commandId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Pending' ? 'Done' : 'Pending';
            await axios.post(`http://127.0.0.1:8000/api/commands/${commandId}/status`, { status: newStatus }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setFilteredCommands(filteredCommands.map(command =>
                command.id === commandId ? { ...command, status: newStatus } : command
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handlePrint = () => {
        window.print();
    };


    return (
        <>
            <div className="background-image" />
            <div className="dashboard-container">
                <div className='mt-20 ml-80'>
{/* Header Section */}
                <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate("/admin/Adminhome")}
                        className="flex items-center text-white hover:text-cyan-600 transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-6 w-6 mr-2" />
                        <span className="font-semibold">Retour</span>
                    </button>

                    <button
                        onClick={() => navigate('/CommandStore')}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                    >
                        <PlusIcon className="h-6 w-6 mr-2" />
                        <span
                            style={{ fontFamily: 'monospace' }}
                            className="font-semibold text-base">Ajouter une commande</span>
                    </button>
                </div>

                <h1 className="text-5xl font-bold text-center text-white mb-12" style={{ fontFamily: 'sans-serif' }}>La page des commandes</h1>

                {/* Filters and Sort */}
                <div className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-between gap-4 mb-8 max-w-6xl mx-auto  ">

                    {/* Search */}
                    <div className="flex-1 lg:max-w-xs">
                        <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: 'monospace' }}>Recherche:</label>
                        <input
                            type="text"
                            placeholder="par nom ou tél du client"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-cyan-700"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex-1 lg:max-w-xs">
                        <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: 'monospace' }}>Trier par:</label>
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-cyan-700"
                        >
                            <option value="" style={{ fontFamily: 'monospace' }}>Aucun</option>
                            <option value="date-asc" style={{ fontFamily: 'monospace' }}>Date : Du plus récent au plus ancien</option>
                            <option value="date-desc" style={{ fontFamily: 'monospace' }}>Date : Du plus ancien au plus récent</option>
                            <option value="price-asc" style={{ fontFamily: 'monospace' }}>Prix : Du plus élevé au plus bas</option>
                            <option value="price-desc" style={{ fontFamily: 'monospace' }}>Prix : Du plus bas au plus élevé</option>
                        </select>
                    </div>

                    {/* Commandes Status Filter */}
                    <div className="flex-1 lg:max-w-xs">
                        <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: 'monospace' }}>Commandes:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-cyan-700"
                        >
                            <option value="" style={{ fontFamily: 'monospace' }}>Tous</option>
                            <option value="Done" style={{ fontFamily: 'monospace' }}>Terminé</option>
                            <option value="Pending" style={{ fontFamily: 'monospace' }}>En attente</option>
                        </select>
                    </div>

                    {/* Payment Status Filter */}
                    <div className="flex-1 lg:max-w-xs">
                        <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: 'monospace' }}>Paiement:</label>
                        <select
                            value={paymentStatusFilter}
                            onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-cyan-700"
                        >
                            <option value="" style={{ fontFamily: 'monospace' }}>Tous</option>
                            <option value="paye" style={{ fontFamily: 'monospace' }}>Payé</option>
                            <option value="non paye" style={{ fontFamily: 'monospace' }}>Non payé</option>
                        </select>
                    </div>

                    {/* Date Range Filter */}
                    <div className="flex-1 lg:max-w-md flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: 'monospace' }}>Date de début:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: 'monospace' }}>Date de fin:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>




                {/* Commands List */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {filteredCommands.length > 0 ? (
                        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {filteredCommands.map((command) => (
                                <div
                                    key={command.id}
                                    className="bg-white shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:shadow-xl hover:-translate-y-2"
                                >
                                    <div className='flex justify-between items-center mb-4'>
                                        <div className="flex justify-between items-center mb-4" style={{ fontFamily: 'monospace' }}>
                                            <button
                                                onClick={() => handleStatusChange(command.id, command.status)}
                                            >
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${command.status === 'Done'
                                                        ? 'bg-green-400 text-green-800'
                                                        : 'bg-yellow-300 text-yellow-800'
                                                        }`}
                                                >
                                                    {command.status === 'Done' ? (
                                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                                    ) : (
                                                        <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                                                    )}
                                                    {command.status === 'Done' ? 'Terminé' : 'En attente'}
                                                </span>
                                            </button>
                                        </div>

                                        <div className="flex items-center mb-4">
                                            <span
                                                style={{ fontFamily: 'monospace' }} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${Number(command.reste) === 0
                                                    ? 'bg-green-300 text-green-800'
                                                    : 'bg-yellow-300 text-yellow-800'
                                                    }`}
                                            >
                                                {Number(command.reste) === 0 ? (
                                                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                                                ) : (
                                                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                                                )}
                                                {Number(command.reste) === 0 ? 'Payé' : 'Non payé'}
                                            </span>
                                            <div className="flex items-center ml-2">
                                                <button
                                                    onClick={() => handleDelete(command.id)}
                                                    className="text-red-600 hover:text-red-500 focus:outline-none transform transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
                                                    title="Delete Command"
                                                >
                                                    <TrashIcon className="h-9 w-6" />
                                                </button>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-6" style={{ fontFamily: 'monospace' }}>
                                        <h2 className="text-2xl font-semibold text-gray-800">
                                            Command #{command.id}
                                        </h2>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-300 text-green-800">
                                            {command.date}
                                        </span>
                                    </div>

                                    <div className="text-gray-700 mb-4 text-base" style={{ fontFamily: 'monospace' }}>
                                        <ClipboardListIcon className="h-6 w-6 text-cyan-600 inline-block mr-2" />
                                        <strong>Medecin:</strong> {command.medecin}
                                    </div>

                                    <div className="text-gray-700 text-base mb-1" style={{ fontFamily: 'monospace' }}>
                                        <strong>Prix:</strong> {command.prix} DH
                                    </div>

                                    <div className="text-gray-700 text-base mb-4" style={{ fontFamily: 'monospace' }}>
                                        <strong>Reste:</strong> {command.reste} DH
                                    </div>

                                    {/* Client Section */}
                                    <div className="mb-4" style={{ fontFamily: 'monospace' }}>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            <UserIcon className="h-5 w-5 inline-block mr-2 text-cyan-600" />
                                            Clients
                                        </h3>
                                        {command.clients.map((client) => (
                                            <div
                                                key={client.id}
                                                className="text-gray-700 text-base mb-2"
                                            >
                                                <div>
                                                    <strong>Nom:</strong> {client.nom}
                                                </div>
                                                <div>
                                                    <strong>Prénom:</strong> {client.prenom}
                                                </div>
                                                <div>
                                                    <strong>Téléphone:</strong> {client.telephone}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => openModal(command)}
                                        style={{ fontFamily: 'monospace' }} className="flex items-center justify-center w-full py-2 px-4 bg-cyan-600 text-white rounded-lg shadow-md hover:bg-cyan-500 transition-all duration-300"
                                    >
                                        <EyeIcon className="h-6 w-6 mr-2" />
                                        Voir les détails
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-600">No commands found.</div>
                    )}
                </div>


                {/* Modal */}
                {isModalOpen && selectedCommand && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black print:hidden">
                        <div className="bg-slate-100 p-8 rounded-lg shadow-xl max-w-xl w-full relative">
                            {/* Close Button */}
                            <button
                                title='close'
                                onClick={closeModal}
                                className="absolute top-1 right-1 p-1  text-red-500 rounded-full  transition-all duration-300 print:hidden"
                            >
                                <XIcon className="h-7 w-6" />
                            </button>

                            <h2 className="text-3xl font-semibold mb-6 border-b border-gray-200 pb-2 text-center uppercase text-cyan-800" style={{ fontFamily: 'monospace' }}>
                                Détails de la commande
                            </h2>

                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="text-gray-700">
                                    <ClipboardListIcon className="h-6 w-6 text-cyan-600 inline-block mr-2" />
                                    <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Medecin:</strong> {selectedCommand.medecin}</div>
                                    <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Date:</strong> {selectedCommand.date}</div>
                                    <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Prix:</strong>{selectedCommand.prix} DH</div>
                                    <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Avance:</strong>{selectedCommand.avance} DH</div>
                                    <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Remise:</strong>{selectedCommand.remise} DH</div>
                                    <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Reste:</strong>{selectedCommand.reste} DH</div>
                                    <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Description:</strong> {selectedCommand.notes}</div>
                                </div>

                                <div className="text-gray-700">
                                    <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'monospace' }}>
                                        <UserIcon className="h-6 w-6 text-cyan-600 inline-block mr-2" />
                                        Client
                                    </h3>
                                    {selectedCommand.clients.map(client => (
                                        <div key={client.id} className="mb-4">
                                            <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Nom:</strong> {client.nom}</div>
                                            <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Prénom:</strong> {client.prenom}</div>
                                            <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Assurance:</strong> {client.assurance}</div>
                                            <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Téléphone:</strong> {client.telephone}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-gray-700 mb-6 items-center">
                                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'monospace' }}>
                                    <EyeIcon className="h-6 w-6 text-cyan-600 inline-block mr-2" />
                                    Détail de la lunette
                                </h3>
                                {selectedCommand.glasses.map(glass => (
                                    <div key={glass.id} className="mb-4">
                                        <div className='text-base' style={{ fontFamily: 'monospace' }}>
                                            <strong>Type Verre:</strong> {typeVerres.find(type => type.id === glass.type_verre_id)?.libelle || "Unknown"}
                                        </div>
                                        <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Monture:</strong> {glass.nature_de_glasse} monture</div>
                                        <div className='text-base' style={{ fontFamily: 'monospace' }}><strong>Vision:</strong> {glass.vision}</div>
                                        <div className='text-base' style={{ fontFamily: 'monospace' }}>
                                            <strong>Fournisseur:</strong> {fournisseurs.find(fournisseur => fournisseur.id === glass.fournisseur_id)?.marque || "Unknown"}
                                        </div>

                                        <div className='text-base mt-2' style={{ fontFamily: 'monospace' }}>
                                            <strong>OG:</strong> {glass.og_sph} sph, {glass.og_cyl} cyl, {glass.og_axe} axe, {glass.og_addition} addition
                                        </div>
                                        <div className='text-base' style={{ fontFamily: 'monospace' }}>
                                            <strong>OD:</strong> {glass.od_sph} sph, {glass.od_cyl} cyl, {glass.od_axe} axe, {glass.od_addition} addition
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end space-x-4 print:hidden">
                                <button
                                    title="Imprimer"
                                    onClick={handlePrint}

                                >
                                    <PrinterIcon
                                        className="h-8 w-8 mr-2 text-cyan-600 print:hidden" />
                                </button>
                            </div>
                        </div>
                    </div>

                )}
                </div>
            </div>
        </>
    );
}


export default CommandList;
