import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import TablaCiudades from "./Tablas/tablaciudades";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const GestionCiudades = ({ id_provincia }) => {
  const [ciudades, setCiudades] = useState([]);
  const [filteredCiudades, setFilteredCiudades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCiudad, setSelectedCiudad] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
      fetchCiudades(id_usuario, id_provincia);
    }
  }, [id_provincia]);

  const fetchCiudades = async (id_usuario, id_provincia) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/Ciudades/ciudades/${id_usuario}/${id_provincia}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCiudades(data);
        setFilteredCiudades(data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        console.error("Error al obtener ciudades:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
    }
  };

  const handleAddCiudad = () => {
    setIsAdding(true);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setSelectedCiudad(null);
  };

  const handleCiudadAdded = async () => {
    await fetchCiudades(userId, id_provincia); // Refetch ciudades to include the new one
    setIsAdding(false);
  };

  const handleEditCiudad = (ciudad) => {
    setSelectedCiudad(ciudad);
  };

  const handleCiudadUpdated = async () => {
    await fetchCiudades(userId, id_provincia); // Refetch ciudades to include the updated one
    setSelectedCiudad(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = ciudades.filter((ciudad) =>
      ciudad.ciudad.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredCiudades(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCiudades.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCiudades.length / itemsPerPage);

  return (
    <div className="p-4">
      {selectedCiudad ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <EditarCiudad
            ciudad={selectedCiudad}
            onClose={handleCloseForm}
            onCiudadUpdated={handleCiudadUpdated}
            userId={userId}
          />
        </div>
      ) : isAdding ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <AgregarCiudad
            onClose={handleCloseForm}
            onCiudadAdded={handleCiudadAdded}
            userId={userId}
            id_provincia={id_provincia}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h1 className="text-2xl font-light">Gestión de Ciudades</h1>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={handleAddCiudad}
                className="
                bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-300 rounded"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Ciudad
              </button>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar por nombre de ciudad"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <TablaCiudades
            ciudades={currentItems}
            onEditCiudad={handleEditCiudad}
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

export default GestionCiudades;
