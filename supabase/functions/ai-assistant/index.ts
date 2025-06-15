
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LifeBalanceData {
  workLifeBalance: number;
  stressLevel: number;
  focusTime: number;
  wellnessScore: number;
  workHours?: number;
  personalHours?: number;
  healthHours?: number;
  socialHours?: number;
  freeTime?: number;
  averageEventDuration?: number;
  upcomingDeadlines?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, lifeBalanceData, context } = await req.json();

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Enhanced context for calendar-synced AI
    let contextPrompt = `You are an advanced wellness and productivity AI assistant integrated with a calendar app. You help users optimize their work-life balance using real-time calendar data analysis.`;

    if (lifeBalanceData) {
      const data = lifeBalanceData as LifeBalanceData;
      contextPrompt += `\n\nReal-time Calendar Metrics:
- Work-Life Balance: ${data.workLifeBalance}%
- Stress Level: ${data.stressLevel}%
- Focus Time: ${data.focusTime}%
- Wellness Score: ${data.wellnessScore}%`;

      if (data.workHours !== undefined) {
        contextPrompt += `\n\nWeekly Time Breakdown:
- Work Hours: ${data.workHours}h
- Personal Hours: ${data.personalHours}h
- Health/Wellness Hours: ${data.healthHours}h
- Social Hours: ${data.socialHours}h
- Free Time Available: ${data.freeTime}h
- Average Event Duration: ${data.averageEventDuration}h
- Upcoming Deadlines: ${data.upcomingDeadlines}`;
      }

      // Context-specific analysis
      if (context === 'calendar_analysis') {
        contextPrompt += `\n\nProvide detailed analysis of calendar patterns, productivity insights, and specific recommendations for time management improvement.`;
      } else if (context === 'schedule_optimization') {
        contextPrompt += `\n\nFocus on providing concrete scheduling recommendations with specific time blocks and optimization strategies.`;
      } else if (context === 'ideal_schedule_generation') {
        contextPrompt += `\n\nCreate a comprehensive daily schedule template with specific times and durations for optimal wellness and productivity.`;
      }

      // Personalized recommendations based on metrics
      if (data.stressLevel > 70) {
        contextPrompt += `\n\nPRIORITY: High stress detected (${data.stressLevel}%). Strongly recommend immediate stress reduction strategies and schedule breaks.`;
      }
      if (data.focusTime < 50) {
        contextPrompt += `\n\nPRIORITY: Low focus time (${data.focusTime}%). Suggest focus sessions and deep work time blocks.`;
      }
      if (data.wellnessScore > 80) {
        contextPrompt += `\n\nEXCELLENT: High wellness score (${data.wellnessScore}%). Congratulate them and suggest maintaining current habits.`;
      }
      if (data.freeTime && data.freeTime < 10) {
        contextPrompt += `\n\nCONCERN: Very limited free time (${data.freeTime}h). Recommend schedule optimization and boundary setting.`;
      }
    }

    contextPrompt += `\n\nYou can suggest actions like:
- "schedule_break" - when user needs immediate stress relief
- "focus_session" - when user needs deep work time
- "schedule_optimization" - for improving time management
- Calendar analysis and pattern recognition
- Wellness coaching and productivity tips
- Specific time recommendations with exact hours

Keep responses practical, actionable, and encouraging. Always consider the user's real calendar data when giving advice. Provide specific time suggestions when relevant (e.g., "Schedule a 15-minute break at 2:30 PM").`;

    // Enhanced request for better AI responses
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${contextPrompt}\n\nUser message: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048, // Increased for more detailed responses
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response.';

    // Enhanced action analysis for calendar-synced features
    let action = null;
    let suggestions = [];

    if (aiResponse.toLowerCase().includes('break') || aiResponse.toLowerCase().includes('rest') || aiResponse.toLowerCase().includes('stress')) {
      action = 'schedule_break';
      suggestions.push('Schedule 15-min wellness break', 'Take a mindful walk', 'Practice breathing exercises', 'Stretch break');
    } else if (aiResponse.toLowerCase().includes('focus') || aiResponse.toLowerCase().includes('concentrate') || aiResponse.toLowerCase().includes('deep work')) {
      action = 'focus_session';
      suggestions.push('Start 25-min focus session', 'Create distraction-free zone', 'Use Pomodoro technique', 'Block calendar for deep work');
    } else if (context === 'calendar_analysis' || aiResponse.toLowerCase().includes('schedule') || aiResponse.toLowerCase().includes('optimize')) {
      suggestions = ['Optimize next week schedule', 'Analyze time patterns', 'Generate ideal schedule', 'Schedule wellness time'];
    } else {
      suggestions = ['Analyze my calendar patterns', 'How can I reduce stress?', 'Optimize my schedule', 'Generate ideal routine'];
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      action,
      suggestions: suggestions.slice(0, 4) // Increased to 4 suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'I apologize, but I encountered an error. Please make sure the AI service is properly configured.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
