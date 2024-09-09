import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faTrash,faFileEdit } from "@fortawesome/free-solid-svg-icons";
import { Modal, Input } from "antd";
import MostrarSolicitud from "./MostrarSolicitudDetalle";
import ListarSolicitudesAceptadas from "./ListarSolicitudesAceptado";
import ListarSolicitudesCanceladas from "./ListarSolicitudesCancelada";
import CrearSolicitud from "./CrearSolicitud";
import API_URL from "../../../Config";
import EditarSolicitudEmpleado from "./EditarSolicitud";

const ListarSolicitudesPendientes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showMostrarSolicitud, setShowMostrarSolicitud] = useState(false);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [showAcceptedRequests, setShowAcceptedRequests] = useState(false);
  const [showCancelledRequests, setShowCancelledRequests] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [solicitudToCancel, setSolicitudToCancel] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [view, setView] = useState("pendientes"); // Estado para manejar la vista actual
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSolicitudId, setEditSolicitudId] = useState(null);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const idUsuario = storedUser.usuario.id_usuario;
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const url = `${API_URL}/Informes/listar-solicitudes/${idUsuario}/`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener solicitudes");

      const data = await response.json();
      setSolicitudes(data.solicitudes);
      setFilteredSolicitudes(data.solicitudes);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleCancelarSolicitud = useCallback(
    async (id_solicitud, motivo) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");

        // Primero, actualizar el estado de la solicitud
        const updateUrl = `${API_URL}/Informes/actualizar-solicitud/${id_solicitud}/`;
        const updateResponse = await fetch(updateUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado_solicitud: "cancelado" }),
        });

        if (!updateResponse.ok)
          throw new Error("Error al cancelar la solicitud");

        // Luego, crear el motivo de cancelación
        const createMotivoUrl = `${API_URL}/Informes/crear-motivo-cancelado/${id_solicitud}/`;
        const createMotivoResponse = await fetch(createMotivoUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ motivo_cancelado: motivo }),
        });

        if (!createMotivoResponse.ok)
          throw new Error("Error al crear el motivo de cancelación");

        console.log("Solicitud cancelada y motivo registrado con éxito");
        fetchSolicitudes();
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [fetchSolicitudes]
  );

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = solicitudes.filter(
      (solicitud) =>
        solicitud["Codigo de Solicitud"].toLowerCase().includes(searchValue) ||
        solicitud["Fecha Solicitud"].toLowerCase().includes(searchValue) ||
        solicitud["Motivo"].toLowerCase().includes(searchValue) ||
        solicitud["Estado"].toLowerCase().includes(searchValue)
    );

    setFilteredSolicitudes(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredSolicitudes(solicitudes);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSolicitudes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

  const handleEditSolicitud = (id_solicitud) => {
    setEditSolicitudId(id_solicitud);
    setShowEditModal(true);
  };
  

  const handleVer = (id_solicitud) => {
    setSelectedSolicitudId(id_solicitud);
    setShowMostrarSolicitud(true);
  };

  const handleCloseMostrarSolicitud = () => {
    setShowMostrarSolicitud(false);
    setSelectedSolicitudId(null);
  };

  const handleShowAcceptedRequests = () => {
    setShowAcceptedRequests(true);
  };

  const handleShowCancelledRequests = () => {
    setShowCancelledRequests(true);
  };

  const handleCreateSolicitud = () => {
    setIsCreating(true);
    setShowMostrarSolicitud(false);
    setShowAcceptedRequests(false);
    setShowCancelledRequests(false);
  };

  const handleCloseCreateSolicitud = () => {
    setIsCreating(false);
    fetchSolicitudes();
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleConfirmCancel = (id_solicitud) => {
    setSolicitudToCancel(id_solicitud);
    setShowCancelModal(true);
  };

  const handleCancelConfirmed = async () => {
    await handleCancelarSolicitud(solicitudToCancel, motivoCancelacion);
    setShowCancelModal(false);
    setSolicitudToCancel(null);
    setMotivoCancelacion("");
  };

  if (isCreating) {
    return <CrearSolicitud onClose={handleCloseCreateSolicitud} />;
  }

  if (view === "aceptadas") {
    return <ListarSolicitudesAceptadas />;
  }

  if (view === "canceladas") {
    return <ListarSolicitudesCanceladas />;
  }

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  return (
    <div className="p-4">
      {showMostrarSolicitud && selectedSolicitudId && (
        <MostrarSolicitud
          id_solicitud={selectedSolicitudId}
          onClose={handleCloseMostrarSolicitud}
        />
      )}

      {showEditModal && editSolicitudId && (
        <EditarSolicitudEmpleado
          id_solicitud={editSolicitudId}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {!showMostrarSolicitud &&
        !showAcceptedRequests &&
        !showCancelledRequests &&
        !isCreating && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-medium flex-1">
                Gestión de Solicitudes
              </h1>
              <div className="flex items-center flex-1 justify-center">
                <label
                  htmlFor="view-select"
                  className="mr-2 text-lg font-light"
                >
                  Ver:
                </label>
                <select
                  id="view-select"
                  value={view}
                  onChange={handleViewChange}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="pendientes">Solicitudes Pendientes</option>
                  <option value="aceptadas">Solicitudes Aceptadas</option>
                  <option value="canceladas">Solicitudes Canceladas</option>
                </select>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCreateSolicitud}
              >
                Crear Solicitud
              </button>
            </div>
            <div className="mb-4">
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Buscar por número, motivo o estado"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                  onClick={handleClear}
                  style={{ minWidth: "80px" }}
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
                    <th className="py-3 px-6 text-left">Fecha Solicitud</th>
                    <th className="py-3 px-6 text-left">Motivo Movilización</th>
                    <th className="py-3 px-6 text-left">Estado Solicitud</th>
                    <th className="py-3 px-6 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {currentItems.map((solicitud) => (
                    <tr
                      key={solicitud["Codigo de Solicitud"]}
                      className="border-b border-gray-300 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {solicitud["Codigo de Solicitud"]}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {solicitud["Fecha Solicitud"]}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {solicitud["Motivo"]}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {solicitud["Estado"]}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <button
                          className="p-2 bg-yellow-500 text-white rounded-full mr-2"
                          title="Editar Solicitud de Movilización"
                          onClick={() => handleEditSolicitud(solicitud.id)}
                        >
                          <FontAwesomeIcon icon={faFileEdit} />
                        </button>

                        <button
                          className="p-2 bg-blue-500 text-white rounded-full mr-2"
                          title="Ver Solicitud de Movilización"
                          onClick={() => handleVer(solicitud.id)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className="p-2 bg-red-500 text-white rounded-full mr-2"
                          title="Cancelar Solicitud de Movilización"
                          onClick={() => handleConfirmCancel(solicitud.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span>{`Página ${currentPage} de ${totalPages}`}</span>
              <button
                onClick={handleNextPage}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
            <Modal
              title="Motivo de cancelación"
              visible={showCancelModal}
              onOk={handleCancelConfirmed}
              onCancel={() => {
                setShowCancelModal(false);
                setMotivoCancelacion("");
              }}
              okText="Confirmar"
              cancelText="Cancelar"
            >
              <p>
                ¿Está seguro de cancelar esta solicitud? Una vez realizada esta
                acción no se podrá revertir.
              </p>
              <Input.TextArea
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                rows={4}
                placeholder="Ingrese el motivo de cancelación"
              />
            </Modal>
          </>
        )}
    </div>
  );
};

export default ListarSolicitudesPendientes;
