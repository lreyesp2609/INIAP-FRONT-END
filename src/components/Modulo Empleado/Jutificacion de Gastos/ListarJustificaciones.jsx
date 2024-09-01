import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileEdit } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../Config';
import CrearJustificacione from './CrearJustificaciones'; // Asegúrate de importar el componente correcto

const ListarJustificacione = () => {
    const [informes, setInformes] = useState([]);
    const [filteredInformes, setFilteredInformes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [view, setView] = useState('sin-justificacion');
    const [isEditing, setIsEditing] = useState(false);
    const [currentInformeId, setCurrentInformeId] = useState(null);

    const fetchInformes = useCallback(async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const idUsuario = storedUser.usuario.id_usuario;
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const response = await fetch(`${API_URL}/Informes/informes-sin-facturas/${idUsuario}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Error al obtener informes');

            const data = await response.json();
            setInformes(data.informes || []);
            setFilteredInformes(data.informes || []);
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
                informe['Codigo de Solicitud']?.toLowerCase().includes(searchValue) ||
                informe['Fecha Solicitud']?.toLowerCase().includes(searchValue)
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

    const handleCloseEdit = () => {
        setIsEditing(false);
        setCurrentInformeId(null);
        fetchInformes();
    };

    if (isEditing) {
        return <CrearJustificacione idInforme={currentInformeId} onClose={handleCloseEdit} />;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInformes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredInformes.length / itemsPerPage);

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <h2 className="text-xl font-medium flex-1">Gestión de Justificaciones de Gastos</h2>
                <div className="flex items-center flex-1 justify-center">
                    <label htmlFor="view-select" className="mr-2 text-lg font-light">Ver:</label>
                    <select
                        id="view-select"
                        value={view}
                        onChange={handleViewChange}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="sin-justificacion">Informes Sin Justificación</option>
                        <option value="pendientes">Solicitudes con Informes Pendientes</option>
                    </select>
                </div>
                <div className="flex-1"></div>
            </div>
            {loading && <div className="text-center mt-8">Cargando...</div>}
            {error && <div className="text-center mt-8 text-red-500">Error: {error}</div>}
            {!loading && !error && (
                <>
                    {view === 'sin-justificacion' ? (
                        <>
                            <div className="mb-4">
                                <div className="flex mb-4">
                                    <input
                                        type="text"
                                        placeholder="Buscar por código o fecha de solicitud"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                                        onClick={handleClear}
                                    >
                                        Limpiar
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                            <th className="py-3 px-6 text-left">Código de Solicitud</th>
                                            <th className="py-3 px-6 text-left">Fecha Solicitud</th>
                                            <th className="py-3 px-6 text-left">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm font-light">
                                        {currentItems.length > 0 ? (
                                            currentItems.map((informe) => (
                                                <tr key={informe.id_informes} className="border-b border-gray-300 hover:bg-gray-100">
                                                    <td className="py-3 px-6 text-left whitespace-nowrap">{informe['Codigo de Solicitud']}</td>
                                                    <td className="py-3 px-6 text-left">{informe['Fecha Solicitud']}</td>
                                                    <td className="py-3 px-6 text-left">
                                                        <button
                                                            onClick={() => handleEditClick(informe.id_informes)}
                                                            className="p-2 bg-yellow-500 text-white rounded-full"
                                                            title="Editar Informe"
                                                        >
                                                            <FontAwesomeIcon icon={faFileEdit} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="py-3 px-6 text-center">No se encontraron informes</td>
                                            </tr>
                                        )}
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
                                <span>Página {currentPage} de {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    ) : (
                        <CrearJustificacione/>
                    )}
                </>
            )}
        </div>
    );
};

export default ListarJustificacione;
