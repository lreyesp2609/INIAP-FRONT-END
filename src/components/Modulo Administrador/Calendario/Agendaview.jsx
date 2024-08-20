import React, { useState, useEffect } from "react";
import DetalleOrden from "./detalleorden";

const AgendaView = ({ ordenesAprobadas }) => {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [mostrarLista, setMostrarLista] = useState(true); // Estado para controlar la visibilidad

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedUser.usuario && storedUser.usuario.id_usuario) {
      setIdUsuario(storedUser.usuario.id_usuario);
    } else {
      console.error("No se encontró id_usuario en localStorage");
    }

    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("No se encontró token en localStorage");
    }
  }, []);

  const formatDate = (date) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
      timeZone: "UTC",
    };
    return new Date(date + "T00:00:00Z").toLocaleDateString("es-ES", options);
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupOrdersByDate = (orders) => {
    const groupedOrders = orders.reduce((acc, order) => {
      const date = new Date(order.fecha_viaje).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(order);
      return acc;
    }, {});

    const sortedDates = Object.keys(groupedOrders).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    const sortedGroupedOrders = sortedDates.reduce((acc, date) => {
      acc[date] = groupedOrders[date];
      return acc;
    }, {});

    return sortedGroupedOrders;
  };

  const ordersByDate = groupOrdersByDate(ordenesAprobadas);

  const handleOrderClick = (orderId) => {
    setOrdenSeleccionada(orderId);
    setMostrarLista(false); // Ocultar lista al seleccionar una orden
  };

  const handleCloseDetail = () => {
    setOrdenSeleccionada(null);
    setMostrarLista(true); // Mostrar lista al cerrar el detalle
  };

  return (
    <div>
      {ordenSeleccionada && idUsuario && token && (
        <DetalleOrden
          idUsuario={idUsuario}
          idOrden={ordenSeleccionada}
          token={token}
          onClose={handleCloseDetail}
        />
      )}
      {mostrarLista && (
        Object.keys(ordersByDate).map((date) => (
          <div key={date} className="mb-4">
            <h2 className="text-lg font-bold">{formatDate(date)}</h2>
            {ordersByDate[date].map((order) => (
              <div
                key={order.id_orden_movilizacion}
                className="p-2 border border-gray-300 rounded mt-2 cursor-pointer"
                onClick={() => handleOrderClick(order.id_orden_movilizacion)}
              >
                <div className="text-sm text-gray-600">
                  {`${formatTime(order.hora_ida)} - ${formatTime(order.hora_regreso)}`}
                  <span className="mx-2 inline-block w-2 h-2 bg-orange-400 rounded-full"></span>
                  {`Orden de movilización: ${order.motivo_movilizacion}`}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AgendaView;
