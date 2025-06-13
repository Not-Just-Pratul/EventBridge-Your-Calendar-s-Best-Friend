
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Settings, Heart, Zap } from 'lucide-react';

interface NavigationSidebarProps {
  currentView: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentView,
  onViewChange,
}) => {
  const menuItems = [
    { icon: Calendar, label: 'My Calendar', active: true, badge: '3' },
    { icon: Clock, label: 'Focus Time', active: false },
    { icon: Users, label: 'Team Sync', active: false, badge: '2' },
    { icon: Heart, label: 'Life Balance', active: false },
    { icon: Zap, label: 'Quick Actions', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Calendar Views</h3>
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start space-x-3 transition-all duration-200 hover:bg-purple-50"
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <div className="text-sm font-medium text-purple-800 mb-2">
            ✨ Pro Tip
          </div>
          <div className="text-xs text-purple-700 leading-relaxed">
            Try typing "Lunch with Sarah tomorrow at 1 PM" in the event creator for natural language scheduling!
          </div>
        </Card>
      </div>

      <div className="mt-auto p-6">
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <div className="text-sm font-medium mb-1">Weekly Focus</div>
          <div className="text-xs opacity-90">You have 4 focus blocks scheduled</div>
          <div className="mt-3 bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 w-3/4 transition-all duration-500"></div>
          </div>
          <div className="text-xs mt-1 opacity-75">75% completed</div>
        </Card>
      </div>
    </div>
  );
};
