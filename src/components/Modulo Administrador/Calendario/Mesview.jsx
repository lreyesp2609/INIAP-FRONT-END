import React from "react";

const MesView = ({ date, ordenesAprobadas }) => {
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const startOfMonth = new Date(year, date.getMonth(), 1);
  const startDay = (startOfMonth.getDay() + 6) % 7;
  const daysInCurrentMonth = daysInMonth(year, date.getMonth());

  const daysOfWeek = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
  const daysArray = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <h2 className="text-center text-xl mb-4">{`${month} ${year}`}</h2>
      <div className="grid grid-cols-7 gap-2 text-center">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="font-bold">
            {day}
          </div>
        ))}
        {daysArray.map((day, index) => {
          const currentDay = new Date(year, date.getMonth(), day);
          const orden = ordenesAprobadas.find(
            (o) =>
              new Date(o.fecha_viaje).toISOString().slice(0, 10) ===
              currentDay.toISOString().slice(0, 10)
          );
          return (
            <div
              key={index}
              className="border p-2 relative min-w-[2.5rem] sm:min-w-[3rem] lg:min-w-[4rem]"
            >
              {day !== null ? (
                <div className="relative overflow-visible text-sm">
                  {day}
                  {orden && (
                    <a
                      href="#"
                      className="block mt-2 p-1 rounded bg-yellow-400 border border-yellow-400 text-black overflow-visible whitespace-normal text-xs sm:text-sm lg:text-base"
                    >
                      {orden.secuencial_orden_movilizacion}
                    </a>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MesView;
