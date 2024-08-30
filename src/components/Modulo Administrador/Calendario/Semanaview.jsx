import React from "react";

const SemanaView = ({
  date,
  ordenesAprobadas,
  solicitudesAceptadas,
  onOrdenClick,
  handleShowSolicitud
}) => {
  const startOfWeek = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  startOfWeek.setUTCDate(
    startOfWeek.getUTCDate() - ((startOfWeek.getUTCDay() + 6) % 7)
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);

  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setUTCDate(startOfWeek.getUTCDate() + i);
    daysOfWeek.push(day);
  }

  const dateFormatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    timeZone: "UTC",
  });

  const headerFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const isSameDay = (date1, date2, useUTC = false) => {
    if (useUTC) {
      date1.setUTCHours(0, 0, 0, 0);
      date2.setUTCHours(0, 0, 0, 0);
      return (
        date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
      );
    } else {
      date1.setHours(0, 0, 0, 0);
      date2.setHours(0, 0, 0, 0);
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    }
  };

  return (
    <div>
      <h2 className="text-center text-xl mb-4">
        {`${headerFormatter.format(startOfWeek)} - ${headerFormatter.format(endOfWeek)}`}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
        {daysOfWeek.map((day, i) => {
          const ordenesDelDia = ordenesAprobadas.filter(o => {
            const fechaEmision = new Date(o.fecha_hora_emision);
            return isSameDay(fechaEmision, day, false);
          });

          const solicitudesDelDia = solicitudesAceptadas.filter(s => {
            const fechaSolicitud = new Date(s["Fecha Solicitud"]);
            return isSameDay(fechaSolicitud, day, true);
          });

          return (
            <div
              key={i}
              className="border p-2 relative min-w-[4rem] sm:min-w-[5rem] lg:min-w-[7rem] h-auto flex flex-col items-center justify-start overflow-hidden"
            >
              <div className="font-bold text-xs mb-1">
                {dateFormatter.format(day)}
              </div>
              <div className="w-full flex flex-col items-center space-y-1">
                {ordenesDelDia.map((orden, index) => (
                  <button
                    key={`orden-${index}`}
                    className="w-full px-1 py-0.5 text-xs bg-yellow-400 border border-yellow-400 text-black hover:bg-yellow-300 rounded truncate"
                    onClick={() => onOrdenClick(orden.id_orden_movilizacion)}
                    title={orden.secuencial_orden_movilizacion}
                  >
                    {orden.secuencial_orden_movilizacion.slice(0, 8)}...
                  </button>
                ))}
                {solicitudesDelDia.map((solicitud, index) => (
                  <button
                    key={`solicitud-${index}`}
                    className="w-full px-1 py-0.5 text-xs bg-blue-400 border border-blue-400 text-white hover:bg-blue-300 rounded truncate"
                    onClick={() => {
                      handleShowSolicitud(solicitud.id); // Asegúrate de que aquí coincida con el nombre esperado en MostrarSolicitudAdministrador
                    }}
                    title={solicitud["Codigo de Solicitud"]}
                  >
                    {solicitud["Codigo de Solicitud"].slice(0, 6)}...
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SemanaView;
