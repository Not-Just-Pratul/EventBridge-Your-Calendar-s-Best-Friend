
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Mail, Lock, User, ArrowLeft, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'google'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/calendar');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've been successfully signed in.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/calendar`,
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!otpSent) {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            data: !isLogin ? { full_name: fullName } : undefined
          }
        });
        if (error) throw error;
        setOtpSent(true);
        toast({
          title: "OTP Sent!",
          description: "Please check your phone for the verification code.",
        });
      } else {
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: 'sms'
        });
        if (error) throw error;
        toast({
          title: "Welcome!",
          description: "You've been successfully authenticated.",
        });
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/calendar`,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
      setLoading(false);
    }
  };

  const resetPhoneAuth = () => {
    setOtpSent(false);
    setOtp('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 sm:mb-6 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EventBridge
            </h1>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {isLogin ? 'Sign in to your account' : 'Get started with EventBridge'}
          </p>
        </div>

        <Card className="p-4 sm:p-8 shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          {/* Auth Method Selector - Made more prominent */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 text-center">
              Choose your sign-in method
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  resetPhoneAuth();
                }}
                className={`py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  authMethod === 'email'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Continue with Email</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setError(null);
                }}
                className={`py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  authMethod === 'phone'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Continue with Phone</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('google');
                  setError(null);
                  resetPhoneAuth();
                }}
                className={`py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  authMethod === 'google'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="hidden sm:inline">Continue with Google</span>
                <span className="sm:hidden">Google</span>
              </button>
            </div>
          </div>

          {/* Auth Forms */}
          {authMethod === 'google' ? (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4">
                You'll be redirected to Google to complete your {isLogin ? 'sign in' : 'account creation'}
              </p>
              <Button
                onClick={handleGoogleAuth}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 sm:py-3 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? 'Redirecting...' : `${isLogin ? 'Sign in' : 'Sign up'} with Google`}
              </Button>
            </div>
          ) : authMethod === 'email' ? (
            <form onSubmit={handleEmailAuth} className="space-y-3 sm:space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="mt-1"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 sm:py-3 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePhoneAuth} className="space-y-3 sm:space-y-4">
              {!isLogin && !otpSent && (
                <div>
                  <Label htmlFor="phoneFullName" className="text-sm">Full Name</Label>
                  <Input
                    id="phoneFullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="mt-1"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={otpSent}
                  className="mt-1"
                />
              </div>

              {otpSent && (
                <div>
                  <Label htmlFor="otp" className="text-sm">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="mt-1"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 sm:py-3 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (otpSent ? 'Verifying...' : 'Sending code...') : (otpSent ? 'Verify Code' : 'Send Verification Code')}
              </Button>

              {otpSent && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetPhoneAuth}
                  className="w-full text-sm"
                >
                  Use different phone number
                </Button>
              )}
            </form>
          )}

          {error && (
            <Alert className="mt-3 sm:mt-4">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4 sm:mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                resetPhoneAuth();
                setError(null);
              }}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
