
export const callAIAssistant = async (message: string, action: string, userContext?: any) => {
  try {
    const response = await fetch(`https://vndzexrgryqmbbrqjjov.supabase.co/functions/v1/ai-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZHpleHJncnlxbWJicnFqam92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MzA4MjksImV4cCI6MjA2NTQwNjgyOX0.vHKSdhaskDFJO5ajbBG5vKvA3DX0t3YiToYHN6RExAs`,
      },
      body: JSON.stringify({
        message,
        action,
        userContext,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', errorText);
      throw new Error(`Failed to call AI assistant: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('AI Assistant Response:', data);
    return data;
  } catch (error) {
    console.error('AI Assistant Error:', error);
    throw error;
  }
};
