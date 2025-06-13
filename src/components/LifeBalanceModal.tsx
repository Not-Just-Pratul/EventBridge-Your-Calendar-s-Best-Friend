
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Target, Zap } from 'lucide-react';

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

  const balanceAreas = [
    { name: 'Work', value: 45, color: 'bg-blue-500' },
    { name: 'Personal', value: 30, color: 'bg-green-500' },
    { name: 'Health', value: 15, color: 'bg-purple-500' },
    { name: 'Social', value: 10, color: 'bg-orange-500' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <span>Life Balance Dashboard</span>
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

          <div className="flex space-x-3">
            <Button className="flex-1" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Break
            </Button>
            <Button className="flex-1" variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Focus Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
