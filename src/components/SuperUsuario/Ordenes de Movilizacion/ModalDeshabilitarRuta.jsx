import React from 'react';
import { Modal, notification } from 'antd';
import API_URL from "../../../Config";


const ModalDeshabilitarRuta = ({ ruta, descripcion, visible, onClose }) => {

  const handleOk = async () => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const idUsuario = storedUser?.usuario?.id_usuario;
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'Token no proporcionado',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/cambiar-estado-rutas/${idUsuario}/${ruta}/`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        notification.success({
          message: 'Éxito',
          description: 'Ruta deshabilitada exitosamente',
        });
        onDeshabilitar();
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al deshabilitar la ruta',
      });
    } finally {
      onClose();
    }
  };


  return (
    <Modal
      title="Deshabilitar Ruta"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Deshabilitar"
      cancelText="Cancelar"
    >
      ¿Estás seguro de que deseas deshabilitar la ruta "{descripcion}"?
    </Modal>
  );
};

export default ModalDeshabilitarRuta;
