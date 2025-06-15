
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarGrid } from '@/components/CalendarGrid';
import { CalendarHeader } from '@/components/CalendarHeader';
import { EventModal } from '@/components/EventModal';
import { AIAssistant } from '@/components/AIAssistant';
import { TimeAnalytics } from '@/components/TimeAnalytics';
import { SmartNotifications } from '@/components/SmartNotifications';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { WellnessTracker } from '@/components/WellnessTracker';
import { QuickActions } from '@/components/QuickActions';
import { NavigationSidebar } from '@/components/NavigationSidebar';
import { useEvents } from '@/hooks/useEvents';
import { Plus, Brain, BarChart3, Bell, Palette, Heart, Zap } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const [isWellnessTrackerOpen, setIsWellnessTrackerOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  
  const { events } = useEvents();

  const handleTimeSlotClick = (time: Date) => {
    setSelectedTime(time);
    setIsEventModalOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedTime(new Date());
    setIsEventModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <NavigationSidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <CalendarHeader 
              currentDate={currentDate} 
              onDateChange={setCurrentDate}
              currentView={currentView}
              onViewChange={setCurrentView}
            />
            
            <div className="flex items-center space-x-2">
              {/* Quick Action Buttons */}
              <Button
                onClick={() => setIsQuickActionsOpen(true)}
                variant="outline"
                size="sm"
                className="hidden md:flex"
              >
                <Zap className="h-4 w-4 mr-2" />
                Quick Actions
              </Button>
              
              <Button
                onClick={() => setIsAIAssistantOpen(true)}
                variant="outline"
                size="sm"
                className="hidden md:flex"
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              
              <Button
                onClick={() => setIsAnalyticsOpen(true)}
                variant="outline"
                size="sm"
                className="hidden lg:flex"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              
              <Button
                onClick={() => setIsWellnessTrackerOpen(true)}
                variant="outline"
                size="sm"
                className="hidden lg:flex"
              >
                <Heart className="h-4 w-4 mr-2" />
                Wellness
              </Button>
              
              <Button
                onClick={handleCreateEvent}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
          
          {/* Mobile Action Buttons */}
          <div className="flex md:hidden mt-4 space-x-2 overflow-x-auto">
            <Button
              onClick={() => setIsQuickActionsOpen(true)}
              variant="outline"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-1" />
              Quick
            </Button>
            <Button
              onClick={() => setIsAIAssistantOpen(true)}
              variant="outline"
              size="sm"
            >
              <Brain className="h-4 w-4 mr-1" />
              AI
            </Button>
            <Button
              onClick={() => setIsAnalyticsOpen(true)}
              variant="outline"
              size="sm"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Stats
            </Button>
            <Button
              onClick={() => setIsWellnessTrackerOpen(true)}
              variant="outline"
              size="sm"
            >
              <Heart className="h-4 w-4 mr-1" />
              Health
            </Button>
            <Button
              onClick={() => setIsNotificationsOpen(true)}
              variant="outline"
              size="sm"
            >
              <Bell className="h-4 w-4 mr-1" />
              Alerts
            </Button>
            <Button
              onClick={() => setIsThemeCustomizerOpen(true)}
              variant="outline"
              size="sm"
            >
              <Palette className="h-4 w-4 mr-1" />
              Theme
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-hidden">
          <CalendarGrid 
            view={currentView}
            currentDate={currentDate} 
            onTimeSlotClick={handleTimeSlotClick}
            events={events}
          />
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleCreateEvent}
            size="lg"
            className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedTime={selectedTime}
      />
      
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
      
      <TimeAnalytics
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
      
      <SmartNotifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      
      <ThemeCustomizer
        isOpen={isThemeCustomizerOpen}
        onClose={() => setIsThemeCustomizerOpen(false)}
      />
      
      <WellnessTracker
        isOpen={isWellnessTrackerOpen}
        onClose={() => setIsWellnessTrackerOpen(false)}
      />
      
      <QuickActions
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
      />
    </div>
  );
};

export default Calendar;
