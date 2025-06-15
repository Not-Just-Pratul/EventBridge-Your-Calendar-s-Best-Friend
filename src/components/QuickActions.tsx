
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Calendar, Clock, Users, Coffee, Target, Video, Phone } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { addMinutes, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuickAction {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  duration: number;
  description: string;
  template: any;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ isOpen, onClose }) => {
  const [isCreating, setIsCreating] = useState(false);
  const { createEvent } = useEvents();
  const { toast } = useToast();

  const quickActions: QuickAction[] = [
    {
      id: 'standup',
      title: 'Daily Standup',
      icon: Users,
      color: 'blue',
      duration: 15,
      description: '15-min team sync',
      template: {
        title: 'Daily Standup',
        description: 'Quick team sync to discuss progress and blockers',
        color: 'blue',
        location: 'Team Room / Video Call',
      },
    },
    {
      id: 'coffee',
      title: 'Coffee Break',
      icon: Coffee,
      color: 'orange',
      duration: 15,
      description: 'Quick break time',
      template: {
        title: 'Coffee Break ☕',
        description: 'Time to recharge and refresh',
        color: 'orange',
        location: 'Kitchen / Cafe',
      },
    },
    {
      id: 'focus',
      title: 'Focus Time',
      icon: Target,
      color: 'green',
      duration: 60,
      description: 'Deep work session',
      template: {
        title: 'Focus Time 🎯',
        description: 'Uninterrupted time for deep work',
        color: 'green',
        location: 'Quiet space',
      },
    },
    {
      id: 'oneonone',
      title: '1:1 Meeting',
      icon: Users,
      color: 'purple',
      duration: 30,
      description: 'One-on-one discussion',
      template: {
        title: '1:1 Meeting',
        description: 'Personal discussion and feedback session',
        color: 'purple',
        location: 'Meeting Room',
      },
    },
    {
      id: 'video',
      title: 'Video Call',
      icon: Video,
      color: 'blue',
      duration: 30,
      description: 'Remote meeting',
      template: {
        title: 'Video Call',
        description: 'Online meeting via video conference',
        color: 'blue',
        location: 'Zoom / Teams',
      },
    },
    {
      id: 'phone',
      title: 'Phone Call',
      icon: Phone,
      color: 'green',
      duration: 15,
      description: 'Quick phone discussion',
      template: {
        title: 'Phone Call',
        description: 'Voice call discussion',
        color: 'green',
        location: 'Phone',
      },
    },
    {
      id: 'lunch',
      title: 'Lunch Break',
      icon: Coffee,
      color: 'orange',
      duration: 60,
      description: 'Meal time',
      template: {
        title: 'Lunch Break 🍽️',
        description: 'Time for lunch and relaxation',
        color: 'orange',
        location: 'Restaurant / Kitchen',
      },
    },
    {
      id: 'review',
      title: 'Code Review',
      icon: Target,
      color: 'purple',
      duration: 45,
      description: 'Review code changes',
      template: {
        title: 'Code Review',
        description: 'Review and discuss code changes',
        color: 'purple',
        location: 'Dev Environment',
      },
    },
  ];

  const createQuickEvent = async (action: QuickAction) => {
    setIsCreating(true);
    try {
      const now = new Date();
      const startTime = now;
      const endTime = addMinutes(startTime, action.duration);

      const eventData = {
        ...action.template,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      };

      await createEvent(eventData);
      
      toast({
        title: "Quick Event Created",
        description: `"${action.title}" has been added to your calendar.`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating quick event:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const scheduleForLater = async (action: QuickAction, hoursLater: number) => {
    setIsCreating(true);
    try {
      const now = new Date();
      const startTime = addMinutes(now, hoursLater * 60);
      const endTime = addMinutes(startTime, action.duration);

      const eventData = {
        ...action.template,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      };

      await createEvent(eventData);
      
      toast({
        title: "Event Scheduled",
        description: `"${action.title}" scheduled for ${format(startTime, 'h:mm a')}.`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error scheduling event:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule event. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-500 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950',
      green: 'border-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-950',
      purple: 'border-purple-500 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950',
      orange: 'border-orange-500 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Quick Actions</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Create events instantly with predefined templates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Card
                  key={action.id}
                  className={`p-6 border-2 transition-all duration-200 hover:scale-105 ${getColorClasses(action.color)}`}
                >
                  <div className="text-center space-y-4">
                    <IconComponent className={`h-8 w-8 mx-auto ${getIconColor(action.color)}`} />
                    <div>
                      <h3 className="font-semibold text-lg">{action.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {action.duration} min
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        onClick={() => createQuickEvent(action)}
                        disabled={isCreating}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        size="sm"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Create Now
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => scheduleForLater(action, 1)}
                          disabled={isCreating}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          +1h
                        </Button>
                        <Button
                          onClick={() => scheduleForLater(action, 2)}
                          disabled={isCreating}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          +2h
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Tip: Use keyboard shortcuts Ctrl+1, Ctrl+2, etc. for even faster access
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
