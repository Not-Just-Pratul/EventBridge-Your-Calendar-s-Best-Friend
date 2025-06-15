
import { useState, useEffect } from 'react';
import { useEvents } from './useEvents';

export interface LifeBalanceMetrics {
  workLifeBalance: number;
  stressLevel: number;
  focusTime: number;
  wellnessScore: number;
  workHours: number;
  personalHours: number;
  healthHours: number;
  socialHours: number;
  freeTime: number;
  averageEventDuration: number;
  upcomingDeadlines: number;
}

export const useLifeBalanceMetrics = () => {
  const { events } = useEvents();
  const [metrics, setMetrics] = useState<LifeBalanceMetrics>({
    workLifeBalance: 50,
    stressLevel: 30,
    focusTime: 60,
    wellnessScore: 70,
    workHours: 0,
    personalHours: 0,
    healthHours: 0,
    socialHours: 0,
    freeTime: 0,
    averageEventDuration: 0,
    upcomingDeadlines: 0,
  });

  useEffect(() => {
    if (!events.length) return;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    // Filter events for current week
    const weekEvents = events.filter(event => {
      const eventStart = new Date(event.start_time);
      return eventStart >= weekStart && eventStart < weekEnd;
    });

    // Categorize events based on title and description keywords
    const workKeywords = ['meeting', 'work', 'project', 'client', 'conference', 'presentation', 'deadline'];
    const healthKeywords = ['gym', 'workout', 'doctor', 'health', 'exercise', 'yoga', 'meditation'];
    const socialKeywords = ['dinner', 'lunch', 'party', 'friends', 'family', 'social', 'date'];

    let workHours = 0;
    let personalHours = 0;
    let healthHours = 0;
    let socialHours = 0;
    let totalDuration = 0;
    let eventCount = 0;
    let upcomingDeadlines = 0;

    weekEvents.forEach(event => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
      
      totalDuration += duration;
      eventCount++;

      const text = `${event.title} ${event.description || ''}`.toLowerCase();
      
      // Check for upcoming deadlines
      if (text.includes('deadline') && start > now) {
        upcomingDeadlines++;
      }

      // Categorize event
      if (workKeywords.some(keyword => text.includes(keyword))) {
        workHours += duration;
      } else if (healthKeywords.some(keyword => text.includes(keyword))) {
        healthHours += duration;
      } else if (socialKeywords.some(keyword => text.includes(keyword))) {
        socialHours += duration;
      } else {
        personalHours += duration;
      }
    });

    const totalScheduledHours = workHours + personalHours + healthHours + socialHours;
    const freeTime = Math.max(0, 168 - totalScheduledHours); // 168 hours in a week
    const averageEventDuration = eventCount > 0 ? totalDuration / eventCount : 0;

    // Calculate metrics
    const workLifeBalance = totalScheduledHours > 0 
      ? Math.round(((personalHours + healthHours + socialHours) / totalScheduledHours) * 100)
      : 50;

    // Stress level based on work hours and upcoming deadlines
    const stressLevel = Math.min(100, Math.round(
      (workHours / 40) * 50 + // Base stress from work hours
      (upcomingDeadlines * 15) + // Stress from deadlines
      (averageEventDuration > 3 ? 20 : 0) // Stress from long events
    ));

    // Focus time based on work events and their spacing
    const focusTime = Math.min(100, Math.round(
      (workHours / 40) * 60 + // Base focus from work time
      (averageEventDuration > 1 ? 20 : 0) + // Bonus for longer focused sessions
      (freeTime > 20 ? 20 : 0) // Bonus for having free time
    ));

    // Wellness score based on balance
    const wellnessScore = Math.round(
      (workLifeBalance * 0.3) +
      ((100 - stressLevel) * 0.3) +
      (focusTime * 0.2) +
      ((healthHours / totalScheduledHours) * 100 * 0.2)
    );

    setMetrics({
      workLifeBalance,
      stressLevel,
      focusTime,
      wellnessScore,
      workHours: Math.round(workHours),
      personalHours: Math.round(personalHours),
      healthHours: Math.round(healthHours),
      socialHours: Math.round(socialHours),
      freeTime: Math.round(freeTime),
      averageEventDuration: Math.round(averageEventDuration * 100) / 100,
      upcomingDeadlines,
    });
  }, [events]);

  return metrics;
};
