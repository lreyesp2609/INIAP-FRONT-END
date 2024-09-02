import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TablaUnidades from "./Tablas/tablaunidades";
import GestionCargos from "../Cargos/gestioncargos";
import AgregarUnidad from "./agregarunidad";
import EditarUnidad from "./editarunidad";

const GestionUnidadesPorEstacion = () => {
  const [unidades, setUnidades] = useState([]);
  const [filteredUnidades, setFilteredUnidades] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // Estado para manejar el componente AgregarUnidad
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userId, setUserId] = useState(null);
  const [unidadToEdit, setUnidadToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
      fetchUnidades(id_usuario);
    }
  }, []);

  const fetchUnidades = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const formData = new FormData();

      const response = await fetch(`${API_URL}/Unidades/unidades/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUnidades(data);
        setFilteredUnidades(data);
        setError(null);
      } else {
        const errorMessage = await response.text();
        throw new Error(`Error al obtener unidades: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error al obtener unidades:", error.message);
      setError(error.message);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = unidades.filter((unidad) =>
      unidad.nombre.toLowerCase().includes(searchValue)
    );

    setFilteredUnidades(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredUnidades(unidades);
    setCurrentPage(1);
  };

  const handleAddUnidad = () => {
    setIsAdding(true); // Activar el modo "Agregar Unidad"
  };

  const handleUnidadAdded = () => {
    setIsAdding(false); // Desactivar el modo "Agregar Unidad" después de agregar una unidad
    fetchUnidades(); // Refrescar la lista de unidades
  };
  const handleEditUnidad = (unidad) => {
    setUnidadToEdit(unidad);
    setIsEditing(true);
  };
  const handleCancelAddUnidad = () => {
    setIsAdding(false); // Desactivar el modo "Agregar Unidad" si se cancela
  };

  const handleAddCargos = (unidad) => {
    setSelectedUnidad(unidad);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUnidades.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUnidades.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (selectedUnidad) {
    return (
      <GestionCargos
        id_usuario={userId}
        id_unidad={selectedUnidad.id_unidad}
        onClose={() => setSelectedUnidad(null)}
      />
    );
  }

  // Mostrar el componente AgregarUnidad si isAdding es true
  if (isAdding) {
    return <AgregarUnidad onUnidadAdded={handleUnidadAdded} onCancel={handleCancelAddUnidad} />;
  }
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUnidadToEdit(null);
  };

  const handleActualizacion = () => {
    fetchUnidades(userId);
    setIsEditing(false);
  };
  return (
    <div className="p-4">
      {isEditing ?(  <EditarUnidad
          unidad={unidadToEdit}
          onCancel={handleCancelEdit}
          onActualizacion={handleActualizacion}
        /> ):(
          <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-light">Gestionar Unidades</h1>
        <button
          onClick={handleAddUnidad}
          className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-300 rounded"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Agregar Unidad
        </button>
      </div>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Buscar unidad"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleClear}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded mt-2 md:mt-0 md:ml-2"
        >
          Limpiar
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <TablaUnidades unidades={currentItems} onEditUnidad={handleEditUnidad} />
      <div className="flex justify-between items-center mt-4">
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
      </>
      )}
    </div>
  );
};

export default GestionUnidadesPorEstacion;
