import React, { useState, useEffect } from "react";
import { notification } from 'antd'; // Importar notificación
import API_URL from "../../../Config";
import TablaEmpleadosJefes from "./Tablas/tablaempleadosjefes";

const GestionEmpleadosJefes = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      fetchEmpleados(storedUser.usuario.id_usuario);
    }
  }, []);

  const fetchEmpleados = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/Empleados/lista-empleados-administrador/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEmpleados(data);
        setFilteredEmpleados(data);
      } else {
        console.error("Error al obtener empleados:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const asignarJefe = async (empleado) => {
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("id_empleado", empleado.id_empleado);

      const response = await fetch(`${API_URL}/Jefes/asignar_jefe_unidad/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Mostrar notificación de éxito
        notification.success({
          message: 'Éxito',
          description: `Jefe asignado exitosamente a ${empleado.nombres} ${empleado.apellidos}.`,
          placement: 'topRight', // Ubicación de la notificación
        });
        fetchEmpleados(JSON.parse(localStorage.getItem("user")).usuario.id_usuario); // Actualizar la lista
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: `Error: ${errorData.error}`,
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error("Error al asignar jefe:", error);
      notification.error({
        message: 'Error',
        description: 'Error al asignar jefe.',
        placement: 'topRight',
      });
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = empleados.filter((empleado) => {
      const fullName = `${empleado.nombres.toLowerCase()} ${empleado.apellidos.toLowerCase()}`;
      const cedula = empleado.cedula.toLowerCase();
      return fullName.includes(searchValue) || cedula.includes(searchValue);
    });

    setFilteredEmpleados(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredEmpleados(empleados);
    setCurrentPage(1);
  };

  const asignarDirector = async (empleado) => {
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("id_empleado", empleado.id_empleado);

      const response = await fetch(`${API_URL}/Jefes/asignar_director_estacion/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Mostrar notificación de éxito
        notification.success({
          message: 'Éxito',
          description: `Director asignado exitosamente a ${empleado.nombres} ${empleado.apellidos}.`,
          placement: 'topRight', // Ubicación de la notificación
        });
        fetchEmpleados(JSON.parse(localStorage.getItem("user")).usuario.id_usuario); // Actualizar la lista
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: `Error: ${errorData.error}`,
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error("Error al asignar director:", error);
      notification.error({
        message: 'Error',
        description: 'Error al asignar director.',
        placement: 'topRight',
      });
    }
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmpleados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmpleados.length / itemsPerPage);

  return (
    <div className="p-4 mt-16">
      <h1 className="text-2xl font-light">Gestión de Empleados</h1>

      <div className="mb-4">
        <div className="flex flex-col md:flex-row">
          <input
            type="text"
            placeholder="Buscar por nombres, apellidos o cédula"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded mt-2 md:mt-0 md:ml-2"
            onClick={handleClear}
            style={{ minWidth: "80px" }}
          >
            Limpiar
          </button>
        </div>
      </div>

      <TablaEmpleadosJefes
        empleados={currentItems}
        asignarJefe={asignarJefe}
        asignarDirector={asignarDirector}
      />

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
        >
          Anterior
        </button>
        <div className="text-center text-gray-700">
          Página {currentPage} de {totalPages}
        </div>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default GestionEmpleadosJefes;
