
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Clock, Zap, Heart, User, Loader2, CheckCircle, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEvents } from '@/hooks/useEvents';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  createdEvent?: any;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  lifeBalanceData?: {
    workLifeBalance: number;
    stressLevel: number;
    focusTime: number;
    wellnessScore: number;
  };
  onScheduleBreak?: () => void;
  onStartFocusSession?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  lifeBalanceData,
  onScheduleBreak,
  onStartFocusSession,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `I'm your AI calendar assistant with full control and memory! I remember our conversations and act immediately on your requests.

Just tell me what you need:
• "Team meeting tomorrow" → I'll schedule it instantly
• "Block focus time" → 2-hour block created
• "Gym session" → Evening workout scheduled
• "I need a break" → Wellness time added

I make smart assumptions and remember your preferences!`,
      timestamp: new Date(),
      suggestions: [
        'Schedule a meeting',
        'Block focus time', 
        'Plan my day',
        'Add workout time'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationMemory, setConversationMemory] = useState<any>(null);
  const { toast } = useToast();
  const { refetch } = useEvents();

  const quickActions = [
    { icon: Clock, label: 'Quick Meeting', action: () => handleSendMessage('Schedule a 1-hour meeting tomorrow') },
    { icon: Zap, label: 'Focus Block', action: () => handleSendMessage('Block 2 hours for deep work') },
    { icon: Heart, label: 'Wellness Break', action: () => handleSendMessage('I need a wellness break') },
  ];

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: messageToSend,
          lifeBalanceData,
          context: 'direct_calendar_control',
          userId: user?.id,
          conversationHistory: messages.concat(userMessage) // Send conversation history
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        createdEvent: data.createdEvent
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update conversation memory
      if (data.conversationMemory) {
        setConversationMemory(data.conversationMemory);
      }

      // Show success toast if event was created
      if (data.createdEvent) {
        toast({
          title: "Event Created!",
          description: `"${data.createdEvent.title}" added to your calendar.`,
        });
        
        // Refresh events
        refetch();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Memory cleared! Ready to help with your calendar. What would you like to schedule?`,
      timestamp: new Date(),
      suggestions: ['Schedule meeting', 'Block focus time', 'Plan my day', 'Add break time']
    }]);
    setConversationMemory(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-600" />
              <span>AI Calendar Assistant</span>
              <Badge variant="outline" className="text-purple-600 flex items-center space-x-1">
                <Brain className="h-3 w-3" />
                <span>Memory</span>
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={clearChat}>
              Clear Memory
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.action}
              className="flex items-center space-x-1 text-xs hover:bg-purple-50"
            >
              <action.icon className="h-3 w-3" />
              <span>{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Memory Insight */}
        {conversationMemory && (conversationMemory.recentTopics.length > 0 || conversationMemory.userPreferences.length > 0) && (
          <Card className="p-3 mb-4 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-purple-500">
            <div className="flex items-center text-xs text-purple-700">
              <Brain className="h-3 w-3 mr-1" />
              <span>
                {conversationMemory.recentTopics.length > 0 && 
                  `Topics: ${[...new Set(conversationMemory.recentTopics)].join(', ')}`}
                {conversationMemory.recentTopics.length > 0 && conversationMemory.userPreferences.length > 0 && ' • '}
                {conversationMemory.userPreferences.length > 0 && 
                  `Preferences: ${[...new Set(conversationMemory.userPreferences)].join(', ')}`}
              </span>
            </div>
          </Card>
        )}

        {/* Wellness Insight */}
        {lifeBalanceData && (
          <Card className="p-3 mb-4 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between text-sm">
              <span>📊 Wellness: {lifeBalanceData.wellnessScore}%</span>
              <span>😌 Stress: {lifeBalanceData.stressLevel}%</span>
              <span>🎯 Focus: {lifeBalanceData.focusTime}%</span>
            </div>
          </Card>
        )}

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' ? 'bg-blue-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-lg shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Show created event */}
                      {message.createdEvent && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center space-x-1 text-green-700">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Event Created</span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            {message.createdEvent.title} - {new Date(message.createdEvent.start_time).toLocaleString()}
                          </p>
                        </div>
                      )}
                      
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mr-2 mb-1 text-xs hover:bg-purple-50"
                          onClick={() => handleSendMessage(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t pt-4 space-y-3">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Just tell me what to schedule - I'll handle the rest!"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSendMessage()} 
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
