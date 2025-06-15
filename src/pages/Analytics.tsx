
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Calendar,
  Users,
  Target,
  ArrowUp,
  ArrowDown,
  Activity,
  Brain,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useEvents();
  const [timeRange, setTimeRange] = useState('week');

  // Mock data for analytics
  const productivityData = [
    { name: 'Mon', hours: 8, focus: 6.5, meetings: 1.5 },
    { name: 'Tue', hours: 7.5, focus: 5.8, meetings: 1.7 },
    { name: 'Wed', hours: 9, focus: 7.2, meetings: 1.8 },
    { name: 'Thu', hours: 8.5, focus: 6.8, meetings: 1.7 },
    { name: 'Fri', hours: 6, focus: 4.5, meetings: 1.5 },
    { name: 'Sat', hours: 2, focus: 2, meetings: 0 },
    { name: 'Sun', hours: 1, focus: 1, meetings: 0 }
  ];

  const categoryData = [
    { name: 'Meetings', value: 35, color: '#8884d8' },
    { name: 'Focus Work', value: 40, color: '#82ca9d' },
    { name: 'Admin', value: 15, color: '#ffc658' },
    { name: 'Break', value: 10, color: '#ff7300' }
  ];

  const weeklyTrends = [
    { week: 'W1', productivity: 85, wellbeing: 78, efficiency: 82 },
    { week: 'W2', productivity: 88, wellbeing: 82, efficiency: 85 },
    { week: 'W3', productivity: 92, wellbeing: 85, efficiency: 88 },
    { week: 'W4', productivity: 89, wellbeing: 87, efficiency: 91 }
  ];

  const stats = [
    {
      title: 'Total Events',
      value: events.length.toString(),
      change: '+12%',
      trend: 'up',
      icon: Calendar
    },
    {
      title: 'Focus Hours',
      value: '42.5h',
      change: '+8%',
      trend: 'up',
      icon: Clock
    },
    {
      title: 'Meetings',
      value: '18',
      change: '-5%',
      trend: 'down',
      icon: Users
    },
    {
      title: 'Productivity Score',
      value: '89%',
      change: '+3%',
      trend: 'up',
      icon: Target
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to view analytics</p>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Insights into your productivity</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => navigate('/calendar')}>Back to Calendar</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.trend === 'up' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`} />
                </div>
              </div>
              <div className="flex items-center mt-2">
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${
                  stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last {timeRange}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="productivity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="time">Time Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="productivity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Daily Productivity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="focus" stackId="a" fill="#8884d8" name="Focus Time" />
                    <Bar dataKey="meetings" stackId="a" fill="#82ca9d" name="Meetings" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Time Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="time" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Time Tracking</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="focus" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="productivity" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="wellbeing" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="efficiency" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">AI Recommendations</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Peak Productivity Time
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your focus is highest on Wednesday mornings. Consider scheduling important tasks then.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Meeting Optimization
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      You have 20% fewer meetings this week. Great work on protecting your focus time!
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      Break Reminder
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Consider taking more breaks between long focus sessions for better productivity.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Activity className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold">Health & Wellness</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Work-Life Balance</span>
                    <Badge variant="outline" className="text-green-600">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Focus Sessions</span>
                    <Badge variant="outline" className="text-blue-600">Above Average</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Meeting Load</span>
                    <Badge variant="outline" className="text-yellow-600">Moderate</Badge>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your productivity score has improved by 15% this month. Keep up the great work!
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
