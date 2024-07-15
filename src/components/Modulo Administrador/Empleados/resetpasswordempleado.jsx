import React, { useState } from 'react';
import { FaKey } from 'react-icons/fa';
import { Modal, notification } from 'antd';
import API_URL from '../../../Config';

const ResetPasswordEmpleado = ({ empleadoId, userId, onResetPassword, empleadoNombre,
    empleadoCedula, }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'No estás autenticado',
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/Empleados/reset-password/${userId}/${empleadoId}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        notification.success({
          message: 'Éxito',
          description: 'Contraseña reseteada exitosamente',
        });
        onResetPassword();
        setModalVisible(false);
      } else {
        console.error('Error al resetear contraseña:', response.statusText);
        notification.error({
          message: 'Error',
          description: 'Error al resetear contraseña',
        });
      }
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      notification.error({
        message: 'Error',
        description: 'Error al resetear contraseña',
      });
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <button
        className="p-2 bg-yellow-500 text-white rounded-full"
        title="Resetear contraseña"
        onClick={showModal}
      >
        <FaKey />
      </button>
      <Modal
        title={`¿Estás seguro de resetear la contraseña del empleado ${empleadoNombre} - ${empleadoCedula}?`}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Sí"
        okType="primary"
        cancelText="No"
      >
        <p>Esta acción reseteará la contraseña del empleado y deberá cambiarla al volver a ingresar al sistema.</p>
      </Modal>
    </>
  );
};

export default ResetPasswordEmpleado;
