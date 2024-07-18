import React, { useState } from 'react';
import API_URL from '../../../Config';
import { Modal, Input, notification } from 'antd';

const RechazarSolicitudMovilizacion = ({ ordenId, userId, visible, onClose, onRechazar }) => {
  const [motivo, setMotivo] = useState('');

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
      const formData = new FormData();
      formData.append('motivo', motivo);

      const response = await fetch(
        `${API_URL}/OrdenesMovilizacion/rechazar-orden/${userId}/${ordenId}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        notification.success({
          message: 'Éxito',
          description: 'Solicitud rechazada exitosamente',
        });
        onRechazar();
        onClose();
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error || 'Error al rechazar solicitud',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al rechazar solicitud',
      });
    }
  };

  return (
    <Modal
      title="Rechazar Solicitud"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Rechazar"
      cancelText="Cancelar"
    >
      <Input.TextArea
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        placeholder="Motivo (requerido)"
        rows={4}
      />
    </Modal>
  );
};

export default RechazarSolicitudMovilizacion;
