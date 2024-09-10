import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek, faArrowRight,faArrowLeft  } from "@fortawesome/free-solid-svg-icons";

const CalendarControls = ({
  handlePrev,
  handleNext,
  handleToday,
  view,
  setView,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
    <div className="flex gap-2">
      <button
        onClick={handlePrev}
        className="flex items-center 
        bg-gray-500 hover:bg-gray-700 text-white font-bold 
        py-2 px-4 border-b-4 border-gray-600 
        hover:border-gray-500 rounded"
        >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Anterior
      </button>
      <button
        onClick={handleToday}
        className="flex items-center  
        bg-gray-500 hover:bg-gray-700 text-white }
        font-bold py-2 px-4 border-b-4 
        border-gray-600 hover:border-gray-500 rounded"
        >
        <FontAwesomeIcon icon={faCalendarWeek} className="mr-2" /> Hoy
      </button>
      <button
        onClick={handleNext}
        className="flex items-center  
        bg-gray-500 hover:bg-gray-700 
        text-white font-bold py-2 px-4 
        border-b-4 border-gray-600 hover:border-gray-500 rounded"
        >
        Siguiente <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
      </button>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => setView("month")}
        className={`px-4 py-2 rounded shadow ${
          view === "month"
            ? "bg-blue-500 hover:bg-blue-600 text-white font-bold  border-b-4 border-blue-300 hover:border-blue-700 rounded"
            : "bg-gray-500 hover:bg-gray-700 text-white font-bold  border-b-4 border-gray-600 hover:border-gray-500 rounded"
        } transition-colors`}
      >
        Mes
      </button>
      <button
        onClick={() => setView("week")}
        className={`px-4 py-2 rounded shadow ${
          view === "week"
            ? "bg-blue-500 hover:bg-blue-600 text-white font-bold  border-b-4 border-blue-300 hover:border-blue-700 rounded"
            : "bg-gray-500 hover:bg-gray-700 text-white font-bold  border-b-4 border-gray-600 hover:border-gray-500 rounded"
        } transition-colors`}
      >
        Semana
      </button>
      <button
        onClick={() => setView("agenda")}
        className={`px-4 py-2 rounded shadow ${
          view === "agenda"
            ? "bg-blue-500 hover:bg-blue-600 text-white font-bold  border-b-4 border-blue-300 hover:border-blue-700 rounded"
            : "bg-gray-500 hover:bg-gray-700 text-white font-bold  border-b-4 border-gray-600 hover:border-gray-500 rounded"
        } transition-colors`}
      >
        Agenda
      </button>
    </div>
  </div>
  
  );
};

export default CalendarControls;
