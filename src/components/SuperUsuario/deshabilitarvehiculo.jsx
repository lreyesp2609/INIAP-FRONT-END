import React, { useState } from "react";
import { FaBan } from "react-icons/fa";
import { Modal, notification, Input } from "antd";
import API_URL from "../../Config";

const DeshabilitarVehiculo = ({
  vehiculoId,
  userId,
  onDeshabilitar,
  vehiculoPlaca,
}) => {
  const [motivo, setMotivo] = useState("");  // Estado para almacenar el motivo de deshabilitación
  const [modalVisible, setModalVisible] = useState(false);  // Estado para manejar la visibilidad del modal

  const handleDeshabilitar = () => {
    setModalVisible(true);  // Muestra el modal
  };

  const handleOk = async () => {
    if (!motivo) {
      notification.error({
        message: "Error",
        description: "El motivo es requerido.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: "Error",
        description: "No estás autenticado",
      });
      return;
    }

    const formData = new FormData();
    formData.append("motivo", motivo);

    try {
      const response = await fetch(
        `${API_URL}/Vehiculos/deshabilitar-vehiculo/${userId}/${vehiculoId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        notification.success({
          message: "Éxito",
          description: "Vehículo deshabilitado exitosamente.",
        });
        onDeshabilitar();
        setModalVisible(false);  // Oculta el modal
      } else {
        const errorData = await response.json();
        notification.error({
          message: "Error",
          description: errorData.error || "Error al deshabilitar el vehículo.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          "Error al deshabilitar el vehículo. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleCancel = () => {
    setModalVisible(false);  // Oculta el modal
  };

  return (
    <>
      <button
        className="p-2 bg-red-500 text-white rounded-full"
        onClick={handleDeshabilitar}
        title="Deshabilitar vehículo"
      >
        <FaBan />
      </button>
      <Modal
        title={`¿Estás seguro de deshabilitar el vehículo con placa ${vehiculoPlaca}?`}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Sí"
        okType="danger"
        cancelText="No"
      >
        <p>Esta acción deshabilitará el vehículo y no podrá volver a ser usado.</p>
        <Input.TextArea
          rows={4}
          placeholder="Ingresa el motivo para deshabilitar el vehículo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default DeshabilitarVehiculo;
