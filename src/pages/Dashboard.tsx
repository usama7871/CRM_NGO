import { Card, CardContent, CardHeader, CardTitle } from './../components/ui/card';
import { Badge } from '.././components/ui/badge';
import { Button } from './../components/ui/button';
import { Progress } from './../components/ui/progress';
import { useAuth } from './../contexts/auth-context';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Activity,
  Calendar,
  Filter,
  Plus,
  FileText,
  Settings,
  Bell
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './../components/ui/chart';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './../components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const chartConfig = {
  feedback: {
    label: "Feedback",
    color: "#8b5cf6",
  },
  resolved: {
    label: "Resolved",
    color: "#10b981",
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
  },
  programmatic: {
    label: "Programmatic",
    color: "#3b82f6",
  },
  sensitive: {
    label: "Sensitive",
    color: "#ef4444",
  },
  out_of_scope: {
    label: "Out of Scope",
    color: "#6b7280",
  },
};

const mockStats = {
  totalBeneficiaries: 2458,
  totalFeedback: 342,
  resolvedFeedback: 298,
  pendingFeedback: 44,
  avgResolutionTime: 2.3,
  satisfactionRate: 94.2,
  activeProjects: 5,
  completedProjects: 12
};

const feedbackTrends = [
  { month: 'Jan', feedback: 45, resolved: 42, pending: 3 },
  { month: 'Feb', feedback: 52, resolved: 48, pending: 4 },
  { month: 'Mar', feedback: 38, resolved: 35, pending: 3 },
  { month: 'Apr', feedback: 61, resolved: 58, pending: 3 },
  { month: 'May', feedback: 55, resolved: 51, pending: 4 },
  { month: 'Jun', feedback: 67, resolved: 62, pending: 5 },
];

const feedbackByType = [
  { name: 'Programmatic', value: 198, color: '#3b82f6' },
  { name: 'Sensitive', value: 89, color: '#ef4444' },
  { name: 'Out of Scope', value: 55, color: '#6b7280' },
];

const projectPerformance = [
  { name: 'Education Support', completion: 85, satisfaction: 92, beneficiaries: 450 },
  { name: 'Healthcare Initiative', completion: 67, satisfaction: 89, beneficiaries: 380 },
  { name: 'Water & Sanitation', completion: 78, satisfaction: 95, beneficiaries: 620 },
  { name: 'Women Empowerment', completion: 92, satisfaction: 88, beneficiaries: 290 },
  { name: 'Youth Skills Dev', completion: 45, satisfaction: 86, beneficiaries: 340 },
];

const recentActivities = [
  { type: 'feedback', message: 'New sensitive feedback received', time: '2 minutes ago', priority: 'high' },
  { type: 'resolved', message: 'Healthcare feedback resolved', time: '15 minutes ago', priority: 'medium' },
  { type: 'project', message: 'Education project milestone reached', time: '1 hour ago', priority: 'low' },
  { type: 'feedback', message: 'Programmatic feedback submitted', time: '2 hours ago', priority: 'medium' },
  { type: 'resolved', message: 'Water project issue closed', time: '4 hours ago', priority: 'low' },
];

export default function Dashboard() {
  const { user, canEdit, canSubmitFeedback, canManageUsers } = useAuth();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('6months');
  const [selectedProject, setSelectedProject] = useState('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'feedback': return <MessageSquare className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'feedback':
        if (canSubmitFeedback()) {
          navigate('/feedback');
        } else {
          toast.error('You do not have permission to submit feedback');
        }
        break;
      case 'tasks':
        if (canEdit()) {
          navigate('/tasks');
        } else {
          toast.error('You do not have permission to manage tasks');
        }
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'users':
        if (canManageUsers()) {
          navigate('/users');
        } else {
          toast.error('You do not have permission to manage users');
        }
        break;
      case 'report':
        toast.success('Report generation started. You will be notified when ready.');
        break;
      default:
        toast.info('Feature coming soon!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">
            Welcome, {user?.name} | Role: {user?.role?.replace('_', ' ').toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32 bg-black/20 border-purple-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-purple-500/30">
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-40 bg-black/20 border-purple-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-purple-500/30">
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="water">Water & Sanitation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Role-specific Alert */}
      {user?.role === 'viewer' && (
        <Card className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-400" />
              <p className="text-blue-200">
                You have view-only access. Contact an admin for additional permissions.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Beneficiaries</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockStats.totalBeneficiaries.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockStats.totalFeedback}</div>
            <div className="flex items-center text-xs text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {((mockStats.resolvedFeedback / mockStats.totalFeedback) * 100).toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockStats.avgResolutionTime} days</div>
            <div className="flex items-center text-xs text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              -0.3 days improved
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Trends */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Feedback Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={feedbackTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="feedback" 
                    stackId="1"
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stackId="2"
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Feedback by Type */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Feedback Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feedbackByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {feedbackByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Project Performance and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Performance */}
        <div className="lg:col-span-2">
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Project Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectPerformance.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{project.name}</span>
                    <div className="flex gap-2 text-sm text-gray-400">
                      <span>{project.beneficiaries} beneficiaries</span>
                      <span>•</span>
                      <span>{project.satisfaction}% satisfaction</span>
                    </div>
                  </div>
                  <Progress 
                    value={project.completion} 
                    className="h-2"
                    style={{
                      backgroundColor: 'rgba(107, 114, 128, 0.3)',
                    }}
                  />
                  <div className="text-right text-xs text-gray-400">
                    {project.completion}% complete
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-1 rounded ${getPriorityColor(activity.priority)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.message}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions with Role-Based Access */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {canSubmitFeedback() && (
              <Button 
                onClick={() => handleQuickAction('feedback')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                New Feedback
              </Button>
            )}
            
            {canEdit() && (
              <Button 
                onClick={() => handleQuickAction('tasks')}
                variant="outline" 
                className="bg-transparent border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Manage Tasks
              </Button>
            )}
            
            <Button 
              onClick={() => handleQuickAction('analytics')}
              variant="outline" 
              className="bg-transparent border-green-500/30 text-green-300 hover:bg-green-500/10"
            >
              <BarChart className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            
            {canManageUsers() && (
              <Button 
                onClick={() => handleQuickAction('users')}
                variant="outline" 
                className="bg-transparent border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            )}
            
            <Button 
              onClick={() => handleQuickAction('report')}
              variant="outline" 
              className="bg-transparent border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            
            {canEdit() && (
              <Button 
                onClick={() => handleQuickAction('settings')}
                variant="outline" 
                className="bg-transparent border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Insights for Admins */}
      {user?.role === 'admin' && (
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-400" />
              Admin Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30">
                <h4 className="text-yellow-300 font-medium">Overdue Tasks</h4>
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-sm text-yellow-400">Require immediate attention</p>
              </div>
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                <h4 className="text-red-300 font-medium">Sensitive Issues</h4>
                <p className="text-2xl font-bold text-white">2</p>
                <p className="text-sm text-red-400">Pending resolution</p>
              </div>
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                <h4 className="text-blue-300 font-medium">Active Users</h4>
                <p className="text-2xl font-bold text-white">24</p>
                <p className="text-sm text-blue-400">Last 7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
