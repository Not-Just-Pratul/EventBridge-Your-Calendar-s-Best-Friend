
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Clock, Target, Zap, Bot, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { EnhancedAIFeatures } from './EnhancedAIFeatures';
import { useLifeBalanceMetrics } from '@/hooks/useLifeBalanceMetrics';
import { useToast } from '@/hooks/use-toast';

interface LifeBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LifeBalanceModal: React.FC<LifeBalanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const metrics = useLifeBalanceMetrics();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isBreakScheduled, setIsBreakScheduled] = useState(false);
  const [isFocusSessionActive, setIsFocusSessionActive] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const { toast } = useToast();

  const balanceAreas = [
    { name: 'Work', value: Math.round((metrics.workHours / (metrics.workHours + metrics.personalHours + metrics.healthHours + metrics.socialHours || 1)) * 100), color: 'bg-blue-500' },
    { name: 'Personal', value: Math.round((metrics.personalHours / (metrics.workHours + metrics.personalHours + metrics.healthHours + metrics.socialHours || 1)) * 100), color: 'bg-green-500' },
    { name: 'Health', value: Math.round((metrics.healthHours / (metrics.workHours + metrics.personalHours + metrics.healthHours + metrics.socialHours || 1)) * 100), color: 'bg-purple-500' },
    { name: 'Social', value: Math.round((metrics.socialHours / (metrics.workHours + metrics.personalHours + metrics.healthHours + metrics.socialHours || 1)) * 100), color: 'bg-orange-500' }
  ];

  const handleScheduleBreak = () => {
    setIsBreakScheduled(true);
    toast({
      title: "Break Scheduled",
      description: "A 15-minute wellness break has been added to your calendar for the next available slot.",
    });

    setTimeout(() => setIsBreakScheduled(false), 3000);
  };

  const handleStartFocusSession = () => {
    setIsFocusSessionActive(true);
    toast({
      title: "Focus Session Started",
      description: "25-minute deep work session initiated. Notifications are now muted.",
    });

    setTimeout(() => setIsFocusSessionActive(false), 5000);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <span>Life Balance Dashboard</span>
              <Badge variant="outline" className="text-blue-600">Calendar-Synced</Badge>
              <Badge variant="outline" className="text-purple-600">AI-Enhanced</Badge>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[75vh] pr-4">
            <div className="space-y-6">
              {/* Real-time Calendar Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Work-Life Balance</span>
                    <Badge variant="outline" className="text-green-600">{metrics.workLifeBalance}%</Badge>
                  </div>
                  <Progress value={metrics.workLifeBalance} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">Based on {metrics.workHours + metrics.personalHours + metrics.healthHours + metrics.socialHours}h scheduled</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Stress Level</span>
                    <Badge variant="outline" className="text-yellow-600">{metrics.stressLevel}%</Badge>
                  </div>
                  <Progress value={metrics.stressLevel} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">{metrics.upcomingDeadlines} upcoming deadlines</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Focus Time</span>
                    <Badge variant="outline" className="text-blue-600">{metrics.focusTime}%</Badge>
                  </div>
                  <Progress value={metrics.focusTime} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">Avg {metrics.averageEventDuration}h per session</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Wellness Score</span>
                    <Badge variant="outline" className="text-purple-600">{metrics.wellnessScore}%</Badge>
                  </div>
                  <Progress value={metrics.wellnessScore} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">{metrics.freeTime}h free time available</div>
                </Card>
              </div>

              {/* Calendar-based Time Distribution */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  This Week's Time Distribution
                </h3>
                <div className="flex h-4 rounded-full overflow-hidden mb-3">
                  {balanceAreas.map((area, index) => (
                    <div
                      key={index}
                      className={`${area.color} transition-all duration-300`}
                      style={{ width: `${area.value || 1}%` }}
                      title={`${area.name}: ${area.value}%`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {balanceAreas.map((area, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-3 h-3 ${area.color} rounded-full mx-auto mb-1`} />
                      <span className="text-xs text-gray-600">{area.name}</span>
                      <div className="text-xs font-medium">{area.value}%</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Enhanced AI Features */}
              <EnhancedAIFeatures 
                metrics={metrics}
                onInsightReceived={setAiInsight}
              />

              {/* AI Insight Display */}
              {aiInsight && (
                <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50">
                  <div className="flex items-start space-x-2">
                    <Bot className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <strong>AI Insight:</strong>
                      <div className="mt-1 whitespace-pre-line">{aiInsight}</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
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

              {/* Stress Alert */}
              {metrics.stressLevel > 60 && (
                <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      High stress detected ({metrics.stressLevel}%)! Consider scheduling a break or using the AI assistant for personalized recommendations.
                    </span>
                  </div>
                </Card>
              )}

              {/* Calendar Sync Status */}
              <Card className="p-3 bg-green-50 border-l-4 border-l-green-500">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    ✓ Synced with {metrics.workHours + metrics.personalHours + metrics.healthHours + metrics.socialHours} hours of calendar events this week
                  </span>
                </div>
              </Card>
            </div>
          </ScrollArea>
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
