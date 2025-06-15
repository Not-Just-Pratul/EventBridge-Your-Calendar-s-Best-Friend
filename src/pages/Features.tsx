
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
      color: 'text-yellow-600'
    },
    {
      icon: Repeat,
      title: 'Recurring Events',
      description: 'Flexible recurring patterns with exception handling',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into your time management patterns',
      color: 'text-green-600'
    },
    {
      icon: Palette,
      title: 'Custom Themes',
      description: 'Personalize your calendar with colors and themes',
      color: 'text-purple-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Fully responsive design for all your devices',
      color: 'text-indigo-600'
    },
    {
      icon: Globe,
      title: 'Multi-timezone',
      description: 'Global timezone support for international teams',
      color: 'text-cyan-600'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EventBridge
            </h1>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <Badge variant="secondary" className="mb-6 animate-pulse">
          ✨ Comprehensive Feature Overview
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Everything You Need
          <br />
          to Master Time
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Discover all the powerful features that make EventBridge the ultimate calendar management solution
          for individuals and teams.
        </p>
      </section>

      {/* Main Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Core Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The foundation of your productivity journey starts here.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {mainFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-8 border-2 border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Advanced Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Advanced Capabilities
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional-grade features for power users and teams.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advancedFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-6 border-2 border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            AI-Powered Intelligence
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the future of calendar management with artificial intelligence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {aiFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-8 border-2 border-purple-100 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Security Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Security & Privacy
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your data is protected with industry-leading security measures.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-8 border-2 border-green-100 dark:border-green-800 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-12 text-center border-0 shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience All These Features?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start your free trial today and discover how EventBridge can transform your productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white text-purple-600 hover:bg-gray-50 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/')}
              className="text-white border-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl transition-all duration-300"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 EventBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Features;
