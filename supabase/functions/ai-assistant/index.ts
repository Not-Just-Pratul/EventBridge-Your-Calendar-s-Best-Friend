
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

    // Build context for the AI based on life balance data
    let contextPrompt = `You are a wellness and productivity AI assistant integrated with a calendar app. You help users optimize their work-life balance, schedule breaks, and manage focus sessions.`;

    if (lifeBalanceData) {
      const data = lifeBalanceData as LifeBalanceData;
      contextPrompt += `\n\nCurrent user metrics:
- Work-Life Balance: ${data.workLifeBalance}%
- Stress Level: ${data.stressLevel}%
- Focus Time: ${data.focusTime}%
- Wellness Score: ${data.wellnessScore}%

Based on these metrics, provide personalized advice. If stress is high (>70%), strongly recommend breaks. If focus time is low (<50%), suggest focus sessions. If wellness score is high (>80%), congratulate them.`;
    }

    contextPrompt += `\n\nYou can suggest actions like:
- "schedule_break" - when user needs a break
- "focus_session" - when user needs to focus
- General wellness advice
- Productivity tips

Keep responses concise, helpful, and encouraging. Always consider the user's current metrics when giving advice.`;

    // Use the correct Gemini API endpoint
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
          maxOutputTokens: 1024,
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

    // Analyze response for action suggestions
    let action = null;
    let suggestions = [];

    if (aiResponse.toLowerCase().includes('break') || aiResponse.toLowerCase().includes('rest')) {
      action = 'schedule_break';
      suggestions.push('Schedule a 15-minute break', 'Take a walk', 'Do breathing exercises');
    } else if (aiResponse.toLowerCase().includes('focus') || aiResponse.toLowerCase().includes('concentrate')) {
      action = 'focus_session';
      suggestions.push('Start 25-minute focus session', 'Set up distraction-free zone', 'Use Pomodoro technique');
    } else {
      suggestions = ['Tell me more about my wellness', 'How can I be more productive?', 'Suggest a daily routine'];
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      action,
      suggestions: suggestions.slice(0, 3) // Limit to 3 suggestions
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
