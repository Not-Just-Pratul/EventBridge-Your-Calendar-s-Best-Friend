
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
      color: 'text-red-600 dark:text-red-400'
    },
    { 
      title: 'Quick Actions', 
      icon: Zap, 
      action: () => setIsQuickActionsOpen(true),
      color: 'text-amber-600 dark:text-amber-400'
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
      <Sidebar className="border-r border-slate-200 dark:border-slate-700 glass-effect">
        <SidebarHeader className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 btn-gradient-premium rounded-xl flex items-center justify-center shadow-premium">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gradient-premium">
                EventBridge
              </h2>
              <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Premium
              </Badge>
            </div>
          </div>
          
          <Button
            onClick={onCreateEvent}
            className="w-full mt-4 btn-gradient-premium shadow-premium hover:shadow-premium-lg transition-all duration-300 font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-600 dark:text-slate-400 font-semibold">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={item.action}
                      className={`w-full transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        location.pathname === item.path
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-l-4 border-slate-800 dark:border-slate-200 shadow-premium' 
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                      {location.pathname === item.path && (
                        <Badge variant="secondary" className="ml-auto text-xs bg-slate-200 dark:bg-slate-700">
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
              <SidebarGroupLabel className="text-slate-600 dark:text-slate-400 font-semibold">
                Calendar Views
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {viewItems.map((item) => (
                    <SidebarMenuItem key={item.view}>
                      <SidebarMenuButton
                        onClick={() => onViewChange(item.view)}
                        className={`w-full transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                          currentView === item.view 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-l-4 border-slate-800 dark:border-slate-200 shadow-premium' 
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.title}
                        {currentView === item.view && (
                          <Badge variant="secondary" className="ml-auto text-xs bg-slate-200 dark:bg-slate-700">
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
            <SidebarGroupLabel className="text-slate-600 dark:text-slate-400 font-semibold">
              Smart Features
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={item.action}
                      className="w-full transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-premium"
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${item.color}`} />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-premium"
                  >
                    <Settings className="mr-3 h-5 w-5 text-slate-600 dark:text-slate-400" />
                    Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="w-8 h-8 btn-gradient-premium rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Premium User</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-600"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex-1 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 border-slate-300 dark:border-slate-600"
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
