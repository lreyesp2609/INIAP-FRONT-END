import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import { notification, Modal, Button } from "antd";
import TablaMotivosDeshabilitados from "./Tablas/tablamotivosdeshabilitados";

const HabilitarMotivo = ({ userId, fetchOrdenes, onVolver }) => {
  const [motivosDeshabilitados, setMotivosDeshabilitados] = useState([]);
  const [motivoAConfirmar, setMotivoAConfirmar] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchOrdenesDeshabilitados(userId);
    }
  }, [userId]);

  const fetchOrdenesDeshabilitados = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/MotivosOrdenes/listar-motivos-deshabilitados/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMotivosDeshabilitados(data.motivos);
      } else {
        console.error("Error al obtener motivos deshabilitados:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener motivos deshabilitados:", error);
    }
  };

  const handleHabilitarMotivo = async () => {
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
        `${API_URL}/MotivosOrdenes/habilitar-motivo/${userId}/${motivoAConfirmar.id_motivo}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        notification.success({
          message: "Motivo Habilitado",
          description: "El motivo ha sido habilitado exitosamente.",
        });
        fetchOrdenes(userId);
        fetchOrdenesDeshabilitados(userId);
        setMotivoAConfirmar(null);
      } else {
        const errorData = await response.json();
        notification.error({
          message: "Error al habilitar motivo",
          description: errorData.error || response.statusText,
        });
      }
    } catch (error) {
      console.error("Error al habilitar motivo:", error);
    }
  };

  const mostrarModalConfirmacion = (motivo) => {
    setMotivoAConfirmar(motivo);
  };

  const handleOk = () => {
    handleHabilitarMotivo();
  };

  const handleCancel = () => {
    setMotivoAConfirmar(null);
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-light">Motivos Deshabilitados</h1>
        <button
          onClick={onVolver}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Volver a la Lista
        </button>
      </div>
      <TablaMotivosDeshabilitados
        motivos={motivosDeshabilitados}
        onHabilitarMotivo={mostrarModalConfirmacion}
      />
      {motivoAConfirmar && (
        <Modal
          title={`Habilitar Motivo ${motivoAConfirmar.nombre_motivo}`}
          visible={!!motivoAConfirmar}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Habilitar"
          cancelText="Cancelar"
          className="ant-modal-confirm"
        >
          <p>¿Estás seguro de que quieres habilitar el motivo <strong>{motivoAConfirmar.nombre_motivo}</strong>?</p>
        </Modal>
      )}
    </div>
  );
};

export default HabilitarMotivo;
