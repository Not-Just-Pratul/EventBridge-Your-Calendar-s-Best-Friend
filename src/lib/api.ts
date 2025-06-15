
export const callAIAssistant = async (message: string, action: string, userContext?: any) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      message,
      action,
      userContext,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to call AI assistant');
  }

  return response.json();
};
