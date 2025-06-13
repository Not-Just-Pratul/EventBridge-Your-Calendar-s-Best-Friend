
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';

interface CalendarHeaderProps {
  currentView: 'day' | 'week' | 'month';
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange: (view: 'day' | 'week' | 'month') => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentView,
  currentDate,
  onDateChange,
  onViewChange,
}) => {
  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate: Date;
    if (direction === 'next') {
      newDate = currentView === 'day' ? addDays(currentDate, 1) :
                currentView === 'week' ? addWeeks(currentDate, 1) :
                addMonths(currentDate, 1);
    } else {
      newDate = currentView === 'day' ? subDays(currentDate, 1) :
                currentView === 'week' ? subWeeks(currentDate, 1) :
                subMonths(currentDate, 1);
    }
    onDateChange(newDate);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ✨";
    if (hour < 17) return "Having a productive day? 🎯";
    return "Evening vibes! 🌙";
  };

  const getDateTitle = () => {
    if (currentView === 'day') {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    } else if (currentView === 'week') {
      return format(currentDate, 'MMMM yyyy');
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EventBridge
              </h1>
            </div>
            <Badge variant="secondary" className="animate-pulse">
              {getGreeting()}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('day')}
              className="transition-all duration-200"
            >
              Day
            </Button>
            <Button
              variant={currentView === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('week')}
              className="transition-all duration-200"
            >
              Week
            </Button>
            <Button
              variant={currentView === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('month')}
              className="transition-all duration-200"
            >
              Month
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateDate('prev')}
                className="hover:bg-purple-50 transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-800 min-w-0">
                {getDateTitle()}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateDate('next')}
                className="hover:bg-purple-50 transition-colors duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(new Date())}
              className="hover:bg-purple-50 transition-colors duration-200"
            >
              Today
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>You've got a smooth week ahead</span>
          </div>
        </div>
      </div>
    </div>
  );
};
