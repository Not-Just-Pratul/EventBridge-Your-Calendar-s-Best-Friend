
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Zap, Shield, Sparkles, ArrowRight, BarChart3, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered calendar that learns your preferences and optimizes your time'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track your productivity patterns and get insights on your time usage'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and monitor your objectives with progress tracking and insights'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share calendars and coordinate with your team seamlessly'
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Create events instantly with predefined templates and shortcuts'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with enterprise-grade security'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
              <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white dark:text-black" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-black dark:text-white">
              EventBridge
            </h1>
          </div>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 min-h-[44px]"
          >
            Get Started
            <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <Badge variant="secondary" className="mb-4 sm:mb-6 animate-pulse text-xs sm:text-sm px-3 py-1">
          ✨ The Future of Calendar Management
        </Badge>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 text-black dark:text-white leading-tight">
          Your Calendar's
          <br />
          Best Friend
        </h1>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
          EventBridge transforms how you manage your time with AI-powered scheduling, 
          intelligent insights, and seamless collaboration tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-xl min-h-[52px] w-full sm:w-auto"
          >
            Start Free Trial
            <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/features')}
            className="text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-xl border-2 border-black dark:border-white text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 min-h-[52px] w-full sm:w-auto"
          >
            View Features
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-black dark:text-white px-2">
            Everything you need to master your time
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Powerful features designed to help you stay organized, productive, and balanced.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white dark:bg-black"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-black dark:text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-black dark:text-white px-2">
            Complete Productivity Suite
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            From calendar management to team collaboration, we've got you covered.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="p-4 sm:p-6 text-center border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-black dark:text-white mx-auto mb-3 sm:mb-4" />
            <h3 className="font-semibold text-sm sm:text-base text-black dark:text-white mb-1 sm:mb-2">Smart Calendar</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Intelligent scheduling with AI</p>
          </Card>
          <Card className="p-4 sm:p-6 text-center border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-black dark:text-white mx-auto mb-3 sm:mb-4" />
            <h3 className="font-semibold text-sm sm:text-base text-black dark:text-white mb-1 sm:mb-2">Analytics</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Productivity insights & reports</p>
          </Card>
          <Card className="p-4 sm:p-6 text-center border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-black dark:text-white mx-auto mb-3 sm:mb-4" />
            <h3 className="font-semibold text-sm sm:text-base text-black dark:text-white mb-1 sm:mb-2">Goal Tracking</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Set & achieve your objectives</p>
          </Card>
          <Card className="p-4 sm:p-6 text-center border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-black dark:text-white mx-auto mb-3 sm:mb-4" />
            <h3 className="font-semibold text-sm sm:text-base text-black dark:text-white mb-1 sm:mb-2">Team Collaboration</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Work together seamlessly</p>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div>
            <h3 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">50K+</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Active Users</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">99.9%</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Uptime</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">2M+</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Events Managed</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Card className="bg-black dark:bg-white text-white dark:text-black p-8 sm:p-12 text-center border-0">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
            Ready to transform your productivity?
          </h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who've revolutionized their time management with EventBridge.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-xl min-h-[52px] w-full sm:w-auto max-w-xs mx-auto"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2025 EventBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
