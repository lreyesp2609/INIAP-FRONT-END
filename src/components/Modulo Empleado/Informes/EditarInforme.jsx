import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { notification, Modal } from 'antd';
import API_URL from '../../../Config';



const DetalleEditarInforme = ({ idInforme, onClose }) => {
  const [informe, setInforme] = useState({
    'Codigo de Solicitud': '',
    'Fecha del Informe': '',
    'Nombre Completo': '',
    'Cargo': '',
    'Lugar de Servicio': '',
    'Nombre de Unidad': '',
    'Listado de Empleados': '',
    'Fecha Salida Informe': '',
    'Hora Salida Informe': '',
    'Fecha Llegada Informe': '',
    'Hora Llegada Informe': '',
    'Observacion': '',
    'Transportes': [],
    'Productos Alcanzados': [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    const formattedInforme = {
      ...data.detalle_informe,
      'Fecha Salida Informe': formatDateForDisplay(data.detalle_informe['Fecha Salida Informe']),
      'Fecha Llegada Informe': formatDateForDisplay(data.detalle_informe['Fecha Llegada Informe']),
      'Transportes': data.detalle_informe.Transportes.map(t => ({
        ...t,
        'Fecha de Salida': formatDateForDisplay(t['Fecha de Salida']),
        'Fecha de Llegada': formatDateForDisplay(t['Fecha de Llegada'])
      }))
    };

    setInforme(formattedInforme);
    setLoading(false);
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
      [name]: name.includes('Fecha') ? formatDateForDisplay(value) : value,
    }));
  };

  const handleEditorChange = (content) => {
    setInforme((prevState) => ({
      ...prevState,
      'Productos Alcanzados': [content],
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

  // Función para convertir la fecha al formato yyyy-mm-dd para los inputs
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Función para convertir la fecha al formato dd-mm-yyyy para enviar al servidor
  const formatDateForServer = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  };

  // Función para formatear la fecha para mostrar en la interfaz (dd-mm-yyyy)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  };

  // Manejo del cambio en los inputs de fecha
  const handleTransporteChange = (index, field, value) => {
    const newTransportes = [...informe.Transportes];
    newTransportes[index] = {
      ...newTransportes[index],
      [field]: field.includes('Fecha') ? formatDateForDisplay(value) : value
    };
    setInforme((prevState) => ({
      ...prevState,
      Transportes: newTransportes,
    }));
  };

  const showConfirmModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    try {
      await handleSubmit();
      onClose(); // Cierra el componente después de enviar el informe con éxito
    } catch (error) {
      // Si hay un error, no cerramos el componente
      console.error("Error al enviar el informe:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const formattedData = {
        fecha_salida_informe: formatDateForServer(informe['Fecha Salida Informe']),
        hora_salida_informe: informe['Hora Salida Informe'],
        fecha_llegada_informe: formatDateForServer(informe['Fecha Llegada Informe']),
        hora_llegada_informe: informe['Hora Llegada Informe'],
        observacion: informe['Observacion'],
        transportes: informe.Transportes.map(t => ({
          tipo_transporte_info: t['Tipo de Transporte'],
          nombre_transporte_info: t['Nombre del Transporte'],
          ruta_info: t['Ruta'],
          hora_salida_info: t['Hora de Salida'],
          fecha_salida_info: formatDateForServer(t['Fecha de Salida']),
          fecha_llegada_info: formatDateForServer(t['Fecha de Llegada']),
          hora_llegada_info: t['Hora de Llegada'],
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

      // No llamamos a onClose() aquí, se llamará en handleOk
    } catch (error) {
      setError(error.message);
      notification.error({
        message: 'Error',
        description: error.message,
        placement: 'topRight',
      });
      throw error; // Re-lanzamos el error para que handleOk pueda manejarlo
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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': ['', 'center', 'right', 'justify'] }],  // Opciones explícitas de alineación
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'align',  // Asegúrate de incluir 'align' en los formatos permitidos
    'link'
  ];

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
        <form onSubmit={(e) => { e.preventDefault(); showConfirmModal(); }} className="space-y-4">
          <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">
            INFORME DE ACTIVIDADES Y PRODUCTOS ALCANZADOS
          </h2>
          <div className="mb-2 border-2 border-gray-600 rounded-lg p-14">
            <ReactQuill
              value={informe['Productos Alcanzados'][0]}
              onChange={handleEditorChange}
              modules={modules}
              formats={formats}
            />
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
                    />
                  </div>
                  <div className="mr-4 w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DE TRANSPORTE</label>
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
                  </div>
                  <div className="mr-4 w-1/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">RUTA</label>
                    <input
                      type="text"
                      value={transporte['Ruta']}
                      onChange={(e) => handleTransporteChange(index, 'Ruta', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                </div>
                <div className="mb-4 flex">
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">FECHA SALIDA dd-mmm-aaaa</label>
                    <input
                      type="date"
                      value={formatDateForInput(transporte['Fecha de Salida'])}
                      onChange={(e) => handleTransporteChange(index, 'Fecha de Salida', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">HORA SALIDA hh:mm</label>
                    <input
                      type="time"
                      value={transporte['Hora de Salida']}
                      onChange={(e) => handleTransporteChange(index, 'Hora de Salida', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">FECHA LLEGADA dd-mmm-aaaa</label>
                    <input
                      type="date"
                      value={formatDateForInput(transporte['Fecha de Llegada'])}
                      onChange={(e) => handleTransporteChange(index, 'Fecha de Llegada', e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                  <div className="mr-4 w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">HORA LLEGADA hh:mm</label>
                    <input
                      type="time"
                      value={transporte['Hora de Llegada']}
                      onChange={(e) => handleTransporteChange(index, 'Hora de Llegada', e.target.value)}
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
          <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Observaciones</label>
            <textarea
              name="Observacion"
              value={informe['Observacion'] || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Terminar Informe
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
      <Modal
        title="Confirmar finalización del informe"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirmar"
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: '#22c55e', color: 'white', padding: '8px 16px', borderRadius: '0.375rem' } }}
        cancelButtonProps={{ style: { backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '0.375rem' } }}
      >
        <p>¿Está seguro que desea terminar el informe? Una vez hecho esto no podras volver a editar el informe.</p>
      </Modal>
    </div>
  );
};

export default DetalleEditarInforme;