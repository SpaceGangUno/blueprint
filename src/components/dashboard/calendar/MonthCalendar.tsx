import React from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { type CalendarEvent } from '../../../config/firebase';

interface MonthCalendarProps {
  date: Date;
  events: CalendarEvent[];
  onDateChange: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({ 
  date, 
  events, 
  onDateChange, 
  onSelectEvent,
  onDeleteEvent 
}) => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth(), daysInMonth).getDay();
  const daysFromPrevMonth = firstDayOfMonth;
  const daysFromNextMonth = 6 - lastDayOfMonth;

  const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 0 - i);
    return {
      date: day,
      isCurrentMonth: false
    };
  }).reverse();

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    date: new Date(date.getFullYear(), date.getMonth(), i + 1),
    isCurrentMonth: true
  }));

  const nextMonthDays = Array.from({ length: daysFromNextMonth }, (_, i) => ({
    date: new Date(date.getFullYear(), date.getMonth() + 1, i + 1),
    isCurrentMonth: false
  }));

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const handlePrevMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    onDateChange(newDate);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      case 'milestone':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {allDays.map(({ date: dayDate, isCurrentMonth }, index) => {
            const dayEvents = getEventsForDate(dayDate);
            const isToday = dayDate.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`min-h-[100px] border rounded-lg p-2 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'border-blue-500' : 'border-gray-200'}`}
              >
                <div className="text-right">
                  <span className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                    {dayDate.getDate()}
                  </span>
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`group relative px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}
                    >
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => onSelectEvent(event)}
                          className="truncate flex-1 text-left"
                        >
                          {event.title}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEvent(event.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 hover:bg-red-200 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthCalendar;
