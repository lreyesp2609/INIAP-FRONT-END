import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileEdit } from "@fortawesome/free-solid-svg-icons";
import API_URL from "../../../Config";
import ListarJustificacione from "./ListarJustificaciones";
import ListarEditarDetalleFacturas from "./ListarEditarFacturas";
import ListarDetalleJustificaciones from "./ListarDetalleJutificacion";

const ListarFacturasInformes = () => {
  const [informes, setInformes] = useState([]);
  const [filteredInformes, setFilteredInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [view, setView] = useState("facturas-informes");
  const [editingInforme, setEditingInforme] = useState(null);
  const [pdfInforme, setPdfInforme] = useState(null); // Estado para el PDF

  const fetchInformes = useCallback(async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const idUsuario = storedUser.usuario.id_usuario;
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const url = `${API_URL}/Informes/listar-facturas/${idUsuario}/`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener informes");

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
    setSearchTerm("");
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
    setPdfInforme(idInforme); // Actualiza el estado para el PDF
  };

  const handleCloseEdit = () => {
    setEditingInforme(null);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  if (pdfInforme !== null) {
    return (
      <ListarDetalleJustificaciones
        idInforme={pdfInforme}
        onClose={() => setPdfInforme(null)}
      />
    );
  }

  const handleUpdate = () => {
    fetchInformes(); // Vuelve a cargar los informes después de una justificación
  };

  if (view === "pendientes") {
    return <ListarJustificacione />;
  }

  if (editingInforme !== null) {
    return (
      <ListarEditarDetalleFacturas
        idInforme={editingInforme}
        onClose={handleCloseEdit}
        onUpdate={handleUpdate}
      />
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInformes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInformes.length / itemsPerPage);

    return (
        <div className="p-4 mt-16">
  {/* Selección y búsqueda */}
  <div className="mb-4">
    <div className="flex flex-col md:flex-row items-center mb-4">
      <h2 className="text-xl font-medium flex-1 text-center md:text-left mb-2 md:mb-0">
        Gestión de Facturas e Informes
      </h2>
      <div className="flex flex-col md:flex-row items-center md:items-center mb-2 md:mb-0">
        <label htmlFor="view-select" className="mr-2 text-lg font-light">
          Ver:
        </label>
        <select
          id="view-select"
          value={view}
          onChange={handleViewChange}
          className="p-2 border border-gray-300 rounded mb-2 md:mb-0"
        >
          <option value="facturas-informes">Terminar Justificaciones</option>
          <option value="pendientes">Crear Justificaciones</option>
        </select>
      </div>
    </div>

    <div className="flex flex-col md:flex-row mb-4">
      <input
        type="text"
        placeholder="Buscar por código, fecha o estado"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded mt-2 md:mt-0 md:ml-2"
            onClick={handleClear}
      >
        Limpiar
      </button>
    </div>
  </div>

  {/* Mensaje de carga o error */}
  {loading && <div className="text-center mt-8">Cargando...</div>}
  {error && <div className="text-center mt-8 text-red-500">Error: {error}</div>}

  {/* Contenido principal */}
  {!loading && !error && (
    <>
      {/* Vista en tabla para pantallas grandes */}
      <div className="hidden md:block overflow-x-auto">
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
                  
                    <button
                      onClick={() => handleEditClick(informe.id_informe)}
                      className="p-2 bg-yellow-500 text-white rounded-full mr-2"
                      title="Editar Informe"
                    >
                      <FontAwesomeIcon icon={faFileEdit} />
                    </button>
                    <button
                      onClick={() => handlePDFClick(informe.id_informe)}
                      className="p-2 bg-gray-500 text-white rounded-full mr-2"
                      title="Ver Detalle PDF"
                    >
                      <FontAwesomeIcon icon={faFilePdf} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista en tarjetas para pantallas móviles */}
      <div className="md:hidden">
        {currentItems.map((informe) => (
          <div key={informe.id_informe} className="bg-white p-4 rounded-lg shadow-lg mb-4">
            <h3 className="text-lg font-medium mb-2">Código de Solicitud: {informe.codigo_solicitud}</h3>
            <p><strong>Fecha Informe:</strong> {informe.fecha_informe}</p>
            <p><strong>Estado Factura:</strong> {informe.estado_factura === 0 ? 'Pendiente' : 'Completada'}</p>
            <div className="mt-4">
              {informe.estado_factura === 0 ? (
                <button
                  onClick={() => handleEditClick(informe.id_informe)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full mr-2"
                  title="Editar Informe"
                >
                  <FontAwesomeIcon icon={faFileEdit} />
                </button>
              ) : (
                <button
                  onClick={() => handlePDFClick(informe.id_informe)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full mr-2"
                  title="Ver Detalle PDF"
                >
                  <FontAwesomeIcon icon={faFilePdf} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white font-bold border-b-4 
          border-gray-600 hover:border-gray-500 rounded w-full md:w-auto"
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="text-center md:text-left">{`Página ${currentPage} de ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white font-bold border-b-4 
          border-gray-600 hover:border-gray-500 rounded w-full md:w-auto"
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

export default ListarFacturasInformes;
