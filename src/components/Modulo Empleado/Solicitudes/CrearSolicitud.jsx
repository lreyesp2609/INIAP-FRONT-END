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
  const [empleadoSesion, setEmpleadoSesion] = useState(null);
  const [tipoTransporte, setTipoTransporte] = useState('');
  const [rutaTransporte, setRutaTransporte] = useState('');
  const [fechaSalidaTransporte, setFechaSalidaTransporte] = useState('');
  const [horaSalidaTransporte, setHoraSalidaTransporte] = useState('');
  const [fechaLlegadaTransporte, setFechaLlegadaTransporte] = useState('');
  const [horaLlegadaTransporte, setHoraLlegadaTransporte] = useState('');
  const [nombreTransporte, setNombreTransporte] = useState('');
  const [transportes, setTransportes] = useState([]);
  const [selectedProvinciaOrigen, setSelectedProvinciaOrigen] = useState('');
  const [selectedCiudadOrigen, setSelectedCiudadOrigen] = useState('');
  const [selectedProvinciaDestino, setSelectedProvinciaDestino] = useState('');
  const [selectedCiudadDestino, setSelectedCiudadDestino] = useState('');
  const [ciudadesOrigen, setCiudadesOrigen] = useState([]);
  const [ciudadesDestino, setCiudadesDestino] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [selectedBanco, setSelectedBanco] = useState('');
  const [tipoCuenta, setTipoCuenta] = useState('');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [rutas, setRutas] = useState([{
    tipoTransporte: '',
    nombreTransporte: '',
    provinciaOrigen: '',
    ciudadOrigen: '',
    provinciaDestino: '',
    ciudadDestino: '',
    fechaSalida: '',
    horaSalida: '',
    fechaLlegada: '',
    horaLlegada: ''
  }]);


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

      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;

      // Obtener todos los empleados
      const responseEmpleados = await fetch(`${API_URL}/Informes/listar-empleados/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Obtener el empleado de la sesión actual
      const responseEmpleadoSesion = await fetch(`${API_URL}/Informes/listar-empleado-sesion/${idUsuario}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseEmpleados.ok && responseEmpleadoSesion.ok) {
        const dataEmpleados = await responseEmpleados.json();
        const dataEmpleadoSesion = await responseEmpleadoSesion.json();
        setEmpleados(dataEmpleados.empleados || []);
        setEmpleadoSesion(dataEmpleadoSesion.empleado || null);

        // Añadir automáticamente el empleado de la sesión a la lista de seleccionados
        if (dataEmpleadoSesion.empleado) {
          const empleadoSesionNombre = `${dataEmpleadoSesion.empleado.distintivo} ${dataEmpleadoSesion.empleado.nombres} ${dataEmpleadoSesion.empleado.apellidos}`;
          setEmpleadosSeleccionados([empleadoSesionNombre]);
        }
      } else {
        const errorEmpleados = await responseEmpleados.json();
        const errorEmpleadoSesion = await responseEmpleadoSesion.json();
        setError(errorEmpleados.error || errorEmpleadoSesion.error || 'Error al obtener los empleados');
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
      const empleadoSeleccionado = empleados.find(emp =>
        `${emp.distintivo} ${emp.nombres} ${emp.apellidos}` === empleadoInput
      );
      if (empleadoSeleccionado) {
        setEmpleadosSeleccionados([...empleadosSeleccionados, empleadoInput]);
        setEmpleadoInput('');
        setError('');
      } else {
        setError('Empleado no encontrado en la lista.');
      }
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

  // Función para obtener los transportes
  const fetchTransportes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token no encontrado');
        return;
      }

      const response = await fetch(`${API_URL}/Informes/listar-vehiculos-habilitados/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransportes([{ placa: 'OFICIAL', habilitado: 1 }, ...data.vehiculos]);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al obtener los transportes');
      }
    } catch (error) {
      setError('Error al obtener transportes: ' + error.message);
    }
  };

  useEffect(() => {
    fetchTransportes();
  }, []);

  const handleProvinciaOrigenChange = (e) => {
    const provincia = e.target.value;
    setSelectedProvinciaOrigen(provincia);
    const selectedProvinciaData = provincias.find(p => p.Provincia === provincia);
    setCiudadesOrigen(selectedProvinciaData ? selectedProvinciaData.Ciudades : []);
    setSelectedCiudadOrigen('');
  };

  const handleProvinciaDestinoChange = (e) => {
    const provincia = e.target.value;
    setSelectedProvinciaDestino(provincia);
    const selectedProvinciaData = provincias.find(p => p.Provincia === provincia);
    setCiudadesDestino(selectedProvinciaData ? selectedProvinciaData.Ciudades : []);
    setSelectedCiudadDestino('');
  };

  const agregarRuta = () => {
    setRutas([...rutas, {
      tipoTransporte: '',
      nombreTransporte: '',
      provinciaOrigen: '',
      ciudadOrigen: '',
      provinciaDestino: '',
      ciudadDestino: '',
      fechaSalida: '',
      horaSalida: '',
      fechaLlegada: '',
      horaLlegada: ''
    }]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const formatTime = (timeString) => {
    return timeString + ':00';  // Añadir segundos si no están incluidos
  };

  const eliminarRuta = (index) => {
    const nuevasRutas = rutas.filter((_, i) => i !== index);
    setRutas(nuevasRutas);
  };

  const fetchBancos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró el token de autenticación');
        return;
      }

      const response = await fetch(`${API_URL}/Informes/listar-bancos/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBancos(data.bancos || []);
      } else {
        setError('Error al obtener la lista de bancos');
      }
    } catch (error) {
      setError('Error al obtener la lista de bancos: ' + error.message);
    }
  };

  // Modificar el useEffect para incluir el token como dependencia
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchBancos();
    } else {
      setError('No se encontró el token de autenticación');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Formatear las fechas principales
    const formattedFechaSalida = formatDate(fechaSalida);
    const formattedFechaLlegada = formatDate(fechaLlegada);

    if (!formattedFechaSalida || !formattedFechaLlegada) {
      setError('Las fechas de salida y llegada son obligatorias');
      return;
    }

    // Formatear las fechas de las rutas
    const formattedRutas = rutas.map(ruta => ({
      ...ruta,
      fechaSalida: formatDate(ruta.fechaSalida),
      fechaLlegada: formatDate(ruta.fechaLlegada)
    }));

    // Validar que todas las rutas tengan fechas válidas
    if (formattedRutas.some(ruta => !ruta.fechaSalida || !ruta.fechaLlegada)) {
      setError('Todas las rutas deben tener fechas de salida y llegada válidas');
      return;
    }

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

    // Validación de rutas
    for (let i = 0; i < formattedRutas.length; i++) {
      const ruta = formattedRutas[i];
      const rutaFechaSalida = new Date(`${ruta.fechaSalida}T${ruta.horaSalida}`);
      const rutaFechaLlegada = new Date(`${ruta.fechaLlegada}T${ruta.horaLlegada}`);

      if (rutaFechaSalida < currentDateTime) {
        setError(`La Fecha Salida y Hora Salida de la ruta ${i + 1} no pueden ser menores que la fecha y hora actual.`);
        return;
      }

      if (rutaFechaLlegada < rutaFechaSalida) {
        setError(`La Fecha Llegada y Hora Llegada de la ruta ${i + 1} no pueden ser menores que la Fecha Salida y Hora Salida.`);
        return;
      }
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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          motivo_movilizacion: motivo,
          fecha_salida_solicitud: formattedFechaSalida,
          hora_salida_solicitud: horaSalida,
          fecha_llegada_solicitud: formattedFechaLlegada,
          hora_llegada_solicitud: horaLlegada,
          descripcion_actividades: actividades,
          listado_empleado: empleadosSeleccionados.join(', '),
          lugar_servicio: `${selectedCiudad}-${selectedProvincia}`,
          id_empleado: idEmpleado,
          rutas: formattedRutas.map(ruta => ({
            tipo_transporte_soli: ruta.tipoTransporte,
            nombre_transporte_soli: ruta.nombreTransporte,
            ruta_soli: `${ruta.ciudadOrigen} - ${ruta.ciudadDestino}`,
            fecha_salida_soli: ruta.fechaSalida,
            hora_salida_soli: ruta.horaSalida,
            fecha_llegada_soli: ruta.fechaLlegada,
            hora_llegada_soli: ruta.horaLlegada,
            provincia_origen: ruta.provinciaOrigen,
            ciudad_origen: ruta.ciudadOrigen,
            provincia_destino: ruta.provinciaDestino,
            ciudad_destino: ruta.ciudadDestino
          })),
          id_banco: selectedBanco,
          tipo_cuenta: tipoCuenta,
          numero_cuenta: numeroCuenta,
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
      <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
        <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">
          SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES
        </h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
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
          </div>
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">DATOS GENERALES</h2>
          <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
            {datosPersonales && (
              <div className="w-full mr-2">
                <div className="flex mb-2">
                  <div className="mr-2 w-1/2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">APELLIDOS - NOMBRES DE LA O EL SERVIDOR</label>
                    <input
                      type="text"
                      value={`${datosPersonales.Nombre}`}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mr-4 w-1/2">
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
                    {empleado !== `${empleadoSesion.distintivo} ${empleadoSesion.nombres} ${empleadoSesion.apellidos}` && (
                      <button type="button" onClick={() => handleRemoveEmpleado(index)} className="ml-2 px-2 text-red-500 hover:text-red-700">
                        &times;
                      </button>
                    )}
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
          </div>
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">TRANSPORTE</h2>
          <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
            <div className="mb-3 flex">
              <div className="mb-3">
                {rutas.map((ruta, index) => (
                  <div key={index} className="mb-6 border-b pb-4">
                    <h3 className="text-lg font-bold mb-2">Ruta {index + 1}</h3>
                    <div className="mb-3 grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">TIPO DE TRANSPORTE (Aéreo, terrestre, marítimo, otros)</label>
                        <input
                          type="text"
                          value={ruta.tipoTransporte}
                          onChange={(e) => {
                            const newRutas = [...rutas];
                            newRutas[index].tipoTransporte = e.target.value;
                            setRutas(newRutas);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'}</label>
                        <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DEL TRANSPORTE</label>
                        <select
                          value={ruta.nombreTransporte}
                          onChange={(e) => {
                            const newRutas = [...rutas];
                            newRutas[index].nombreTransporte = e.target.value;
                            setRutas(newRutas);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Selecciona un transporte...</option>
                          {transportes.map((transporte, idx) => (
                            <option key={idx} value={transporte.placa}>
                              {transporte.placa}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'}</label>
                        <label className="block text-gray-700 text-sm font-bold mb-2">RUTA - SELECCIONE EL INICIO DE LA RUTA:</label>
                        <select
                          value={ruta.provinciaOrigen}
                          onChange={(e) => {
                            const newRutas = [...rutas];
                            newRutas[index].provinciaOrigen = e.target.value;
                            newRutas[index].ciudadOrigen = '';
                            setRutas(newRutas);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Seleccione la provincia...</option>
                          {provincias.map((p) => (
                            <option key={p.Provincia} value={p.Provincia}>
                              {p.Provincia}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">{'\u00A0'}</label>
                        <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'}</label>
                        <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'}</label>
                        <select
                          value={ruta.ciudadOrigen}
                          onChange={(e) => {
                            const newRutas = [...rutas];
                            newRutas[index].ciudadOrigen = e.target.value;
                            setRutas(newRutas);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Seleccione la ciudad...</option>
                          {provincias.find(p => p.Provincia === ruta.provinciaOrigen)?.Ciudades.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'}</label>
                        <label className="block text-gray-700 text-sm font-bold mb-2">RUTA - SELECCIONE EL FINAL DE LA RUTA:</label>
                        <select
                          value={ruta.provinciaDestino}
                          onChange={(e) => {
                            const newRutas = [...rutas];
                            newRutas[index].provinciaDestino = e.target.value;
                            newRutas[index].ciudadDestino = '';
                            setRutas(newRutas);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Seleccione la provincia...</option>
                          {provincias.map((p) => (
                            <option key={p.Provincia} value={p.Provincia}>
                              {p.Provincia}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">{'\u00A0'}</label>
                        <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'}</label>
                        <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'}</label>
                        <select
                          value={ruta.ciudadDestino}
                          onChange={(e) => {
                            const newRutas = [...rutas];
                            newRutas[index].ciudadDestino = e.target.value;
                            setRutas(newRutas);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Seleccione la ciudad...</option>
                          {provincias.find(p => p.Provincia === ruta.provinciaDestino)?.Ciudades.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">FECHA SALIDA TRANSPORTE</label>
                        <input
                          type="date"
                          value={ruta.fechaSalida}
                          onChange={(e) => {
                            const newRutas = [...rutas];
                            newRutas[index].fechaSalida = e.target.value;
                            setRutas(newRutas);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">HORA SALIDA TRANSPORTE</label>
                        <input
                          type="time"
                          value={ruta.horaSalida}
                          onChange={(e) => {
                            const newRutas = [...rutas];
                            newRutas[index].horaSalida = e.target.value;
                            setRutas(newRutas);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">FECHA LLEGADA TRANSPORTE</label>
                        <input
                          type="date"
                          value={ruta.fechaLlegada}
                          onChange={(e) => {
                            const newRutas = [...rutas];
                            newRutas[index].fechaLlegada = e.target.value;
                            setRutas(newRutas);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">HORA LLEGADA TRANSPORTE</label>
                        <input
                          type="time"
                          value={ruta.horaLlegada}
                          onChange={(e) => {
                            const newRutas = [...rutas];
                            newRutas[index].horaLlegada = e.target.value;
                            setRutas(newRutas);
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    {rutas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarRuta(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Eliminar Ruta
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={agregarRuta}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Agregar Ruta
            </button>
          </div>
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">DATOS PARA TRANSFERENCIA</h2>
          <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DEL BANCO:</label>
                <select
                  value={selectedBanco}
                  onChange={(e) => setSelectedBanco(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione un banco...</option>
                  {bancos.map((banco) => (
                    <option key={banco.id_banco} value={banco.id_banco}>
                      {banco.nombre_banco}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">TIPO DE CUENTA:</label>
                <select
                  value={tipoCuenta}
                  onChange={(e) => setTipoCuenta(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione el tipo de cuenta...</option>
                  <option value="Ahorros">Ahorros</option>
                  <option value="Corriente">Corriente</option>
                </select>
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">No. DE CUENTA:</label>
                <input
                  type="text"
                  value={numeroCuenta}
                  onChange={(e) => setNumeroCuenta(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
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
    </div>
  );
};

export default CrearSolicitud;