import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API_URL from '../../../Config';
import { notification } from 'antd';

const CrearInformes = ({ idSolicitud, onClose }) => {
  const [informeData, setInformeData] = useState(null);
  const [formData, setFormData] = useState({
    codigoSolicitud: '',
    fechaActual: '',
    nombreCompleto: '',
    cargo: '',
    lugarServicio: '',
    nombreUnidad: '',
    listadoEmpleados: '',
    fecha_informe: '',
    fecha_salida_informe: '',
    hora_salida_informe: '',
    fecha_llegada_informe: '',
    hora_llegada_informe: '',
    observacion: '',
    transportes: [{
      tipo_transporte_info: '',
      nombre_transporte_info: '',
      ruta_info: '',
      fecha_salida_info: '',
      hora_salida_info: '',
      fecha_llegada_info: '',
      hora_llegada_info: ''
    }],
    productos: [{ descripcion: '' }],
    informeActividades: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const response = await fetch(`${API_URL}/Informes/listar-vehiculos-habilitados/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al obtener los vehículos');

        const data = await response.json();
        setVehiculos(data.vehiculos);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchVehiculos();
  }, []);

  useEffect(() => {
    const fetchInformeData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const response = await fetch(`${API_URL}/Informes/datos-informe/${idSolicitud}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al obtener datos del informe');

        const data = await response.json();
        setInformeData(data.informe);
        setFormData({
          ...formData,
          codigoSolicitud: data.informe['Codigo de Solicitud'],
          fechaActual: data.informe['Fecha Actual'],
          nombreCompleto: data.informe['Nombre Completo'],
          cargo: data.informe['Cargo'],
          lugarServicio: data.informe['Lugar de Servicio'],
          nombreUnidad: data.informe['Nombre de Unidad'],
          listadoEmpleados: data.informe['Listado de Empleados']
        });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInformeData();
  }, [idSolicitud]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditorChange = (content) => {
    setFormData(prevState => ({
      ...prevState,
      informeActividades: content
    }));
  };

  const handleTransporteChange = (index, field, value) => {
    const newTransportes = [...formData.transportes];
    newTransportes[index] = { ...newTransportes[index], [field]: value };
    setFormData(prevState => ({
      ...prevState,
      transportes: newTransportes
    }));
  };

  const addTransporte = () => {
    setFormData(prevState => ({
      ...prevState,
      transportes: [...prevState.transportes, {
        tipo_transporte_info: '',
        nombre_transporte_info: '',
        ruta_info: '',
        fecha_salida_info: '',
        hora_salida_info: '',
        fecha_llegada_info: '',
        hora_llegada_info: ''
      }]
    }));
  };

  const removeTransporte = (index) => {
    setFormData(prevState => ({
      ...prevState,
      transportes: prevState.transportes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const dataToSend = {
        ...formData,
        productos: [{ descripcion: formData.informeActividades }]
      };

      const response = await fetch(`${API_URL}/Informes/crear-informe/${idSolicitud}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) throw new Error('Error al crear el informe');

      const data = await response.json();

      notification.success({
        message: 'Éxito',
        description: 'Informe creado exitosamente',
        placement: 'topRight',
      });

      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
        <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">INFORME DE SERVICIOS INSTITUCIONALES</h2>
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
          <div className="mb-4 flex">
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nro. SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES</label>
              <input
                type="text"
                value={formData.codigoSolicitud}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">FECHA DE INFORME (dd-mmm-aaa)</label>
              <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
              <input
                type="text"
                value={formData.fechaActual}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">
          DATOS GENERALES
        </h2>
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
          <div className="mb-4 flex">
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">APELLIDOS - NOMBRES DE LA O EL SERVIDOR</label>
              <input
                type="text"
                value={formData.nombreCompleto}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">PUESTO QUE OCUPA</label>
              <input
                type="text"
                value={formData.cargo}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="mb-4 flex">
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">CIUDAD - PROVINCIA DEL SERVICIO INSTITUCIONAL</label>
              <input
                type="text"
                value={formData.lugarServicio}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DE LA UNIDAD A LA QUE PERTENECE LA O EL SERVIDOR</label>
              <input
                type="text"
                value={formData.nombreUnidad}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">SERVIDORES QUE INTEGRAN EL SERVICIO INSTITUCIONAL</label>
            <input
              type="text"
              value={formData.listadoEmpleados}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">
            INFORME DE ACTIVIDADES Y PRODUCTOS ALCANZADOS
          </h2>
          <div className="mb-2 border-2 border-gray-600 rounded-lg p-14">
            <ReactQuill
              value={formData.informeActividades}
              onChange={handleEditorChange}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                  ['link'],
                  ['clean']
                ],
              }}
            />
          </div>
          <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
            <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
              <div className="mb-4 flex">
                <div className="mr-4 w-1/4">
                  <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">INTINERARIO</h2>
                </div>
                <div className="mr-4 w-1/2">
                  <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">SALIDA</h2>
                </div>
                <div className="mr-4 w-1/2">
                  <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">LLEGADA</h2>
                </div>
              </div>
            </div>
            <div className="mb-6 border-2 border-gray-600 rounded-lg p -4">
              <div className="mb-4 flex">
                <div className="mr-4 w-1/4">
                  <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
                  <h2 className="block text-gray-700 text -sm font-bold mb-2 text-center">FECHA</h2>
                  <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">dd-mmm-aaaa</h2>
                </div>
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
                  <input
                    type="date"
                    name="fecha_salida_informe"
                    value={formData.fecha_salida_informe}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
                  <input
                    type="date"
                    name="fecha_llegada_informe"
                    value={formData.fecha_llegada_informe}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-4 border-2 border-gray-600 rounded-lg p-4">
              <div className="mb-4 flex">
                <div className="mr-4 w-1/4">
                  <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
                  <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">HORA</h2>
                  <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">hh-mm</h2>
                </div>
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
                  <input
                    type="time"
                    name="hora_salida_informe"
                    value={formData.hora_salida_informe}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
                  <input
                    type="time"
                    name="hora_llegada_informe"
                    value={formData.hora_llegada_informe}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">TRANSPORTE</h2>
          <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
            {formData.transportes.map((transporte, index) => (
              <div key={index} className="mb-4">
                <div className="mb-4 flex">
                  <div className="mr-4 w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">TIPO DE TRANSPORTE</label>
                    <input
                      type="text"
                      placeholder=' (Aéreo, terrestre, marítimo, otros)'
                      value={transporte.tipo_transporte_info}
                      onChange={(e) => handleTransporteChange(index, 'tipo_transporte_info', e.target.value)}
                      className="w-full p-2 mb-2 border rounded" />
                  </div>
                  <div className="mr-4 w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DE TRANSPORTE</label>
                    <select
                      value={transporte.nombre_transporte_info}
                      onChange={(e) => handleTransporteChange(index, 'nombre_transporte_info', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                    >
                      <option value="">Seleccionar vehículo</option>
                      {vehiculos.map((vehiculo) => (
                        <option key={vehiculo.placa} value={vehiculo.placa}>
                          {vehiculo.placa}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mr-4 w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">RUTA</label>
                    <input
                      type="text"
                      value={transporte.ruta_info}
                      onChange={(e) => handleTransporteChange(index, 'ruta_info', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                </div>
                <div className="mb-4 flex">
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">FECHA SALIDA dd-mmm-aaaa</label>
                    <input
                      type="date"
                      value={transporte.fecha_salida_info}
                      onChange={(e) => handleTransporteChange(index, 'fecha_salida_info', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">HORA SALIDA hh:mm</label>
                    <input
                      type="time"
                      value={transporte.hora_salida_info}
                      onChange={(e) => handleTransporteChange(index, 'hora_salida_info', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">FECHA LLEGADA dd-mmm-aaaa</label>
                    <input
                      type="date"
                      value={transporte.fecha_llegada_info}
                      onChange={(e) => handleTransporteChange(index, 'fecha_llegada_info', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">HORA LLEGADA hh:mm</label>
                    <input
                      type="time"
                      value={transporte.hora_llegada_info}
                      onChange={(e) => handleTransporteChange(index, 'hora_llegada_info', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeTransporte(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Eliminar
                  </button>
                )}
                <div className="border-t border-gray-300 my-4"></div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTransporte}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Agregar Ruta
            </button>
          </div>
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">OBSERVACIONES</h2>
          <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
            <div>
              <textarea
                name="observacion"
                value={formData.observacion}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="4"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Crear Informe
            </button>
            <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearInformes;