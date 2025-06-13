
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, addDays, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Edit, Trash2, Clock, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  color: string;
  attendees?: string[];
}

interface CalendarGridProps {
  view: 'day' | 'week' | 'month';
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void;
  onEditEvent?: (event: Event) => void;
}

// Enhanced sample events
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Morning Standup ☕',
    time: '9:00 AM',
    duration: '30m',
    color: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200',
    attendees: ['Sarah', 'Mike', 'Alex']
  },
  {
    id: '2',
    title: 'Design Review 🎨',
    time: '2:00 PM',
    duration: '1h',
    color: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200',
    attendees: ['Emma', 'John']
  },
  {
    id: '3',
    title: 'Coffee with Anna ☕',
    time: '4:00 PM',
    duration: '45m',
    color: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
  }
];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  view,
  currentDate,
  onTimeSlotClick,
  onEditEvent,
}) => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    // Extended hours: 6 AM to 11 PM (18 hours)
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
              {hours.map(hour => (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="h-20 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-purple-25 hover:to-blue-25 dark:hover:from-purple-950 dark:hover:to-blue-950 transition-all duration-300 cursor-pointer relative group shadow-sm"
                  onClick={() => onTimeSlotClick(new Date(day.setHours(hour)))}
                >
                  <div className="absolute inset-0 rounded-lg group-hover:ring-2 group-hover:ring-purple-200 dark:group-hover:ring-purple-700 transition-all duration-200 group-hover:shadow-md"></div>
                  
                  {/* Enhanced sample events with edit/delete functionality */}
                  {isSameDay(day, new Date()) && hour === 9 && events.find(e => e.id === '1') && (
                    <Card className={`absolute inset-1 p-2 ${events.find(e => e.id === '1')?.color} border-l-4 transform hover:scale-105 transition-all duration-200 cursor-pointer z-10 shadow-lg group/event`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-xs font-semibold">{events.find(e => e.id === '1')?.title}</div>
                          <div className="text-xs opacity-75 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {events.find(e => e.id === '1')?.time} • {events.find(e => e.id === '1')?.duration}
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover/event:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 hover:bg-white/80"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditEvent?.(events.find(e => e.id === '1')!);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent('1');
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {events.find(e => e.id === '1')?.attendees && (
                        <div className="flex items-center mt-1">
                          <Users className="h-3 w-3 mr-1 opacity-75" />
                          <div className="flex -space-x-1">
                            {events.find(e => e.id === '1')?.attendees?.slice(0, 3).map((attendee, i) => (
                              <div key={i} className="w-4 h-4 rounded-full bg-white border text-xs flex items-center justify-center font-medium shadow-sm">
                                {attendee[0]}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  )}
                  
                  {isSameDay(day, new Date()) && hour === 14 && events.find(e => e.id === '2') && (
                    <Card className={`absolute inset-1 p-2 ${events.find(e => e.id === '2')?.color} border-l-4 transform hover:scale-105 transition-all duration-200 cursor-pointer z-10 shadow-lg group/event`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-xs font-semibold">{events.find(e => e.id === '2')?.title}</div>
                          <div className="text-xs opacity-75 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {events.find(e => e.id === '2')?.time} • {events.find(e => e.id === '2')?.duration}
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover/event:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 hover:bg-white/80"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditEvent?.(events.find(e => e.id === '2')!);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent('2');
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
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
        
        {days.map(day => (
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
            
            {isSameDay(day, new Date()) && (
              <div className="space-y-1">
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200 border-0">
                  {events.length} events
                </Badge>
                {events.slice(0, 2).map((event, index) => (
                  <div key={index} className="text-xs truncate p-1 rounded bg-white/50 dark:bg-gray-800/50">
                    {event.title}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    // Extended hours: 6 AM to 11 PM (18 hours)
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
          {hours.map(hour => (
            <div
              key={hour}
              className="flex items-center space-x-4 group hover:bg-gradient-to-r hover:from-purple-25 hover:to-blue-25 dark:hover:from-purple-950 dark:hover:to-blue-950 p-3 rounded-lg transition-all duration-200 cursor-pointer"
              onClick={() => onTimeSlotClick(new Date(currentDate.setHours(hour)))}
            >
              <div className="w-20 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                {format(new Date().setHours(hour), 'h:mm a')}
              </div>
              <div className="flex-1 h-16 border border-gray-200 dark:border-gray-700 rounded-lg group-hover:border-purple-300 dark:group-hover:border-purple-600 transition-colors duration-200 relative">
                {/* Sample events for day view */}
                {isToday(currentDate) && hour === 9 && events.find(e => e.id === '1') && (
                  <div className={`absolute inset-1 p-2 ${events.find(e => e.id === '1')?.color} rounded border-l-4 flex justify-between items-center group/event shadow-md`}>
                    <div>
                      <div className="font-semibold text-sm">{events.find(e => e.id === '1')?.title}</div>
                      <div className="text-xs opacity-75">{events.find(e => e.id === '1')?.duration}</div>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover/event:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
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
