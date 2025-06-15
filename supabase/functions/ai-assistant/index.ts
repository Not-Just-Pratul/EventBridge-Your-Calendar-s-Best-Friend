
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
    let contextPrompt = `You are an advanced AI assistant for EventBridge, a sophisticated calendar and wellness application. You are extremely friendly, helpful, and knowledgeable about virtually any topic. You can assist with:

🗓️ CALENDAR & PRODUCTIVITY:
• Calendar management and scheduling
• Time management and productivity tips
• Work-life balance optimization
• Stress reduction techniques
• Goal setting and achievement

🧠 GENERAL KNOWLEDGE:
• Answer questions on any topic (science, history, technology, etc.)
• Explain complex concepts in simple terms
• Provide educational content
• Help with problem-solving
• Creative writing and brainstorming

💬 CONVERSATION:
• Casual conversations and small talk
• Motivational quotes and inspiration
• Jokes and entertainment
• Personal advice and guidance
• Learning new skills

🔧 PRACTICAL HELP:
• Step-by-step instructions
• Recommendations and suggestions
• Analysis and insights
• Planning and organization

You should be conversational, empathetic, knowledgeable, and engaging. Always provide helpful, accurate information regardless of the topic. If you don't know something, be honest about it but offer to help in other ways.`;

    if (lifeBalanceData) {
      const data = lifeBalanceData as LifeBalanceData;
      contextPrompt += `\n\n📊 Current User Wellness Metrics:
• Work-Life Balance: ${data.workLifeBalance}%
• Stress Level: ${data.stressLevel}%
• Focus Time: ${data.focusTime}%
• Overall Wellness Score: ${data.wellnessScore}%`;

      if (data.workHours !== undefined) {
        contextPrompt += `\n\n📅 Weekly Schedule Overview:
• Work: ${data.workHours}h
• Personal: ${data.personalHours}h
• Health/Wellness: ${data.healthHours}h
• Social: ${data.socialHours}h
• Free Time: ${data.freeTime}h
• Avg Event Duration: ${data.averageEventDuration}h
• Upcoming Deadlines: ${data.upcomingDeadlines}`;
      }

      // Provide gentle wellness insights when relevant
      if (data.stressLevel > 70) {
        contextPrompt += `\n\n💡 Note: User has elevated stress levels (${data.stressLevel}%). Consider gentle wellness suggestions when appropriate.`;
      }
      if (data.wellnessScore > 80) {
        contextPrompt += `\n\n✅ Positive: User has excellent wellness score (${data.wellnessScore}%). Acknowledge their good habits when relevant.`;
      }
    }

    contextPrompt += `\n\n🎯 Response Guidelines:
• Be conversational and friendly
• Answer ANY question the user asks, not just calendar-related
• Provide specific, actionable advice when relevant
• Use emojis sparingly but effectively
• Keep responses helpful and engaging
• If discussing calendar/productivity, include exact times or specific suggestions
• Be honest if you don't know something
• Encourage curiosity and learning

Remember: You're a knowledgeable assistant who can discuss anything - from quantum physics to cooking recipes, from productivity tips to philosophical questions. Be helpful, accurate, and engaging!`;

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
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response. Please try asking your question differently.';

    // Generate contextual suggestions based on response content
    let suggestions = [];
    const responseLower = aiResponse.toLowerCase();
    const messageLower = message.toLowerCase();
    
    // Context-aware suggestions
    if (messageLower.includes('calendar') || messageLower.includes('schedule')) {
      suggestions = ['Optimize my daily schedule', 'Help me plan tomorrow', 'Time management tips', 'How to reduce scheduling conflicts'];
    } else if (messageLower.includes('stress') || messageLower.includes('wellness')) {
      suggestions = ['Quick stress relief techniques', 'Plan a wellness break', 'Work-life balance tips', 'Meditation recommendations'];
    } else if (messageLower.includes('productivity') || messageLower.includes('focus')) {
      suggestions = ['Deep work strategies', 'Eliminate distractions', 'Energy management tips', 'Goal setting techniques'];
    } else if (messageLower.includes('learn') || messageLower.includes('explain')) {
      suggestions = ['Teach me something new', 'Explain a complex topic simply', 'Recommend learning resources', 'Study techniques'];
    } else if (messageLower.includes('motivation') || messageLower.includes('inspire')) {
      suggestions = ['Give me a motivational quote', 'Success strategies', 'Overcoming challenges', 'Building good habits'];
    } else {
      // General conversation suggestions
      suggestions = [
        'Help me plan my day',
        'Tell me something interesting',
        'Give me productivity tips',
        'Explain a science concept',
        'Motivate me',
        'Solve a problem for me'
      ];
    }

    // Shuffle and limit suggestions
    suggestions = suggestions.sort(() => Math.random() - 0.5).slice(0, 4);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'I apologize, but I encountered an error. Please make sure the AI service is properly configured and try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
