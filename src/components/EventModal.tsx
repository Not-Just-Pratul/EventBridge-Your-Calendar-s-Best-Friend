import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Sparkles, Palette } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import { useEvents, Event } from '@/hooks/useEvents';
import { LocationPicker } from '@/components/LocationPicker';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTime?: Date | null;
  editEvent?: Event | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  selectedTime,
  editEvent,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [color, setColor] = useState('blue');
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationTab, setLocationTab] = useState('manual');
  const { createEvent, updateEvent } = useEvents();

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.description || '');
      setLocation(editEvent.location || '');
      setStartTime(format(new Date(editEvent.start_time), "yyyy-MM-dd'T'HH:mm"));
      setEndTime(format(new Date(editEvent.end_time), "yyyy-MM-dd'T'HH:mm"));
      setColor(editEvent.color);
    } else if (selectedTime) {
      const start = selectedTime;
      const end = addMinutes(start, parseInt(duration));
      setTitle('');
      setDescription('');
      setLocation('');
      setStartTime(format(start, "yyyy-MM-dd'T'HH:mm"));
      setEndTime(format(end, "yyyy-MM-dd'T'HH:mm"));
      setColor('blue');
    }
  }, [editEvent, selectedTime, duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const eventData = {
        title,
        description,
        location,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        color,
      };

      if (editEvent) {
        await updateEvent(editEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setStartTime('');
    setEndTime('');
    setDuration('30');
    setColor('blue');
    setLocationTab('manual');
  };

  const handleLocationSelect = (selectedLocation: { address: string; lat: number; lng: number }) => {
    setLocation(selectedLocation.address);
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

  const handleDurationChange = (newDuration: string) => {
    setDuration(newDuration);
    if (startTime) {
      const start = new Date(startTime);
      const end = addMinutes(start, parseInt(newDuration));
      setEndTime(format(end, "yyyy-MM-dd'T'HH:mm"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>{editEvent ? 'Edit Event' : 'Create New Event'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Event Title ✨
            </Label>
            <Input
              id="title"
              placeholder="What's happening?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 border-2 focus:border-purple-300 transition-colors duration-200"
              disabled={isProcessing}
              required
            />
            {!editEvent && (
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
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="text-sm font-medium">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  if (e.target.value) {
                    const start = new Date(e.target.value);
                    const end = addMinutes(start, parseInt(duration));
                    setEndTime(format(end, "yyyy-MM-dd'T'HH:mm"));
                  }
                }}
                className="mt-2"
                disabled={isProcessing}
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime" className="text-sm font-medium">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-2"
                disabled={isProcessing}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration" className="text-sm font-medium">Quick Duration</Label>
              <Select value={duration} onValueChange={handleDurationChange}>
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
            <Label htmlFor="location" className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Location
            </Label>
            
            <Tabs value={locationTab} onValueChange={setLocationTab} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="map">Map Picker</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="mt-4">
                <Input
                  id="location"
                  placeholder="Where is this happening?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-2 focus:border-purple-300 transition-colors duration-200"
                  disabled={isProcessing}
                />
              </TabsContent>
              
              <TabsContent value="map" className="mt-4">
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={location}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add some details about this event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 resize-none border-2 focus:border-purple-300 transition-colors duration-200"
              rows={3}
              disabled={isProcessing}
            />
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
              🤖 Working on it...
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
