import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import TablaVehiculos from "./Tablas/tablavehiculos";
import AgregarVehiculo from "./agregarvehiculo";
import HabilitarVehiculo from "./habilitarvehiculo";
import EditarVehiculo from "./editarvehiculo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import FormularioRegistrarKilometraje from "../Mantenimiento/Formularios/formulariomantenimiento";
import ListarKilometrajes from "../Mantenimiento/Tablas/ListarKilometrajes";

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
  const [isHabilitarVehiculoVisible, setIsHabilitarVehiculoVisible] = useState(false);
  const [isKilometrajeFormVisible, setIsKilometrajeFormVisible] = useState(false); // Estado para mostrar el formulario
  const [selectedVehiculoForKilometraje, setSelectedVehiculoForKilometraje] = useState(null); // Vehículo seleccionado para el formulario
  const [isListarKilometrajesVisible, setIsListarKilometrajesVisible] = useState(false); // Nuevo estado


  const [reporteFilters, setReporteFilters] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    vehiculo: '',
    empleado: '',
    evento: ''
  });


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

  const handleGenerarReporte = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userId) return;
  
    try {
      const formData = new FormData();
      Object.entries(reporteFilters).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
  
      const response = await fetch(`${API_URL}/Mantenimientos/reporte-kilometraje/${userId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `${token}`,
        },
        body: formData
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_kilometraje.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Error al generar el reporte');
      }
    } catch (error) {
      console.error('Error:', error);
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

  const handleKilometraje = (vehiculo) => {
    setSelectedVehiculoForKilometraje(vehiculo);
    setIsKilometrajeFormVisible(true); // Mostrar el formulario
  };

  const handleCloseKilometrajeForm = () => {
    setIsKilometrajeFormVisible(false); // Cerrar el formulario
    setSelectedVehiculoForKilometraje(null);
  };

  const handleHistorialMantenimiento = (vehiculo) => {
    setSelectedVehiculoForKilometraje(vehiculo); // Establecer el vehículo seleccionado
    setIsListarKilometrajesVisible(true); // Mostrar el componente ListarKilometrajes
    setIsKilometrajeFormVisible(false); // Asegurarse de que el formulario no se muestre
  };


  const handleVolverHistorial = () => {
    setIsListarKilometrajesVisible(false);  // Cerrar el listado de kilometrajes
    setIsKilometrajeFormVisible(false);  // Asegurarse de que el formulario también esté cerrado
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehiculos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredVehiculos.length / itemsPerPage);

  return (
    <div className="p-4 mt-16">
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
      ) : isKilometrajeFormVisible ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <FormularioRegistrarKilometraje
            vehiculo={selectedVehiculoForKilometraje}
            onClose={handleCloseKilometrajeForm}
            handleCancel={handleCloseKilometrajeForm}  // Esta es la misma función que se pasa como handleCancel
          />
        </div>
      ) : isListarKilometrajesVisible ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <ListarKilometrajes
            vehiculo={selectedVehiculoForKilometraje}
            handleCancel={handleVolverHistorial}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h1 className="text-2xl font-light text-center md:text-left">Gestión de Vehículos</h1>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              {/* Botón existente para vehículos deshabilitados */}
              <button
                onClick={handleHabilitarVehiculos}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-300 rounded w-full md:w-auto text-center"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Ver Vehículos Deshabilitados
              </button>

              {/* Nuevo botón para generar reporte */}
              <button
                onClick={handleGenerarReporte}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 border-b-4 border-purple-700 hover:border-purple-300 rounded w-full md:w-auto text-center"
              >
                <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                Generar Reporte
              </button>

              {/* Botón existente para agregar vehículo */}
              <button
                onClick={handleAddVehiculo}
                className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-300 rounded w-full md:w-auto text-center"
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
            onKilometraje={handleKilometraje} // Pasar la función de manejar el clic
            onHistorialMantenimiento={handleHistorialMantenimiento}

          />
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1
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
