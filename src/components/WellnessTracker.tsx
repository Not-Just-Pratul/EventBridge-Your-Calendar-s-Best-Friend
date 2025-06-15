
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { differenceInMinutes, parseISO, format, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';

interface WellnessTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WellnessMetrics {
  workHours: number;
  breakTime: number;
  focusTime: number;
  meetingTime: number;
  workLifeBalance: number;
  stressLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export const WellnessTracker: React.FC<WellnessTrackerProps> = ({ isOpen, onClose }) => {
  const { events } = useEvents();
  const [wellness, setWellness] = useState<WellnessMetrics>({
    workHours: 0,
    breakTime: 0,
    focusTime: 0,
    meetingTime: 0,
    workLifeBalance: 0,
    stressLevel: 'low',
    recommendations: [],
  });

  useEffect(() => {
    calculateWellnessMetrics();
  }, [events]);

  const calculateWellnessMetrics = () => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    
    const weekEvents = events.filter(event => {
      const eventDate = parseISO(event.start_time);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });

    let workHours = 0;
    let breakTime = 0;
    let focusTime = 0;
    let meetingTime = 0;

    weekEvents.forEach(event => {
      const duration = differenceInMinutes(parseISO(event.end_time), parseISO(event.start_time));
      const title = event.title.toLowerCase();

      if (title.includes('break') || title.includes('lunch') || title.includes('coffee')) {
        breakTime += duration;
      } else if (title.includes('meeting') || title.includes('call') || title.includes('standup')) {
        meetingTime += duration;
        workHours += duration;
      } else if (title.includes('focus') || title.includes('coding') || title.includes('work')) {
        focusTime += duration;
        workHours += duration;
      } else {
        workHours += duration;
      }
    });

    // Convert to hours
    workHours = workHours / 60;
    breakTime = breakTime / 60;
    focusTime = focusTime / 60;
    meetingTime = meetingTime / 60;

    // Calculate work-life balance (ideal: 40 hours/week)
    const idealWeeklyHours = 40;
    const workLifeBalance = Math.max(0, Math.min(100, 100 - (Math.abs(workHours - idealWeeklyHours) / idealWeeklyHours) * 100));

    // Determine stress level
    let stressLevel: 'low' | 'medium' | 'high' = 'low';
    if (workHours > 50 || meetingTime > 20) {
      stressLevel = 'high';
    } else if (workHours > 45 || meetingTime > 15) {
      stressLevel = 'medium';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (workHours > 50) {
      recommendations.push('Consider reducing work hours to maintain better work-life balance');
    }
    
    if (breakTime < 5) {
      recommendations.push('Schedule more breaks throughout your day');
    }
    
    if (meetingTime > workHours * 0.6) {
      recommendations.push('Try to reduce meeting time and increase focused work time');
    }
    
    if (focusTime < workHours * 0.3) {
      recommendations.push('Block more time for focused, uninterrupted work');
    }

    if (recommendations.length === 0) {
      recommendations.push('Great job maintaining a healthy work schedule!');
    }

    setWellness({
      workHours: Math.round(workHours * 10) / 10,
      breakTime: Math.round(breakTime * 10) / 10,
      focusTime: Math.round(focusTime * 10) / 10,
      meetingTime: Math.round(meetingTime * 10) / 10,
      workLifeBalance: Math.round(workLifeBalance),
      stressLevel,
      recommendations,
    });
  };

  const getBalanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Wellness Tracker</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{wellness.workHours}h</p>
              <p className="text-sm text-gray-600">Work Hours</p>
            </Card>
            <Card className="p-4 text-center">
              <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{wellness.focusTime}h</p>
              <p className="text-sm text-gray-600">Focus Time</p>
            </Card>
            <Card className="p-4 text-center">
              <Heart className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{wellness.breakTime}h</p>
              <p className="text-sm text-gray-600">Break Time</p>
            </Card>
            <Card className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{wellness.meetingTime}h</p>
              <p className="text-sm text-gray-600">Meetings</p>
            </Card>
          </div>

          {/* Work-Life Balance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Work-Life Balance Score
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Balance</span>
                <span className={`text-2xl font-bold ${getBalanceColor(wellness.workLifeBalance)}`}>
                  {wellness.workLifeBalance}%
                </span>
              </div>
              <Progress value={wellness.workLifeBalance} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Poor</span>
                <span className="text-gray-500">Excellent</span>
              </div>
            </div>
          </Card>

          {/* Stress Level */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current Stress Level</h3>
            <div className="flex items-center space-x-4">
              <Badge className={`${getStressColor(wellness.stressLevel)} px-4 py-2 text-lg`}>
                {wellness.stressLevel.toUpperCase()}
              </Badge>
              {wellness.stressLevel === 'high' && (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span className="text-sm">Consider taking breaks</span>
                </div>
              )}
            </div>
          </Card>

          {/* Time Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Time Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Focus Work</span>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={(wellness.focusTime / wellness.workHours) * 100} 
                    className="w-24 h-2" 
                  />
                  <span className="text-sm font-medium">{wellness.focusTime}h</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Meetings</span>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={(wellness.meetingTime / wellness.workHours) * 100} 
                    className="w-24 h-2" 
                  />
                  <span className="text-sm font-medium">{wellness.meetingTime}h</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Breaks</span>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={Math.min((wellness.breakTime / 10) * 100, 100)} 
                    className="w-24 h-2" 
                  />
                  <span className="text-sm font-medium">{wellness.breakTime}h</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Wellness Recommendations</h3>
            <div className="space-y-2">
              {wellness.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
