
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

interface ConversationMemory {
  userPreferences: string[];
  recentTopics: string[];
  createdEvents: any[];
  lastInteraction: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, lifeBalanceData, context, userId, conversationHistory } = await req.json();

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get current date and time information
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const currentDateString = now.toISOString();
    const currentDateReadable = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const currentTimeReadable = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });

    // Build conversation memory from history
    let conversationMemory: ConversationMemory = {
      userPreferences: [],
      recentTopics: [],
      createdEvents: [],
      lastInteraction: ''
    };

    if (conversationHistory && conversationHistory.length > 0) {
      // Extract key information from conversation history
      const recentMessages = conversationHistory.slice(-10); // Last 10 messages
      
      // Analyze user patterns and preferences
      const userMessages = recentMessages.filter((msg: any) => msg.role === 'user');
      const assistantMessages = recentMessages.filter((msg: any) => msg.role === 'assistant');
      
      // Extract topics and preferences
      userMessages.forEach((msg: any) => {
        const content = msg.content.toLowerCase();
        if (content.includes('meeting')) conversationMemory.recentTopics.push('meetings');
        if (content.includes('focus') || content.includes('deep work')) conversationMemory.recentTopics.push('focus_work');
        if (content.includes('wellness') || content.includes('break')) conversationMemory.recentTopics.push('wellness');
        if (content.includes('gym') || content.includes('exercise')) conversationMemory.recentTopics.push('fitness');
        if (content.includes('morning')) conversationMemory.userPreferences.push('morning_person');
        if (content.includes('afternoon') || content.includes('evening')) conversationMemory.userPreferences.push('afternoon_person');
      });

      // Track created events
      assistantMessages.forEach((msg: any) => {
        if (msg.createdEvent) {
          conversationMemory.createdEvents.push(msg.createdEvent);
        }
      });

      if (userMessages.length > 0) {
        conversationMemory.lastInteraction = userMessages[userMessages.length - 1].content;
      }
    }

    // Enhanced context with memory and direct action focus
    let contextPrompt = `You are an advanced AI calendar assistant with FULL CALENDAR CONTROL and CONVERSATION MEMORY. You are direct, proactive, and remember user preferences.

🧠 CONVERSATION MEMORY:
${conversationMemory.recentTopics.length > 0 ? `• Recent topics: ${[...new Set(conversationMemory.recentTopics)].join(', ')}` : ''}
${conversationMemory.userPreferences.length > 0 ? `• User preferences: ${[...new Set(conversationMemory.userPreferences)].join(', ')}` : ''}
${conversationMemory.createdEvents.length > 0 ? `• Recent events created: ${conversationMemory.createdEvents.map(e => e.title).join(', ')}` : ''}
${conversationMemory.lastInteraction ? `• Last interaction: "${conversationMemory.lastInteraction}"` : ''}

⚡ DIRECT ACTION PERSONALITY:
• Be proactive - suggest and create events immediately
• Don't ask unnecessary questions - make reasonable assumptions
• Use conversation memory to understand user patterns
• Default to smart scheduling based on context
• Confirm actions with brief, clear statements

🗓️ CALENDAR CONTROL CAPABILITIES:
• Create events instantly from natural language
• Schedule optimal times based on user patterns
• Resolve conflicts automatically
• Set appropriate durations and locations
• Use smart defaults for recurring patterns

⏰ CURRENT DATE & TIME:
• Today: ${currentDateReadable} at ${currentTimeReadable}
• Current year: ${currentYear} (ALWAYS use this year)
• ISO format: ${currentDateString}

📝 EVENT CREATION - DIRECT FORMAT:
When users mention scheduling, immediately create events using:
EVENT_CREATE:{
  "title": "Event Title",
  "description": "Brief description",
  "start_time": "${currentYear}-MM-DDTHH:MM:SS.000Z",
  "end_time": "${currentYear}-MM-DDTHH:MM:SS.000Z",
  "location": "Location if mentioned",
  "color": "blue|purple|green|orange|red|pink"
}

⚡ SMART DEFAULTS:
• Work meetings: 1 hour, 9 AM - 6 PM weekdays
• Focus work: 2 hours, morning or afternoon
• Wellness/breaks: 30 minutes, between work blocks
• Personal activities: 1 hour, evenings or weekends
• Gym/exercise: 1 hour, morning or evening

🎯 BEHAVIOR RULES:
• Act immediately on scheduling requests
• Use memory to make better suggestions
• Don't repeat questions already answered
• Assume reasonable defaults
• Be conversational but efficient
• Always confirm what you created`;

    if (lifeBalanceData) {
      const data = lifeBalanceData as LifeBalanceData;
      contextPrompt += `\n\n📊 CURRENT WELLNESS CONTEXT:
• Work-Life Balance: ${data.workLifeBalance}% • Stress: ${data.stressLevel}%
• Focus Time: ${data.focusTime}% • Wellness Score: ${data.wellnessScore}%`;

      if (data.workHours !== undefined) {
        contextPrompt += `\n• Weekly: Work ${data.workHours}h | Personal ${data.personalHours}h | Health ${data.healthHours}h`;
      }
    }

    contextPrompt += `\n\n💡 EXAMPLES OF DIRECT ACTION:
User: "I need to meet with the team tomorrow"
You: "Creating team meeting for tomorrow 2-3 PM" + EVENT_CREATE

User: "Block some focus time" 
You: "Blocking 2 hours of focus time for this afternoon" + EVENT_CREATE

User: "Gym session"
You: "Scheduling 1-hour gym session for this evening" + EVENT_CREATE

REMEMBER: 
- Current year is ${currentYear} - NEVER use any other year
- Be direct and proactive - don't ask what you can assume
- Use conversation memory to make smart decisions
- Create events immediately when requested`;

    // Build conversation context from history for API
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6); // Last 6 messages for context
      conversationContext = '\n\nRECENT CONVERSATION:\n' + 
        recentHistory.map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${contextPrompt}${conversationContext}\n\nUSER: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
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
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response. Please try asking your question differently.';

    // Check if AI wants to create an event
    const eventCreateMatch = aiResponse.match(/EVENT_CREATE:\s*({[^}]+})/);
    let createdEvent = null;

    if (eventCreateMatch && userId) {
      try {
        const eventData = JSON.parse(eventCreateMatch[1]);
        
        // Validate and correct dates
        const startDate = new Date(eventData.start_time);
        const endDate = new Date(eventData.end_time);
        
        if (startDate.getFullYear() !== currentYear) {
          startDate.setFullYear(currentYear);
          eventData.start_time = startDate.toISOString();
        }
        
        if (endDate.getFullYear() !== currentYear) {
          endDate.setFullYear(currentYear);
          eventData.end_time = endDate.toISOString();
        }
        
        // Create the event
        const { data: newEvent, error } = await supabase
          .from('events')
          .insert([{
            title: eventData.title,
            description: eventData.description || '',
            start_time: eventData.start_time,
            end_time: eventData.end_time,
            location: eventData.location || '',
            color: eventData.color || 'blue',
            user_id: userId
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating event:', error);
        } else {
          createdEvent = newEvent;
          // Clean up the response
          aiResponse = aiResponse.replace(/EVENT_CREATE:\s*{[^}]+}/, '').trim();
          
          // Add brief confirmation if not already mentioned
          if (!aiResponse.toLowerCase().includes('created') && !aiResponse.toLowerCase().includes('scheduled')) {
            const eventDate = new Date(newEvent.start_time).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });
            const eventTime = new Date(newEvent.start_time).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            });
            
            aiResponse += `\n\n✅ Created "${eventData.title}" for ${eventDate} at ${eventTime}`;
          }
        }
      } catch (error) {
        console.error('Error parsing or creating event:', error);
      }
    }

    // Generate contextual suggestions based on conversation memory and patterns
    let suggestions = [];
    const messageLower = message.toLowerCase();
    const recentTopics = conversationMemory.recentTopics;
    
    if (recentTopics.includes('meetings')) {
      suggestions = ['Schedule follow-up meeting', 'Block prep time', 'Add buffer time', 'Create recurring meeting'];
    } else if (recentTopics.includes('focus_work')) {
      suggestions = ['Schedule deep work block', 'Plan focused morning', 'Block distraction-free time', 'Create study session'];
    } else if (recentTopics.includes('wellness')) {
      suggestions = ['Schedule wellness break', 'Plan exercise time', 'Add meditation session', 'Block lunch break'];
    } else if (messageLower.includes('today') || messageLower.includes('tomorrow')) {
      suggestions = ['Plan my day', 'Schedule priorities', 'Block focus time', 'Add break time'];
    } else if (createdEvent) {
      suggestions = ['Schedule another event', 'Add preparation time', 'Plan follow-up', 'Create reminder'];
    } else {
      suggestions = ['Schedule meeting', 'Block focus time', 'Plan workout', 'Add break time'];
    }

    // Limit and randomize suggestions
    suggestions = suggestions.slice(0, 3);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: suggestions,
      createdEvent: createdEvent,
      action: createdEvent ? 'event_created' : null,
      conversationMemory: conversationMemory
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'I encountered an error. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
