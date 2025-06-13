
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTime?: Date | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  selectedTime,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Creating event:', { title, description, selectedTime });
    setIsProcessing(false);
    onClose();
    setTitle('');
    setDescription('');
  };

  const suggestions = [
    "Team standup meeting",
    "Coffee chat with client",
    "Design review session",
    "Focus time for coding",
    "Lunch break 🍜"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>Create New Event</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              What's happening? ✨
            </Label>
            <Input
              id="title"
              placeholder="Try: 'Lunch with Sarah tomorrow at 1 PM'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              disabled={isProcessing}
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50 transition-colors text-xs"
                  onClick={() => setTitle(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          {selectedTime && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-purple-800">
                <Calendar className="h-4 w-4" />
                <span>{format(selectedTime, 'EEEE, MMMM d')}</span>
                <Clock className="h-4 w-4 ml-2" />
                <span>{format(selectedTime, 'h:mm a')}</span>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Add some details (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Meeting agenda, location, or any special notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 resize-none"
              rows={3}
              disabled={isProcessing}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="space-x-2"
              disabled={isProcessing}
            >
              <MapPin className="h-4 w-4" />
              <span>Add Location</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="space-x-2"
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
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </form>

        {isProcessing && (
          <div className="text-center py-2">
            <div className="text-sm text-purple-600 animate-pulse">
              🤖 AI is working its magic...
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
