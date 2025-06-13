
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

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex w-full">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <SidebarInset className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b dark:border-gray-700">
            <SidebarTrigger />
            <h1 className="font-semibold dark:text-white">EventBridge Calendar</h1>
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
        onClick={() => setIsEventModalOpen(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        size="icon"
      >
        <Plus className="h-6 w-6" />
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
