import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { notification } from 'antd';
import API_URL from '../../../Config';


const DetalleEditarInforme = ({ idInforme, onClose }) => {
  const [informe, setInforme] = useState(null);
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
    setInforme((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditorChange = (content) => {
    setInforme((prevState) => ({
      ...prevState,
      'Productos Alcanzados': [content],
    }));
  };

  const handleTransporteChange = (index, field, value) => {
    const newTransportes = [...informe.Transportes];
    newTransportes[index] = { ...newTransportes[index], [field]: value };
    setInforme((prevState) => ({
      ...prevState,
      Transportes: newTransportes,
    }));
  };

  const addTransporte = () => {
    setInforme((prevState) => ({
      ...prevState,
      Transportes: [
        ...prevState.Transportes,
        {
          'Tipo de Transporte': '',
          'Nombre del Transporte': '',
          'Ruta': '',
          'Fecha de Salida': '',
          'Hora de Salida': '',
          'Fecha de Llegada': '',
          'Hora de Llegada': '',
        },
      ],
    }));
  };

  const removeTransporte = (index) => {
    setInforme((prevState) => ({
      ...prevState,
      Transportes: prevState.Transportes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');
  
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
      };
  
      const formattedData = {
        fecha_salida_informe: formatDate(informe['Fecha del Informe']),
        hora_salida_informe: informe.Transportes[0]['Hora de Salida'],
        fecha_llegada_informe: formatDate(informe.Transportes[informe.Transportes.length - 1]['Fecha de Llegada']),
        hora_llegada_informe: informe.Transportes[informe.Transportes.length - 1]['Hora de Llegada'],
        observacion: informe['Observaciones'],
        transportes: informe.Transportes.map(t => ({
          tipo_transporte_info: t['Tipo de Transporte'],
          nombre_transporte_info: t['Nombre del Transporte'],
          ruta_info: t['Ruta'],
          fecha_salida_info: formatDate(t['Fecha de Salida']),
          hora_salida_info: t['Hora de Salida'],
          fecha_llegada_info: formatDate(t['Fecha de Llegada']),
          hora_llegada_info: t['Hora de Llegada']
        })),
        productos: [{ descripcion: informe['Productos Alcanzados'][0] }]
      };
  
      const response = await fetch(`${API_URL}/Informes/editar-informe/${idInforme}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(formattedData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el informe');
      }
  
      const data = await response.json();
      notification.success({
        message: 'Éxito',
        description: data.mensaje,
        placement: 'topRight',
      });
  
      if (onClose) onClose();
    } catch (error) {
      setError(error.message);
      notification.error({
        message: 'Error',
        description: error.message,
        placement: 'topRight',
      });
    }
  };
  
  // Helper function to get CSRF token
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!informe) return null;

  return (
    <div className="p-4">
      <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
        <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">
          INFORME DE SERVICIOS INSTITUCIONALES
        </h2>
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
          <div className="mb-4 flex">
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nro. SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES
              </label>
              <input
                type="text"
                value={informe['Codigo de Solicitud']}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                FECHA DEL INFORME (dd-mmm-aaa)
              </label>
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
              <label className="block text-gray-700 text-sm font-bold mb-2">
                APELLIDOS - NOMBRES DE LA O EL SERVIDOR
              </label>
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
              <label className="block text-gray-700 text-sm font-bold mb-2">
                CIUDAD - PROVINCIA DEL SERVICIO INSTITUCIONAL
              </label>
              <input
                type="text"
                value={informe['Lugar de Servicio']}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mr-4 w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                NOMBRE DE LA UNIDAD A LA QUE PERTENECE LA O EL SERVIDOR
              </label>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">
              SERVIDORES QUE INTEGRAN EL SERVICIO INSTITUCIONAL
            </label>
            <input
              type="text"
              value={informe['Listado de Empleados']}
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
              value={informe['Productos Alcanzados'][0]}
              onChange={handleEditorChange}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
            />
          </div>
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">TRANSPORTE</h2>
          {informe.Transportes.map((transporte, index) => (
            <div key={index} className="mb-4 border-2 border-gray-600 rounded-lg p-14">
              <div className="mb-4 flex">
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Transporte</label>
                  <input
                    type="text"
                    value={transporte['Tipo de Transporte']}
                    onChange={(e) =>
                      handleTransporteChange(index, 'Tipo de Transporte', e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del Transporte</label>
                  <input
                    type="text"
                    value={transporte['Nombre del Transporte']}
                    onChange={(e) =>
                      handleTransporteChange(index, 'Nombre del Transporte', e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mb-4 flex">
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Ruta</label>
                  <input
                    type="text"
                    value={transporte['Ruta']}
                    onChange={(e) => handleTransporteChange(index, 'Ruta', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mb-4 flex">
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Salida</label>
                  <input
                    type="date"
                    value={transporte['Fecha de Salida']}
                    onChange={(e) =>
                      handleTransporteChange(index, 'Fecha de Salida', e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Salida</label>
                  <input
                    type="time"
                    value={transporte['Hora de Salida']}
                    onChange={(e) => handleTransporteChange(index, 'Hora de Salida', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mb-4 flex">
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Llegada</label>
                  <input
                    type="date"
                    value={transporte['Fecha de Llegada']}
                    onChange={(e) =>
                      handleTransporteChange(index, 'Fecha de Llegada', e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mr-4 w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Hora de Llegada</label>
                  <input
                    type="time"
                    value={transporte['Hora de Llegada']}
                    onChange={(e) => handleTransporteChange(index, 'Hora de Llegada', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeTransporte(index)}
                  className="text-red-500"
                >
                  Eliminar Transporte
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={addTransporte}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Añadir Transporte
            </button>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Actualizar Informe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetalleEditarInforme;