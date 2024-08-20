import React from "react";

const MesView = ({
  date,
  ordenesAprobadas,
  onOrdenClick,
  onShowSolicitudList,
}) => {
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const startOfMonth = new Date(year, date.getMonth(), 1);
  const startDay = (startOfMonth.getDay() + 6) % 7;
  const daysInCurrentMonth = daysInMonth(year, date.getMonth());

  const daysOfWeek = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
  const previousMonthDays = daysInMonth(year, date.getMonth() - 1);
  const daysArray = [
    ...Array(startDay)
      .fill(null)
      .map((_, i) => previousMonthDays - startDay + i + 1),
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
          const ordenesDelDia = isCurrentMonth
            ? ordenesAprobadas.filter(
                (o) =>
                  new Date(o.fecha_viaje).toISOString().slice(0, 10) ===
                  currentDay.toISOString().slice(0, 10)
              )
            : [];

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
                  {ordenesDelDia.length === 1 && (
                    <button
                      className="block mt-2 p-1 rounded bg-yellow-400 border border-yellow-400 text-black whitespace-normal break-words text-xs sm:text-sm lg:text-base cursor-pointer"
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
                      onClick={() => onShowSolicitudList(currentDay)}
                    >
                      {`+ ${ordenesDelDia.length}`}
                    </button>
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
