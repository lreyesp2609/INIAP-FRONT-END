import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import { notification, Modal, Input, Button } from "antd";
import TablaVehiculosDeshabilitados from "./Tablas/tablavehiculosdeshabilitado";

const HabilitarVehiculo = ({ userId, fetchVehiculos, onVolver }) => {
  const [vehiculosDeshabilitados, setVehiculosDeshabilitados] = useState([]);
  const [vehiculoAConfirmar, setVehiculoAConfirmar] = useState(null);
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (userId) {
      fetchVehiculosDeshabilitados(userId);
    }
  }, [userId]);

  const fetchVehiculosDeshabilitados = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/Vehiculos/vehiculosdeshabilitados/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVehiculosDeshabilitados(data.vehiculos);
      } else {
        console.error("Error al obtener vehículos deshabilitados:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener vehículos deshabilitados:", error);
    }
  };

  const handleHabilitarVehiculo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: "Error",
        description: "No estás autenticado",
      });
      return;
    }

    if (!motivo.trim()) {
      notification.error({
        message: "Error",
        description: "El motivo no puede estar vacío",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/Vehiculos/habilitar-vehiculo/${userId}/${vehiculoAConfirmar.id_vehiculo}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ motivo }).toString(),
        }
      );

      if (response.ok) {
        notification.success({
          message: "Vehículo Habilitado",
          description: "El vehículo ha sido habilitado exitosamente.",
        });
        fetchVehiculos(userId);
        fetchVehiculosDeshabilitados(userId);
        setMotivo("");
        setVehiculoAConfirmar(null);
      } else {
        const errorData = await response.json();
        notification.error({
          message: "Error al habilitar vehículo",
          description: errorData.error || response.statusText,
        });
      }
    } catch (error) {
      console.error("Error al habilitar vehículo:", error);
    }
  };

  const mostrarModalConfirmacion = (vehiculo) => {
    setVehiculoAConfirmar(vehiculo);
    setMotivo("");
  };

  const handleOk = () => {
    handleHabilitarVehiculo();
  };

  const handleCancel = () => {
    setVehiculoAConfirmar(null);
    setMotivo("");
  };

  return (
    <div className="w-full p-4">
  <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
    <h1 className="text-2xl font-light text-center md:text-left">Vehículos Deshabilitados</h1>
    <button
      onClick={onVolver}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold 
      py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"
      >
      Volver a la Lista
    </button>
  </div>
  <TablaVehiculosDeshabilitados
    vehiculos={vehiculosDeshabilitados}
    onHabilitarVehiculo={mostrarModalConfirmacion}
  />
  {vehiculoAConfirmar && (
    <Modal
      title={`Habilitar Vehículo con Placa ${vehiculoAConfirmar.placa}`}
      visible={!!vehiculoAConfirmar}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Habilitar"
      cancelText="Cancelar"
      className="ant-modal-confirm"
    >
      <p>
        ¿Estás seguro de que quieres habilitar el vehículo con placa{' '}
        <strong>{vehiculoAConfirmar.placa}</strong>?
      </p>
      <Input
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        placeholder="Motivo por el cual se está habilitando el vehículo"
        className="mt-4"
      />
    </Modal>
  )}
</div>

  );
};

export default HabilitarVehiculo;
