
import React from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Settings, Heart, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface AppSidebarProps {
  currentView: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onViewChange,
}) => {
  const { theme, setTheme } = useTheme();

  const handleLifeBalance = () => {
    alert('Life Balance features coming soon! 🧘‍♀️ Track your work-life harmony with personalized insights.');
  };

  const handleQuickActions = () => {
    alert('Quick Actions ready! ⚡ Create events, set reminders, or schedule focus time in seconds.');
  };

  const handleSettings = () => {
    alert('Settings panel opening soon! ⚙️ Customize your calendar experience and sync preferences.');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
      onClick: handleLifeBalance
    },
    { 
      icon: Zap, 
      label: 'Quick Actions', 
      active: false,
      onClick: handleQuickActions
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      active: false,
      onClick: handleSettings
    },
  ];

  const viewButtons = [
    { label: 'Day', value: 'day' as const },
    { label: 'Week', value: 'week' as const },
    { label: 'Month', value: 'month' as const },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Calendar Views</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex gap-1 mt-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {viewButtons.map((button) => (
            <button
              key={button.value}
              onClick={() => onViewChange(button.value)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                currentView === button.value
                  ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    isActive={item.active}
                    className="transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-950"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <SidebarMenuBadge>
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
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
              <div className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
                ✨ Pro Tip
              </div>
              <div className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                Try typing "Lunch with Sarah tomorrow at 1 PM" in the event creator for natural language scheduling!
              </div>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <div className="text-sm font-medium mb-1">Weekly Focus</div>
          <div className="text-xs opacity-90">You have 4 focus blocks scheduled</div>
          <div className="mt-3 bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 w-3/4 transition-all duration-500"></div>
          </div>
          <div className="text-xs mt-1 opacity-75">75% completed</div>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
};
