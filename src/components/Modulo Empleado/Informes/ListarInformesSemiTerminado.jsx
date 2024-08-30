import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileEdit } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../Config';
import InformesPendientes from './ListarInformesPendientes';
import DetalleEditarInforme from './EditarInforme';

const InformesSemiTerminados = () => {
    const [informes, setInformes] = useState([]);
    const [filteredInformes, setFilteredInformes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [view, setView] = useState('semi-terminados');
    const [isEditing, setIsEditing] = useState(false);
    const [currentInformeId, setCurrentInformeId] = useState(null);

    const fetchInformes = useCallback(async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const idUsuario = storedUser.usuario.id_usuario;
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const url = `${API_URL}/Informes/listar-informes/${idUsuario}/`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Error al obtener informes');

            const data = await response.json();
            setInformes(data.informes);
            setFilteredInformes(data.informes);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInformes();
    }, [fetchInformes]);

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(event.target.value);

        const filtered = informes.filter(
            (informe) =>
                informe.codigo_solicitud.toLowerCase().includes(searchValue) ||
                informe.fecha_informe.toLowerCase().includes(searchValue) ||
                informe.estado.toString().includes(searchValue)
        );

        setFilteredInformes(filtered);
        setCurrentPage(1);
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilteredInformes(informes);
        setCurrentPage(1);
    };

    const handleViewChange = (event) => {
        setView(event.target.value);
    };

    const handleEditClick = (idInforme) => {
        setCurrentInformeId(idInforme);
        setIsEditing(true);
    };

    const handleCloseEdit = useCallback(() => {
        setIsEditing(false);
        setCurrentInformeId(null);
        fetchInformes(); // Actualiza la lista de informes después de editar
    }, [fetchInformes]);

    if (isEditing) {
        return <DetalleEditarInforme idInforme={currentInformeId} onClose={handleCloseEdit} />;
    }

    if (view === 'pendientes') {
        return <InformesPendientes />;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInformes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredInformes.length / itemsPerPage);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-light mb-4">Informes</h2>
                <div className="flex items-center mb-4">
                    <label htmlFor="view-select" className="text-lg font-light mr-4">Ver: </label>
                    <select
                        id="view-select"
                        value={view}
                        onChange={handleViewChange}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="semi-terminados">Informes</option>
                        <option value="pendientes">Solicitudes con Informes Pendientes</option>
                    </select>
                </div>
                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por número, fecha o estado"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                        onClick={handleClear}
                        style={{ minWidth: '80px' }}
                    >
                        Limpiar
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Código de Solicitud</th>
                            <th className="py-3 px-6 text-left">Fecha Informe</th>
                            <th className="py-3 px-6 text-left">Estado Informe</th>
                            <th className="py-3 px-6 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {currentItems.map((informe) => (
                            <tr key={informe.id_informes} className="border-b border-gray-300 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{informe.codigo_solicitud}</td>
                                <td className="py-3 px-6 text-left">{informe.fecha_informe}</td>
                                <td className="py-3 px-6 text-left">
                                    {informe.estado === 0 ? 'Incompleto' : 'Completo'}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {informe.estado === 1 && (
                                        <button
                                            className="p-2 bg-gray-500 text-white rounded-full mr-2"
                                            title="Generar PDF"
                                        >
                                            <FontAwesomeIcon icon={faFilePdf} />
                                        </button>
                                    )}
                                    {informe.estado === 0 && (
                                        <button
                                            onClick={() => handleEditClick(informe.id_informes)}
                                            className="p-2 bg-yellow-500 text-white rounded-full mr-2"
                                            title="Editar Informe"
                                        >
                                            <FontAwesomeIcon icon={faFileEdit} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span>{`Página ${currentPage} de ${totalPages}`}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default InformesSemiTerminados;