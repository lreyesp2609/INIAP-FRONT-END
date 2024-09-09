import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_URL from '../../../Config';

const EditarSolicitudEmpleado = ({ onClose, id_solicitud }) => {
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
  const [empleados, setEmpleados] = useState([]);
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [empleadoInput, setEmpleadoInput] = useState('');
  const [empleadoManual, setEmpleadoManual] = useState('');
  const [mostrarInputManual, setMostrarInputManual] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [selectedBanco, setSelectedBanco] = useState('');
  const [tipoCuenta, setTipoCuenta] = useState('');
  const [numeroCuenta, setNumeroCuenta] = useState('');

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/Informes/listar-solicitud-empleado/${id_solicitud}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMotivo(data.solicitud['Motivo']);
          setFechaSalida(data.solicitud['Fecha de Salida']);
          setHoraSalida(data.solicitud['Hora de Salida']);
          setFechaLlegada(data.solicitud['Fecha de Llegada']);
          setHoraLlegada(data.solicitud['Hora de Llegada']);
          setActividades(data.solicitud['Descripción de Actividades']);
          setListadoEmpleados(data.solicitud['Listado de Empleados']);
          setCodigoSolicitud(data.solicitud['Codigo de Solicitud']);
          setFechaHoraPrevisualizacion(data.solicitud['Fecha Solicitud']);
          setDatosPersonales(data.datos_personales);
          setLugarServicio(data.solicitud['Lugar de Servicio']);
          setRutas(data.rutas);
          setSelectedBanco(data.cuenta_bancaria['Banco']);
          setTipoCuenta(data.cuenta_bancaria['Tipo de Cuenta']);
          setNumeroCuenta(data.cuenta_bancaria['Número de Cuenta']);

          // Separar la ciudad y la provincia del lugar de servicio
          const [ciudad, provincia] = data.solicitud['Lugar de Servicio'].split('-');
          setSelectedCiudad(ciudad);
          setSelectedProvincia(provincia);

          // Convertir el listado de empleados a un array
          setEmpleadosSeleccionados(data.solicitud['Listado de Empleados'].split(', '));
        } else {
          setError('Error al cargar los datos de la solicitud');
        }
      } catch (error) {
        setError('Error al cargar los datos de la solicitud: ' + error.message);
      }
    };

    fetchSolicitud();
    fetchMotivos();
    fetchProvinciasYCiudades();
    fetchEmpleados();
    fetchBancos();
  }, [id_solicitud]);

  const fetchMotivos = async () => {
    try {
      const token = localStorage.getItem('token');
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

  const fetchProvinciasYCiudades = async () => {
    try {
      const token = localStorage.getItem('token');
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

  const fetchEmpleados = async () => {
    try {
      const token = localStorage.getItem('token');
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

  const fetchBancos = async () => {
    try {
      const token = localStorage.getItem('token');
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

  const handleProvinciaChange = (e) => {
    const provincia = e.target.value;
    setSelectedProvincia(provincia);
    const selectedProvinciaData = provincias.find(p => p.Provincia === provincia);
    setCiudades(selectedProvinciaData ? selectedProvinciaData.Ciudades : []);
    setSelectedCiudad('');
  };

  const handleAddEmpleado = () => {
    if (empleadoInput && !empleadosSeleccionados.includes(empleadoInput)) {
      setEmpleadosSeleccionados([...empleadosSeleccionados, empleadoInput]);
      setEmpleadoInput('');
    }
  };

  const handleAddEmpleadoManual = () => {
    if (empleadoManual && !empleadosSeleccionados.includes(empleadoManual)) {
      setEmpleadosSeleccionados([...empleadosSeleccionados, empleadoManual]);
      setEmpleadoManual('');
      setMostrarInputManual(false);
    }
  };

  const handleRemoveEmpleado = (index) => {
    const nuevosEmpleadosSeleccionados = empleadosSeleccionados.filter((_, i) => i !== index);
    setEmpleadosSeleccionados(nuevosEmpleadosSeleccionados);
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

  const eliminarRuta = (index) => {
    const nuevasRutas = rutas.filter((_, i) => i !== index);
    setRutas(nuevasRutas);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/Informes/editar-solicitud/${id_solicitud}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          motivo_movilizacion: motivo,
          lugar_servicio: `${selectedCiudad}-${selectedProvincia}`,
          fecha_salida_solicitud: fechaSalida,
          hora_salida_solicitud: horaSalida,
          fecha_llegada_solicitud: fechaLlegada,
          hora_llegada_solicitud: horaLlegada,
          descripcion_actividades: actividades,
          listado_empleado: empleadosSeleccionados.join(', '),
          rutas: rutas.map(ruta => ({
            tipo_transporte_soli: ruta.tipoTransporte,
            nombre_transporte_soli: ruta.nombreTransporte,
            ruta_soli: `${ruta.ciudadOrigen} - ${ruta.ciudadDestino}`,
            fecha_salida_soli: ruta.fechaSalida,
            hora_salida_soli: ruta.horaSalida,
            fecha_llegada_soli: ruta.fechaLlegada,
            hora_llegada_soli: ruta.horaLlegada
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
        setError(errorData.error || 'Error al actualizar la solicitud');
      }
    } catch (error) {
      setError('Error al actualizar la solicitud: ' + error.message);
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

export default EditarSolicitudEmpleado;