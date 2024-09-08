import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';

const VerSolicitudMovilizacion = ({ orderId, onClose }) => {
  const [detalleOrden, setDetalleOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const idUsuario = storedUser?.usuario?.id_usuario;

  // Función para obtener detalles de la orden
  const fetchDetalleOrden = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const response = await fetch(`${API_URL}/OrdenesMovilizacion/detalle-orden/${idUsuario}/${orderId}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener el detalle de la orden');
      }

      const data = await response.json();
      setDetalleOrden(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Función para obtener la lista de conductores
  const fetchConductores = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

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
      console.error('Error fetching conductors:', error);
    }
  };

  // Función para obtener la lista de vehículos
  const fetchVehiculos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

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
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchDetalleOrden();
    fetchConductores();
    fetchVehiculos();
  }, [idUsuario, orderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getYearFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const getConductor = (idConductor) => {
    return conductores.find((c) => c.id_empleado === idConductor) || {};
  };

  const conductor = getConductor(detalleOrden.id_conductor);

  const getFuncionario = (idFuncionario) => {
    return conductores.find((c) => c.id_empleado === idFuncionario) || {};
  };

  const funcionario = getFuncionario(detalleOrden.id_empleado);

  const getVehiculo = (idVehiculo) => {
    return vehiculos.find((v) => v.id_vehiculo === idVehiculo) || {};
  };

  const vehiculo = getVehiculo(detalleOrden.id_vehiculo);

  return (
    <div className="p-4 sm:p-6">
  <h2 className="text-2xl font-bold mb-4 text-center">Detalle de la Solicitud de Movilización</h2>
  {detalleOrden ? (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <tbody>
            <tr>
              <td colSpan="2" className="text-center font-semibold">ORDEN DE MOVILIZACIÓN</td>
            </tr>
            <tr>
              <td colSpan="2" className="text-center">ESTACIÓN EXPERIMENTAL TROPICAL PICHILINGUE</td>
            </tr>
            <tr>
              <td className="w-1/2 p-2">Secuencial: {detalleOrden.secuencial_orden_movilizacion}/{getYearFromDate(detalleOrden.fecha_hora_emision)}</td>
              <td className="w-1/2 p-2"><strong>Marca/Tipo: </strong>{vehiculo.marca}</td>
            </tr>
            <tr>
              <td className="w-1/2 p-2"><strong>Lugar, fecha y hora de emisión: </strong> Mocache, {detalleOrden.fecha_hora_emision}</td>
              <td className="w-1/2 p-2"><strong>Color: </strong>{vehiculo.color_primario}</td>
            </tr>
            <tr>
              <td className="w-1/2 p-2"><strong>Motivo de Movilización: </strong>{detalleOrden.motivo_movilizacion}</td>
              <td className="w-1/2 p-2"><strong>Placa N°: </strong>{vehiculo.placa}</td>
            </tr>
            <tr>
              <td className="w-1/2 p-2"><strong>Origen y destino: </strong>{detalleOrden.lugar_origen_destino_movilizacion}</td>
              <td className="w-1/2 p-2"><strong>Matrícula: </strong>{vehiculo.numero_matricula}</td>
            </tr>
            <tr>
              <td className="w-1/2 p-2">
                <strong>Conductor: </strong> {conductor.nombres} {conductor.apellidos}<br />
                <strong>Cédula: </strong>{conductor.cedula}
              </td>
              <td className="w-1/2 p-2"><strong>Motor: </strong>{vehiculo.numero_motor}</td>
            </tr>
            <tr>
              <td className="w-1/2 p-2">
                <strong>Funcionario: </strong> {funcionario.nombres} {funcionario.apellidos}<br />
                <strong>Cédula: </strong>{funcionario.cedula}
              </td>
              <td className="w-1/2 p-2"><strong>Año: </strong>{vehiculo.anio_fabricacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <p>No se encontraron detalles para esta solicitud.</p>
  )}
  <button
    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    onClick={onClose}
  >
    Volver
  </button>
</div>

  );
};

export default VerSolicitudMovilizacion;
