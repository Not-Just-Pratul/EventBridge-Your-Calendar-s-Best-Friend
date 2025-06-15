
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

    // Enhanced context for a more conversational AI assistant
    let contextPrompt = `You are an advanced AI assistant for EventBridge, a sophisticated calendar and wellness application. You are friendly, helpful, and can assist with both calendar-related tasks and general questions. You have access to the user's real-time wellness and calendar metrics.

Your capabilities include:
1. Calendar and scheduling assistance
2. Wellness and productivity coaching
3. General conversation and answering any questions
4. Life balance optimization
5. Stress management advice
6. Focus and productivity tips

You should be conversational, empathetic, and provide practical advice. You can answer questions about any topic, not just calendar or wellness related.`;

    if (lifeBalanceData) {
      const data = lifeBalanceData as LifeBalanceData;
      contextPrompt += `\n\n📊 Current User Metrics:
• Work-Life Balance: ${data.workLifeBalance}%
• Stress Level: ${data.stressLevel}%
• Focus Time: ${data.focusTime}%
• Overall Wellness Score: ${data.wellnessScore}%`;

      if (data.workHours !== undefined) {
        contextPrompt += `\n\n📅 Weekly Time Analysis:
• Work: ${data.workHours}h
• Personal: ${data.personalHours}h
• Health/Wellness: ${data.healthHours}h
• Social: ${data.socialHours}h
• Free Time: ${data.freeTime}h
• Avg Event Duration: ${data.averageEventDuration}h
• Upcoming Deadlines: ${data.upcomingDeadlines}`;
      }

      // Context-specific guidance
      if (context === 'calendar_analysis') {
        contextPrompt += `\n\n🎯 TASK: Provide detailed calendar pattern analysis and specific scheduling recommendations.`;
      } else if (context === 'schedule_optimization') {
        contextPrompt += `\n\n🎯 TASK: Focus on concrete scheduling optimization with specific time blocks.`;
      } else if (context === 'ideal_schedule_generation') {
        contextPrompt += `\n\n🎯 TASK: Generate a comprehensive daily schedule template with specific times for optimal wellness.`;
      }

      // Smart recommendations based on current metrics
      if (data.stressLevel > 70) {
        contextPrompt += `\n\n⚠️ PRIORITY: High stress detected (${data.stressLevel}%). Recommend immediate stress relief strategies.`;
      }
      if (data.focusTime < 50) {
        contextPrompt += `\n\n💡 SUGGESTION: Low focus time (${data.focusTime}%). Suggest productivity enhancement techniques.`;
      }
      if (data.wellnessScore > 80) {
        contextPrompt += `\n\n✅ POSITIVE: Excellent wellness score (${data.wellnessScore}%). Acknowledge and encourage continuation.`;
      }
      if (data.freeTime && data.freeTime < 10) {
        contextPrompt += `\n\n⏰ CONCERN: Limited free time (${data.freeTime}h). Recommend work-life balance improvements.`;
      }
    }

    contextPrompt += `\n\n🛠️ Available Actions:
You can suggest these actions when appropriate:
• "schedule_break" - for immediate stress relief or wellness breaks
• "focus_session" - for deep work or concentration periods
• "schedule_optimization" - for improving time management
• "calendar_analysis" - for reviewing patterns and habits

Guidelines:
• Be conversational and friendly
• Provide specific, actionable advice
• Include exact times when suggesting schedule changes
• Answer any questions the user has, not just calendar-related
• Be empathetic and supportive
• Use emojis sparingly but effectively
• Keep responses helpful but concise

Remember: You can discuss any topic the user brings up, while also being their wellness and productivity coach.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${contextPrompt}\n\nUser: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
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

    // Enhanced action detection and suggestions
    let action = null;
    let suggestions = [];

    const responseLower = aiResponse.toLowerCase();
    
    if (responseLower.includes('break') || responseLower.includes('rest') || responseLower.includes('stress') || responseLower.includes('relax')) {
      action = 'schedule_break';
      suggestions = ['Schedule 15-min break', 'Take a wellness walk', 'Practice mindfulness', 'Stretch and breathe'];
    } else if (responseLower.includes('focus') || responseLower.includes('concentrate') || responseLower.includes('deep work') || responseLower.includes('productivity')) {
      action = 'focus_session';
      suggestions = ['Start 25-min focus session', 'Enable do-not-disturb', 'Block calendar for deep work', 'Use Pomodoro technique'];
    } else if (responseLower.includes('schedule') || responseLower.includes('optimize') || responseLower.includes('plan') || responseLower.includes('calendar')) {
      suggestions = ['Optimize my schedule', 'Analyze calendar patterns', 'Create ideal routine', 'Review time allocation'];
    } else {
      // General conversation suggestions
      suggestions = ['How can I improve productivity?', 'Help me reduce stress', 'Analyze my wellness data', 'What should I focus on today?'];
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      action,
      suggestions: suggestions.slice(0, 4)
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
