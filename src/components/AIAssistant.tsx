
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Clock, Zap, Heart, User, Loader2, Calendar, Target, BookOpen, Coffee, Lightbulb, CheckCircle, Plus, CalendarPlus } from 'lucide-react';
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
      content: `Hello! I'm your AI calendar assistant with full calendar control. I can create, modify, and manage your events directly through our conversation. Just tell me what you need to schedule and I'll take care of it! 

Try saying things like:
• "Schedule a team meeting tomorrow at 2pm"
• "Block 2 hours for focused work"
• "I need to go to the gym"
• "Plan my day optimally"`,
      timestamp: new Date(),
      suggestions: [
        'Schedule a meeting for me',
        'Create a focus block',
        'Plan my ideal day',
        'Add a wellness activity',
        'Schedule time for priorities',
        'Optimize my calendar'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { refetch } = useEvents();

  const quickCalendarActions = [
    { icon: CalendarPlus, label: 'Quick Event', action: () => handleSendMessage('Schedule something important for me today') },
    { icon: Clock, label: 'Focus Block', action: () => handleSendMessage('Create a 2-hour focus block for deep work') },
    { icon: Zap, label: 'Meeting', action: () => handleSendMessage('Schedule a team meeting tomorrow') },
    { icon: Target, label: 'Plan Day', action: () => handleSendMessage('Plan my day optimally based on my priorities') },
    { icon: Heart, label: 'Wellness', action: () => handleSendMessage('Schedule a wellness break for me') },
    { icon: Coffee, label: 'Break Time', action: () => handleSendMessage('I need to schedule some break time') },
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
          context: 'calendar_control',
          userId: user?.id
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

      // Show success toast if event was created
      if (data.createdEvent) {
        toast({
          title: "Event Created Successfully!",
          description: `"${data.createdEvent.title}" has been added to your calendar.`,
        });
        
        // Refresh events to show the new event
        refetch();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your request.',
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
      content: `Chat cleared! I'm ready to help you manage your calendar. What would you like to schedule?`,
      timestamp: new Date(),
      suggestions: [
        'Schedule my priorities',
        'Create a focus session',
        'Plan tomorrow',
        'Add a meeting'
      ]
    }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>AI Calendar Assistant</span>
              <Badge variant="outline" className="text-green-600">Full Control</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={clearChat}>
              Clear Chat
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Quick Calendar Actions */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickCalendarActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.action}
              className="flex items-center space-x-1 text-xs hover:bg-blue-50"
            >
              <action.icon className="h-3 w-3" />
              <span>{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Wellness Insight */}
        {lifeBalanceData && (
          <Card className="p-3 mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
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
                      
                      {/* Show created event info */}
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
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500 mb-1">💡 Try asking:</p>
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mr-2 mb-1 text-xs hover:bg-blue-50"
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
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      <span className="text-sm">Creating your event...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t pt-4 space-y-3">
          {/* Calendar Control Examples */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendMessage('Schedule a 1-hour meeting tomorrow')}
              className="text-xs"
            >
              📅 Quick Meeting
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendMessage('Block 2 hours for deep work today')}
              className="text-xs"
            >
              🎯 Focus Block
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendMessage('Plan my optimal schedule for tomorrow')}
              className="text-xs"
            >
              ⚡ Plan Day
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendMessage('I need a wellness break')}
              className="text-xs"
            >
              💚 Wellness
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tell me what to schedule... I'll create events directly for you!"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSendMessage()} 
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
