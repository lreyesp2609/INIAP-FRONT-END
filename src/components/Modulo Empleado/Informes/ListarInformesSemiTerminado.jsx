import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../Config';
import InformesPendientes from './ListarInformesPendientes';
import DetalleEditarInforme from './EditarInforme';
import ListarDetallePDF from './ListarDetallePDFs';

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
    const [showDetallePDF, setShowDetallePDF] = useState(false);
    const [includeHeaderFooter, setIncludeHeaderFooter] = useState(true); // Estado para incluir encabezado y pie de página

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
        fetchInformes();
    }, [fetchInformes]);

    const handleDetallePDFClick = (idInforme) => {
        setCurrentInformeId(idInforme);
        setShowDetallePDF(true);
    };

    const handleCloseDetallePDF = () => {
        setShowDetallePDF(false);
        setCurrentInformeId(null);
    };

    const handlePDFClick = async (idInforme) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const idUsuario = storedUser?.usuario?.id_usuario;
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');
    
            const response = await fetch(`${API_URL}/Informes/generar_pdf/${idUsuario}/${idInforme}/pdf/?include_header_footer=${includeHeaderFooter}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                },
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error en la respuesta del servidor');
            }
    
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/pdf')) {
                throw new Error('Respuesta inesperada del servidor');
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const popup = window.open('', '_blank');
            if (popup) {
                popup.location.href = url;
            } else {
                notification.error({
                    message: 'Error',
                    description: 'No se pudo abrir la ventana del PDF. Por favor, permite las ventanas emergentes.',
                    placement: 'topRight',
                });
            }
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al generar o abrir el PDF:', error);
            notification.error({
                message: 'Error',
                description: `Error al generar o abrir el PDF: ${error.message}`,
                placement: 'topRight',
            });
        }
    };

    if (isEditing) {
        return <DetalleEditarInforme idInforme={currentInformeId} onClose={handleCloseEdit} />;
    }

    if (showDetallePDF) {
        return <ListarDetallePDF idInforme={currentInformeId} onClose={handleCloseDetallePDF} />;
    }

    if (view === 'pendientes') {
        return <InformesPendientes />;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInformes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredInformes.length / itemsPerPage);

    return (
        <div className="p-4 mt-16">
        <div className="mb-4">
          <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-4">
            <h2 className="text-xl font-medium mb-2 md:mb-0">Gestión de Informes</h2>
            <div className="flex flex-col md:flex-row items-center md:items-center mb-2 md:mb-0">
              <label htmlFor="view-select" className="mr-2 text-lg font-light">Ver:</label>
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
          </div>
      
          <div className="mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <input
              type="text"
              placeholder="Buscar por nombres, apellidos o cédula"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded mt-2 md:mt-0 md:ml-2"
              onClick={handleClear}
              style={{ minWidth: "80px" }}
            >
              Limpiar
            </button>
            </div>
          </div>
      
          <div className="flex items-center mb-4">
            <label htmlFor="include-header-footer" className="mr-2 text-lg font-light">Incluir Encabezado y Pie de Página:</label>
            <input
              type="checkbox"
              id="include-header-footer"
              checked={includeHeaderFooter}
              onChange={() => setIncludeHeaderFooter(!includeHeaderFooter)}
              className="mr-2"
            />
          </div>
        </div>
      
        {/* Tabla visible en pantallas grandes */}
  <div className="hidden md:block overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-left">Código de Solicitud</th>
          <th className="py-3 px-6 text-left">Fecha Informe</th>
          <th className="py-3 px-6 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {currentItems.map((informe) => (
          <tr key={informe.id_informes} className="border-b border-gray-300 hover:bg-gray-100">
            <td className="py-3 px-6 text-left whitespace-nowrap">{informe.codigo_solicitud}</td>
            <td className="py-3 px-6 text-left whitespace-nowrap">{informe.fecha_informe}</td>
            <td className="py-3 px-6 text-left whitespace-nowrap">
              <button
                onClick={() => handleEditClick(informe.id_informes)}
                className="p-2 bg-yellow-500 text-white rounded-full mr-2"
              >
                <FontAwesomeIcon icon={faFileEdit} />
              </button>
              <button
                onClick={() => handlePDFClick(informe.id_informes)}
                className="p-2 bg-gray-500 text-white rounded-full mr-2"
              >
                <FontAwesomeIcon icon={faFilePdf} />
              </button>
              <button
                onClick={() => handleDetallePDFClick(informe.id_informes)}
                className="p-2 bg-blue-500 text-white rounded-full mr-2"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Tarjetas visibles en pantallas pequeñas */}
  <div className="md:hidden">
    {currentItems.map((informe) => (
      <div key={informe.id_informes} className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
        <h3 className="text-lg font-semibold mb-2">Código de Solicitud: {informe.codigo_solicitud}</h3>
        <p className="text-sm text-gray-600 mb-2">Fecha Informe: {informe.fecha_informe}</p>
        <p className="text-sm text-gray-600 mb-2">Estado Informe: {informe.estado}</p>
        <div className="flex space-x-4">
          <button
            onClick={() => handleEditClick(informe.id_informes)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faFileEdit} />
          </button>
          <button
            onClick={() => handlePDFClick(informe.id_informes)}
            className="text-green-500 hover:text-green-700"
          >
            <FontAwesomeIcon icon={faFilePdf} />
          </button>
          <button
            onClick={() => handleDetallePDFClick(informe.id_informes)}
            className="text-purple-500 hover:text-purple-700"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </div>
      </div>
    ))}
  </div>
      
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
          >
            Anterior
          </button>
          <span className="text-center md:text-left">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
          >
            Siguiente
          </button>
        </div>
      </div>
      
    );
};

export default InformesSemiTerminados;
