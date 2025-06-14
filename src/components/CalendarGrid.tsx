
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, addDays, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Edit, Trash2, Clock, Users } from 'lucide-react';
import { useEvents, Event } from '@/hooks/useEvents';

interface CalendarGridProps {
  view: 'day' | 'week' | 'month';
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void;
  onEditEvent?: (event: Event) => void;
  events: Event[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  view,
  currentDate,
  onTimeSlotClick,
  onEditEvent,
  events,
}) => {
  const { deleteEvent } = useEvents();

  const handleDeleteEvent = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
    }
  };

  const getEventsForTimeSlot = (date: Date, hour?: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      if (hour !== undefined) {
        return isSameDay(eventStart, date) && eventStart.getHours() === hour;
      }
      return isSameDay(eventStart, date);
    });
  };

  const renderEvent = (event: Event) => (
    <Card
      key={event.id}
      className={`absolute inset-1 p-2 border-l-4 transform hover:scale-105 transition-all duration-200 cursor-pointer z-10 shadow-lg group/event bg-${event.color}-100 border-${event.color}-300 text-${event.color}-800 dark:bg-${event.color}-900 dark:border-${event.color}-700 dark:text-${event.color}-200`}
      onClick={(e) => {
        e.stopPropagation();
        onEditEvent?.(event);
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-xs font-semibold truncate">{event.title}</div>
          <div className="text-xs opacity-75 flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {format(new Date(event.start_time), 'h:mm a')}
          </div>
          {event.location && (
            <div className="text-xs opacity-75 truncate">📍 {event.location}</div>
          )}
        </div>
        <div className="flex space-x-1 opacity-0 group-hover/event:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 hover:bg-white/80"
            onClick={(e) => {
              e.stopPropagation();
              onEditEvent?.(event);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
            onClick={(e) => handleDeleteEvent(event.id, e)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 18 }, (_, i) => i + 6);

    return (
      <div className="grid grid-cols-8 gap-4 h-full">
        <div className="col-span-1">
          <div className="h-16"></div>
          {hours.map(hour => (
            <div key={hour} className="h-20 flex items-center justify-end pr-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              {format(new Date().setHours(hour), 'h a')}
            </div>
          ))}
        </div>
        
        {days.map(day => (
          <div key={day.toISOString()} className="col-span-1">
            <div className="h-16 flex flex-col items-center justify-center border-b border-gray-200 dark:border-gray-700 mb-2 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-t-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-bold transition-all duration-200 ${
                isToday(day) 
                  ? 'text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg' 
                  : 'text-gray-800 dark:text-gray-200'
              }`}>
                {format(day, 'd')}
              </div>
            </div>
            
            <div className="space-y-1">
              {hours.map(hour => {
                const timeSlotEvents = getEventsForTimeSlot(day, hour);
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="h-20 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-purple-25 hover:to-blue-25 dark:hover:from-purple-950 dark:hover:to-blue-950 transition-all duration-300 cursor-pointer relative group shadow-sm"
                    onClick={() => onTimeSlotClick(new Date(day.setHours(hour)))}
                  >
                    <div className="absolute inset-0 rounded-lg group-hover:ring-2 group-hover:ring-purple-200 dark:group-hover:ring-purple-700 transition-all duration-200 group-hover:shadow-md"></div>
                    {timeSlotEvents.map(event => renderEvent(event))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const days = eachDayOfInterval({ start: calendarStart, end: addDays(calendarStart, 41) });

    return (
      <div className="grid grid-cols-7 gap-4 h-full">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-4 text-center font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayEvents = getEventsForTimeSlot(day);
          return (
            <Card
              key={day.toISOString()}
              className={`p-4 min-h-32 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 ${
                isToday(day) 
                  ? 'ring-2 ring-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-300 dark:border-purple-700' 
                  : 'hover:bg-gradient-to-br hover:from-purple-25 hover:to-blue-25 dark:hover:from-purple-950 dark:hover:to-blue-950 border-gray-200 dark:border-gray-700'
              } ${
                day.getMonth() !== currentDate.getMonth() ? 'opacity-30' : ''
              }`}
              onClick={() => onTimeSlotClick(day)}
            >
              <div className={`text-sm font-bold mb-2 ${
                isToday(day) ? 'text-purple-600 dark:text-purple-400' : 'text-gray-800 dark:text-gray-200'
              }`}>
                {format(day, 'd')}
              </div>
              
              {dayEvents.length > 0 && (
                <div className="space-y-1">
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200 border-0">
                    {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                  </Badge>
                  {dayEvents.slice(0, 2).map((event, index) => (
                    <div key={index} className="text-xs truncate p-1 rounded bg-white/50 dark:bg-gray-800/50">
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 18 }, (_, i) => i + 6);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isToday(currentDate) ? 'Today' : format(currentDate, 'EEEE')}
          </div>
        </div>
        
        <div className="space-y-2">
          {hours.map(hour => {
            const hourEvents = getEventsForTimeSlot(currentDate, hour);
            return (
              <div
                key={hour}
                className="flex items-center space-x-4 group hover:bg-gradient-to-r hover:from-purple-25 hover:to-blue-25 dark:hover:from-purple-950 dark:hover:to-blue-950 p-3 rounded-lg transition-all duration-200 cursor-pointer"
                onClick={() => onTimeSlotClick(new Date(currentDate.setHours(hour)))}
              >
                <div className="w-20 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  {format(new Date().setHours(hour), 'h:mm a')}
                </div>
                <div className="flex-1 h-16 border border-gray-200 dark:border-gray-700 rounded-lg group-hover:border-purple-300 dark:group-hover:border-purple-600 transition-colors duration-200 relative">
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className={`absolute inset-1 p-2 rounded border-l-4 flex justify-between items-center group/event shadow-md bg-${event.color}-100 border-${event.color}-300 text-${event.color}-800 dark:bg-${event.color}-900 dark:border-${event.color}-700 dark:text-${event.color}-200`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent?.(event);
                      }}
                    >
                      <div>
                        <div className="font-semibold text-sm">{event.title}</div>
                        <div className="text-xs opacity-75">
                          {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                        </div>
                        {event.location && (
                          <div className="text-xs opacity-75">📍 {event.location}</div>
                        )}
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover/event:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEvent?.(event);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={(e) => handleDeleteEvent(event.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-lg p-4">
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
      {view === 'day' && renderDayView()}
    </div>
  );
};
