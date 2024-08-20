import React from "react";

const SemanaView = ({
  date,
  ordenesAprobadas,
  onOrdenClick,
  onShowSolicitudList,
}) => {
  const startOfWeek = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  startOfWeek.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
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

  return (
    <div>
      <h2 className="text-center text-xl mb-4">
        {`${headerFormatter.format(startOfWeek)} - ${headerFormatter.format(
          endOfWeek
        )}`}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
        {daysOfWeek.map((day, i) => {
          const ordenesDelDia = ordenesAprobadas.filter(
            (o) =>
              new Date(o.fecha_viaje).toISOString().split("T")[0] ===
              day.toISOString().split("T")[0]
          );

          return (
            <div
              key={i}
              className="border p-2 relative min-w-[5rem] sm:min-w-[7rem] lg:min-w-[10rem] h-auto flex flex-col items-center justify-center"
            >
              <div className="font-bold mb-1">{dateFormatter.format(day)}</div>
              {ordenesDelDia.length === 1 && (
                <button
                  className="block p-1 rounded bg-yellow-400 border border-yellow-400 text-black text-xs sm:text-sm lg:text-base break-words text-center"
                  onClick={() => {
                    onOrdenClick(ordenesDelDia[0].id_orden_movilizacion);
                  }}
                >
                  {ordenesDelDia[0].secuencial_orden_movilizacion}
                </button>
              )}
              {ordenesDelDia.length > 1 && (
                <button
                  className="mt-2 p-2 rounded bg-yellow-200 border border-yellow-400 text-black text-xs sm:text-sm lg:text-base cursor-pointer 
                             hover:bg-yellow-300 transition duration-200 ease-in-out 
                             text-center overflow-hidden text-ellipsis"
                  style={{ maxWidth: "100%", whiteSpace: "nowrap" }}
                  onClick={() => onShowSolicitudList(day)}
                >
                  {`+ ${ordenesDelDia.length}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SemanaView;
