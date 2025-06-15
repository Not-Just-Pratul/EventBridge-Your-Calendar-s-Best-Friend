
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Zap, Brain, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { LifeBalanceMetrics } from '@/hooks/useLifeBalanceMetrics';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedAIFeaturesProps {
  metrics: LifeBalanceMetrics;
  onInsightReceived?: (insight: string) => void;
}

export const EnhancedAIFeatures: React.FC<EnhancedAIFeaturesProps> = ({
  metrics,
  onInsightReceived,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const { events, createEvent } = useEvents();
  const { toast } = useToast();

  const analyzeCalendarPatterns = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: `Analyze my calendar patterns and productivity. Here are my current metrics:
          - Work hours this week: ${metrics.workHours}
          - Personal hours: ${metrics.personalHours}
          - Health/wellness hours: ${metrics.healthHours}
          - Social hours: ${metrics.socialHours}
          - Free time: ${metrics.freeTime}
          - Average event duration: ${metrics.averageEventDuration} hours
          - Upcoming deadlines: ${metrics.upcomingDeadlines}
          - Current stress level: ${metrics.stressLevel}%
          
          Provide insights on my time management patterns, productivity trends, and specific recommendations for improvement.`,
          lifeBalanceData: metrics,
          context: 'calendar_analysis'
        }
      });

      if (error) throw error;
      
      onInsightReceived?.(data.response);
      toast({
        title: "Calendar Analysis Complete",
        description: "Your AI assistant has analyzed your calendar patterns and provided insights.",
      });
    } catch (error) {
      console.error('Error analyzing calendar:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze calendar patterns. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const optimizeSchedule = async () => {
    setIsOptimizing(true);
    try {
      const upcomingWeekEvents = events.filter(event => {
        const eventDate = new Date(event.start_time);
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return eventDate > new Date() && eventDate <= nextWeek;
      });

      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: `Help me optimize my schedule for next week. Current situation:
          - Stress level: ${metrics.stressLevel}%
          - Work-life balance: ${metrics.workLifeBalance}%
          - Focus time: ${metrics.focusTime}%
          - Upcoming events: ${upcomingWeekEvents.length}
          - Upcoming deadlines: ${metrics.upcomingDeadlines}
          
          Suggest specific time blocks for:
          1. Deep work sessions
          2. Wellness breaks
          3. Personal time
          4. Buffer time between meetings
          
          Provide concrete scheduling recommendations with suggested times.`,
          lifeBalanceData: metrics,
          context: 'schedule_optimization'
        }
      });

      if (error) throw error;
      
      onInsightReceived?.(data.response);
      toast({
        title: "Schedule Optimization Complete",
        description: "Your AI assistant has provided schedule optimization recommendations.",
      });
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "Could not optimize schedule. Please try again.",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const generateIdealSchedule = async () => {
    setIsGeneratingSchedule(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: `Create an ideal daily schedule template based on my current metrics:
          - Current work hours: ${metrics.workHours}/week
          - Stress level: ${metrics.stressLevel}%
          - Health time: ${metrics.healthHours} hours/week
          - Free time available: ${metrics.freeTime} hours/week
          
          Generate a balanced daily schedule that includes:
          1. Optimal work blocks (with breaks)
          2. Exercise/wellness time
          3. Personal time
          4. Meal times
          5. Wind-down periods
          
          Suggest specific times and durations. I want to improve my wellness score from ${metrics.wellnessScore}% to 85%+.`,
          lifeBalanceData: metrics,
          context: 'ideal_schedule_generation'
        }
      });

      if (error) throw error;
      
      onInsightReceived?.(data.response);
      
      // Auto-create template events for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      // Create a morning wellness break
      await createEvent({
        title: "🧘 Morning Wellness Break",
        description: "AI-recommended wellness time to start the day right",
        start_time: new Date(tomorrow.getTime()).toISOString(),
        end_time: new Date(tomorrow.getTime() + 30 * 60 * 1000).toISOString(),
        color: "green",
      });

      toast({
        title: "Ideal Schedule Generated",
        description: "AI has created schedule recommendations and added a sample wellness break for tomorrow.",
      });
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate ideal schedule. Please try again.",
      });
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  const getMetricStatus = (value: number, type: 'stress' | 'balance' | 'wellness') => {
    if (type === 'stress') {
      if (value > 70) return { color: 'red', status: 'High' };
      if (value > 40) return { color: 'yellow', status: 'Moderate' };
      return { color: 'green', status: 'Low' };
    } else {
      if (value > 80) return { color: 'green', status: 'Excellent' };
      if (value > 60) return { color: 'yellow', status: 'Good' };
      return { color: 'red', status: 'Needs Attention' };
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <Brain className="h-4 w-4 mr-2 text-purple-600" />
          AI-Powered Calendar Insights
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold">{metrics.workHours}h</div>
            <div className="text-xs text-gray-600">Work This Week</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{metrics.freeTime}h</div>
            <div className="text-xs text-gray-600">Free Time</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={`text-${getMetricStatus(metrics.stressLevel, 'stress').color}-600`}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            Stress: {getMetricStatus(metrics.stressLevel, 'stress').status}
          </Badge>
          <Badge variant="outline" className={`text-${getMetricStatus(metrics.wellnessScore, 'wellness').color}-600`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            Wellness: {getMetricStatus(metrics.wellnessScore, 'wellness').status}
          </Badge>
          {metrics.upcomingDeadlines > 0 && (
            <Badge variant="outline" className="text-orange-600">
              <Clock className="h-3 w-3 mr-1" />
              {metrics.upcomingDeadlines} Deadlines
            </Badge>
          )}
        </div>

        <div className="grid gap-2">
          <Button 
            onClick={analyzeCalendarPatterns}
            disabled={isAnalyzing}
            variant="outline"
            className="w-full"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Calendar Patterns'}
          </Button>
          
          <Button 
            onClick={optimizeSchedule}
            disabled={isOptimizing}
            variant="outline"
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Optimize Next Week'}
          </Button>
          
          <Button 
            onClick={generateIdealSchedule}
            disabled={isGeneratingSchedule}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Brain className="h-4 w-4 mr-2" />
            {isGeneratingSchedule ? 'Generating...' : 'Generate Ideal Schedule'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
