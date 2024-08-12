import React from "react";

const MesView = ({ date, ordenesAprobadas }) => {
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const startOfMonth = new Date(year, date.getMonth(), 1);
  const startDay = (startOfMonth.getDay() + 6) % 7;
  const daysInCurrentMonth = daysInMonth(year, date.getMonth());

  const daysOfWeek = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
  const previousMonthDays = daysInMonth(year, date.getMonth() - 1);
  const daysArray = [
    ...Array(startDay).fill(null).map((_, i) => previousMonthDays - startDay + i + 1),
    ...Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1),
  ];
  
  const today = new Date();
  const isToday = (day) =>
    day !== null &&
    day === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return (
    <div>
      <h2 className="text-center text-xl mb-4">{`${month} ${year}`}</h2>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center">
        {daysArray.map((day, index) => {
          const isCurrentMonth = day > 0 && index >= startDay;
          const currentDay = new Date(year, date.getMonth(), day);
          const dayOfWeek = daysOfWeek[index % 7];
          const orden = isCurrentMonth ? ordenesAprobadas.find(
            (o) =>
              new Date(o.fecha_viaje).toISOString().slice(0, 10) ===
              currentDay.toISOString().slice(0, 10)
          ) : null;
          
          return (
            <div
              key={index}
              className={`border p-2 relative min-w-[3rem] min-h-[3rem] sm:min-w-[4rem] lg:min-w-[5rem] ${
                isToday(day) ? "bg-blue-100 border-blue-500" : ""
              } ${isCurrentMonth ? "" : "text-gray-400"}`}
            >
              {day !== null ? (
                <div className="relative overflow-visible text-sm">
                  <div className="font-bold">
                    {dayOfWeek} {day}
                  </div>
                  {orden && (
                    <a
                      href="#"
                      className="block mt-2 p-1 rounded bg-yellow-400 border border-yellow-400 text-black whitespace-normal break-words text-xs sm:text-sm lg:text-base"
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
