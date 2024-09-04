import React, { useState } from "react";
import { FaBan } from "react-icons/fa";
import { Modal, notification, Input } from "antd";
import API_URL from "../../../Config";

const DeshabilitarVehiculo = ({
  vehiculoId,
  userId,
  onDeshabilitar,
  fetchVehiculos, // Asegúrate de que esta prop esté presente
  vehiculoPlaca,
}) => {
  const [motivo, setMotivo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeshabilitar = () => {
    setModalVisible(true);
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

      const responseData = await response.json();

      if (response.ok) {
        notification.success({
          message: "Éxito",
          description: responseData.mensaje || "Vehículo deshabilitado correctamente.",
        });
        if (fetchVehiculos) {
          fetchVehiculos(); // Llama a la función para actualizar la lista de vehículos
        }
        onDeshabilitar(); // Llama a la función para actualizar la lista de vehículos
        setModalVisible(false);
      } else {
        notification.error({
          message: "Error",
          description: responseData.error || "Error al deshabilitar el vehículo.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Error al deshabilitar el vehículo. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <button
        className="p-2 bg-red-500 text-white rounded-full text-xl md:text-base"
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
        className="max-w-full md:max-w-lg"
      >
        <p>Esta acción deshabilitará el vehículo y no podrá volver a ser usado.</p>
        <Input.TextArea
          rows={4}
          placeholder="Ingresa el motivo para deshabilitar el vehículo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="w-full"
        />
      </Modal>

    </>
  );
};

export default DeshabilitarVehiculo;
