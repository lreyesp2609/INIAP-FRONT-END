import React from "react";

const SolicitudListView = ({ ordenes, onClose, onOrdenSelect }) => {
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

  const groupOrdersByDate = (orders) => {
    return orders.reduce((acc, order) => {
      const date = new Date(order.fecha_viaje).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(order);
      return acc;
    }, {});
  };

  const ordersByDate = groupOrdersByDate(ordenes);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      {Object.keys(ordersByDate).length === 0 ? (
        <p>No hay órdenes para mostrar.</p>
      ) : (
        Object.keys(ordersByDate).map((date) => (
          <div key={date} className="mb-4">
            <h2 className="text-lg font-bold">{formatDate(date)}</h2>
            {ordersByDate[date].map((order) => (
              <div
                key={order.id_orden_movilizacion}
                className="p-2 border border-gray-300 rounded mt-2 cursor-pointer"
                onClick={() => onOrdenSelect(order.id_orden_movilizacion)}
              >
                <div className="text-sm text-gray-600">
                  {`${formatTime(order.hora_ida)} - ${formatTime(
                    order.hora_regreso
                  )}`}
                  <span className="mx-2 inline-block w-2 h-2 bg-orange-400 rounded-full"></span>
                  {`Orden de movilización: ${order.motivo_movilizacion}`}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Cerrar
      </button>
    </div>
  );
};

export default SolicitudListView;
