
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Target, Zap, Bot, Calendar, CheckCircle } from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { useToast } from '@/hooks/use-toast';

interface LifeBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LifeBalanceModal: React.FC<LifeBalanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [metrics] = useState({
    workLifeBalance: 72,
    stressLevel: 35,
    focusTime: 85,
    wellnessScore: 78
  });

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isBreakScheduled, setIsBreakScheduled] = useState(false);
  const [isFocusSessionActive, setIsFocusSessionActive] = useState(false);
  const { toast } = useToast();

  const balanceAreas = [
    { name: 'Work', value: 45, color: 'bg-blue-500' },
    { name: 'Personal', value: 30, color: 'bg-green-500' },
    { name: 'Health', value: 15, color: 'bg-purple-500' },
    { name: 'Social', value: 10, color: 'bg-orange-500' }
  ];

  const handleScheduleBreak = () => {
    setIsBreakScheduled(true);
    toast({
      title: "Break Scheduled",
      description: "A 15-minute wellness break has been added to your calendar for the next available slot.",
    });

    // Reset after 3 seconds for demo
    setTimeout(() => setIsBreakScheduled(false), 3000);
  };

  const handleStartFocusSession = () => {
    setIsFocusSessionActive(true);
    toast({
      title: "Focus Session Started",
      description: "25-minute deep work session initiated. Notifications are now muted.",
    });

    // Reset after 5 seconds for demo
    setTimeout(() => setIsFocusSessionActive(false), 5000);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <span>Life Balance Dashboard</span>
              <Badge variant="outline" className="text-blue-600">AI-Powered</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Work-Life Balance</span>
                  <Badge variant="outline" className="text-green-600">{metrics.workLifeBalance}%</Badge>
                </div>
                <Progress value={metrics.workLifeBalance} className="h-2" />
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Stress Level</span>
                  <Badge variant="outline" className="text-yellow-600">{metrics.stressLevel}%</Badge>
                </div>
                <Progress value={metrics.stressLevel} className="h-2" />
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Focus Time</span>
                  <Badge variant="outline" className="text-blue-600">{metrics.focusTime}%</Badge>
                </div>
                <Progress value={metrics.focusTime} className="h-2" />
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Wellness Score</span>
                  <Badge variant="outline" className="text-purple-600">{metrics.wellnessScore}%</Badge>
                </div>
                <Progress value={metrics.wellnessScore} className="h-2" />
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Time Distribution
              </h3>
              <div className="flex h-4 rounded-full overflow-hidden">
                {balanceAreas.map((area, index) => (
                  <div
                    key={index}
                    className={`${area.color} transition-all duration-300`}
                    style={{ width: `${area.value}%` }}
                    title={`${area.name}: ${area.value}%`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {balanceAreas.map((area, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-3 h-3 ${area.color} rounded-full mx-auto mb-1`} />
                    <span className="text-xs text-gray-600">{area.name}</span>
                    <div className="text-xs font-medium">{area.value}%</div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                onClick={handleScheduleBreak}
                disabled={isBreakScheduled}
                className="flex items-center space-x-2"
              >
                {isBreakScheduled ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Break Scheduled</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4" />
                    <span>Schedule Break</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleStartFocusSession}
                disabled={isFocusSessionActive}
                className="flex items-center space-x-2"
              >
                {isFocusSessionActive ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Focus Active</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Focus Session</span>
                  </>
                )}
              </Button>

              <Button 
                onClick={() => setIsAIAssistantOpen(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Bot className="h-4 w-4" />
                <span>AI Assistant</span>
              </Button>
            </div>

            {metrics.stressLevel > 60 && (
              <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    High stress detected! Consider taking a break or chatting with your AI assistant.
                  </span>
                </div>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        lifeBalanceData={metrics}
        onScheduleBreak={handleScheduleBreak}
        onStartFocusSession={handleStartFocusSession}
      />
    </>
  );
};
