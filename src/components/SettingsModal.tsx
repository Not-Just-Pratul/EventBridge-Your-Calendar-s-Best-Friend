
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Calendar, Shield, Palette, Clock, User } from 'lucide-react';
import { useTheme } from 'next-themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState(true);
  const [weekStart, setWeekStart] = useState('monday');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [autoSync, setAutoSync] = useState(true);
  const { theme, setTheme } = useTheme();

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Push Notifications',
          description: 'Receive notifications for upcoming events',
          value: notifications,
          onChange: setNotifications,
          type: 'switch'
        }
      ]
    },
    {
      title: 'Calendar Preferences',
      icon: Calendar,
      items: [
        {
          label: 'Week Starts On',
          description: 'Choose your preferred week start day',
          value: weekStart,
          onChange: setWeekStart,
          type: 'select',
          options: [
            { label: 'Sunday', value: 'sunday' },
            { label: 'Monday', value: 'monday' }
          ]
        },
        {
          label: 'Time Format',
          description: '12-hour or 24-hour time display',
          value: timeFormat,
          onChange: setTimeFormat,
          type: 'select',
          options: [
            { label: '12-hour (AM/PM)', value: '12h' },
            { label: '24-hour', value: '24h' }
          ]
        }
      ]
    },
    {
      title: 'Sync & Privacy',
      icon: Shield,
      items: [
        {
          label: 'Auto Sync',
          description: 'Automatically sync events across devices',
          value: autoSync,
          onChange: setAutoSync,
          type: 'switch'
        }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          value: theme,
          onChange: setTheme,
          type: 'select',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' }
          ]
        }
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <span>Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {settingsSections.map((section, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
                <section.icon className="h-4 w-4 mr-2 text-purple-600" />
                {section.title}
              </h3>
              
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">{item.label}</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="ml-4">
                      {item.type === 'switch' ? (
                        <Switch
                          checked={item.value as boolean}
                          onCheckedChange={item.onChange}
                        />
                      ) : item.type === 'select' && item.options ? (
                        <select
                          value={item.value as string}
                          onChange={(e) => item.onChange(e.target.value)}
                          className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        >
                          {item.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Account Plan
                </h3>
                <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                  You're on the Premium plan
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                Premium
              </Badge>
            </div>
          </Card>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
