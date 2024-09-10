import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';

const EditarSolicitudEmpleado = ({ id_solicitud, onClose, onUpdate }) => {
  const [solicitud, setSolicitud] = useState(null);
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [cuentaBancaria, setCuentaBancaria] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [motivos, setMotivos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [empleadoInput, setEmpleadoInput] = useState('');
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [mostrarInputManual, setMostrarInputManual] = useState(false);
  const [empleadoManual, setEmpleadoManual] = useState('');
  const [empleadoSesion, setEmpleadoSesion] = useState(null);

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
          console.log('Datos de la solicitud:', data);
          setSolicitud(data.solicitud);
          setDatosPersonales(data.datos_personales);
          setRutas(data.rutas);
          setCuentaBancaria(data.cuenta_bancaria);
          setEmpleadosSeleccionados(data.solicitud['Listado de Empleados'].split(', '));
          setEmpleadoSesion({
            distintivo: data.datos_personales.Distintivo,
            nombres: data.datos_personales.Nombre.split(' ')[0],
            apellidos: data.datos_personales.Nombre.split(' ')[1],
          });
        } else {
          const errorData = await response.json();
          console.log('Error al obtener la solicitud:', errorData);
          setError(errorData.error || 'Error al obtener la solicitud');
        }
      } catch (error) {
        console.log('Error al obtener la solicitud:', error);
        setError('Error al obtener la solicitud: ' + error.message);
      } finally {
        setIsLoading(false);
      }
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
          setMotivos(data.motivos);
        } else {
          const errorData = await response.json();
          console.log('Error al obtener los motivos:', errorData);
          setError(errorData.error || 'Error al obtener los motivos');
        }
      } catch (error) {
        console.log('Error al obtener los motivos:', error);
        setError('Error al obtener los motivos: ' + error.message);
      }
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
          setEmpleados(data.empleados);
        } else {
          const errorData = await response.json();
          console.log('Error al obtener los empleados:', errorData);
          setError(errorData.error || 'Error al obtener los empleados');
        }
      } catch (error) {
        console.log('Error al obtener los empleados:', error);
        setError('Error al obtener los empleados: ' + error.message);
      }
    };

    fetchSolicitud();
    fetchMotivos();
    fetchEmpleados();
  }, [id_solicitud]);

  const handleInputChange = (e, field) => {
    setSolicitud({ ...solicitud, [field]: e.target.value });
  };

  const handleRutaChange = (index, field, value) => {
    const updatedRutas = [...rutas];
    updatedRutas[index] = { ...updatedRutas[index], [field]: value };
    setRutas(updatedRutas);
  };

  const handleCuentaBancariaChange = (field, value) => {
    setCuentaBancaria({ ...cuentaBancaria, [field]: value });
  };

  const handleAddEmpleado = () => {
    if (empleadoInput && !empleadosSeleccionados.includes(empleadoInput)) {
      setEmpleadosSeleccionados([...empleadosSeleccionados, empleadoInput]);
      setEmpleadoInput('');
    }
  };

  const handleRemoveEmpleado = (index) => {
    // Verificar si es el último empleado en la lista
    if (empleadosSeleccionados.length > 1) {
      const newEmpleados = empleadosSeleccionados.filter((_, i) => i !== index);
      setEmpleadosSeleccionados(newEmpleados);
    } else {
      // Si es el último empleado, mostrar un mensaje de error
      setError("No se puede eliminar el último empleado de la lista.");
    }
  };

  const handleAddEmpleadoManual = () => {
    if (empleadoManual && !empleadosSeleccionados.includes(empleadoManual)) {
      setEmpleadosSeleccionados([...empleadosSeleccionados, empleadoManual]);
      setEmpleadoManual('');
      setMostrarInputManual(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token no encontrado');
        return;
      }

      const response = await fetch(`${API_URL}/Informes/editar-solicitud/${id_solicitud}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          motivo_movilizacion: solicitud['Motivo'],
          lugar_servicio: solicitud['Lugar de Servicio'],
          fecha_salida_solicitud: solicitud['Fecha de Salida'],
          hora_salida_solicitud: solicitud['Hora de Salida'],
          fecha_llegada_solicitud: solicitud['Fecha de Llegada'],
          hora_llegada_solicitud: solicitud['Hora de Llegada'],
          descripcion_actividades: solicitud['Descripción de Actividades'],
          listado_empleado: empleadosSeleccionados.join(', '),
          rutas: rutas.map(ruta => ({
            tipo_transporte_soli: ruta['Tipo de Transporte'],
            nombre_transporte_soli: ruta['Nombre del Transporte'],
            ciudad_origen: ruta['Ruta'].split(' - ')[0],
            ciudad_destino: ruta['Ruta'].split(' - ')[1],
            fecha_salida_soli: ruta['Fecha de Salida'],
            hora_salida_soli: ruta['Hora de Salida'],
            fecha_llegada_soli: ruta['Fecha de Llegada'],
            hora_llegada_soli: ruta['Hora de Llegada']
          })),
          id_banco: cuentaBancaria.id_banco,
          tipo_cuenta: cuentaBancaria['Tipo de Cuenta'],
          numero_cuenta: cuentaBancaria['Número de Cuenta']
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Solicitud actualizada:', data);
        if (typeof onUpdate === 'function') {
          onUpdate(data);
        }
        if (typeof onClose === 'function') {
          onClose();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al actualizar la solicitud');
      }
    } catch (error) {
      console.log('Error al actualizar la solicitud:', error);
      setError('Error al actualizar la solicitud: ' + error.message);
    }
  };

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
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
        <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">
          EDITAR SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES
        </h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
          <div className="mb-4 flex">
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nro. SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES
              </label>
              <input
                type="text"
                value={solicitud['Codigo de Solicitud']}
                readOnly
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2 h-10">
                FECHA DE SOLICITUD (dd-mmm-aaa)
              </label>
              <input
                type="text"
                value={solicitud['Fecha Solicitud']}
                readOnly
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">MOTIVO MOVILIZACIÓN</label>
            <select
              value={solicitud['Motivo']}
              onChange={(e) => handleInputChange(e, 'Motivo')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un motivo</option>
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
                    value={datosPersonales.Nombre}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">PUESTO QUE OCUPA:</label>
                  <input
                    type="text"
                    value={datosPersonales.Cargo}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4 flex">
                <div className="w-1/2 mr-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">CIUDAD - PROVINCIA DEL SERVICIO INSTITUCIONAL:</label>
                  <input
                    type="text"
                    value={solicitud['Lugar de Servicio']}
                    onChange={(e) => handleInputChange(e, 'Lugar de Servicio')}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DE LA UNIDAD A LA QUE PERTENECE LA O EL SERVIDOR</label>
                  <input
                    type="text"
                    value={datosPersonales.Unidad}
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
                value={solicitud['Fecha de Salida']}
                onChange={(e) => handleInputChange(e, 'Fecha de Salida')}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mr-4 w-1/4">
              <label className="block text-gray-700 text-sm font-bold mb-2">HORA SALIDA (hh:mm)</label>
              <input
                type="time"
                value={solicitud['Hora de Salida']}
                onChange={(e) => handleInputChange(e, 'Hora de Salida')}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mr-4 w-1/4">
              <label className="block text-gray-700 text-sm font-bold mb-2">FECHA LLEGADA (dd-mmm-aaaa)</label>
              <input
                type="date"
                value={solicitud['Fecha de Llegada']}
                onChange={(e) => handleInputChange(e, 'Fecha de Llegada')}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/4">
              <label className="block text-gray-700 text-sm font-bold mb-2">HORA LLEGADA (hh:mm)</label>
              <input
                type="time"
                value={solicitud['Hora de Llegada']}
                onChange={(e) => handleInputChange(e, 'Hora de Llegada')}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEmpleado(index)}
                      className="ml-2 px-2 text-red-500 hover:text-red-700"
                    >
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
              value={solicitud['Descripción de Actividades']}
              onChange={(e) => handleInputChange(e, 'Descripción de Actividades')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
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
                  <div className="mb-3 grid grid-cols-12 gap-2">
                    <div className="col-span-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">TIPO DE TRANSPORTE (Aéreo, terrestre, marítimo, otros)</label>
                      <input
                        type="text"
                        value={ruta['Tipo de Transporte']}
                        onChange={(e) => handleRutaChange(index, 'Tipo de Transporte', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2 h-10">NOMBRE DEL TRANSPORTE</label>
                      <input
                        type="text"
                        value={ruta['Nombre del Transporte']}
                        onChange={(e) => handleRutaChange(index, 'Nombre del Transporte', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2 h-10">RUTA</label>
                      <input
                        type="text"
                        value={ruta['Ruta']}
                        onChange={(e) => handleRutaChange(index, 'Ruta', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">FECHA SALIDA TRANSPORTE</label>
                      <input
                        type="date"
                        value={ruta['Fecha de Salida']}
                        onChange={(e) => handleRutaChange(index, 'Fecha de Salida', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">HORA SALIDA TRANSPORTE</label>
                      <input
                        type="time"
                        value={ruta['Hora de Salida']}
                        onChange={(e) => handleRutaChange(index, 'Hora de Salida', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">FECHA LLEGADA TRANSPORTE</label>
                      <input
                        type="date"
                        value={ruta['Fecha de Llegada']}
                        onChange={(e) => handleRutaChange(index, 'Fecha de Llegada', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">HORA LLEGADA TRANSPORTE</label>
                      <input
                        type="time"
                        value={ruta['Hora de Llegada']}
                        onChange={(e) => handleRutaChange(index, 'Hora de Llegada', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">DATOS PARA TRANSFERENCIA</h2>
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DEL BANCO:</label>
              <input
                type="text"
                value={cuentaBancaria?.Banco}
                onChange={(e) => handleCuentaBancariaChange('Banco', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">TIPO DE CUENTA:</label>
              <input
                type="text"
                value={cuentaBancaria?.['Tipo de Cuenta']}
                onChange={(e) => handleCuentaBancariaChange('Tipo de Cuenta', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">No. DE CUENTA:</label>
              <input
                type="text"
                value={cuentaBancaria?.['Número de Cuenta']}
                onChange={(e) => handleCuentaBancariaChange('Número de Cuenta', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Guardar Cambios
          </button>
        </div>
        {error && <div className="mt-4 text-red-500">{error}</div>}
      </div>
    </form>
  );
};

export default EditarSolicitudEmpleado;