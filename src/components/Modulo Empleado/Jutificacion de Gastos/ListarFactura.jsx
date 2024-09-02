import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileEdit, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../Config';
import ListarJustificacione from './ListarJustificaciones';

const ListarFacturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [filteredFacturas, setFilteredFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [view, setView] = useState('facturas');

    const fetchFacturas = useCallback(async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const idUsuario = storedUser.usuario.id_usuario;
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const response = await fetch(`${API_URL}/Informes/listar-facturas/${idUsuario}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Error al obtener facturas');

            const data = await response.json();
            setFacturas(data.facturas || []);
            setFilteredFacturas(data.facturas || []);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFacturas();
    }, [fetchFacturas]);

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(event.target.value);

        const filtered = facturas.filter(
            (factura) =>
                factura.codigo_solicitud?.toLowerCase().includes(searchValue) ||
                factura.fecha_informe?.toLowerCase().includes(searchValue)
        );

        setFilteredFacturas(filtered);
        setCurrentPage(1);
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilteredFacturas(facturas);
        setCurrentPage(1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFacturas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFacturas.length / itemsPerPage);

    if (view === 'justificaciones') {
        return <ListarJustificacione />;
    }

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <h2 className="text-xl font-medium flex-1">Listado de Facturas</h2>
                <div className="flex items-center flex-1 justify-center">
                    <label htmlFor="view-select" className="mr-2 text-lg font-light">Ver:</label>
                    <select
                        id="view-select"
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="facturas">Facturas</option>
                        <option value="justificaciones">Justificaciones</option>
                    </select>
                </div>
            </div>
            {loading && <div className="text-center mt-8">Cargando...</div>}
            {error && <div className="text-center mt-8 text-red-500">Error: {error}</div>}
            {!loading && !error && (
                <>
                    <div className="mb-4">
                        <div className="flex mb-4">
                            <input
                                type="text"
                                placeholder="Buscar por código de solicitud o fecha"
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
                                    <th className="py-3 px-6 text-left">Estado</th>
                                    <th className="py-3 px-6 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {currentItems.length > 0 ? (
                                    currentItems.map((factura) => (
                                        <tr key={factura.id_factura} className="border-b border-gray-300 hover:bg-gray-100">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">{factura.codigo_solicitud}</td>
                                            <td className="py-3 px-6 text-left">{factura.fecha_informe}</td>
                                            <td className="py-3 px-6 text-left">
                                                {factura.estado === 0 ? 'Incompleto' : 'Completo'}
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                            {factura.estado === 1 && (
                                                    <button
                                                        onClick={() => handlePDFClick(factura.id_factura)}
                                                        className="p-2 bg-gray-500 text-white rounded-full mr-2"
                                                        title="Ver Detalle PDF"
                                                    >
                                                        <FontAwesomeIcon icon={faFilePdf} />
                                                    </button>
                                                )}
                                                {factura.estado === 0 && (
                                                    <button
                                                        onClick={() => handleEditClick(factura.id_factura)}
                                                        className="p-2 bg-yellow-500 text-white rounded-full mr-2"
                                                        title="Editar Informe"
                                                    >
                                                        <FontAwesomeIcon icon={faFileEdit} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-3 px-6 text-center">No se encontraron facturas</td>
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
            )}
        </div>
    );
};

export default ListarFacturas;