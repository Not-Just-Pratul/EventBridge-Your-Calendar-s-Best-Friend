
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Clock, Zap, Heart, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
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
      content: `Hello! I'm your AI wellness assistant powered by Google Gemini. I can help you optimize your work-life balance, schedule breaks, and start focus sessions. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: ['Schedule a break', 'Start focus session', 'Analyze my wellness', 'Give productivity tips']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      // Call our AI assistant edge function
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          lifeBalanceData,
          context: 'life_balance'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle action suggestions
      if (data.action === 'schedule_break' && onScheduleBreak) {
        onScheduleBreak();
      } else if (data.action === 'focus_session' && onStartFocusSession) {
        onStartFocusSession();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please make sure the AI service is properly configured.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getWellnessInsight = () => {
    if (!lifeBalanceData) return null;

    const { workLifeBalance, stressLevel, focusTime, wellnessScore } = lifeBalanceData;
    
    if (stressLevel > 70) {
      return { type: 'warning', message: 'High stress detected! Consider taking a break.' };
    } else if (focusTime < 50) {
      return { type: 'info', message: 'Low focus time. Try a focus session!' };
    } else if (wellnessScore > 80) {
      return { type: 'success', message: 'Great wellness score! Keep it up!' };
    }
    
    return null;
  };

  const insight = getWellnessInsight();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>AI Wellness Assistant</span>
            <Badge variant="outline" className="text-green-600">Powered by Gemini</Badge>
          </DialogTitle>
        </DialogHeader>

        {insight && (
          <Card className={`p-3 mb-4 border-l-4 ${
            insight.type === 'warning' ? 'border-l-red-500 bg-red-50' :
            insight.type === 'success' ? 'border-l-green-500 bg-green-50' :
            'border-l-blue-500 bg-blue-50'
          }`}>
            <p className="text-sm font-medium">{insight.message}</p>
          </Card>
        )}

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mr-2 mb-1 text-xs"
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
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t pt-4">
          <div className="flex space-x-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onScheduleBreak?.()}
              className="flex items-center space-x-1"
            >
              <Clock className="h-3 w-3" />
              <span>Schedule Break</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStartFocusSession?.()}
              className="flex items-center space-x-1"
            >
              <Zap className="h-3 w-3" />
              <span>Focus Session</span>
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about your wellness, productivity, or schedule..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleSendMessage()} 
              disabled={isLoading || !inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
