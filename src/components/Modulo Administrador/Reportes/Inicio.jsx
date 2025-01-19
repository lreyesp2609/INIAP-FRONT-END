import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import FormularioReporteOrdenes from './Formularios/FormularioReporteOrdenes';
import FormularioReporteInformes from './Formularios/FormularioReporteInformes';
import FormularioReporteFacturas from './Formularios/FormularioReporteFacturas';
import API_URL from '../../../Config';


const Reportes = () => {
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [error, setError] = useState(null);
  const [provincias, setProvincias] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const idUsuario = storedUser?.usuario?.id_usuario;

  useEffect(() => {
    fetchVehiculos();
    fetchConductores();
    fetchRutas();
    fetchProvinciasYCiudades();
  }, []);

  const fetchProvinciasYCiudades = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notification.error({ message: 'Token no encontrado' });
        return;
      }

      const response = await fetch(`${API_URL}/Informes/listar-provincias-ciudades/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProvincias(data.provincias_ciudades || []);
      } else {
        const errorData = await response.json();
        notification.error({ message: errorData.error || 'Error al obtener provincias y ciudades' });
      }
    } catch (error) {
      notification.error({ message: 'Error al obtener provincias y ciudades: ' + error.message });
    }
  };

  const fetchRutas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'Token no proporcionado',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/listar-rutas/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRutas(data.rutas);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        notification.error({
          message: 'Error',
          description: errorData.error,
        });
      }
    } catch (error) {
      setError(error.toString());
      notification.error({
        message: 'Error',
        description: 'Error al obtener las rutas',
      });
    }
  };

  const fetchVehiculos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/Vehiculos/vehiculos/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener vehículos');
      }
      const data = await response.json();
      setVehiculos(data.vehiculos);
    } catch (error) {
      setError('Error al obtener vehículos');
      notification.error({
        message: 'Error',
        description: 'No se pudo obtener la lista de vehículos.',
        placement: 'topRight',
      });
      console.error('Error fetching vehiculos:', error);
    }
  };

  const fetchConductores = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/Empleados/lista-empleados/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener conductores');
      }
      const data = await response.json();
      setConductores(data);
    } catch (error) {
      setError('Error al obtener conductores');
      notification.error({
        message: 'Error',
        description: 'No se pudo obtener la lista de conductores.',
        placement: 'topRight',
      });
      console.error('Error fetching conductores:', error);
    }
  };



  return (
    <div className="p-4 mt-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Generar Reportes</h2>
      <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
        <FormularioReporteOrdenes
          rutas={rutas}
          vehiculos={vehiculos}
          conductores={conductores}
          empleados={conductores}
          idUsuario={idUsuario}
        />
      </div>
      {/* Reporte de Informes */}
      <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
        <FormularioReporteInformes
          empleados={conductores}
          provincias={provincias}
          idUsuario={idUsuario}
        />
      </div>

      {/* Reporte de Facturas */}
      <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
        <FormularioReporteFacturas
          empleados={conductores}
          idUsuario={idUsuario}
        />
      </div>
    </div>
  );
};

export default Reportes;
