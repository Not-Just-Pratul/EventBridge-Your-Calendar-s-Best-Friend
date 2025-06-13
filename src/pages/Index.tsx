
import React, { useState } from 'react';
import { CalendarHeader } from '@/components/CalendarHeader';
import { CalendarGrid } from '@/components/CalendarGrid';
import { AppSidebar } from '@/components/AppSidebar';
import { EventModal } from '@/components/EventModal';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);

  const handleTimeSlotClick = (date: Date) => {
    setSelectedTimeSlot(date);
    setIsEventModalOpen(true);
  };

  const handleCreateEvent = () => {
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
        
        <SidebarInset className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <SidebarTrigger className="hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors duration-200" />
            <h1 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EventBridge Calendar
            </h1>
            <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              Your Calendar's Best Friend
            </div>
          </div>
          
          <CalendarHeader 
            currentView={currentView} 
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onViewChange={setCurrentView}
          />
          
          <div className="flex-1 overflow-auto p-6">
            <CalendarGrid 
              view={currentView}
              currentDate={currentDate}
              onTimeSlotClick={handleTimeSlotClick}
            />
          </div>
        </SidebarInset>
      </div>

      <Button
        onClick={handleCreateEvent}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50 border-4 border-white dark:border-gray-800"
        size="icon"
      >
        <Plus className="h-8 w-8" />
      </Button>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedTimeSlot(null);
        }}
        selectedTime={selectedTimeSlot}
      />
    </SidebarProvider>
  );
};

export default Index;
