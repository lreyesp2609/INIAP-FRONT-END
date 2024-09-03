import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileEdit } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../Config';
import ListarJustificacione from './ListarJustificaciones';
import ListarEditarDetalleFacturas from './ListarEditarFacturas';

const ListarFacturasInformes = () => {
    const [informes, setInformes] = useState([]);
    const [filteredInformes, setFilteredInformes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [view, setView] = useState('facturas-informes');
    const [editingInforme, setEditingInforme] = useState(null);

    const fetchInformes = useCallback(async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const idUsuario = storedUser.usuario.id_usuario;
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const url = `${API_URL}/Informes/listar-facturas/${idUsuario}/`;
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
        setSearchTerm(searchValue);

        const filtered = informes.filter(
            (informe) =>
                informe.codigo_solicitud.toLowerCase().includes(searchValue) ||
                informe.fecha_informe.toLowerCase().includes(searchValue) ||
                informe.estado_factura.toString().includes(searchValue)
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
        setEditingInforme(idInforme);
    };

    const handlePDFClick = (idInforme) => {
        console.log('Ver PDF del informe:', idInforme);
    };

    const handleCloseEdit = () => {
        setEditingInforme(null);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    if (view === 'pendientes') {
        return <ListarJustificacione />
    }

    if (editingInforme !== null) {
        return (
            <ListarEditarDetalleFacturas 
                idInforme={editingInforme}
                onClose={handleCloseEdit}
            />
        );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInformes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredInformes.length / itemsPerPage);

    return (
        <div className="p-4">
            <div className="mb-4">
                <div className="flex items-center mb-4">
                    <h2 className="text-xl font-medium flex-1">Gestión de Facturas e Informes</h2>
                    <div className="flex items-center flex-1 justify-center">
                        <label htmlFor="view-select" className="mr-2 text-lg font-light">Ver:</label>
                        <select
                            id="view-select"
                            value={view}
                            onChange={handleViewChange}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="facturas-informes">Terminar Justificaciones</option> 
                            <option value="pendientes">Crear Justificaciones</option>
                        </select>
                    </div>
                    <div className="flex-1"></div>
                </div>
                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por código, fecha o estado"
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
                            <th className="py-3 px-6 text-left">Fecha Informe</th>
                            <th className="py-3 px-6 text-left">Estado Factura</th>
                            <th className="py-3 px-6 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {currentItems.map((informe) => (
                            <tr key={informe.id_informe} className="border-b border-gray-300 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{informe.codigo_solicitud}</td>
                                <td className="py-3 px-6 text-left">{informe.fecha_informe}</td>
                                <td className="py-3 px-6 text-left">
                                    {informe.estado_factura === 0 ? 'Pendiente' : 'Completada'}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {informe.estado_factura === 0 ? (
                                        <button
                                            onClick={() => handleEditClick(informe.id_informe)}
                                            className="p-2 bg-yellow-500 text-white rounded-full mr-2"
                                            title="Editar Informe"
                                        >
                                            <FontAwesomeIcon icon={faFileEdit} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handlePDFClick(informe.id_informe)}
                                            className="p-2 bg-gray-500 text-white rounded-full mr-2"
                                            title="Ver Detalle PDF"
                                        >
                                            <FontAwesomeIcon icon={faFilePdf} />
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

export default ListarFacturasInformes;
