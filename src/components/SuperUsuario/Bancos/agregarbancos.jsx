import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../Config";
import FormularioBanco from "./Formularios/formulariobanco";

const AgregarBanco = ({ onClose, onBancoAdded }) => {
  const [nombre_banco, setNombreBanco] = useState("");
  const [id_usuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.usuario) {
      setIdUsuario(storedUser.usuario.id_usuario);
    } else {
      console.error("Usuario no encontrado en localStorage");
    }
  }, []);

  const handleInputChange = (e) => {
    setNombreBanco(e.target.value);
  };

  const handleSave = async () => {
    if (!id_usuario) {
      console.error("ID de usuario no encontrado");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("nombre_banco", nombre_banco);

      const response = await fetch(
        `${API_URL}/Bancos/crear-banco/${id_usuario}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        notification.success({
          message: "Éxito",
          description: "Banco agregado correctamente",
        });
        onBancoAdded();
        onClose();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error:", errorJson);
          notification.error({
            message: "Error",
            description: `Error al agregar el banco: ${errorJson.error}`,
          });
        } catch (parseError) {
          console.error("Error al parsear JSON de error:", parseError);
          notification.error({
            message: "Error",
            description: `Error al agregar el banco: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error al agregar el banco:", error);
      notification.error({
        message: "Error",
        description: `Error al agregar el banco: ${error}`,
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <button
          onClick={onClose}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Volver a la Lista
        </button>
        <h2 className="text-2xl font-bold mb-4">Agregar Banco</h2>
        <FormularioBanco
          nombre_banco={nombre_banco}
          onInputChange={handleInputChange}
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarBanco;
