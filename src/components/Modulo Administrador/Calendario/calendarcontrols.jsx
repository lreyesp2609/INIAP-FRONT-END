import React from "react";

const CalendarControls = ({
  handlePrev,
  handleNext,
  handleToday,
  view,
  setView,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
      <div>
        <button
          onClick={handlePrev}
          className="bg-gray-200 px-4 py-2 mr-2 rounded"
        >
          Anterior
        </button>
        <button
          onClick={handleToday}
          className="bg-gray-200 px-4 py-2 mr-2 rounded"
        >
          Hoy
        </button>
        <button onClick={handleNext} className="bg-gray-200 px-4 py-2 rounded">
          Siguiente
        </button>
      </div>
      <div>
        <button
          onClick={() => setView("month")}
          className={`px-4 py-2 mr-2 rounded ${
            view === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Mes
        </button>
        <button
          onClick={() => setView("week")}
          className={`px-4 py-2 mr-2 rounded ${
            view === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => setView("agenda")}
          className={`px-4 py-2 rounded ${
            view === "agenda" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

export default CalendarControls;
