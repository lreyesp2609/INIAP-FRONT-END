import React, { useState, useEffect, useRef } from "react";
import API_URL from "../../../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TablaEstaciones from "./Tablas/tablaestaciones";
import EditarEstacion from "./editarestacion";
import AgregarEstacion from "./agregarestacion";
import GestionUnidadesPorEstacion from "../Unidades/gestionunidades";

const GestionEstaciones = () => {
  const [estaciones, setEstaciones] = useState([]);
  const [filteredEstaciones, setFilteredEstaciones] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [estacionToEdit, setEstacionToEdit] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAddingUnidad, setIsAddingUnidad] = useState(false);

  const forceUpdate = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
      fetchEstaciones(id_usuario);
    }
  }, []);

  useEffect(() => {
    forceUpdate.current = forceUpdate.current + 1;
  }, [estaciones]);

  const fetchEstaciones = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/Estaciones/estaciones/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEstaciones(data);
        setFilteredEstaciones(data);
      } else {
        console.error("Error al obtener estaciones:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener estaciones:", error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = estaciones.filter((estacion) => {
      const nombre_estacion = estacion.nombre_estacion.toLowerCase();
      return nombre_estacion.includes(searchValue);
    });

    setFilteredEstaciones(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredEstaciones(estaciones);
    setCurrentPage(1);
  };

  const handleAddEstacion = () => {
    setIsAdding(true);
  };

  const handleEditEstacion = (estacion) => {
    setEstacionToEdit(estacion);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEstacionToEdit(null);
  };

  const handleEstacionAdded = () => {
    setIsAdding(false);
    fetchEstaciones(userId);
  };

  const handleActualizacion = () => {
    fetchEstaciones(userId);
    setIsEditing(false);
  };

  const handleAgregarUnidades = (estacion) => {
    setEstacionToEdit(estacion);
    setIsAddingUnidad(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstaciones.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEstaciones.length / itemsPerPage);

  return (
    <div className="p-4">
      {isAdding ? (
        <AgregarEstacion
          onClose={() => setIsAdding(false)}
          onEstacionAdded={handleEstacionAdded}
          userId={userId}
        />
      ) : isEditing ? (
        <EditarEstacion
          estacion={estacionToEdit}
          onCancel={handleCancelEdit}
          onActualizacion={handleActualizacion}
        />
      ) : isAddingUnidad ? (
        <GestionUnidadesPorEstacion
          onClose={() => setIsAddingUnidad(false)}
          onUnidadAdded={() => {
            setIsAddingUnidad(false);
            fetchEstaciones(userId);
          }}
          id_estacion={estacionToEdit.id_estacion}
          id_usuario={userId}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h1 className="text-2xl font-light">Gestión de Estaciones</h1>
            <div className="flex space-x-4">
              <button
                onClick={handleAddEstacion}
                className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-300 rounded"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Estación
              </button>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nombre de la estación"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <TablaEstaciones
            currentItems={currentItems}
            onEditEstacion={handleEditEstacion}
            onAgregarUnidades={handleAgregarUnidades}
          />
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="
              bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
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

export default GestionEstaciones;
