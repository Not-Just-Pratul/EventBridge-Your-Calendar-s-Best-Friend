
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
import { Calendar, Clock, Users, Settings, Heart, Zap } from 'lucide-react';

interface AppSidebarProps {
  currentView: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onViewChange,
}) => {
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
      onClick: () => console.log('Life Balance clicked')
    },
    { 
      icon: Zap, 
      label: 'Quick Actions', 
      active: false,
      onClick: () => console.log('Quick Actions clicked')
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      active: false,
      onClick: () => console.log('Settings clicked')
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
        <h2 className="text-lg font-semibold text-gray-800">Calendar Views</h2>
        
        <div className="flex gap-1 mt-4 p-1 bg-gray-100 rounded-lg">
          {viewButtons.map((button) => (
            <button
              key={button.value}
              onClick={() => onViewChange(button.value)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                currentView === button.value
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
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
                    className="transition-all duration-200 hover:bg-purple-50"
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
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <div className="text-sm font-medium text-purple-800 mb-2">
                ✨ Pro Tip
              </div>
              <div className="text-xs text-purple-700 leading-relaxed">
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
