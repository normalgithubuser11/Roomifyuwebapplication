import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { GraduationCap } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - redirect to dashboard
    navigate('/dashboard');
  };

  const handleSSOLogin = () => {
    // Mock SSO login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-2">RoomifyU</h1>
            <p className="text-xl text-muted-foreground">University Room Booking System</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80"
            alt="University Campus"
            className="rounded-2xl shadow-2xl max-w-md w-full"
          />
        </div>

        {/* Right side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to manage room bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* SSO Login */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSSOLogin}
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Sign in with University SSO
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 h-auto"
                      onClick={() => navigate('/forgot-password')}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Need help?{' '}
                <a href="#" className="text-primary hover:underline">
                  Contact IT Support
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
