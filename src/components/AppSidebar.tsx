
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Plus, 
  Clock, 
  CalendarDays, 
  CalendarIcon, 
  Heart, 
  Zap, 
  Settings,
  LogOut,
  Moon,
  Sun,
  User,
  List
} from 'lucide-react';
import { LifeBalanceModal } from '@/components/LifeBalanceModal';
import { QuickActionsModal } from '@/components/QuickActionsModal';
import { SettingsModal } from '@/components/SettingsModal';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { useNavigate, useLocation } from 'react-router-dom';

interface AppSidebarProps {
  currentView: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onCreateEvent: () => void;
}

export function AppSidebar({ currentView, onViewChange, onCreateEvent }: AppSidebarProps) {
  const [isLifeBalanceOpen, setIsLifeBalanceOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const viewItems = [
    { title: 'Day View', icon: Clock, view: 'day' as const },
    { title: 'Week View', icon: CalendarDays, view: 'week' as const },
    { title: 'Month View', icon: CalendarIcon, view: 'month' as const },
  ];

  const navigationItems = [
    { 
      title: 'Calendar View', 
      icon: Calendar, 
      path: '/calendar',
      action: () => navigate('/calendar')
    },
    { 
      title: 'All Events', 
      icon: List, 
      path: '/events',
      action: () => navigate('/events')
    },
  ];

  const quickItems = [
    { 
      title: 'Life Balance', 
      icon: Heart, 
      action: () => setIsLifeBalanceOpen(true),
      color: 'text-black dark:text-white'
    },
    { 
      title: 'Quick Actions', 
      icon: Zap, 
      action: () => setIsQuickActionsOpen(true),
      color: 'text-black dark:text-white'
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <Sidebar className="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <SidebarHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-premium">
              <Calendar className="h-6 w-6 text-white dark:text-black" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-black dark:text-white">
                EventBridge
              </h2>
              <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                Premium
              </Badge>
            </div>
          </div>
          
          <Button
            onClick={onCreateEvent}
            className="w-full mt-4 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black shadow-premium hover:shadow-premium-lg transition-all duration-300 font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-600 dark:text-gray-400 font-semibold">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={item.action}
                      className={`w-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-900 ${
                        location.pathname === item.path
                          ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-l-4 border-black dark:border-white shadow-premium' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                      {location.pathname === item.path && (
                        <Badge variant="secondary" className="ml-auto text-xs bg-gray-200 dark:bg-gray-800">
                          Active
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {location.pathname === '/calendar' && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-600 dark:text-gray-400 font-semibold">
                Calendar Views
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {viewItems.map((item) => (
                    <SidebarMenuItem key={item.view}>
                      <SidebarMenuButton
                        onClick={() => onViewChange(item.view)}
                        className={`w-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-900 ${
                          currentView === item.view 
                            ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-l-4 border-black dark:border-white shadow-premium' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.title}
                        {currentView === item.view && (
                          <Badge variant="secondary" className="ml-auto text-xs bg-gray-200 dark:bg-gray-800">
                            Active
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-600 dark:text-gray-400 font-semibold">
              Smart Features
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={item.action}
                      className="w-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 hover:shadow-premium"
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${item.color}`} />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 hover:shadow-premium"
                  >
                    <Settings className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-400" />
                    Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white dark:text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black dark:text-white truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Premium User</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-900 border-gray-300 dark:border-gray-600"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white border-gray-300 dark:border-gray-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <LifeBalanceModal
        isOpen={isLifeBalanceOpen}
        onClose={() => setIsLifeBalanceOpen(false)}
      />

      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onCreateEvent={onCreateEvent}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
