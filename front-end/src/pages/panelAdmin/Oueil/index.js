import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../../component/loading";
import { Link } from "react-router-dom";

function Oueils() {
    const [oueils, setOueils] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/oueils")
            .then(res => {
                console.log(res.data);
                setOueils(res.data || []);
                setLoading(false);
            })
            .catch(error => {
                console.log("Error fetching data", error);
                setLoading(false);
            });
    }, []);

    const deleteOueil = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/oueils/${id}`)
            .then(res => {
                setOueils(oueils.filter(oueil => oueil.id !== id));
                alert("Oueil deleted successfully");
            })
            .catch(error => {
                console.log("Error deleting oueil", error);
            });
    };

    return (
        <div className='mt-20 ml-80'>
            {loading ? (
                <Loading />
            ) : (
                <table className="table-auto w-full">
                    <thead className="text-white">
                        <Link to="/admin/oueilStore" className="inline-block w-6 h-6 mb-4 ml-8">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
                            </svg>
                        </Link>
                        <tr>
                            <th className="px-4 py-2" style={{ fontStyle: 'italic' }}>Id</th>
                            <th className="px-4 py-2" style={{ fontStyle: 'italic' }}>OG Sph</th>
                            <th className="px-4 py-2" style={{ fontStyle: 'italic' }}>OG Cyl</th>
                            <th className="px-4 py-2" style={{ fontStyle: 'italic' }}>OG Axe</th>
                            <th className="px-4 py-2" style={{ fontStyle: 'italic' }}>OG Addition</th>
                            <th className="px-4 py-2" style={{ fontStyle: 'italic' }}>OD Sph</th>
                            <th className="px-4 py-2" style={{ fontStyle: 'italic' }}>OD Cyl</th>
                            <th className="px-4 py-2" style={{ fontStyle: 'italic' }}>OD Axe</th>
                            <th className="px-4 py-2" style={{ fontStyle: 'italic' }}>OD Addition</th>
                            <th className="px-4 py-2" style={{ fontStyle: 'italic' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {oueils.length > 0 ? (
                            oueils.map((oueil, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border px-4 py-2">{oueil.id}</td>
                                    <td className="border px-4 py-2">{oueil.og_sph}</td>
                                    <td className="border px-4 py-2">{oueil.og_cyl}</td>
                                    <td className="border px-4 py-2">{oueil.og_axe}</td>
                                    <td className="border px-4 py-2">{oueil.og_addition}</td>
                                    <td className="border px-4 py-2">{oueil.od_sph}</td>
                                    <td className="border px-4 py-2">{oueil.od_cyl}</td>
                                    <td className="border px-4 py-2">{oueil.od_axe}</td>
                                    <td className="border px-4 py-2">{oueil.od_addition}</td>
                                    <td>
                                        <Link to={`/admin/oueilUpdate/${oueil.id}`} className="inline-block w-6 h-6 ml-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
                                            </svg>
                                        </Link>
                                        <button type="button" onClick={() => deleteOueil(oueil.id)} className="inline-block w-6 h-6 ml-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center py-4">No oueils available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Oueils;
