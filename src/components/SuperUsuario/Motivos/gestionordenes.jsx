import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import TablaOrdenes from "./Tablas/tablaordenes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import AgregarMotivo from "./agregarmotivo";

const GestionOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filteredOrdenes, setFilteredOrdenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isHabilitarOrdenVisible, setIsHabilitarOrdenVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
      fetchOrdenes(id_usuario);
    }
  }, []);

  const fetchOrdenes = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/MotivosOrdenes/listar-motivos/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOrdenes(data.motivos);
        setFilteredOrdenes(data.motivos);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        console.error("Error al obtener órdenes:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    }
  };

  const handleAddOrden = () => {
    setIsAdding(true);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setSelectedOrden(null);
  };

  const handleMotivoAdded = () => {
    fetchOrdenes(userId);
    setIsAdding(false);
  };

  const handleEditOrden = (orden) => {
    setSelectedOrden(orden);
  };

  const handleOrdenUpdated = () => {
    fetchOrdenes(userId);
    setSelectedOrden(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = ordenes.filter((orden) =>
      orden.nombre_motivo.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredOrdenes(filtered);
    setCurrentPage(1);
  };

  const handleHabilitarOrdenes = () => {
    setIsHabilitarOrdenVisible(true);
  };

  const handleVolver = () => {
    setIsHabilitarOrdenVisible(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrdenes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredOrdenes.length / itemsPerPage);

  return (
    <div className="p-4">
      {selectedOrden ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <EditarOrden
            orden={selectedOrden}
            onClose={handleCloseForm}
            onOrdenUpdated={handleOrdenUpdated}
            userId={userId}
          />
        </div>
      ) : isAdding ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <AgregarMotivo
            onClose={handleCloseForm}
            onMotivoAdded={handleMotivoAdded}
            userId={userId}
          />
        </div>
      ) : isHabilitarOrdenVisible ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <HabilitarOrden
            userId={userId}
            fetchOrdenes={() => fetchOrdenes(userId)}
            onVolver={handleVolver}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h1 className="text-2xl font-light">Gestión de Órdenes</h1>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={handleHabilitarOrdenes}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 border-b-4 
                border-yellow-700 hover:border-yellow-300 rounded"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Ver Órdenes Deshabilitadas
              </button>
              <button
                onClick={handleAddOrden}
                className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 
                border-b-4 border-green-900 hover:border-green-300 rounded"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Orden
              </button>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por motivo"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          {errorMessage && (
            <div className="mb-4 text-red-500">{errorMessage}</div>
          )}
          <TablaOrdenes
            ordenes={currentItems}
            onEditOrden={handleEditOrden}
            userId={userId}
            fetchOrdenes={fetchOrdenes}
          />
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-1 px-3 py-1 border rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GestionOrdenes;
