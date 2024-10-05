import React, { useState, useEffect } from "react";
import { notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

import API_URL from "../../../Config";
import FormularioEditarEmpleado from "./Formularios/formulario_editar_empleado";

const EditarUsuario = ({ empleado, onClose, user, fetchEmpleados }) => {
  const [formData, setFormData] = useState({
    nombres: empleado.nombres,
    apellidos: empleado.apellidos,
    cedula: empleado.cedula,
    correo_electronico: empleado.correo_electronico,
    fecha_nacimiento: empleado.fecha_nacimiento,
    celular: empleado.celular,
    cargo: empleado.cargo ? empleado.cargo.id_cargo : "",
    unidad: empleado.unidad ? empleado.unidad.id_unidad : "",
    estacion: empleado.estacion ? empleado.estacion.id_estacion : "",
    fecha_ingreso: empleado.fecha_ingreso,
    direccion: empleado.direccion,
    id_rol: empleado.rol ? empleado.rol.id_rol : "",
    genero: empleado.genero || "", // Asegura que si no hay género, sea una cadena vacía
    id_unidad: empleado.id_unidad,
    id_estacion: empleado.id_estacion,
    id_cargo: empleado.id_cargo,
    usuario: empleado.usuario,
    distintivo: empleado.distintivo,
    licencias: empleado.licencias ? empleado.licencias.id_tipo_licencia : null,
    id_licencia: empleado.id_tipo_licencia || null,
  });

  const [cargos, setCargos] = useState([]);
  const [licencias, setLicencias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchEmpleadoDetalle = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/Empleados/detalle-empleado/${user.usuario.id_usuario}/${empleado.id_empleado}/`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFormData((prevFormData) => ({
            ...prevFormData,
            cargo: data.cargo ? data.cargo.id_cargo : "",
            id_cargo: data.cargo ? data.cargo.id_cargo : "",
            estacion: data.estacion ? data.estacion.id_estacion : "",
            id_estacion: data.estacion ? data.estacion.id_estacion : "",
            unidad: data.unidad ? data.unidad.id_unidad : "",
            id_unidad: data.unidad ? data.unidad.id_unidad : "",
            id_rol: data.rol ? data.rol.id_rol : "",
            id_tipo_licencia: data.licencia ? data.licencia.id_tipo_licencia : "",
          }));
        } else {
          console.error(
            "Error al obtener detalle de empleado:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error al obtener detalle de empleado:", error);
      }
    };

    fetchEmpleadoDetalle();
  }, [empleado.id_empleado, user.usuario.id_usuario]);

  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/Roles/roles/`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRoles(data.roles);
        } else {
          console.error("Error al obtener roles:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchCargos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const formDataForCargos = new FormData();
        formDataForCargos.append("estacion_id", formData.estacion);
        formDataForCargos.append("unidad_id", formData.unidad);

        const response = await fetch(`${API_URL}/Cargos/cargos/`, {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formDataForCargos,
        });

        if (response.ok) {
          const data = await response.json();
          setCargos(data);
        } else {
          console.error("Error al obtener cargos:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener cargos:", error);
      }
    };

    if (formData.estacion && formData.unidad) {
      fetchCargos();
    }
  }, [formData.estacion, formData.unidad]);
  
  useEffect(() => {
    const fetchLicencias = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
  
      try {
        const response = await fetch(`${API_URL}/Licencias/listar-tipos/${user.usuario.id_usuario}/`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setLicencias(data.tipos_licencias);
        } else {
          console.error("Error al obtener las licencias:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener licencias:", error);
      }
    };
  
    fetchLicencias();
  }, [user.usuario.id_usuario]);
  
  useEffect(() => {
    const fetchUnidades = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const formDataForUnidades = new FormData();
        formDataForUnidades.append("estacion_id", formData.estacion);

        const response = await fetch(`${API_URL}/Unidades/unidades/`, {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formDataForUnidades,
        });

        if (response.ok) {
          const data = await response.json();
          setUnidades(data);
        } else {
          console.error("Error al obtener unidades:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener unidades:", error.message);
      }
    };

    if (formData.estacion) {
      fetchUnidades();
    }
  }, [formData.estacion]);

  useEffect(() => {
    const fetchEstaciones = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/Estaciones/estaciones/${user.usuario.id_usuario}/`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEstaciones(data);
        } else {
          console.error("Error al obtener estaciones:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener estaciones:", error);
      }
    };

    fetchEstaciones();
  }, [user.usuario.id_usuario]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "habilitado" ? newValue === true : newValue,
    }));
  
    // Si se cambia la estación, resetea la unidad y el cargo
    if (name === "estacion") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        unidad: "",
        id_cargo: "",
      }));
    }
    
    // Si se cambia la unidad, resetea solo el cargo
    if (name === "unidad") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_cargo: "",
      }));
    }
  };
  
  const handleSave = async () => {
    if (!formData.id_cargo) {
      notification.error({
        message: "Error al actualizar",
        description: "Se necesita un cargo para actualizar.",
      });
      return;
    }

    if (!["Masculino", "Femenino"].includes(formData.genero)) {
      notification.error({
        message: "Error de validación",
        description: "El género debe ser Masculino o Femenino"
      });
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
  
    try {
      const formDataForUpdate = new FormData();
      formDataForUpdate.append("numero_cedula", formData.cedula);
      formDataForUpdate.append("nombres", formData.nombres);
      formDataForUpdate.append("apellidos", formData.apellidos);
      formDataForUpdate.append("fecha_nacimiento", formData.fecha_nacimiento);
      formDataForUpdate.append("genero", formData.genero);
      formDataForUpdate.append("celular", formData.celular);
      formDataForUpdate.append("direccion", formData.direccion);
      formDataForUpdate.append("correo_electronico", formData.correo_electronico);
      formDataForUpdate.append("id_cargo", formData.id_cargo);
      formDataForUpdate.append("fecha_ingreso", formData.fecha_ingreso);
      formDataForUpdate.append("usuario", formData.usuario);
      formDataForUpdate.append("distintivo", formData.distintivo);
      formDataForUpdate.append("id_rol", formData.id_rol);
      formDataForUpdate.append("id_licencia", formData.id_licencia !== undefined ? formData.id_licencia : null);
  
      const response = await fetch(
        `${API_URL}/Empleados/editar-empleado/${user.usuario.id_usuario}/${empleado.id_empleado}/`,
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formDataForUpdate,
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        onClose();
        fetchEmpleados(user.usuario.id_usuario);
        notification.success({
          message: "Empleado actualizado",
          description:
            data.mensaje ||
            "Los datos del empleado han sido actualizados correctamente.",
        });
      } else {
        console.error(
          "Error al actualizar empleado:",
          data.error || response.statusText
        );
        notification.error({
          message: "Error al actualizar",
          description:
            data.error ||
            "Hubo un problema al intentar actualizar los datos del empleado.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      notification.error({
        message: "Error al actualizar",
        description:
          "Hubo un problema al intentar actualizar los datos del empleado.",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Editar Empleado</h2>
      <FormularioEditarEmpleado
        formData={formData}
        handleInputChange={handleInputChange}
        cargos={cargos}
        roles={roles}
        licencias={licencias}
        unidades={unidades}
        estaciones={estaciones}
        handleSave={handleSave}
      />
      <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
          <button
            type="button"
            onClick={onClose}
            className="
            w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 
            px-4 border-b-4 border-red-400 hover:border-red-900 rounded
            "
          >
           <FontAwesomeIcon icon={faTimes} /> Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 
            border-b-4 border-blue-300 hover:border-blue-700 rounded"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar
          </button>
        </div>
    </div>
  );
};

export default EditarUsuario;