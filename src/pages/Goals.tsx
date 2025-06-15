
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  Plus, 
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  Flag,
  Edit,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

const Goals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Complete Q1 Project Milestones',
      description: 'Finish all major deliverables for the first quarter',
      category: 'work',
      priority: 'high',
      progress: 75,
      targetDate: '2025-03-31',
      status: 'active',
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      title: 'Learn React Advanced Patterns',
      description: 'Master hooks, context, and performance optimization',
      category: 'learning',
      priority: 'medium',
      progress: 45,
      targetDate: '2025-04-15',
      status: 'active',
      createdAt: '2025-01-05'
    },
    {
      id: '3',
      title: 'Improve Work-Life Balance',
      description: 'Maintain 8-hour workdays and take regular breaks',
      category: 'wellness',
      priority: 'high',
      progress: 60,
      targetDate: '2025-06-30',
      status: 'active',
      createdAt: '2025-01-10'
    }
  ]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'work',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetDate: ''
  });

  const categories = [
    { value: 'work', label: 'Work', color: 'bg-blue-100 text-blue-800' },
    { value: 'learning', label: 'Learning', color: 'bg-green-100 text-green-800' },
    { value: 'wellness', label: 'Wellness', color: 'bg-purple-100 text-purple-800' },
    { value: 'personal', label: 'Personal', color: 'bg-orange-100 text-orange-800' }
  ];

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) return;

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'work',
      priority: 'medium',
      targetDate: ''
    });
    setIsCreateModalOpen(false);
  };

  const updateProgress = (goalId: string, newProgress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: newProgress, status: newProgress >= 100 ? 'completed' : 'active' }
        : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to view goals</p>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goals</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your objectives and progress</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="What do you want to achieve?"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe your goal in detail..."
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select 
                          value={newGoal.priority} 
                          onValueChange={(value: 'low' | 'medium' | 'high') => setNewGoal({ ...newGoal, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Target Date</label>
                      <Input
                        type="date"
                        value={newGoal.targetDate}
                        onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleCreateGoal} className="flex-1">
                        Create Goal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={() => navigate('/calendar')}>
                Back to Calendar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goals.filter(g => g.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goals.filter(g => g.status === 'completed').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)}%
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Due This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((goal) => {
            const category = categories.find(c => c.value === goal.category);
            const daysUntilDue = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={goal.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {goal.title}
                      </h3>
                      <Badge className={category?.color}>
                        {category?.label}
                      </Badge>
                      <Badge className={priorityColors[goal.priority]}>
                        {goal.priority}
                      </Badge>
                      {goal.status === 'completed' && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{goal.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {daysUntilDue > 0 ? `${daysUntilDue} days left` : 'Overdue'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progress: {goal.progress}%
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProgress(goal.id, Math.max(0, goal.progress - 10))}
                        disabled={goal.progress <= 0}
                      >
                        -10%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProgress(goal.id, Math.min(100, goal.progress + 10))}
                        disabled={goal.progress >= 100}
                      >
                        +10%
                      </Button>
                    </div>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </Card>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No goals yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by creating your first goal to track your progress
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
