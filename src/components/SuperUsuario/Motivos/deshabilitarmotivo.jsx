import React, { useState } from "react";
import { FaBan } from "react-icons/fa";
import { Modal, notification } from "antd";
import API_URL from "../../../Config";

const DeshabilitarMotivo = ({ motivoId, userId, fetchOrdenes, motivoNombre }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeshabilitar = () => {
    setModalVisible(true);
  };

  const handleOk = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: "Error",
        description: "No estás autenticado",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/MotivosOrdenes/deshabilitar-motivo/${userId}/${motivoId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        notification.success({
          message: "Éxito",
          description: responseData.mensaje || "Motivo deshabilitado correctamente.",
        });
        if (fetchOrdenes) {
          fetchOrdenes();
        }
        setModalVisible(false);
      } else {
        notification.error({
          message: "Error",
          description: responseData.error || "Error al deshabilitar el motivo.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Error al deshabilitar el motivo. Por favor, inténtalo de nuevo más tarde.",
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
        onClick={handleDeshabilitar}
        title="Deshabilitar motivo"
      >
        <FaBan />
      </button>
      <Modal
        title={`¿Estás seguro de deshabilitar el motivo ${motivoNombre}?`}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Sí"
        okType="danger"
        cancelText="No"
      >
        <p>Esta acción deshabilitará el motivo y no podrá volver a ser usado.</p>
      </Modal>
    </>
  );
};

export default DeshabilitarMotivo;
