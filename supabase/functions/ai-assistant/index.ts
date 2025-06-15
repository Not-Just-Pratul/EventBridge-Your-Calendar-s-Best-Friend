
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, action, userContext } = await req.json();

    if (action === 'create_event') {
      // Use Gemini for natural language event creation
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Extract event details from this message and return as JSON: "${message}". 
              Return format: {"title": "string", "description": "string", "start_time": "ISO date", "end_time": "ISO date", "location": "string", "color": "blue|purple|green|orange|red|pink"}. 
              If no specific time is mentioned, suggest a reasonable time based on the event type. Current time: ${new Date().toISOString()}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        }),
      });

      const data = await response.json();
      let eventData = data.candidates[0].content.parts[0].text;
      
      // Clean up the response to extract JSON
      eventData = eventData.replace(/```json\n?|\n?```/g, '').trim();
      
      return new Response(JSON.stringify({ eventData: JSON.parse(eventData) }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'smart_suggestions') {
      // Use OpenAI for smart scheduling suggestions
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a scheduling assistant. Analyze the user\'s calendar patterns and suggest optimal time slots for new events. Return suggestions as JSON array with time slots and reasons.' 
            },
            { 
              role: 'user', 
              content: `User context: ${JSON.stringify(userContext)}. Message: ${message}` 
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      const data = await response.json();
      const suggestions = data.choices[0].message.content;
      
      return new Response(JSON.stringify({ suggestions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Default AI chat response using Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are EventBridge AI, a helpful calendar assistant. Respond to: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1000,
        }
      }),
    });

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
