import React, { useState } from 'react';
import { MdPersonOff } from 'react-icons/md';
import API_URL from '../../../Config';
import { notification, Modal, Input, Button } from 'antd';

const DeshabilitarEmpleado = ({
  empleadoId,
  userId,
  onDeshabilitar,
  empleadoNombre,
  empleadoCedula,
}) => {
  const [motivo, setMotivo] = useState('');  // Estado para el motivo
  const [modalVisible, setModalVisible] = useState(false);  // Estado para mostrar el modal

  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = async () => {
    if (!motivo) {
      notification.error({
        message: 'Error',
        description: 'Debes proporcionar un motivo para deshabilitar al empleado.',
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'No estás autenticado',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('motivo', motivo);  // Agrega el motivo al FormData

      const response = await fetch(
        `${API_URL}/Empleados/deshabilitar-empleado/${userId}/${empleadoId}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `${token}`,  // Asegúrate de que `Token` esté presente
          },
          body: formData,
        }
      );

      if (response.ok) {
        notification.success({
          message: 'Éxito',
          description: 'Empleado deshabilitado exitosamente',
        });
        onDeshabilitar();
        setModalVisible(false);  // Cierra el modal después de deshabilitar
      } else {
        console.error('Error al deshabilitar empleado:', response.statusText);
        notification.error({
          message: 'Error',
          description: 'Error al deshabilitar empleado',
        });
      }
    } catch (error) {
      console.error('Error al deshabilitar empleado:', error);
      notification.error({
        message: 'Error',
        description: 'Error al deshabilitar empleado',
      });
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <button
        className="p-2 bg-red-500 text-white rounded-full"
        title="Deshabilitar empleado"
        onClick={showModal}
      >
        <MdPersonOff />
      </button>
      <Modal
        title={`¿Estás seguro de deshabilitar al empleado ${empleadoNombre} - ${empleadoCedula}?`}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Sí"
        okType="danger"
        cancelText="No"
      >
        <p>Esta acción deshabilitará al empleado y no podrá volver a acceder al sistema.</p>
        <Input.TextArea
          placeholder="Ingresa el motivo para deshabilitar al empleado"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}  // Manejo del cambio del motivo
          rows={4}
        />
      </Modal>
    </>
  );
};

export default DeshabilitarEmpleado;
