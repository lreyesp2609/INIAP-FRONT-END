import React, { useState, useEffect } from "react";
import { Card, message } from "antd"; // Importar Card y message de Ant Design
import API_URL from "../../../../Config"; // Asumiendo que tienes esta configuración

const ListarAlertasActivas = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // Obtener el token desde localStorage

  // Verificar si el token existe antes de realizar la solicitud
  useEffect(() => {
    if (!token) {
      message.error('Token no proporcionado');
      setLoading(false);
      return;
    }

    // Obtener las alertas activas desde el servidor
    const obtenerAlertas = async () => {
      try {
        const response = await fetch(`${API_URL}/Mantenimientos/alertas/`, {
          method: 'GET',
          headers: {
            Authorization: token, // Enviar el token sin 'Bearer'
          },
        });

        if (!response.ok) {
          const result = await response.json();
          message.error(result.error || 'Error al obtener las alertas');
          setLoading(false);
          return;
        }

        const result = await response.json();
        if (result.length === 0) {
          message.warning('No hay alertas activas');
        }
        setAlertas(result);
      } catch (error) {
        console.error('Error al obtener las alertas:', error);
        message.error('Hubo un error al obtener las alertas');
      } finally {
        setLoading(false);
      }
    };

    obtenerAlertas();
  }, [token]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {loading ? (
        <p className="text-center text-lg text-blue-500">Cargando alertas...</p>
      ) : alertas.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No se encontraron alertas activas.</p>
      ) : (
        alertas.map((alerta, index) => (
          <Card
            key={index}
            title={<span className="text-lg font-bold text-black-600">{alerta.placa}</span>} // Usar placa como título
            bordered={false}
            className="shadow-xl hover:shadow-2xl transition-shadow duration-300"
            hoverable
            style={{ backgroundColor: '#f4f8ff', borderRadius: '10px' }} // Fondo y bordes redondeados
          >
            <div className="space-y-4 text-gray-700">
              <div className="flex items-center justify-between">
                <strong className="text-md font-medium">Modelo:</strong>
                <span>{alerta.modelo}</span>
              </div>
              <div className="flex items-center justify-between">
                <strong className="text-md font-medium">Kilometraje de Activación:</strong>
                <span>{alerta.kilometraje}</span>
              </div>
              <div className="flex items-center justify-between">
                <strong className="text-md font-medium">Tipo de Mantenimiento:</strong>
                <span>{alerta.tipo_mantenimiento}</span>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default ListarAlertasActivas;
