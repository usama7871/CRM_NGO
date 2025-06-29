import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Users, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome to NGO CRM!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  const demoAccounts = [{
    email: 'admin@ngo.org',
    role: 'Admin',
    description: 'Full system access'
  }, {
    email: 'focal@ngo.org',
    role: 'Focal Person',
    description: 'Task management'
  }, {
    email: 'viewer@ngo.org',
    role: 'Viewer',
    description: 'Analytics only'
  }];
  return <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center gap-8">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col items-center space-y-8 flex-1">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">NGO CRM System</h1>
            <p className="text-xl text-gray-300 mb-8">Streamline beneficiary feedback management with futuristic design</p>
          </div>

          <div className="grid grid-cols-1 gap-6 w-full max-w-md">
            <div className="backdrop-blur-xl rounded-lg p-6 border border-purple-500/20 bg-fuchsia-900">
              <Shield className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-400 text-sm">Role-based access control with JWT security</p>
            </div>
            <div className="backdrop-blur-xl rounded-lg p-6 border border-purple-500/20 bg-pink-500">
              <Users className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Task Management</h3>
              <p className="text-gray-400 text-sm">Assign and track feedback resolution tasks</p>
            </div>
            <div className="backdrop-blur-xl rounded-lg p-6 border border-purple-500/20 bg-rose-700">
              <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-400 text-sm">Real-time insights and automated reporting</p>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md">
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="text-center">
              <div className="lg:hidden w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
              <CardDescription className="text-gray-400">
                Sign in to access the NGO CRM system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400" placeholder="Enter your password" required />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="space-y-3">
                <p className="text-sm text-gray-400 text-center">Demo Accounts:</p>
                {demoAccounts.map(account => <Button key={account.email} variant="outline" onClick={() => setEmail(account.email)} className="w-full bg-transparent border-purple-500/30 text-white hover:bg-purple-500/20 text-left justify-start">
                    <div>
                      <div className="font-medium">{account.role}</div>
                      <div className="text-xs text-gray-400">{account.description}</div>
                    </div>
                  </Button>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}