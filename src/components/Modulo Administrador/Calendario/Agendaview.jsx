import React, { useState, useEffect } from "react";
import DetalleOrden from "./detalleorden";
import MostrarSolicitudAdministrador from "./MostrarSolicitudDetalleAdmin";

const AgendaView = ({
  ordenesAprobadas,
  solicitudesAceptadas,
  handleShowSolicitud,
}) => {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [mostrarLista, setMostrarLista] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [token, setToken] = useState(null);

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
    return new Date(`1970-01-01T${time}Z`).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupItemsByDate = (items, dateField) => {
    return items.reduce((acc, item) => {
      const fecha = item[dateField];
      if (!fecha) return acc;
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return acc;
      const formattedDate = date.toISOString().split("T")[0];
      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(item);
      return acc;
    }, {});
  };

  const ordersByDate = groupItemsByDate(ordenesAprobadas, "fecha_viaje");
  const solicitudesAceptadasByDate = groupItemsByDate(
    solicitudesAceptadas,
    "Fecha de Llegada"
  );

  const allDates = [
    ...new Set([
      ...Object.keys(ordersByDate),
      ...Object.keys(solicitudesAceptadasByDate),
    ]),
  ].sort();

  const handleOrderClick = (orderId) => {
    setOrdenSeleccionada(orderId);
    setMostrarLista(false);
  };

  const handleSolicitudClick = (id) => {
    setSolicitudSeleccionada(id); // Establecer solicitud seleccionada
    setMostrarLista(false);
  };

  const handleCloseDetail = () => {
    setOrdenSeleccionada(null);
    setSolicitudSeleccionada(null); // Limpiar solicitud seleccionada
    setMostrarLista(true);
  };

  return (
    <div>
      {ordenSeleccionada && (
        <DetalleOrden
          idUsuario={idUsuario}
          idOrden={ordenSeleccionada}
          token={token}
          onClose={handleCloseDetail}
        />
      )}
      {solicitudSeleccionada && (
        <MostrarSolicitudAdministrador
          id={solicitudSeleccionada}
          onClose={handleCloseDetail}
        />
      )}
      {mostrarLista && (
        <>
          {allDates.length === 0 ? (
            <p>No hay órdenes ni solicitudes para mostrar.</p>
          ) : (
            allDates.map((date) => (
              <div key={date} className="mb-4">
                <h2 className="text-lg font-bold">{formatDate(date)}</h2>
                {ordersByDate[date]?.map((order) => (
                  <div
                    key={order.id_orden_movilizacion}
                    className="p-2 border border-gray-300 rounded mt-2 cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      handleOrderClick(order.id_orden_movilizacion)
                    }
                  >
                    <div className="text-sm text-gray-600">
                      {`${formatTime(order.hora_ida)} - ${formatTime(
                        order.hora_regreso
                      )}`}
                      <span className="mx-2 inline-block w-2 h-2 bg-orange-400 rounded-full"></span>
                      {`Orden de movilización: ${order.motivo_movilizacion}`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {`Secuencial: ${order.secuencial_orden_movilizacion}`}
                    </div>
                  </div>
                ))}
                {solicitudesAceptadasByDate[date]?.map((viaje) => (
                  <div
                    key={viaje["Codigo de Solicitud"]}
                    className="p-2 border border-gray-300 rounded mt-2 hover:bg-gray-100"
                    onClick={() => {
                      handleShowSolicitud(viaje.id); // Asegúrate de que aquí coincida con el nombre esperado en MostrarSolicitudAdministrador
                    }}
                    title={viaje["Codigo de Solicitud"]}
                  >
                    <div className="text-sm text-gray-600">
                      <span className="mx-2 inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                      {`Viaje: ${viaje["Codigo de Solicitud"]}`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {`Motivo: ${viaje["Motivo"]}`}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default AgendaView;
