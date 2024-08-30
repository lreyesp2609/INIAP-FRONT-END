const MesView = ({
  date,
  ordenesAprobadas,
  solicitudesAceptadas,
  onOrdenClick,
  handleShowSolicitud,
}) => {
  const daysInMonth = (year, month) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const startOfMonth = new Date(Date.UTC(year, date.getMonth(), 1));
  const startDay = (startOfMonth.getUTCDay() + 6) % 7;
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
  today.setHours(0, 0, 0, 0); // Usar hora local para comparar solo las fechas

  const isToday = (day) =>
    day !== null &&
    day === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

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
      <h2 className="text-center text-xl mb-4">{`${month} ${year}`}</h2>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center">
        {daysArray.map((day, index) => {
          const isCurrentMonth = day > 0 && index >= startDay;
          const currentDayLocal = new Date(year, date.getMonth(), day);
          currentDayLocal.setHours(0, 0, 0, 0); // Usar hora local

          const currentDayUTC = new Date(Date.UTC(year, date.getMonth(), day));
          currentDayUTC.setUTCHours(0, 0, 0, 0); // Usar UTC

          const dayOfWeek = daysOfWeek[index % 7];

          const ordenesDelDia = isCurrentMonth
            ? ordenesAprobadas.filter((o) => {
                const fechaEmision = new Date(o.fecha_hora_emision);
                return isSameDay(fechaEmision, currentDayLocal);
              })
            : [];

          const solicitudesDelDia = isCurrentMonth
            ? solicitudesAceptadas.filter((s) => {
                const fechaSolicitud = new Date(s["Fecha Solicitud"]);
                return isSameDay(fechaSolicitud, currentDayUTC, true);
              })
            : [];

          return (
            <div
              key={index}
              className={`border p-1 relative min-w-[3rem] min-h-[3rem] sm:min-w-[4rem] lg:min-w-[5rem] ${
                isToday(day) ? "bg-blue-100 border-blue-500" : ""
              } ${isCurrentMonth ? "" : "text-gray-400"}`}
            >
              {day !== null ? (
                <div className="relative overflow-visible text-xs">
                  <div className="font-bold mb-1">
                    {dayOfWeek} {day}
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    {ordenesDelDia.map((orden, idx) => (
                      <button
                        key={`orden-${idx}`}
                        className="w-full px-1 py-0.5 text-xs bg-yellow-400 border border-yellow-400 text-black hover:bg-yellow-300 rounded truncate"
                        onClick={() => {
                          onOrdenClick(orden.id_orden_movilizacion);
                        }}
                        title={orden.secuencial_orden_movilizacion}
                      >
                        {orden.secuencial_orden_movilizacion.slice(0, 6)}...
                      </button>
                    ))}
                    {solicitudesDelDia.map((solicitud, idx) => (
                      <button
                        key={`solicitud-${idx}`}
                        className="w-full px-1 py-0.5 text-xs bg-blue-400 border border-blue-400 text-white hover:bg-blue-300 rounded truncate"
                        onClick={() => {
                          handleShowSolicitud(solicitud.id);
                        }}
                        title={solicitud["Codigo de Solicitud"]}
                      >
                        {solicitud["Codigo de Solicitud"].slice(0, 6)}...
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-xs">{dayOfWeek}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MesView;
