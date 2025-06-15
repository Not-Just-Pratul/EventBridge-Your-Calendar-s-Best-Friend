
import React, { useState } from 'react';
import { CalendarHeader } from '@/components/CalendarHeader';
import { CalendarGrid } from '@/components/CalendarGrid';
import { AppSidebar } from '@/components/AppSidebar';
import { EventModal } from '@/components/EventModal';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Calendar = () => {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const { user, loading: authLoading } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get user display name (full_name or fallback to email)
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || user?.email;

  const handleTimeSlotClick = (date: Date) => {
    setSelectedTimeSlot(date);
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setSelectedTimeSlot(null);
    setIsEventModalOpen(true);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setSelectedTimeSlot(null);
    setIsEventModalOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex w-full">
        <AppSidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          onCreateEvent={handleCreateEvent}
        />
        
        <SidebarInset className="flex flex-col overflow-hidden min-w-0 flex-1">
          <div className="flex items-center gap-2 p-3 border-b dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <SidebarTrigger className="hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors duration-200 flex-shrink-0 p-2 min-h-[44px]" />
            <h1 className="font-bold text-base sm:text-lg md:text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate flex-1 min-w-0">
              EventBridge Calendar
            </h1>
            <div className="text-xs text-gray-500 dark:text-gray-400 hidden md:block max-w-[150px] truncate">
              Welcome, {displayName}
            </div>
          </div>
          
          <CalendarHeader 
            currentView={currentView} 
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onViewChange={setCurrentView}
          />
          
          <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-6">
            <CalendarGrid 
              view={currentView}
              currentDate={currentDate}
              onTimeSlotClick={handleTimeSlotClick}
              onEditEvent={handleEditEvent}
              events={events}
            />
          </div>
        </SidebarInset>
      </div>

      <Button
        onClick={handleCreateEvent}
        className="fixed bottom-4 right-4 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50 border-4 border-white dark:border-gray-800 active:scale-95"
        size="icon"
      >
        <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
      </Button>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedTimeSlot(null);
          setEditingEvent(null);
        }}
        selectedTime={selectedTimeSlot}
        editEvent={editingEvent}
      />
    </SidebarProvider>
  );
};

export default Calendar;
