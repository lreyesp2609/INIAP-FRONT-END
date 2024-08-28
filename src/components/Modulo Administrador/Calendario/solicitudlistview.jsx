import React from "react";

const SolicitudListView = ({ ordenes, viajes, onClose, onOrdenSelect }) => {
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

  const ordersByDate = groupItemsByDate(ordenes, "fecha_viaje");
  const viajesByDate = groupItemsByDate(viajes, "Fecha de Llegada");

  const allDates = [
    ...new Set([...Object.keys(ordersByDate), ...Object.keys(viajesByDate)]),
  ].sort();

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      {allDates.length === 0 ? (
        <p>No hay órdenes ni viajes para mostrar.</p>
      ) : (
        <>
          {allDates.map((date) => (
            <div key={date} className="mb-4">
              <h2 className="text-lg font-bold">{formatDate(date)}</h2>
              {ordersByDate[date]?.map((order) => (
                <div
                  key={order.id_orden_movilizacion}
                  className="p-2 border border-gray-300 rounded mt-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => onOrdenSelect(order.id_orden_movilizacion)}
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
              {viajesByDate[date]?.map((viaje) => (
                <div
                  key={viaje["Codigo de Solicitud"]}
                  className="p-2 border border-gray-300 rounded mt-2 hover:bg-gray-100"
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
          ))}
        </>
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
