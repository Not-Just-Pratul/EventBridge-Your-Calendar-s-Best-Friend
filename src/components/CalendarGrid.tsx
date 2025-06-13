
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, addDays, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

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
}

// Sample events for demonstration
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Morning Standup ☕',
    time: '9:00 AM',
    duration: '30m',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    attendees: ['Sarah', 'Mike', 'Alex']
  },
  {
    id: '2',
    title: 'Design Review 🎨',
    time: '2:00 PM',
    duration: '1h',
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    attendees: ['Emma', 'John']
  },
  {
    id: '3',
    title: 'Coffee with Anna ☕',
    time: '4:00 PM',
    duration: '45m',
    color: 'bg-green-100 border-green-300 text-green-800'
  }
];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  view,
  currentDate,
  onTimeSlotClick,
}) => {
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="grid grid-cols-8 gap-4 h-full">
        <div className="col-span-1">
          <div className="h-16"></div>
          {hours.map(hour => (
            <div key={hour} className="h-20 flex items-center justify-end pr-4 text-sm text-gray-500">
              {format(new Date().setHours(hour), 'h a')}
            </div>
          ))}
        </div>
        
        {days.map(day => (
          <div key={day.toISOString()} className="col-span-1">
            <div className="h-16 flex flex-col items-center justify-center border-b border-gray-200 mb-2">
              <div className="text-sm text-gray-600 font-medium">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-semibold ${
                isToday(day) ? 'text-purple-600 bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center' : 'text-gray-800'
              }`}>
                {format(day, 'd')}
              </div>
            </div>
            
            <div className="space-y-1">
              {hours.map(hour => (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="h-20 border border-gray-100 rounded-lg hover:bg-purple-25 transition-colors duration-200 cursor-pointer relative group"
                  onClick={() => onTimeSlotClick(new Date(day.setHours(hour)))}
                >
                  <div className="absolute inset-0 rounded-lg group-hover:ring-2 group-hover:ring-purple-200 transition-all duration-200"></div>
                  
                  {/* Sample events */}
                  {isSameDay(day, new Date()) && hour === 9 && (
                    <Card className={`absolute inset-1 p-2 ${sampleEvents[0].color} border-l-4 transform hover:scale-105 transition-transform duration-200 cursor-pointer z-10`}>
                      <div className="text-xs font-medium">{sampleEvents[0].title}</div>
                      <div className="text-xs opacity-75">{sampleEvents[0].time} • {sampleEvents[0].duration}</div>
                      {sampleEvents[0].attendees && (
                        <div className="flex -space-x-1 mt-1">
                          {sampleEvents[0].attendees.slice(0, 3).map((attendee, i) => (
                            <div key={i} className="w-4 h-4 rounded-full bg-white border text-xs flex items-center justify-center font-medium">
                              {attendee[0]}
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}
                  
                  {isSameDay(day, new Date()) && hour === 14 && (
                    <Card className={`absolute inset-1 p-2 ${sampleEvents[1].color} border-l-4 transform hover:scale-105 transition-transform duration-200 cursor-pointer z-10`}>
                      <div className="text-xs font-medium">{sampleEvents[1].title}</div>
                      <div className="text-xs opacity-75">{sampleEvents[1].time} • {sampleEvents[1].duration}</div>
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
          <div key={day} className="p-4 text-center font-medium text-gray-600 border-b border-gray-200">
            {day}
          </div>
        ))}
        
        {days.map(day => (
          <Card
            key={day.toISOString()}
            className={`p-4 min-h-32 cursor-pointer hover:shadow-md transition-all duration-200 transform hover:scale-105 ${
              isToday(day) ? 'ring-2 ring-purple-300 bg-purple-50' : 'hover:bg-purple-25'
            } ${
              day.getMonth() !== currentDate.getMonth() ? 'opacity-30' : ''
            }`}
            onClick={() => onTimeSlotClick(day)}
          >
            <div className={`text-sm font-medium ${
              isToday(day) ? 'text-purple-600' : 'text-gray-800'
            }`}>
              {format(day, 'd')}
            </div>
            
            {isSameDay(day, new Date()) && (
              <div className="mt-2 space-y-1">
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                  3 events
                </Badge>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full">
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
      {view === 'day' && (
        <div className="text-center py-20 text-gray-500">
          <div className="text-lg font-medium mb-2">Day view coming soon! 🌟</div>
          <div className="text-sm">For now, enjoy the week and month views</div>
        </div>
      )}
    </div>
  );
};
