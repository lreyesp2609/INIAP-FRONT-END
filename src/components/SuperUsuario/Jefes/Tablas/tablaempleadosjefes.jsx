import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Modal, Button } from "antd";

const TablaEmpleadosJefes = ({ empleados, asignarJefe, asignarDirector }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDirectorModalVisible, setIsDirectorModalVisible] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  const showConfirmModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setIsModalVisible(true);
  };

  const showDirectorConfirmModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setIsDirectorModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDirectorModalVisible(false);
    setSelectedEmpleado(null);
  };

  const handleConfirm = () => {
    if (selectedEmpleado) {
      asignarJefe(selectedEmpleado);
      handleCancel();
    }
  };

  const handleDirectorConfirm = () => {
    if (selectedEmpleado) {
      asignarDirector(selectedEmpleado);
      handleCancel();
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="hidden md:block">
          <table className="min-w-full bg-white border border-gray-200 table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombres</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Apellidos</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cédula</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unidad</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cargo</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Jefe de Unidad</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Director de Estación</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">{empleado.nombres}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{empleado.apellidos}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{empleado.cedula}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{empleado.nombre_unidad}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{empleado.cargo}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {empleado.es_jefe ? (
                      <FaCheckCircle className="text-green-500" title="Es jefe" />
                    ) : (
                      <FaTimesCircle className="text-red-500" title="No es jefe" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {empleado.es_director ? (
                      <FaCheckCircle className="text-green-500" title="Es director" />
                    ) : (
                      <FaTimesCircle className="text-red-500" title="No es director" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {!empleado.es_jefe && (
                      <Button
                        onClick={() => showConfirmModal(empleado)}
                        type="secundary" // Cambia de 'primary' a 'default'
                        size="small"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Asignar como Jefe
                      </Button>
                    )}
                    {!empleado.es_director && (
                      <Button
                        onClick={() => showDirectorConfirmModal(empleado)}
                        type="secundary" // Cambia de 'primary' a 'default'
                        size="small"
                        className="bg-green-500 hover:bg-green-600 text-white" // Cambia los colores según lo que prefieras
                      >
                        Asignar como Director
                      </Button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Vista móvil */}
        <div className="block md:hidden">
          {empleados.map((empleado, index) => (
            <div key={index} className="mb-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
              <div className="mb-2">
                <span className="font-bold">Nombres: </span>
                {empleado.nombres}
              </div>
              <div className="mb-2">
                <span className="font-bold">Apellidos: </span>
                {empleado.apellidos}
              </div>
              <div className="mb-2">
                <span className="font-bold">Cédula: </span>
                {empleado.cedula}
              </div>
              <div className="mb-2">
                <span className="font-bold">Unidad: </span>
                {empleado.nombre_unidad}
              </div>
              <div className="mb-2">
                <span className="font-bold">Cargo: </span>
                {empleado.cargo}
              </div>
              <div className="mb-2">
                <span className="font-bold">Jefe: </span>
                {empleado.es_jefe ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
              </div>
              <div className="mb-2">
                <span className="font-bold">Director: </span>
                {empleado.es_director ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
              </div>
              <div className="flex space-x-2">
                {!empleado.es_jefe && (
                  <Button
                    onClick={() => showConfirmModal(empleado)}
                    type="primary"
                    size="small"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Asignar como Jefe
                  </Button>
                )}
                {!empleado.es_director && (
                  <Button
                    onClick={() => showDirectorConfirmModal(empleado)}
                    type="primary"
                    size="small"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Asignar como Director
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmación para Jefe */}
      <Modal
        title="Confirmación"
        visible={isModalVisible}
        onCancel={handleCancel}
        okText="Confirmar"
        cancelText="Cancelar"
        onOk={handleConfirm}
      >
        {selectedEmpleado && (
          <p>
            ¿Estás seguro de que quieres asignar a {selectedEmpleado.nombres}{" "}
            {selectedEmpleado.apellidos} (Cédula: {selectedEmpleado.cedula}) como jefe
            de la unidad {selectedEmpleado.nombre_unidad}?
          </p>
        )}
      </Modal>

      {/* Modal de confirmación para Director */}
      <Modal
        title="Confirmación"
        visible={isDirectorModalVisible}
        onCancel={handleCancel}
        okText="Confirmar"
        cancelText="Cancelar"
        onOk={handleDirectorConfirm}
      >
        {selectedEmpleado && (
          <p>
            ¿Estás seguro de que quieres asignar a {selectedEmpleado.nombres}{" "}
            {selectedEmpleado.apellidos} (Cédula: {selectedEmpleado.cedula}) como director
            de la estación {selectedEmpleado.nombre_estacion}?
          </p>
        )}
      </Modal>
    </div>
  );
};

export default TablaEmpleadosJefes;
