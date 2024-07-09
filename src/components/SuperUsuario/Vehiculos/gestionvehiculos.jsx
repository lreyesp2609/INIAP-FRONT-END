import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import TablaVehiculos from "./Tablas/tablavehiculos";
import AgregarVehiculo from "./agregarvehiculo";
import HabilitarVehiculo from "./habilitarvehiculo";
import EditarVehiculo from "./editarvehiculo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye } from "@fortawesome/free-solid-svg-icons";

const GestionVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isHabilitarVehiculoVisible, setIsHabilitarVehiculoVisible] =
    useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
      fetchVehiculos(id_usuario);
    }
  }, []);

  const fetchVehiculos = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/Vehiculos/vehiculos/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVehiculos(data.vehiculos);
        setFilteredVehiculos(data.vehiculos);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        console.error("Error al obtener vehículos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
    }
  };

  const handleAddVehiculo = () => {
    setIsAdding(true);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setSelectedVehiculo(null);
  };

  const handleVehiculoAdded = () => {
    fetchVehiculos(userId);
    setIsAdding(false);
  };

  const handleEditVehiculo = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
  };

  const handleVehiculoUpdated = () => {
    fetchVehiculos(userId);
    setSelectedVehiculo(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = vehiculos.filter((vehiculo) =>
      vehiculo.placa.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredVehiculos(filtered);
    setCurrentPage(1);
  };

  const handleHabilitarVehiculos = () => {
    setIsHabilitarVehiculoVisible(true);
  };

  const handleVolver = () => {
    setIsHabilitarVehiculoVisible(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehiculos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredVehiculos.length / itemsPerPage);

  return (
    <div className="p-4">
      {selectedVehiculo ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <EditarVehiculo
            vehiculo={selectedVehiculo}
            onClose={handleCloseForm}
            onVehiculoUpdated={handleVehiculoUpdated}
            userId={userId}
          />
        </div>
      ) : isAdding ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <AgregarVehiculo
            onClose={handleCloseForm}
            onVehiculoAdded={handleVehiculoAdded}
            userId={userId}
          />
        </div>
      ) : isHabilitarVehiculoVisible ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <HabilitarVehiculo
            userId={userId}
            fetchVehiculos={() => fetchVehiculos(userId)}
            onVolver={handleVolver}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-light">Gestión de Vehículos</h1>
            <div className="flex space-x-4">
              <button
                onClick={handleHabilitarVehiculos}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-400"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Ver Vehículos Deshabilitados
              </button>
              <button
                onClick={handleAddVehiculo}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Vehículo
              </button>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por placa"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          {errorMessage && (
            <div className="mb-4 text-red-500">{errorMessage}</div>
          )}
          <TablaVehiculos
            vehiculos={currentItems}
            onEditVehiculo={handleEditVehiculo}
            userId={userId}
            fetchVehiculos={fetchVehiculos}
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

export default GestionVehiculos;
