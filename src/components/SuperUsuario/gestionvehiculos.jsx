import React, { useState, useEffect } from "react";
import API_URL from "../../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TablaVehiculos from "./tablavehiculos";
import AgregarVehiculo from "./agregarvehiculo";

const GestionVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [userId, setUserId] = useState(null);

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
    if (!token) {
      return;
    }

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
        console.error("Error al obtener vehículos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = vehiculos.filter((vehiculo) => {
      const placa = vehiculo.placa.toLowerCase();
      return (
        placa.includes(searchValue)
      );
    });

    setFilteredVehiculos(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredVehiculos(vehiculos);
    setCurrentPage(1);
  };

  const handleAddVehiculo = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehiculos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredVehiculos.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex-grow flex flex-col items-center p-4">
      <h1 className="text-2xl font-light mb-4">Gestión de Vehículos</h1>
      {isAdding ? (
        <AgregarVehiculo
          onClose={handleCancelAdd}
          onVehiculoAdded={() => {
            if (userId) {
              fetchVehiculos(userId);
            }
            setIsAdding(false);
          }}
          userId={userId}
        />
      ) : (
        <>
          <div className="w-full flex flex-wrap md:flex-nowrap mb-4 items-center">
            <div className="flex w-full md:w-3/4">
              <input
                type="text"
                placeholder="Placa"
                value={searchTerm}
                onChange={handleSearch}
                className="p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button
                className="p-2 text-white focus:outline-none bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                onClick={handleClear}
                style={{
                  minWidth: "80px",
                  borderRadius: "0 0.375rem 0.375rem 0",
                }}
              >
                Limpiar
              </button>
            </div>
            <button
              className="mt-2 md:mt-0 md:ml-2 p-2 focus:outline-none w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-700 rounded"
              onClick={handleAddVehiculo}
              style={{ minWidth: "200px" }}
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar Vehículo
            </button>
          </div>
          <TablaVehiculos vehiculos={currentItems} />
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handleClick(index + 1)}
                className={`mx-1 px-3 py-1 border rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
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
