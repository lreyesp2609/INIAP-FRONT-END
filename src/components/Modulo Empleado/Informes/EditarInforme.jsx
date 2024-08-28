import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { notification } from 'antd';
import API_URL from '../../../Config';

const DetalleEditarInforme = ({ idInforme, onClose }) => {
  const [informe, setInforme] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);

  useEffect(() => {
    fetchInforme();
    fetchVehiculos();
  }, [idInforme]);

  const fetchInforme = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const response = await fetch(`${API_URL}/Informes/detalle-informe/${idInforme}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener el informe');

      const data = await response.json();
      setInforme(data.detalle_informe);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInforme(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditorChange = (content) => {
    setInforme(prevState => ({
      ...prevState,
      'Productos Alcanzados': [content]
    }));
  };

  const handleTransporteChange = (index, field, value) => {
    const newTransportes = [...informe.Transportes];
    newTransportes[index] = { ...newTransportes[index], [field]: value };
    setInforme(prevState => ({
      ...prevState,
      Transportes: newTransportes
    }));
  };

  const addTransporte = () => {
    setInforme(prevState => ({
      ...prevState,
      Transportes: [...prevState.Transportes, {
        'Tipo de Transporte': '',
        'Nombre del Transporte': '',
        'Ruta': '',
        'Fecha de Salida': '',
        'Hora de Salida': '',
        'Fecha de Llegada': '',
        'Hora de Llegada': ''
      }]
    }));
  };

  const removeTransporte = (index) => {
    setInforme(prevState => ({
      ...prevState,
      Transportes: prevState.Transportes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const response = await fetch(`${API_URL}/Informes/editar-informe/${idInforme}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(informe)
      });

      if (!response.ok) throw new Error('Error al actualizar el informe');

      const data = await response.json();

      notification.success({
        message: 'Éxito',
        description: 'Informe actualizado exitosamente',
        placement: 'topRight',
      });

      setEditMode(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!informe) return null;

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
                value={informe['Codigo de Solicitud']}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">FECHA DEL INFORME (dd-mmm-aaa)</label>
              <input
                type="text"
                value={informe['Fecha del Informe']}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">DATOS GENERALES</h2>
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
          <div className="mb-4 flex">
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">APELLIDOS - NOMBRES DE LA O EL SERVIDOR</label>
              <input
                type="text"
                value={informe['Nombre Completo']}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">PUESTO QUE OCUPA</label>
              <input
                type="text"
                value={informe['Cargo']}
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
                value={informe['Lugar de Servicio']}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DE LA UNIDAD A LA QUE PERTENECE LA O EL SERVIDOR</label>
              <input
                type="text"
                value={informe['Nombre de Unidad']}
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
              value={informe['Listado de Empleados']}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">INFORME DE ACTIVIDADES Y PRODUCTOS ALCANZADOS</h2>
          <div className="mb-2 border-2 border-gray-600 rounded-lg p-14">
            <ReactQuill
              value={informe['Productos Alcanzados'][0]}
              onChange={handleEditorChange}
              readOnly={!editMode}
              modules={{
                toolbar: editMode ? [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                  ['link'],
                  ['clean']
                ] : false,
              }}
              formats={[
                'header',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image'
              ]}
              className="h-60"
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
            <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
              <div className="mb-4 flex">
                <div className="mr-4 w-1/4">
                  <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
                  <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">FECHA</h2>
                  <h2 className="block text-gray-700 text-sm font-bold mb-2 text-center">dd-mmm-aaaa</h2>
                </div>
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
                  <input
                    type="date"
                    name="Fecha Salida Informe"
                    value={informe['Fecha Salida Informe']}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    readOnly={!editMode}
                  />
                </div>
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
                  <input
                    type="date"
                    name="Fecha Llegada Informe"
                    value={informe['Fecha Llegada Informe']}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    readOnly={!editMode}
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
                    name="Hora Salida Informe"
                    value={informe['Hora Salida Informe']}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    readOnly={!editMode}
                  />
                </div>
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">{'\u00A0'}</label>
                  <input
                    type="time"
                    name="Hora Llegada Informe"
                    value={informe['Hora Llegada Informe']}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    readOnly={!editMode}
                  />
                </div>
              </div>
            </div>
          </div>
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">TRANSPORTE</h2>
          <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
            {informe.Transportes.map((transporte, index) => (
              <div key={index} className="mb-4">
                <div className="mb-4 flex">
                  <div className="mr-4 w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">TIPO DE TRANSPORTE</label>
                    <input
                      type="text"
                      placeholder="(Aéreo, terrestre, marítimo, otros)"
                      value={transporte['Tipo de Transporte']}
                      onChange={(e) => handleTransporteChange(index, 'Tipo de Transporte', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                      readOnly={!editMode}
                    />
                  </div>
                  <div className="mr-4 w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DE TRANSPORTE</label>
                    {editMode ? (
                      <select
                        value={transporte['Nombre del Transporte']}
                        onChange={(e) => handleTransporteChange(index, 'Nombre del Transporte', e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                      >
                        <option value="">Seleccionar vehículo</option>
                        {vehiculos.map((vehiculo) => (
                          <option key={vehiculo.placa} value={vehiculo.placa}>
                            {vehiculo.placa}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={transporte['Nombre del Transporte']}
                        readOnly
                        className="w-full p-2 mb-2 border rounded"
                      />
                    )}
                  </div>
                  <div className="mr-4 w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">RUTA</label>
                    <input
                      type="text"
                      value={transporte['Ruta']}
                      onChange={(e) => handleTransporteChange(index, 'Ruta', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                      readOnly={!editMode}
                    />
                  </div>
                </div>
                <div className="mb-4 flex">
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">FECHA SALIDA dd-mmm-aaaa</label>
                    <input
                      type="date"
                      value={transporte['Fecha de Salida']}
                      onChange={(e) => handleTransporteChange(index, 'Fecha de Salida', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                      readOnly={!editMode}
                    />
                  </div>
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">HORA SALIDA hh:mm</label>
                    <input
                      type="time"
                      value={transporte['Hora de Salida']}
                      onChange={(e) => handleTransporteChange(index, 'Hora de Salida', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                      readOnly={!editMode}
                    />
                  </div>
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">FECHA LLEGADA dd-mmm-aaaa</label>
                    <input
                      type="date"
                      value={transporte['Fecha de Llegada']}
                      onChange={(e) => handleTransporteChange(index, 'Fecha de Llegada', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                      readOnly={!editMode}
                    />
                  </div>
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">HORA LLEGADA hh:mm</label>
                    <input
                      type="time"
                      value={transporte['Hora de Llegada']}
                      onChange={(e) => handleTransporteChange(index, 'Hora de Llegada', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                      readOnly={!editMode}
                    />
                  </div>
                </div>
                {editMode && index > 0 && (
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
            {editMode && (
              <button
                type="button"
                onClick={addTransporte}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Agregar Ruta
              </button>
            )}
          </div>
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">OBSERVACIONES</h2>
          <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
            <div>
              <textarea
                name="Observacion"
                value={informe['Observacion']}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="4"
                readOnly={!editMode}
              />
            </div>
          </div>
          <div className="flex justify-between">
            {editMode ? (
              <>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Guardar Cambios
                </button>
                <button type="button" onClick={() => setEditMode(false)} className="bg-yellow-500 text-white px-4 py-2 rounded">
                  Cancelar Edición
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                Editar Informe
              </button>
            )}
            <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetalleEditarInforme;