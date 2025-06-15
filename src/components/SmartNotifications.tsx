
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellOff, Clock, Smartphone, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationSettings {
  enabled: boolean;
  beforeMinutes: number;
  methods: string[];
  smartSuggestions: boolean;
  doNotDisturb: boolean;
  quietHours: { start: string; end: string };
}

export const SmartNotifications: React.FC<SmartNotificationsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    beforeMinutes: 15,
    methods: ['browser'],
    smartSuggestions: true,
    doNotDisturb: false,
    quietHours: { start: '22:00', end: '08:00' },
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Request notification permission if not granted
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const testNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('EventBridge Test', {
        body: 'This is how your notifications will appear!',
        icon: '/favicon.ico',
      });
    } else {
      toast({
        variant: "destructive",
        title: "Permission Required",
        description: "Please enable browser notifications to use this feature.",
      });
    }
  };

  const scheduleSmartReminder = (event: any) => {
    const now = new Date();
    const eventTime = new Date(event.start_time);
    const reminderTime = new Date(eventTime.getTime() - settings.beforeMinutes * 60000);

    if (reminderTime > now) {
      const timeoutId = setTimeout(() => {
        if (settings.enabled && Notification.permission === 'granted') {
          new Notification(`Upcoming: ${event.title}`, {
            body: `Starting in ${settings.beforeMinutes} minutes`,
            icon: '/favicon.ico',
          });
        }
      }, reminderTime.getTime() - now.getTime());

      return timeoutId;
    }
  };

  const toggleMethod = (method: string) => {
    setSettings(prev => ({
      ...prev,
      methods: prev.methods.includes(method)
        ? prev.methods.filter(m => m !== method)
        : [...prev.methods, method]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <span>Smart Notifications</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Enable Notifications</span>
                </Label>
                <Switch
                  id="enabled"
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="smart" className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Smart Suggestions</span>
                </Label>
                <Switch
                  id="smart"
                  checked={settings.smartSuggestions}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smartSuggestions: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dnd" className="flex items-center space-x-2">
                  <BellOff className="h-4 w-4" />
                  <span>Do Not Disturb</span>
                </Label>
                <Switch
                  id="dnd"
                  checked={settings.doNotDisturb}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, doNotDisturb: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Default Reminder Time</Label>
                <Select
                  value={settings.beforeMinutes.toString()}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, beforeMinutes: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes before</SelectItem>
                    <SelectItem value="10">10 minutes before</SelectItem>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Notification Methods */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Methods</h3>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  settings.methods.includes('browser')
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => toggleMethod('browser')}
              >
                <Smartphone className="h-6 w-6 text-blue-500 mb-2" />
                <h4 className="font-medium">Browser Push</h4>
                <p className="text-sm text-gray-600">Desktop notifications</p>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  settings.methods.includes('email')
                    ? 'border-green-500 bg-green-50 dark:bg-green-950'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => toggleMethod('email')}
              >
                <Mail className="h-6 w-6 text-green-500 mb-2" />
                <h4 className="font-medium">Email</h4>
                <p className="text-sm text-gray-600">Email reminders</p>
              </div>
            </div>
          </Card>

          {/* Quiet Hours */}
          {settings.doNotDisturb && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quiet Hours</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start: e.target.value }
                    }))}
                    className="w-full mt-2 p-2 border rounded-md"
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: e.target.value }
                    }))}
                    className="w-full mt-2 p-2 border rounded-md"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={testNotification}>
              Test Notification
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={saveSettings} className="bg-blue-500 hover:bg-blue-600">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
