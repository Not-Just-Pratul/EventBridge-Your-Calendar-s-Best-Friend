
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Clock, Zap, Heart, User, Loader2, Calendar, Target, BookOpen, Coffee, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
      content: `Hello! I'm your AI assistant powered by Google Gemini. I can help you with calendar management, productivity tips, general questions, and much more. What would you like to know or discuss today?`,
      timestamp: new Date(),
      suggestions: [
        'Help me plan my day',
        'Give me productivity tips', 
        'What\'s the weather like?',
        'Explain quantum physics',
        'Schedule optimization tips',
        'Random fun fact'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    { icon: Clock, label: 'Schedule Break', action: () => onScheduleBreak?.() },
    { icon: Zap, label: 'Focus Session', action: () => onStartFocusSession?.() },
    { icon: Calendar, label: 'Plan My Day', action: () => handleSendMessage('Help me plan my day based on my calendar') },
    { icon: Target, label: 'Set Goals', action: () => handleSendMessage('Help me set productive goals for today') },
    { icon: BookOpen, label: 'Learn Something', action: () => handleSendMessage('Teach me something interesting') },
    { icon: Coffee, label: 'Take a Break', action: () => handleSendMessage('I need break ideas') },
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
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: messageToSend,
          lifeBalanceData,
          context: 'general_assistant'
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
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Only execute actions if explicitly requested, don't auto-trigger
      if (data.action === 'schedule_break' && messageToSend.toLowerCase().includes('break')) {
        // Only if user specifically asked for break
      } else if (data.action === 'focus_session' && messageToSend.toLowerCase().includes('focus')) {
        // Only if user specifically asked for focus
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Chat cleared! I'm here to help with anything you need. What would you like to discuss?`,
      timestamp: new Date(),
      suggestions: [
        'Help me be more productive',
        'Tell me a joke',
        'Explain a complex topic',
        'Help with my schedule'
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
              <span>AI Assistant</span>
              <Badge variant="outline" className="text-green-600">Gemini Powered</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={clearChat}>
              Clear Chat
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
              className="flex items-center space-x-1 text-xs"
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
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t pt-4 space-y-3">
          {/* Context Options */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendMessage('Help me with my calendar')}
              className="text-xs"
            >
              📅 Calendar Help
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendMessage('Give me a motivational quote')}
              className="text-xs"
            >
              ✨ Motivation
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendMessage('Explain something interesting')}
              className="text-xs"
            >
              🧠 Learn
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendMessage('Help me solve a problem')}
              className="text-xs"
            >
              🔧 Problem Solving
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything - calendar help, general questions, productivity tips..."
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
