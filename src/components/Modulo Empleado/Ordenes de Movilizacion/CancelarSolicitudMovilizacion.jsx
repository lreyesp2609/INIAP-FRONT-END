import React from 'react';
import API_URL from '../../../Config';
import { Modal, notification } from 'antd';

const CancelarSolicitudMovilizacionModal = ({ ordenId, userId, onCancel, visible, onClose }) => {
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
        `${API_URL}/OrdenesMovilizacion/cancelar-orden/${userId}/${ordenId}/`,
        {
          method: 'PUT',
          headers: {
            Authorization: `${token}`,  
          },
        }
      );

      if (response.ok) {
        notification.success({
          message: 'Éxito',
          description: 'Solicitud cancelada exitosamente',
        });
        onCancel();
        onClose();
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error || 'Error al cancelar solicitud',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al cancelar solicitud',
      });
    }
  };

  return (
    <Modal
      title="Confirmar Cancelación"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Sí"
      cancelText="No"
    >
      <p>¿Estás seguro de que deseas cancelar esta solicitud?</p>
    </Modal>
  );
};

export default CancelarSolicitudMovilizacionModal;