import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import { notification, Modal, Input, Button } from "antd";
import TablaEmpleadosDeshabilitados from "./Tablas/tablaempleadosdeshabilitado";
import { MdPersonAdd } from "react-icons/md";

const HabilitarEmpleado = ({ user, fetchEmpleados, onVolver }) => {
  const [empleadosDeshabilitados, setEmpleadosDeshabilitados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);  // Estado para mostrar el modal
  const [motivo, setMotivo] = useState('');  // Estado para el motivo
  const [empleadoIdSeleccionado, setEmpleadoIdSeleccionado] = useState(null);  // Estado para el ID del empleado seleccionado

  useEffect(() => {
    if (user && user.usuario && user.usuario.id_usuario) {
      fetchEmpleadosDeshabilitados(user.usuario.id_usuario);
    }
  }, [user]);

  const fetchEmpleadosDeshabilitados = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/Empleados/lista-empleados-deshabilitados/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEmpleadosDeshabilitados(data);
      } else {
        console.error(
          "Error al obtener empleados deshabilitados:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error al obtener empleados deshabilitados:", error);
    }
  };

  const showModal = (empleadoId) => {
    setEmpleadoIdSeleccionado(empleadoId);
    setModalVisible(true);
  };

  const handleOk = async () => {
    if (!motivo) {
      notification.error({
        message: 'Error',
        description: 'Debes proporcionar un motivo para habilitar al empleado.',
      });
      return;
    }

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
        `${API_URL}/Empleados/habilitar-empleado/${user.usuario.id_usuario}/${empleadoIdSeleccionado}/`,
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
          description: 'Empleado habilitado exitosamente',
        });
        if (user && user.usuario && user.usuario.id_usuario) {
          fetchEmpleados(user.usuario.id_usuario);
          fetchEmpleadosDeshabilitados(user.usuario.id_usuario);
        }
        setModalVisible(false);  // Cierra el modal después de habilitar
        setMotivo('');  // Limpia el campo de motivo
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error || response.statusText,
        });
      }
    } catch (error) {
      console.error('Error al habilitar empleado:', error);
      notification.error({
        message: 'Error',
        description: 'Error al habilitar empleado',
      });
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setMotivo('');  // Limpia el campo de motivo al cancelar
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <h1 className="text-2xl font-light">Empleados Deshabilitados</h1>
        <button
          onClick={onVolver}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"
        >
          Volver a la Lista
        </button>
      </div>
      <TablaEmpleadosDeshabilitados
        empleados={empleadosDeshabilitados}
        onHabilitarEmpleado={showModal}  // Pasar la función para mostrar el modal
      />
      <Modal
        title={`¿Estás seguro de habilitar al empleado?`}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Sí"
        cancelText="No"
      >
        <p>Esta acción habilitará al empleado para que pueda acceder nuevamente al sistema.</p>
        <Input.TextArea
          placeholder="Ingresa el motivo para habilitar al empleado"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}  // Manejo del cambio del motivo
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default HabilitarEmpleado;
