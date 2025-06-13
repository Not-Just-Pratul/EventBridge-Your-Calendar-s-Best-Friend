
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, Sparkles, Palette } from 'lucide-react';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTime?: Date | null;
  editEvent?: any;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  selectedTime,
  editEvent,
}) => {
  const [title, setTitle] = useState(editEvent?.title || '');
  const [description, setDescription] = useState(editEvent?.description || '');
  const [duration, setDuration] = useState(editEvent?.duration || '30');
  const [color, setColor] = useState(editEvent?.color || 'blue');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Creating event:', { title, description, selectedTime, duration, color });
    setIsProcessing(false);
    onClose();
    setTitle('');
    setDescription('');
    setDuration('30');
    setColor('blue');
  };

  const suggestions = [
    "Team standup meeting",
    "Coffee chat with client",
    "Design review session",
    "Focus time for coding",
    "Lunch break 🍜",
    "1:1 with manager",
    "Project planning",
    "Code review"
  ];

  const colorOptions = [
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Green', value: 'green', class: 'bg-green-500' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
    { name: 'Red', value: 'red', class: 'bg-red-500' },
    { name: 'Pink', value: 'pink', class: 'bg-pink-500' }
  ];

  const durationOptions = [
    '15', '30', '45', '60', '90', '120'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>{editEvent ? 'Edit Event' : 'Create New Event'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              What's happening? ✨
            </Label>
            <Input
              id="title"
              placeholder="Try: 'Lunch with Sarah tomorrow at 1 PM'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 border-2 focus:border-purple-300 transition-colors duration-200"
              disabled={isProcessing}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors text-xs border-purple-200 dark:border-purple-700"
                  onClick={() => setTitle(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          {selectedTime && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-4 text-sm text-purple-800 dark:text-purple-200">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{format(selectedTime, 'EEEE, MMMM d')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{format(selectedTime, 'h:mm a')}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color" className="text-sm font-medium flex items-center">
                <Palette className="h-4 w-4 mr-1" />
                Color
              </Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${option.class}`} />
                        <span>{option.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Add some details (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Meeting agenda, location, or any special notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 resize-none border-2 focus:border-purple-300 transition-colors duration-200"
              rows={3}
              disabled={isProcessing}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="space-x-2 border-2 hover:border-purple-300 transition-colors duration-200"
              disabled={isProcessing}
            >
              <MapPin className="h-4 w-4" />
              <span>Add Location</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="space-x-2 border-2 hover:border-purple-300 transition-colors duration-200"
              disabled={isProcessing}
            >
              <Users className="h-4 w-4" />
              <span>Invite Others</span>
            </Button>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{editEvent ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                editEvent ? 'Update Event' : 'Create Event'
              )}
            </Button>
          </div>
        </form>

        {isProcessing && (
          <div className="text-center py-2">
            <div className="text-sm text-purple-600 dark:text-purple-400 animate-pulse">
              🤖 AI is working its magic...
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
