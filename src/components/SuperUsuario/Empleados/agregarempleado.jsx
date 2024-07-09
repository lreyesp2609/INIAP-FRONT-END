import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import { notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import FormularioEmpleado from "./Formularios/formularioempleado";

const AgregarEmpleados = (props) => {
  const { onClose, user } = props;
  const [roles, setRoles] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [formData, setFormData] = useState({
    id_estacion: "",
    id_unidad: "",
    numero_cedula: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    genero: "",
    celular: "",
    direccion: "",
    correo_electronico: "",
    id_cargo: "",
    distintivo: "",
    id_rol: "",
  });

  useEffect(() => {
    fetchUserDetails(user.usuario.id_usuario); // Fetch user details on component mount
    fetchRoles();
  }, []);

  useEffect(() => {
    if (formData.id_estacion) {
      fetchUnidades(formData.id_estacion);
    }
  }, [formData.id_estacion]);

  useEffect(() => {
    if (formData.id_estacion && formData.id_unidad) {
      fetchCargos(formData.id_estacion, formData.id_unidad);
    }
  }, [formData.id_estacion, formData.id_unidad]);

  const fetchUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(
        `${API_URL}/Login/obtener_usuario/${userId}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const usuario = data.usuario;

        setFormData((prevData) => ({
          ...prevData,
          id_estacion: usuario.estacion.id_estacion,
          id_unidad:
            usuario.unidades.length > 0 ? usuario.unidades[0].id_unidad : "",
        }));
        setEstaciones([usuario.estacion]);
        setUnidades(usuario.unidades);

        if (usuario.unidades.length > 0) {
          fetchCargos(
            usuario.estacion.id_estacion,
            usuario.unidades[0].id_unidad
          );
        }
      } else {
        console.error("Error:", response.statusText);
        notification.error({
          message: "Error",
          description: "Error al obtener los detalles del usuario",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: "Error al obtener los detalles del usuario",
      });
    }
  };

  const fetchEstaciones = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(`${API_URL}/Estaciones/estaciones/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEstaciones(data);

        if (data.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            id_estacion: data[0].id_estacion,
          }));
          fetchUnidades(data[0].id_estacion);
        }
      } else {
        console.error("Error:", response.statusText);
        notification.error({
          message: "Error",
          description: "Error al obtener las estaciones",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: "Error al obtener las estaciones",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "id_estacion") {
      fetchUnidades(value);
    } else if (name === "id_unidad") {
      fetchCargos(formData.id_estacion, value);
    }
  };

  const fetchUnidades = async (estacionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const formData = new FormData();
      formData.append("estacion_id", estacionId);

      const response = await fetch(`${API_URL}/Unidades/unidades/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUnidades(data);

        if (data.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            id_unidad: data[0].id_unidad,
          }));
          fetchCargos(estacionId, data[0].id_unidad);
        }
      } else {
        console.error("Error:", response.statusText);
        notification.error({
          message: "Error",
          description: "Error al obtener las unidades",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: "Error al obtener las unidades",
      });
    }
  };

  const fetchCargos = async (estacionId, unidadId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const formData = new FormData();
      formData.append("estacion_id", estacionId);
      formData.append("unidad_id", unidadId);

      const response = await fetch(`${API_URL}/Cargos/cargos/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCargos(data);
      } else {
        console.error("Error:", response.statusText);
        notification.error({
          message: "Error",
          description: "Error al obtener los cargos",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: "Error al obtener los cargos",
      });
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(`${API_URL}/Roles/roles/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles);
      } else {
        console.error("Error:", response.statusText);
        notification.error({
          message: "Error",
          description: "Error al obtener los roles",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: "Error al obtener los roles",
      });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const formDataToSend = new FormData(
        document.getElementById("employeeForm")
      );

      const response = await fetch(
        `${API_URL}/Empleados/nuevo-empleado/${user.usuario.id_usuario}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        onClose();
        notification.success({
          message: "Éxito",
          description: "Empleado agregado exitosamente",
        });
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error:", errorJson);
          notification.error({
            message: "Error",
            description: `Error al agregar el empleado: ${errorJson.error}`,
          });
        } catch (parseError) {
          console.error("Error al parsear JSON de error:", parseError);
          notification.error({
            message: "Error",
            description: `Error al agregar el empleado: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: `Error al agregar el empleado: ${error}`,
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4">Agregar Empleado</h2>
        <FormularioEmpleado
          formData={formData}
          handleInputChange={handleInputChange}
          cargos={cargos}
          roles={roles}
          estaciones={estaciones}
          unidades={unidades}
        />
        <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
          <button
            type="button"
            onClick={onClose}
            className="
            w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 border-b-4 border-red-400 hover:border-red-900 rounded
            "
          >
           <FontAwesomeIcon icon={faTimes} /> Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar
          </button>
        </div>

      </div>
    </div>
  );
};

export default AgregarEmpleados;
