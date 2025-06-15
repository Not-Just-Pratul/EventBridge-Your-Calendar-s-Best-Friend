
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Zap, Shield, Sparkles, ArrowRight, Brain, BarChart3, Heart, CheckCircle, Star, Globe, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI Assistant',
      description: 'Natural language event creation and smart scheduling suggestions powered by advanced AI'
    },
    {
      icon: BarChart3,
      title: 'Time Analytics',
      description: 'Track your productivity patterns and get insights on your time usage with detailed reports'
    },
    {
      icon: Heart,
      title: 'Wellness Tracking',
      description: 'Monitor work-life balance with intelligent wellness insights and recommendations'
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Create events instantly with predefined templates and one-click shortcuts'
    },
    {
      icon: Shield,
      title: 'Smart Notifications',
      description: 'Intelligent reminder system with customizable notification preferences'
    },
    {
      icon: Sparkles,
      title: 'Custom Themes',
      description: 'Personalize your calendar with beautiful themes and color customization'
    }
  ];

  const stats = [
    { number: '10M+', label: 'Events Created' },
    { number: '500K+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '4.9★', label: 'User Rating' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      content: 'EventBridge has revolutionized how our team manages schedules. The AI suggestions are incredibly accurate!',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Entrepreneur',
      company: 'StartupLab',
      content: 'The wellness tracking feature helped me achieve better work-life balance. Game changer!',
      rating: 5
    },
    {
      name: 'Elena Rodriguez',
      role: 'Team Lead',
      company: 'DesignStudio',
      content: 'Smart notifications and time analytics have boosted our team productivity by 40%.',
      rating: 5
    }
  ];

  const benefits = [
    'Reduce scheduling conflicts by 90%',
    'Save 2+ hours per week on calendar management',
    'Improve team collaboration efficiency',
    'Get personalized productivity insights',
    'Maintain better work-life balance',
    'Access your calendar from anywhere'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              EventBridge
            </h1>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/features')}
              className="border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500"
            >
              Features
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <Badge variant="secondary" className="mb-6 animate-pulse bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
          ✨ AI-Powered Calendar Management
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Smart
          <br />
          Calendar Assistant
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          EventBridge combines AI intelligence with intuitive design to revolutionize how you manage time, 
          boost productivity, and maintain work-life balance in 2025 and beyond.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
          >
            Start Free Trial
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/features')}
            className="text-lg px-8 py-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300"
          >
            Explore Features
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Why Choose EventBridge?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their productivity.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Intelligent Features for Modern Productivity
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Experience the future of calendar management with AI-powered insights and automation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            What Our Users Say
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Real feedback from real users who love EventBridge
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 italic">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {testimonial.name}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform Compatibility */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Access Anywhere, Anytime
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            EventBridge works seamlessly across all your devices
          </p>
        </div>

        <div className="flex justify-center items-center space-x-12">
          <div className="text-center">
            <Globe className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400">Web</p>
          </div>
          <div className="text-center">
            <Smartphone className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400">Mobile</p>
          </div>
          <div className="text-center">
            <Calendar className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400">Desktop</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-12 text-center border-0 shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to revolutionize your productivity?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their time management with EventBridge's AI-powered features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white text-indigo-600 hover:bg-slate-50 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/features')}
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl"
            >
              View Demo
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">EventBridge</span>
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-center">
              <p>&copy; 2025 EventBridge. All rights reserved. Built with ❤️ for productivity.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
