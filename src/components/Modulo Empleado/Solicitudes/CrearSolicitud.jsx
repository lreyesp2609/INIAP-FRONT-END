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
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [lugarServicio, setLugarServicio] = useState('');
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedCiudad, setSelectedCiudad] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [empleadoInput, setEmpleadoInput] = useState('');
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [empleadoManual, setEmpleadoManual] = useState('');
  const [mostrarInputManual, setMostrarInputManual] = useState(false);



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


  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    const currentDate = `${year}-${month}-${day}`;

    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const currentTime = `${hours}:${minutes}`;

    return {
      currentDate,
      currentTime,
    };
  };

  // Validar que la fecha y hora de salida no puedan ser menores que la actual
  const validateFechaHoraSalida = () => {
    const { currentDate, currentTime } = getCurrentDateTime();
    if (fechaSalida < currentDate || (fechaSalida === currentDate && horaSalida < currentTime)) {
      setError('La fecha y hora de salida no pueden ser menores que la actual del sistema.');
      return false;
    }
    return true;
  };

  // Validar que la fecha y hora de llegada no sean menores que la fecha y hora de salida
  const validateFechaHoraLlegada = () => {
    if (fechaLlegada < fechaSalida || (fechaLlegada === fechaSalida && horaLlegada <= horaSalida)) {
      setError('La fecha y hora de llegada deben ser posteriores a la fecha y hora de salida.');
      return false;
    }
    return true;
  };

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

  const fetchProvinciasYCiudades = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token no encontrado');
        return;
      }

      const response = await fetch(`${API_URL}/Informes/listar-provincias-ciudades/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProvincias(data.provincias_ciudades || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al obtener provincias y ciudades');
      }
    } catch (error) {
      setError('Error al obtener provincias y ciudades: ' + error.message);
    }
  };

  useEffect(() => {
    fetchProvinciasYCiudades(); // Cargar provincias y ciudades al montar el componente
  }, []);

  const handleProvinciaChange = (e) => {
    const provincia = e.target.value;
    setSelectedProvincia(provincia);
    const selectedProvinciaData = provincias.find(p => p.Provincia === provincia);
    setCiudades(selectedProvinciaData ? selectedProvinciaData.Ciudades : []);
    setSelectedCiudad('');
  };

  const fetchEmpleados = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token no encontrado');
        return;
      }

      const response = await fetch(`${API_URL}/Informes/listar-empleados/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmpleados(data.empleados || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al obtener los empleados');
      }
    } catch (error) {
      setError('Error al obtener empleados: ' + error.message);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleAddEmpleado = () => {
    if (empleadoInput && !empleadosSeleccionados.includes(empleadoInput)) {
      setEmpleadosSeleccionados([...empleadosSeleccionados, empleadoInput]);
      setEmpleadoInput('');
      setError('');
    } else if (empleadosSeleccionados.includes(empleadoInput)) {
      setError('El empleado ya está agregado.');
    }
  };

  const handleAddEmpleadoManual = () => {
    if (empleadoManual && !empleadosSeleccionados.includes(empleadoManual)) {
      setEmpleadosSeleccionados([...empleadosSeleccionados, empleadoManual]);
      setEmpleadoManual('');
      setMostrarInputManual(false);
      setError('');
    } else if (empleadosSeleccionados.includes(empleadoManual)) {
      setError('El empleado ya está agregado.');
    }
  };

  const handleRemoveEmpleado = (index) => {
    const nuevosEmpleadosSeleccionados = empleadosSeleccionados.filter((_, i) => i !== index);
    setEmpleadosSeleccionados(nuevosEmpleadosSeleccionados);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
  
    const formattedFechaSalida = fechaSalida ? fechaSalida : null;
    const formattedFechaLlegada = fechaLlegada ? fechaLlegada : null;
  
    // Validación de fechas y horas
    const currentDateTime = new Date();
    const selectedFechaSalida = new Date(`${formattedFechaSalida}T${horaSalida}`);
    const selectedFechaLlegada = new Date(`${formattedFechaLlegada}T${horaLlegada}`);
  
    if (selectedFechaSalida < currentDateTime) {
      setError('La Fecha Salida y Hora Salida no pueden ser menores que la fecha y hora actual.');
      return;
    }
  
    if (selectedFechaLlegada < selectedFechaSalida) {
      setError('La Fecha Llegada y Hora Llegada no pueden ser menores que la Fecha Salida y Hora Salida.');
      return;
    }
  
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
          listado_empleado: empleadosSeleccionados.join(', '),
          lugar_servicio: `${selectedCiudad}-${selectedProvincia}`, // Guardar Ciudad-Provincia
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
        <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">DATOS GENERALES</h2>
        <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
        {datosPersonales && (
          <div className="mb-4 flex">
            <div className="w-10/2 mr-4">
              <div className="flex mb-4">
                <div className="w-10/2 mr-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">APELLIDOS - NOMBRES DE LA O EL SERVIDOR</label>
                  <input
                    type="text"
                    value={`${datosPersonales.Nombre}`}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">PUESTO QUE OCUPA:</label>
                  <input
                    type="text"
                    value={`${datosPersonales.Cargo}`}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4 flex">
                <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
                <div className="w-1/2 mr-4">
                  <label className="block text-gray-700 text-sm font-bold mb-1/2">CIUDAD - PROVINCIA DEL SERVICIO INSTITUCIONAL:</label>
                  <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
                  <select
                    value={selectedProvincia}
                    onChange={handleProvinciaChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar Provincia</option>
                    {provincias.map((p) => (
                      <option key={p.Provincia} value={p.Provincia}>
                        {p.Provincia}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2 mr-4">
                  <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
                  <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
                  <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
                  <select
                    value={selectedCiudad}
                    onChange={(e) => setSelectedCiudad(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar Ciudad</option>
                    {ciudades.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-1/2">NOMBRE DE LA UNIDAD A LA QUE PERTENECE LA O EL SERVIDOR</label>
                  <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'} {/* Espacio en blanco */}</label>
                  <input
                    type="text"
                    value={`${datosPersonales.Unidad}`}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

        )}
        <div className="mb-4 flex">
          <div className="mr-4 w-1/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">FECHA SALIDA (dd-mmm-aaaa)</label>
            <input
              type="date"
              value={fechaSalida}
              onChange={(e) => setFechaSalida(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mr-4 w-1/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">HORA SALIDA (hh:mm)</label>
            <input
              type="time"
              value={horaSalida}
              onChange={(e) => setHoraSalida(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mr-4 w-1/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">FECHA LLEGADA (dd-mmm-aaaa)</label>
            <input
              type="date"
              value={fechaLlegada}
              onChange={(e) => setFechaLlegada(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="w-1/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">HORA LLEGADA (hh:mm)</label>
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
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <label className="block text-gray-700 text-sm font-bold mb-2">SERVIDORES QUE INTEGRAN LOS SERVICIOS INSTITUCIONALES:</label>
          <div className="flex mb-2">
            <select
              value={empleadoInput}
              onChange={(e) => setEmpleadoInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Buscar empleados...</option>
              {empleados.map((emp, index) => (
                <option key={index} value={`${emp.distintivo} ${emp.nombres} ${emp.apellidos}`}>
                  {`${emp.distintivo} ${emp.nombres} ${emp.apellidos}`}
                </option>
              ))}
            </select>
            <button type="button" onClick={handleAddEmpleado} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              +
            </button>
          </div>
          <div className="flex flex-wrap mb-2">
            {empleadosSeleccionados.map((empleado, index) => (
              <span key={index} className="mr-2 p-2 bg-gray-200 rounded flex items-center">
                {empleado}
                <button type="button" onClick={() => handleRemoveEmpleado(index)} className="ml-2 px-2 text-red-500 hover:text-red-700">
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex mb-2">
            {mostrarInputManual ? (
              <>
                <input
                  type="text"
                  value={empleadoManual}
                  onChange={(e) => setEmpleadoManual(e.target.value)}
                  placeholder="Otro empleado..."
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={handleAddEmpleadoManual} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  +
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setMostrarInputManual(true)} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Otro...
              </button>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">DESCRIPCIÓN DE LAS ACTIVIDADES A EJECUTARSE</label>
          <textarea
            value={actividades}
            onChange={(e) => setActividades(e.target.value)}
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