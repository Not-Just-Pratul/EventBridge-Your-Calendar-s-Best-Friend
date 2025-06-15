
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Plus, Heart, Bot, Calendar, List, Settings } from 'lucide-react';
import { useTheme } from "next-themes";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LifeBalanceModal } from './LifeBalanceModal';
import { AIAssistant } from './AIAssistant';
import { SettingsModal } from './SettingsModal';
import { useLifeBalanceMetrics } from '@/hooks/useLifeBalanceMetrics';

interface AppSidebarProps {
  currentView: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onCreateEvent: () => void;
}

export function AppSidebar({ currentView, onViewChange, onCreateEvent }: AppSidebarProps) {
  const [isLifeBalanceOpen, setIsLifeBalanceOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const metrics = useLifeBalanceMetrics();

  const { setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      navigate('/auth');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get user display name (full_name or fallback to email)
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || user?.email;

  return (
    <>
      <Sidebar className="border-r-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <SidebarHeader>
          <Button variant="ghost" className="w-full justify-start px-4">
            EventBridge
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-purple-600 dark:text-purple-400 font-semibold">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate('/calendar')} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate('/events')} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <List className="h-4 w-4" />
                    <span>All Events</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-purple-600 dark:text-purple-400 font-semibold">
              Calendar Views
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => onViewChange('day')} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Day
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => onViewChange('week')} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Week
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => onViewChange('month')} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Month
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-purple-600 dark:text-purple-400 font-semibold">
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={onCreateEvent} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Plus className="h-4 w-4" />
                    <span>New Event</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setIsLifeBalanceOpen(true)}
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Life Balance</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setIsAIAssistantOpen(true)}
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Bot className="h-4 w-4" />
                    <span>AI Assistant</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setIsSettingsOpen(true)}
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-purple-600 dark:text-purple-400 font-semibold">
              View
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex items-center space-x-2 px-4">
                <Sun className="h-4 w-4 text-yellow-500" />
                <Switch
                  id="theme"
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
                <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center space-x-2 px-4 pb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
              <AvatarFallback>{displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{displayName}</p>
              <Button variant="link" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <LifeBalanceModal
        isOpen={isLifeBalanceOpen}
        onClose={() => setIsLifeBalanceOpen(false)}
      />

      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        lifeBalanceData={metrics}
        onScheduleBreak={() => {
          setIsAIAssistantOpen(false);
          setIsLifeBalanceOpen(true);
        }}
        onStartFocusSession={() => {
          setIsAIAssistantOpen(false);
          setIsLifeBalanceOpen(true);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
