
import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { BarChart3, Clock, Target, TrendingUp, Calendar, Zap } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, differenceInMinutes, startOfDay } from 'date-fns';

interface TimeAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimeAnalytics: React.FC<TimeAnalyticsProps> = ({ isOpen, onClose }) => {
  const { events } = useEvents();

  const analytics = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const thisWeekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Calculate daily hours
    const dailyHours = thisWeekDays.map(day => {
      const dayEvents = events.filter(event => {
        const eventDate = startOfDay(parseISO(event.start_time));
        return eventDate.getTime() === startOfDay(day).getTime();
      });

      const totalMinutes = dayEvents.reduce((acc, event) => {
        return acc + differenceInMinutes(parseISO(event.end_time), parseISO(event.start_time));
      }, 0);

      return {
        day: format(day, 'EEE'),
        hours: Math.round(totalMinutes / 60 * 10) / 10,
        events: dayEvents.length,
      };
    });

    // Calculate productivity by time of day
    const hourlyProductivity = Array.from({ length: 24 }, (_, hour) => {
      const hourEvents = events.filter(event => {
        const eventHour = parseISO(event.start_time).getHours();
        return eventHour === hour;
      });

      return {
        hour: `${hour}:00`,
        events: hourEvents.length,
        productivity: hourEvents.length > 0 ? hourEvents.length * 20 : 0,
      };
    });

    // Calculate category distribution
    const categoryData = events.reduce((acc, event) => {
      const category = event.title.toLowerCase().includes('meeting') ? 'Meetings' :
                     event.title.toLowerCase().includes('focus') ? 'Focus Time' :
                     event.title.toLowerCase().includes('break') || event.title.toLowerCase().includes('lunch') ? 'Breaks' :
                     'Other';
      
      acc[category] = (acc[category] || 0) + differenceInMinutes(parseISO(event.end_time), parseISO(event.start_time));
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value: Math.round(value / 60 * 10) / 10,
    }));

    // Calculate stats
    const totalHours = dailyHours.reduce((acc, day) => acc + day.hours, 0);
    const avgDailyHours = totalHours / 7;
    const mostProductiveDay = dailyHours.reduce((prev, current) => 
      current.hours > prev.hours ? current : prev
    );

    return {
      dailyHours,
      hourlyProductivity,
      pieData,
      stats: {
        totalHours: Math.round(totalHours * 10) / 10,
        avgDailyHours: Math.round(avgDailyHours * 10) / 10,
        totalEvents: events.length,
        mostProductiveDay: mostProductiveDay.day,
      },
    };
  }, [events]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Time Analytics Dashboard</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{analytics.stats.totalHours}h</p>
              <p className="text-sm text-gray-600">Total This Week</p>
            </Card>
            <Card className="p-4 text-center">
              <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{analytics.stats.avgDailyHours}h</p>
              <p className="text-sm text-gray-600">Daily Average</p>
            </Card>
            <Card className="p-4 text-center">
              <Calendar className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{analytics.stats.totalEvents}</p>
              <p className="text-sm text-gray-600">Total Events</p>
            </Card>
            <Card className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{analytics.stats.mostProductiveDay}</p>
              <p className="text-sm text-gray-600">Most Productive</p>
            </Card>
          </div>

          {/* Daily Hours Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Daily Time Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.dailyHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value}h`, 'Hours']} />
                <Bar dataKey="hours" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Time by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}h`}
                  >
                    {analytics.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}h`, 'Hours']} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Productivity Heatmap */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Productivity by Hour</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics.hourlyProductivity.filter(h => h.events > 0)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Insights & Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Work-Life Balance: Good
                </Badge>
                <p className="text-sm text-gray-600">
                  You're maintaining a healthy balance with an average of {analytics.stats.avgDailyHours} hours per day.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Peak Productivity: {analytics.stats.mostProductiveDay}
                </Badge>
                <p className="text-sm text-gray-600">
                  Your most productive day is {analytics.stats.mostProductiveDay}. Consider scheduling important tasks on this day.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
