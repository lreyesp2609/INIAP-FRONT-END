import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../Config';

const CrearSolicitud = ({ onClose, idEmpleado }) => {
  const [motivo, setMotivo] = useState('');
  const [motivos, setMotivos] = useState([]);
  const [fechaSalida, setFechaSalida] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [fechaLlegada, setFechaLlegada] = useState('');
  const [horaLlegada, setHoraLlegada] = useState('');
  const [actividades, setActividades] = useState('');
  const [listadoEmpleados, setListadoEmpleados] = useState('');
  const [codigoSolicitud, setCodigoSolicitud] = useState('');
  const [fechaHoraPrevisualizacion, setFechaHoraPrevisualizacion] = useState('');
  const [error, setError] = useState(null);
  const [datosPersonales, setDatosPersonales] = useState(null);
  const navigate = useNavigate();
  const [lugarServicio, setLugarServicio] = useState('');


  // Función para obtener la previsualización del código de solicitud y datos personales
  const fetchPrevisualizacion = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token no encontrado');
        return;
      }

      // Obtener previsualización del código de solicitud
      const responseCodigo = await fetch(`${API_URL}/Informes/previsualizar-codigo-solicitud/${idUsuario}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseCodigo.ok) {
        const dataCodigo = await responseCodigo.json();
        if (dataCodigo.previsualizacion) {
          setCodigoSolicitud(dataCodigo.previsualizacion['Codigo de Solicitud'] || '');
          setFechaHoraPrevisualizacion(dataCodigo.previsualizacion['Fecha y Hora de Previsualización'] || '');
        } else {
          setError('Datos de previsualización no encontrados');
        }
      } else {
        const errorCodigo = await responseCodigo.json();
        setError(errorCodigo.error || 'Error al obtener la previsualización del código de solicitud');
      }

      // Obtener datos personales
      const responseDatos = await fetch(`${API_URL}/Informes/listar-datos-personales/${idUsuario}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseDatos.ok) {
        const dataDatos = await responseDatos.json();
        if (dataDatos.datos_personales) {
          setDatosPersonales(dataDatos.datos_personales);
        } else {
          setError('Datos personales no encontrados');
        }
      } else {
        const errorDatos = await responseDatos.json();
        setError(errorDatos.error || 'Error al obtener datos personales');
      }

    } catch (error) {
      setError('Error al obtener datos: ' + error.message);
    }
  };

  useEffect(() => {
    fetchPrevisualizacion();
  }, []);

  const fetchMotivos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token no encontrado');
        return;
      }

      const response = await fetch(`${API_URL}/Informes/listar-motivos/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMotivos(data.motivos || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al obtener los motivos');
      }
    } catch (error) {
      setError('Error al obtener motivos: ' + error.message);
    }
  };

  useEffect(() => {
    fetchMotivos(); // Cargar los motivos al montar el componente
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const formattedFechaSalida = fechaSalida ? fechaSalida : null;
    const formattedFechaLlegada = fechaLlegada ? fechaLlegada : null;

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const idUsuario = storedUser.usuario.id_usuario;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/Informes/crear-solicitud/${idUsuario}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          motivo_movilizacion: motivo,
          fecha_salida_solicitud: formattedFechaSalida,
          hora_salida_solicitud: horaSalida,
          fecha_llegada_solicitud: formattedFechaLlegada,
          hora_llegada_solicitud: horaLlegada,
          descripcion_actividades: actividades,
          listado_empleado: listadoEmpleados,
          lugar_servicio: lugarServicio,  // Agregar lugar_servicio al cuerpo del request
          id_empleado: idEmpleado,
        }),
      });

      if (response.ok) {
        onClose();
        navigate('/menu-empleados');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear la solicitud');
      }
    } catch (error) {
      setError('Error al crear la solicitud: ' + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">
        SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES
      </h2>
      <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
      <label className="block text-gray-700 text-sm font-bold mb-2">{'\u00A0'}</label>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex">
          <div className="mr-4 w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nro. SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES
            </label>
            <input
              type="text"
              value={codigoSolicitud}
              readOnly
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              FECHA DE SOLICITUD (dd-mmm-aaa)
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
            <input
              type="text"
              value={fechaHoraPrevisualizacion}
              readOnly
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">MOTIVO MOVILIZACIÓN</label>
          <select
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona un motivo...</option>
            {motivos.map((motivo, index) => (
              <option key={index} value={motivo}>
                {motivo}
              </option>
            ))}
          </select>
        </div>
        <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
        <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">
          DATOS GENERALES
        </h2>
        <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
        {datosPersonales && (
          <div className="mb-4 flex">
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">APELLIDOS - NOMBRES DE LA O EL SERVIDOR</label>
              <input
                type="text"
                value={`${datosPersonales.Nombre}`}
                readOnly
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <label className="block text-gray-700 text-sm font-bold mb-2">PUESTO QUE OCUPA:</label>
              <input
                type="text"
                value={`${datosPersonales.Cargo}`}
                readOnly
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">LUGAR DE SERVICIO</label>
                <input
                  type="text"
                  value={lugarServicio}
                  onChange={(e) => setLugarServicio(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DE LA UNIDAD A LA QUE PERTENECE LA O EL SERVIDOR</label>
              <input
                type="text"
                value={`${datosPersonales.Unidad}`}
                readOnly
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
        <div className="mb-4 flex">
          <div className="mr-4 w-1/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Fecha Salida</label>
            <input
              type="date"
              value={fechaSalida}
              onChange={(e) => setFechaSalida(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mr-4 w-1/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Hora Salida</label>
            <input
              type="time"
              value={horaSalida}
              onChange={(e) => setHoraSalida(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mr-4 w-1/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Fecha Llegada</label>
            <input
              type="date"
              value={fechaLlegada}
              onChange={(e) => setFechaLlegada(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="w-1/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Hora Llegada</label>
            <input
              type="time"
              value={horaLlegada}
              onChange={(e) => setHoraLlegada(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Descripción Actividades</label>
          <textarea
            value={actividades}
            onChange={(e) => setActividades(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Listado Empleados</label>
          <textarea
            value={listadoEmpleados}
            onChange={(e) => setListadoEmpleados(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="flex justify-between">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Enviar
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearSolicitud;