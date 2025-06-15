
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, lifeBalanceData, context, userId } = await req.json();

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Initialize Supabase client for event creation
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get current date and time information
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Format current date for AI context
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

    // Enhanced context for AI with calendar control capabilities and correct date handling
    let contextPrompt = `You are an advanced AI assistant for EventBridge with FULL CALENDAR CONTROL. You can:

🗓️ CALENDAR MANAGEMENT:
• Create, modify, and delete events directly
• Schedule meetings and appointments
• Set reminders and recurring events
• Optimize schedules and resolve conflicts
• Analyze calendar patterns

⏰ CURRENT DATE & TIME INFORMATION:
• Today is: ${currentDateReadable}
• Current time: ${currentTimeReadable}
• Current year: ${currentYear}
• ISO format: ${currentDateString}

📝 EVENT CREATION RULES:
When users mention scheduling, planning, or time-related requests, you can create events directly by responding with a special JSON format.

CRITICAL DATE REQUIREMENTS:
• ALWAYS use ${currentYear} as the year (NOT 2024 or any other year)
• When user says "today", use: ${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}
• When user says "tomorrow", add 1 day to today's date
• When user says "next week", add 7 days to today's date
• ALL dates MUST be in ISO format: YYYY-MM-DDTHH:MM:SS.000Z
• Default to 1-hour duration if not specified
• Use reasonable times (9 AM - 6 PM for work, evenings for personal)

EVENT_CREATE FORMAT:
{
  "title": "Event Title",
  "description": "Event description",
  "start_time": "${currentYear}-MM-DDTHH:MM:SS.000Z",
  "end_time": "${currentYear}-MM-DDTHH:MM:SS.000Z",
  "location": "Optional location",
  "color": "blue|purple|green|orange|red|pink"
}

EXAMPLES OF CORRECT DATE HANDLING:
• "Schedule a meeting today at 2pm" → start_time: "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}T14:00:00.000Z"
• "Book dentist appointment tomorrow at 10am" → start_time: "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${(currentDay + 1).toString().padStart(2, '0')}T10:00:00.000Z"
• "Meeting next Monday" → Calculate next Monday from today and use ${currentYear}

🧠 GENERAL CAPABILITIES:
• Answer questions on any topic
• Provide explanations and tutorials
• Help with productivity and wellness
• Creative writing and brainstorming
• Problem-solving and analysis

💬 INTERACTION STYLE:
• Be conversational and proactive about calendar management
• Suggest optimal times for events
• Offer to create events when users mention activities
• Use natural language to confirm event details
• ALWAYS confirm the date you're using when creating events`;

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
    }

    contextPrompt += `\n\n🎯 CALENDAR CONTROL EXAMPLES:
• "Schedule a meeting tomorrow at 2pm" → Create event for ${new Date(now.getTime() + 24*60*60*1000).toDateString()} at 2pm
• "I need to go to the gym" → Suggest time and create event for ${currentYear}
• "Block time for focused work" → Create focus block for today or specified date in ${currentYear}
• "Plan my day" → Analyze schedule and create optimized events for ${currentYear}

REMEMBER: 
- Current year is ${currentYear}
- Today is ${currentDateReadable}
- NEVER use 2024 or any year other than ${currentYear}
- Always confirm dates when creating events
- Be proactive in creating events when users mention activities!`;

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
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response. Please try asking your question differently.';

    // Check if AI wants to create an event
    const eventCreateMatch = aiResponse.match(/EVENT_CREATE:\s*({[^}]+})/);
    let createdEvent = null;

    if (eventCreateMatch && userId) {
      try {
        const eventData = JSON.parse(eventCreateMatch[1]);
        
        // Validate dates are in current year
        const startDate = new Date(eventData.start_time);
        const endDate = new Date(eventData.end_time);
        
        if (startDate.getFullYear() !== currentYear) {
          console.warn(`Event start_time year corrected from ${startDate.getFullYear()} to ${currentYear}`);
          startDate.setFullYear(currentYear);
          eventData.start_time = startDate.toISOString();
        }
        
        if (endDate.getFullYear() !== currentYear) {
          console.warn(`Event end_time year corrected from ${endDate.getFullYear()} to ${currentYear}`);
          endDate.setFullYear(currentYear);
          eventData.end_time = endDate.toISOString();
        }
        
        // Create the event in Supabase
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
          // Remove the EVENT_CREATE instruction from the response
          aiResponse = aiResponse.replace(/EVENT_CREATE:\s*{[^}]+}/, '').trim();
          
          // Add confirmation to the response with correct date
          const eventDate = new Date(newEvent.start_time).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          const eventTime = new Date(newEvent.start_time).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          });
          
          if (!aiResponse.includes('created') && !aiResponse.includes('scheduled')) {
            aiResponse += `\n\n✅ Perfect! I've created the event "${eventData.title}" for ${eventDate} at ${eventTime}.`;
          }
        }
      } catch (error) {
        console.error('Error parsing or creating event:', error);
      }
    }

    // Generate contextual suggestions
    let suggestions = [];
    const responseLower = aiResponse.toLowerCase();
    const messageLower = message.toLowerCase();
    
    // Calendar-focused suggestions
    if (messageLower.includes('schedule') || messageLower.includes('calendar') || messageLower.includes('meeting')) {
      suggestions = [
        'Schedule a focus session',
        'Plan my week optimally',
        'Create a recurring meeting',
        'Block time for deep work',
        'Schedule a wellness break',
        'Optimize my schedule'
      ];
    } else if (messageLower.includes('today') || messageLower.includes('tomorrow')) {
      suggestions = [
        'What should I focus on today?',
        'Schedule my most important task',
        'Plan a productive morning',
        'Block time for priorities',
        'Create a balanced schedule',
        'Add a wellness activity'
      ];
    } else if (createdEvent) {
      suggestions = [
        'Create another event',
        'Schedule a follow-up meeting',
        'Plan preparation time',
        'Add a buffer after this event',
        'Set a reminder for this',
        'Optimize my day around this'
      ];
    } else {
      suggestions = [
        'Schedule something for me',
        'Plan my ideal day',
        'Create a focus block',
        'Add a wellness activity',
        'Schedule a meeting',
        'Optimize my calendar'
      ];
    }

    // Shuffle and limit suggestions
    suggestions = suggestions.sort(() => Math.random() - 0.5).slice(0, 4);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions: suggestions,
      createdEvent: createdEvent,
      action: createdEvent ? 'event_created' : null
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
