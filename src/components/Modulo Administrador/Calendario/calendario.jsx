import React, { useState } from 'react';

const Calendario = () => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const handlePrev = () => {
    const newDate = new Date(date);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    }
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    }
    setDate(newDate);
  };

  const handleToday = () => {
    setDate(new Date());
  };

  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderMonthView = () => {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const startOfMonth = new Date(year, date.getMonth(), 1);
    const startDay = (startOfMonth.getDay() + 6) % 7; // Adjust start day to Monday
    const daysInCurrentMonth = daysInMonth(year, date.getMonth());
    
    const daysOfWeek = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
    const daysArray = [
      ...Array(startDay).fill(null), 
      ...Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1)
    ];

    return (
      <div>
        <h2 className="text-center text-xl mb-4">{`${month} ${year}`}</h2>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="font-bold">{day}</div>
          ))}
          {daysArray.map((day, index) => (
            <div key={index} className="border p-2">{day !== null ? day : ''}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - ((date.getDay() + 6) % 7)); // Adjust to start on Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      daysOfWeek.push(day);
    }
    return (
      <div>
        <h2 className="text-center text-xl mb-4">
          {`${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString('default', { month: 'short' })} ${endOfWeek.getFullYear()}`}
        </h2>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((day, i) => (
            <div key={i} className="border p-2">
              {`${day.toLocaleDateString('default', { weekday: 'short' })} ${day.getDate()}/${day.getMonth() + 1}`}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button onClick={handlePrev} className="bg-gray-200 px-4 py-2 mr-2 rounded">Anterior</button>
          <button onClick={handleToday} className="bg-gray-200 px-4 py-2 mr-2 rounded">Hoy</button>
          <button onClick={handleNext} className="bg-gray-200 px-4 py-2 rounded">Siguiente</button>
        </div>
        <div>
          <button onClick={() => setView('month')} className={`px-4 py-2 mr-2 rounded ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Mes</button>
          <button onClick={() => setView('week')} className={`px-4 py-2 mr-2 rounded ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Semana</button>
          <button onClick={() => setView('agenda')} className={`px-4 py-2 rounded ${view === 'agenda' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Agenda</button>
        </div>
      </div>
      <div>
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'agenda' && <div>Agenda View</div>}
      </div>
    </div>
  );
};

export default Calendario;
