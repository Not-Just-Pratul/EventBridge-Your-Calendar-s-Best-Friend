
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Calendar, Clock, Users, Coffee, Target } from 'lucide-react';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: () => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const quickActions = [
    {
      title: 'Quick Meeting',
      description: 'Schedule a 30min meeting',
      icon: Users,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      action: () => onCreateEvent()
    },
    {
      title: 'Focus Block',
      description: '2 hour deep work session',
      icon: Target,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      action: () => onCreateEvent()
    },
    {
      title: 'Coffee Break',
      description: '15min break reminder',
      icon: Coffee,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      action: () => onCreateEvent()
    },
    {
      title: 'Lunch Time',
      description: 'Block 1 hour for lunch',
      icon: Clock,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      action: () => onCreateEvent()
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Quick Actions</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className={`p-4 cursor-pointer transition-all duration-200 transform hover:scale-105 ${action.color}`}
              onClick={() => {
                action.action();
                onClose();
              }}
            >
              <div className="text-center space-y-2">
                <action.icon className="h-6 w-6 mx-auto text-gray-700" />
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs text-gray-600">{action.description}</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-4">
          <Button
            onClick={() => {
              onCreateEvent();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Create Custom Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
