import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Zap, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Bell,
  Repeat,
  BarChart3,
  Palette,
  Moon,
  Sun,
  Smartphone,
  Globe,
  Lock,
  Target,
  Brain,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered calendar that learns your preferences and optimizes your time',
      details: [
        'Automatic time slot suggestions',
        'Conflict detection and resolution',
        'Meeting optimization algorithms',
        'Intelligent buffer time allocation'
      ]
    },
    {
      icon: Clock,
      title: 'Time Analytics',
      description: 'Track your productivity patterns and get insights on your time usage',
      details: [
        'Daily, weekly, monthly reports',
        'Productivity heatmaps',
        'Time allocation breakdowns',
        'Goal tracking and progress'
      ]
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share calendars and coordinate with your team seamlessly',
      details: [
        'Shared team calendars',
        'Meeting room booking',
        'Availability sharing',
        'Team scheduling polls'
      ]
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Create events instantly with predefined templates and shortcuts',
      details: [
        'One-click event templates',
        'Smart event suggestions',
        'Bulk operations',
        'Keyboard shortcuts'
      ]
    }
  ];

  const advancedFeatures = [
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Customizable reminders and intelligent notification scheduling',
      color: 'text-black dark:text-white'
    },
    {
      icon: Repeat,
      title: 'Recurring Events',
      description: 'Flexible recurring patterns with exception handling',
      color: 'text-black dark:text-white'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into your time management patterns',
      color: 'text-black dark:text-white'
    },
    {
      icon: Palette,
      title: 'Custom Themes',
      description: 'Personalize your calendar with colors and themes',
      color: 'text-black dark:text-white'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Fully responsive design for all your devices',
      color: 'text-black dark:text-white'
    },
    {
      icon: Globe,
      title: 'Multi-timezone',
      description: 'Global timezone support for international teams',
      color: 'text-black dark:text-white'
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and security protocols'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data stays private with end-to-end encryption'
    },
    {
      icon: Target,
      title: 'GDPR Compliant',
      description: 'Full compliance with international privacy regulations'
    }
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: 'AI Assistant',
      description: 'Natural language event creation and smart suggestions'
    },
    {
      icon: Heart,
      title: 'Wellness Tracking',
      description: 'Monitor work-life balance with intelligent wellness insights'
    },
    {
      icon: Sparkles,
      title: 'Predictive Planning',
      description: 'AI-powered suggestions based on your habits and preferences'
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
          <div className="flex space-x-2 sm:space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-2 border-black dark:border-white text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 min-h-[44px]"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 min-h-[44px]"
            >
              Get Started
              <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <Badge variant="secondary" className="mb-4 sm:mb-6 animate-pulse text-xs sm:text-sm px-3 py-1">
          ✨ Comprehensive Feature Overview
        </Badge>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-black dark:text-white leading-tight">
          Everything You Need
          <br />
          to Master Time
        </h1>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
          Discover all the powerful features that make EventBridge the ultimate calendar management solution
          for individuals and teams.
        </p>
      </section>

      {/* Main Features */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-black dark:text-white px-2">
            Core Features
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            The foundation of your productivity journey starts here.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          {mainFeatures.map((feature, index) => (
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
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full mr-3 flex-shrink-0"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Advanced Features */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-black dark:text-white px-2">
            Advanced Capabilities
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Professional-grade features for power users and teams.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {advancedFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-4 sm:p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-white dark:bg-black"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <feature.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${feature.color}`} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-black dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Features */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-black dark:text-white px-2">
            AI-Powered Intelligence
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Experience the future of calendar management with artificial intelligence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {aiFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white dark:bg-black"
            >
              <div className="w-10 h-12 sm:w-14 sm:h-14 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-black" />
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

      {/* Security Features */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-black dark:text-white px-2">
            Security & Privacy
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Your data is protected with industry-leading security measures.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {securityFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white dark:bg-black"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-black" />
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Card className="bg-black dark:bg-white text-white dark:text-black p-8 sm:p-12 text-center border-0">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Experience All These Features?
          </h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
            Start your free trial today and discover how EventBridge can transform your productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-xl min-h-[52px] w-full sm:w-auto"
            >
              Start Free Trial
              <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/')}
              className="text-white dark:text-black border-white dark:border-black hover:bg-white/10 dark:hover:bg-black/10 text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-xl min-h-[52px] w-full sm:w-auto"
            >
              Back to Home
            </Button>
          </div>
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

export default Features;
