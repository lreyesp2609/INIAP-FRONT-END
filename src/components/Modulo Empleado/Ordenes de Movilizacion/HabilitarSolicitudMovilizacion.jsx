import React from 'react';
import API_URL from '../../../Config';
import { Modal, notification } from 'antd';

const HabilitarSolicitudMovilizacionModal = ({ ordenId, userId, onHabilitar, visible, onClose }) => {
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
        `${API_URL}/OrdenesMovilizacion/habilitar-orden/${userId}/${ordenId}/`,
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
          description: 'Solicitud habilitada exitosamente',
        });
        onHabilitar();  // Actualiza la lista de solicitudes canceladas
        onClose();      // Cierra el modal
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error || 'Error al habilitar solicitud',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al habilitar solicitud',
      });
    }
  };

  return (
    <Modal
      title="Confirmar Habilitación"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Sí"
      cancelText="No"
    >
      <p>¿Estás seguro de que deseas habilitar esta solicitud?</p>
    </Modal>
  );
};

export default HabilitarSolicitudMovilizacionModal;
