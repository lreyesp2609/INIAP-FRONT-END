import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import TablaProvincias from "./Tablas/tablaprovincias";
import AgregarProvincia from "./agregarprovincia";
import EditarProvincia from "./editarprovincia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const GestionProvincias = () => {
  const [provincias, setProvincias] = useState([]);
  const [filteredProvincias, setFilteredProvincias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
      fetchProvincias(id_usuario);
    }
  }, []);

  const fetchProvincias = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/Provincias/listar_provincias/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProvincias(data);
        setFilteredProvincias(data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        console.error("Error al obtener provincias:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener provincias:", error);
    }
  };

  const handleAddProvincia = () => {
    setIsAdding(true);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setSelectedProvincia(null);
  };

  const handleProvinciaAdded = async () => {
    await fetchProvincias(userId);  // Refetch provincias to include the new one
    setIsAdding(false);
  };

  const handleEditProvincia = (provincia) => {
    setSelectedProvincia(provincia);
  };

  const handleProvinciaUpdated = async () => {
    await fetchProvincias(userId);  // Refetch provincias to include the updated one
    setSelectedProvincia(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = provincias.filter((provincia) =>
      provincia.provincia
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    setFilteredProvincias(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProvincias.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProvincias.length / itemsPerPage);

  return (
    <div className="p-4">
      {selectedProvincia ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <EditarProvincia
            provincia={selectedProvincia}
            onClose={handleCloseForm}
            onProvinciaUpdated={handleProvinciaUpdated}
            userId={userId}
          />
        </div>
      ) : isAdding ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <AgregarProvincia
            onClose={handleCloseForm}
            onProvinciaAdded={handleProvinciaAdded}
            userId={userId}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h1 className="text-2xl font-light">Gestión de Provincias</h1>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={handleAddProvincia}
                className="
                bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-300 rounded"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Provincia
              </button>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar por nombre de provincia"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <TablaProvincias
            provincias={currentItems}
            onEditProvincia={handleEditProvincia}
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

export default GestionProvincias;
