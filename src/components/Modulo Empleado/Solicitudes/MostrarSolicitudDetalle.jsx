import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';

const MostrarSolicitud = ({ id_solicitud, onClose }) => {
  const [solicitud, setSolicitud] = useState(null);
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [cuentaBancaria, setCuentaBancaria] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token no encontrado');
          setIsLoading(false);
          return;
        }

        if (!id_solicitud || isNaN(id_solicitud)) {
          setError('ID de solicitud no válido');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/Informes/listar-solicitud-empleado/${id_solicitud}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Datos de la solicitud:', data); // Depuración
          setSolicitud(data.solicitud);
          setDatosPersonales(data.datos_personales);
          setRutas(data.rutas);
          setCuentaBancaria(data.cuenta_bancaria);
        } else {
          const errorData = await response.json();
          console.log('Error al obtener la solicitud:', errorData); // Depuración
          setError(errorData.error || 'Error al obtener la solicitud');
        }
      } catch (error) {
        console.log('Error al obtener la solicitud:', error); // Depuración
        setError('Error al obtener la solicitud: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolicitud();
  }, [id_solicitud]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!solicitud) {
    return <div>No se encontraron datos de la solicitud</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Solicitud de Autorización para Cumplimiento de Servicios Institucionales</h1>
      
      <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2">Datos Generales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Código de Solicitud:</strong> {solicitud['Codigo de Solicitud']}</p>
            <p><strong>Fecha de Solicitud:</strong> {solicitud['Fecha Solicitud']}</p>
            <p><strong>Motivo:</strong> {solicitud['Motivo']}</p>
            <p><strong>Lugar de Servicio:</strong> {solicitud['Lugar de Servicio']}</p>
          </div>
          <div>
            <p><strong>Fecha de Salida:</strong> {solicitud['Fecha de Salida']}</p>
            <p><strong>Hora de Salida:</strong> {solicitud['Hora de Salida']}</p>
            <p><strong>Fecha de Llegada:</strong> {solicitud['Fecha de Llegada']}</p>
            <p><strong>Hora de Llegada:</strong> {solicitud['Hora de Llegada']}</p>
          </div>
        </div>
        <p><strong>Descripción de Actividades:</strong> {solicitud['Descripción de Actividades']}</p>
        <p><strong>Listado de Empleados:</strong> {solicitud['Listado de Empleados']}</p>
      </div>

      {datosPersonales && (
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Datos Personales</h2>
          <p><strong>Nombre:</strong> {datosPersonales.Nombre}</p>
          <p><strong>Cargo:</strong> {datosPersonales.Cargo}</p>
          <p><strong>Unidad:</strong> {datosPersonales.Unidad}</p>
        </div>
      )}

      {rutas.length > 0 && (
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Rutas</h2>
          {rutas.map((ruta, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <h3 className="font-bold">Ruta {index + 1}</h3>
              <p><strong>Tipo de Transporte:</strong> {ruta['Tipo de Transporte']}</p>
              <p><strong>Nombre del Transporte:</strong> {ruta['Nombre del Transporte']}</p>
              <p><strong>Ruta:</strong> {ruta['Ruta']}</p>
              <p><strong>Fecha de Salida:</strong> {ruta['Fecha de Salida']}</p>
              <p><strong>Hora de Salida:</strong> {ruta['Hora de Salida']}</p>
              <p><strong>Fecha de Llegada:</strong> {ruta['Fecha de Llegada']}</p>
              <p><strong>Hora de Llegada:</strong> {ruta['Hora de Llegada']}</p>
            </div>
          ))}
        </div>
      )}

      {cuentaBancaria && (
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Datos para Transferencia</h2>
          <p><strong>Banco:</strong> {cuentaBancaria.Banco}</p>
          <p><strong>Tipo de Cuenta:</strong> {cuentaBancaria['Tipo de Cuenta']}</p>
          <p><strong>Número de Cuenta:</strong> {cuentaBancaria['Número de Cuenta']}</p>
        </div>
      )}

      <button 
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Cerrar
      </button>
    </div>
  );
};

export default MostrarSolicitud;