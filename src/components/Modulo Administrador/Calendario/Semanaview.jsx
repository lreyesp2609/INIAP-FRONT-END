import React from "react";

const SemanaView = ({ date, ordenesAprobadas }) => {
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
    timeZone: "UTC"
  });

  const headerFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
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
          const orden = ordenesAprobadas.find(
            (o) =>
              new Date(o.fecha_viaje).toISOString().split('T')[0] ===
              day.toISOString().split('T')[0]
          );
          return (
            <div
              key={i}
              className="border p-2 relative min-w-[5rem] sm:min-w-[7rem] lg:min-w-[10rem] h-auto flex flex-col items-center justify-center"
            >
              <div className="font-bold mb-1">
                {dateFormatter.format(day)}
              </div>
              {orden && (
                <a
                  href="#"
                  className="block p-1 rounded bg-yellow-400 border border-yellow-400 text-black text-xs sm:text-sm lg:text-base break-words text-center"
                >
                  {orden.secuencial_orden_movilizacion}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SemanaView;
