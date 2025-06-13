
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Settings, Heart, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LifeBalanceModal } from './LifeBalanceModal';
import { QuickActionsModal } from './QuickActionsModal';
import { SettingsModal } from './SettingsModal';

interface AppSidebarProps {
  currentView: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onCreateEvent: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onViewChange,
  onCreateEvent,
}) => {
  const { theme, setTheme } = useTheme();
  const [lifeBalanceOpen, setLifeBalanceOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const menuItems = [
    { 
      icon: Calendar, 
      label: 'My Calendar', 
      active: true, 
      badge: '3',
      onClick: () => onViewChange('week')
    },
    { 
      icon: Clock, 
      label: 'Focus Time', 
      active: false,
      onClick: () => onViewChange('day')
    },
    { 
      icon: Users, 
      label: 'Team Sync', 
      active: false, 
      badge: '2',
      onClick: () => onViewChange('month')
    },
    { 
      icon: Heart, 
      label: 'Life Balance', 
      active: false,
      onClick: () => setLifeBalanceOpen(true)
    },
    { 
      icon: Zap, 
      label: 'Quick Actions', 
      active: false,
      onClick: () => setQuickActionsOpen(true)
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      active: false,
      onClick: () => setSettingsOpen(true)
    },
  ];

  const viewButtons = [
    { label: 'Day', value: 'day' as const },
    { label: 'Week', value: 'week' as const },
    { label: 'Month', value: 'month' as const },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <Sidebar className="border-r border-gray-200 dark:border-gray-700">
        <SidebarHeader className="p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EventBridge
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 rounded-full hover:bg-purple-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          </div>
          
          <div className="flex gap-1 mt-4 p-1 bg-white/70 dark:bg-gray-800/70 rounded-lg backdrop-blur-sm shadow-sm">
            {viewButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => onViewChange(button.value)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  currentView === button.value
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-white dark:bg-gray-900">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 dark:text-gray-400 font-medium">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      onClick={item.onClick}
                      isActive={item.active}
                      className="transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-950 dark:hover:to-blue-950 rounded-lg group"
                    >
                      <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <SidebarMenuBadge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupContent>
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800 shadow-lg">
                <div className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  ✨ Pro Tip
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                  Try typing "Lunch with Sarah tomorrow at 1 PM" in the event creator for natural language scheduling!
                </div>
              </Card>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Card className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Weekly Focus</div>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">75%</div>
            </div>
            <div className="text-xs opacity-90 mb-3">You have 4 focus blocks scheduled</div>
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <div className="bg-white rounded-full h-2 w-3/4 transition-all duration-500 shadow-sm"></div>
            </div>
          </Card>
        </SidebarFooter>
      </Sidebar>

      <LifeBalanceModal
        isOpen={lifeBalanceOpen}
        onClose={() => setLifeBalanceOpen(false)}
      />

      <QuickActionsModal
        isOpen={quickActionsOpen}
        onClose={() => setQuickActionsOpen(false)}
        onCreateEvent={onCreateEvent}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};
