import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Lock, Mail, Phone, ArrowLeft, Eye, EyeOff, Palette } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check URL parameters for reset flow or errors
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const error = hashParams.get('error');
    const errorCode = hashParams.get('error_code');
    const errorDescription = hashParams.get('error_description');
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');

    console.log('Auth page - hash params:', {
      error,
      errorCode,
      type,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    });

    if (error) {
      if (errorCode === 'otp_expired') {
        toast.error('Password reset link has expired. Please request a new one.');
      } else {
        toast.error(errorDescription || 'Authentication error occurred');
      }
      // Clear the URL parameters
      window.history.replaceState({}, document.title, location.pathname);
      return;
    }

    if (type === 'recovery' && accessToken && refreshToken) {
      console.log('Setting session for password reset...');
      // Set the session from URL parameters for password reset
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then((result) => {
        console.log('Session set result:', result);
        if (result.error) {
          toast.error('Failed to authenticate. Please try again.');
        } else {
          setIsResetMode(true);
          toast.success('You can now set a new password');
        }
        // Clear the URL parameters
        window.history.replaceState({}, document.title, location.pathname);
      });
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, !!session);
      if (session && !isResetMode) {
        // Check if user has admin access before redirecting
        const emailDomain = session.user.email?.split('@')[1];
        const hasAdminAccess = emailDomain && ['alzikan.com', 'alzikan.net'].includes(emailDomain);
        
        if (hasAdminAccess) {
          navigate('/admin/artworks');
        } else {
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.hash, isResetMode]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Successfully signed in!');
        // Navigation is handled by onAuthStateChange
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Check your email for the confirmation link!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://mobile.alzikan.net/auth`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent! Check your inbox.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully!');
        setIsResetMode(false);
        setNewPassword('');
        setConfirmPassword('');
        // Navigate to appropriate page
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const emailDomain = user.email.split('@')[1];
          const hasAdminAccess = emailDomain && ['alzikan.com', 'alzikan.net'].includes(emailDomain);
          
          if (hasAdminAccess) {
            navigate('/admin/artworks');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isResetMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Palette className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter your new password"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your new password"
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating password...' : 'Update Password'}
              </Button>
              <div className="text-center mt-4">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsResetMode(false)}
                  className="text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-gold/10 via-background to-warm-bronze/20 p-4">
    <div className="relative">
      {/* Background Artistic Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-transparent backdrop-blur-sm rounded-3xl border border-warm-gold/20"></div>
      
      <Card className="relative w-full max-w-md glass-card">
        <CardHeader className="text-center pb-8 pt-12">
          {/* Logo/Brand Section */}
          <div className="mb-8">
            <div className="text-3xl font-bold text-warm-gold mb-2 font-decorative">
              الفنان التشكيلي
            </div>
            <div className="text-2xl font-bold text-foreground font-decorative">
              إبراهيم الزيكان
            </div>
            <div className="text-lg text-warm-bronze italic mt-2">
              Ibrahim al Zikan
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="User Name"
                      className="pl-12 h-12 bg-background/50 border-border/30 focus:border-warm-gold/50"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Password"
                      className="pl-12 h-12 bg-background/50 border-border/30 focus:border-warm-gold/50"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-card hover:bg-card/90 text-card-foreground font-medium rounded-xl"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
                
                {/* Social Login Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">OR</span>
                  </div>
                </div>
                
                {/* Social Login Buttons */}
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-full border-border/30">
                    <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  </Button>
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-full border-border/30">
                    <div className="w-5 h-5 bg-red-500 rounded"></div>
                  </Button>
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-full border-border/30">
                    <div className="w-5 h-5 bg-blue-400 rounded"></div>
                  </Button>
                </div>
                
                <div className="text-center mt-6">
                  <span className="text-sm text-muted-foreground">Already have account? </span>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="text-sm text-warm-gold hover:text-warm-gold/80 p-0"
                  >
                    Sign in
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      id="name-signup"
                      type="text"
                      placeholder="User Name"
                      className="pl-12 h-12 bg-background/50 border-border/30 focus:border-warm-gold/50"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="phone-signup"
                      type="tel"
                      placeholder="Mobile Number"
                      className="pl-12 h-12 bg-background/50 border-border/30 focus:border-warm-gold/50"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="email-signup"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Email"
                      className="pl-12 h-12 bg-background/50 border-border/30 focus:border-warm-gold/50"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="password-signup"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Password"
                      className="pl-12 h-12 bg-background/50 border-border/30 focus:border-warm-gold/50"
                      minLength={6}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-card hover:bg-card/90 text-card-foreground font-medium rounded-xl"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </Button>
                
                {/* Social Login Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">OR</span>
                  </div>
                </div>
                
                {/* Social Login Buttons */}
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-full border-border/30">
                    <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  </Button>
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-full border-border/30">
                    <div className="w-5 h-5 bg-red-500 rounded"></div>
                  </Button>
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-full border-border/30">
                    <div className="w-5 h-5 bg-blue-400 rounded"></div>
                  </Button>
                </div>
                
                <div className="text-center mt-6">
                  <span className="text-sm text-muted-foreground">Already have account? </span>
                  <Button
                    variant="link"
                    onClick={() => {}}
                    className="text-sm text-warm-gold hover:text-warm-gold/80 p-0"
                  >
                    Sign in
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </div>
  );
};

export default Auth;