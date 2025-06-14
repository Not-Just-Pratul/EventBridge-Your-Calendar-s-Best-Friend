
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isToday, isFuture, isPast } from 'date-fns';
import { Edit, Trash2, Clock, MapPin, Search, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useEvents, Event } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { EventModal } from '@/components/EventModal';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { events, deleteEvent, loading } = useEvents();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  // Filter events based on search term and filter criteria
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    switch (filterBy) {
      case 'today':
        return isToday(new Date(event.start_time));
      case 'upcoming':
        return isFuture(new Date(event.start_time));
      case 'past':
        return isPast(new Date(event.end_time));
      default:
        return true;
    }
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'created':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);

    if (isToday(start)) return { label: 'Today', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    if (now >= start && now <= end) return { label: 'Ongoing', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (isFuture(start)) return { label: 'Upcoming', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
    return { label: 'Past', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              All Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage all your events in one place
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/calendar')}
              variant="outline"
              className="hover:bg-purple-50 dark:hover:bg-purple-950"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Back to Calendar
            </Button>
            <Button
              onClick={handleCreateEvent}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="created">Recently Created</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              {sortedEvents.length} of {events.length} events
            </div>
          </div>
        </Card>

        {/* Events List */}
        {sortedEvents.length === 0 ? (
          <Card className="p-12 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm || filterBy !== 'all' ? 'No events found' : 'No events yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first event.'
              }
            </p>
            {(!searchTerm && filterBy === 'all') && (
              <Button
                onClick={handleCreateEvent}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedEvents.map((event) => {
              const status = getEventStatus(event);
              return (
                <Card key={event.id} className="p-6 hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {event.title}
                        </h3>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                        <Badge variant="outline" className={`border-${event.color}-300 text-${event.color}-700 dark:text-${event.color}-300`}>
                          {event.color}
                        </Badge>
                      </div>
                      
                      {event.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(event.start_time), 'MMM d, yyyy h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                          </span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditEvent(event)}
                        className="hover:bg-purple-50 dark:hover:bg-purple-950"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        selectedTime={null}
        editEvent={editingEvent}
      />
    </div>
  );
};

export default Events;
