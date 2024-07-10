import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import TablaLicencias from "./Tablas/tablalicencias";
import AgregarLicencia from "./agregarlicencia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const GestionLicencias = () => {
  const [licencias, setLicencias] = useState([]);
  const [filteredLicencias, setFilteredLicencias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedLicencia, setSelectedLicencia] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isHabilitarLicenciaVisible, setIsHabilitarLicenciaVisible] =
    useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
      fetchLicencias(id_usuario);
    }
  }, []);

  const fetchLicencias = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/Licencias/listar-tipos/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setLicencias(data.tipos_licencias);
        setFilteredLicencias(data.tipos_licencias);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        console.error("Error al obtener licencias:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener licencias:", error);
    }
  };

  const handleAddLicencia = () => {
    setIsAdding(true);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setSelectedLicencia(null);
  };

  const handleLicenciaAdded = async () => {
    await fetchLicencias(userId);  // Refetch licencias to include the new one
    setIsAdding(false);
  };

  const handleEditLicencia = (licencia) => {
    setSelectedLicencia(licencia);
  };

  const handleLicenciaUpdated = async () => {
    await fetchLicencias(userId);  // Refetch licencias to include the updated one
    setSelectedLicencia(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = licencias.filter((licencia) =>
      licencia.tipo_licencia
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    setFilteredLicencias(filtered);
    setCurrentPage(1);
  };

  const handleHabilitarLicencias = () => {
    setIsHabilitarLicenciaVisible(true);
  };

  const handleVolver = () => {
    setIsHabilitarLicenciaVisible(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLicencias.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredLicencias.length / itemsPerPage);

  return (
    <div className="p-4">
      {selectedLicencia ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <EditarLicencia
            licencia={selectedLicencia}
            onClose={handleCloseForm}
            onLicenciaUpdated={handleLicenciaUpdated}
            userId={userId}
          />
        </div>
      ) : isAdding ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <AgregarLicencia
            onClose={handleCloseForm}
            onLicenciaAdded={handleLicenciaAdded}
            onLicenciaUpdated={handleLicenciaUpdated}
            userId={userId}
          />
        </div>
      ) : isHabilitarLicenciaVisible ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <HabilitarLicencia
            userId={userId}
            fetchLicencias={() => fetchLicencias(userId)}
            onVolver={handleVolver}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h1 className="text-2xl font-light">Gestión de Licencias</h1>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={handleAddLicencia}
                className="
                bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-300 rounded"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Licencia
              </button>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar por tipo de licencia"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <TablaLicencias
            licencias={currentItems}
            onEditLicencia={handleEditLicencia}
            userId={userId}
          />
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="text-center md:text-left">{`Página ${currentPage} de ${totalPages}`}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
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

export default GestionLicencias;
