import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Link } from 'wouter';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (username === 'admin' && password === 'admin') {
      // Set login status in session storage
      sessionStorage.setItem('loggedIn', 'true');
      // Redirect to the admin dashboard in the public folder
      window.location.href = '/index.html';
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-orbitron">Admin Login</CardTitle>
          <CardDescription>Enter your administrator credentials below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="admin" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full bg-electric-blue hover:bg-electric-blue-dark">
              Login
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            Not an admin?{' '}
            <Link href="/login" className="underline">
              Return to user login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage; 