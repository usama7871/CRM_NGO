
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BarChart3, TrendingUp, Users, Clock, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const feedbackByProject = [
  { name: 'Education', value: 85, color: '#8b5cf6' },
  { name: 'Healthcare', value: 67, color: '#06b6d4' },
  { name: 'Water & Sanitation', value: 43, color: '#10b981' },
  { name: 'Women Empowerment', value: 32, color: '#f59e0b' },
  { name: 'Youth Skills', value: 20, color: '#ef4444' },
];

const feedbackByType = [
  { name: 'Programmatic', value: 156, color: '#8b5cf6' },
  { name: 'Sensitive', value: 67, color: '#ef4444' },
  { name: 'Out of Scope', value: 24, color: '#6b7280' },
];

const monthlyTrends = [
  { month: 'Jan', feedback: 45, resolved: 38 },
  { month: 'Feb', feedback: 52, resolved: 41 },
  { month: 'Mar', feedback: 48, resolved: 45 },
  { month: 'Apr', feedback: 61, resolved: 52 },
  { month: 'May', feedback: 55, resolved: 48 },
  { month: 'Jun', feedback: 67, resolved: 58 },
];

const responseTimeData = [
  { category: 'Critical', avgTime: 2.1 },
  { category: 'High', avgTime: 4.5 },
  { category: 'Medium', avgTime: 8.2 },
  { category: 'Low', avgTime: 15.6 },
];

export default function Analytics() {
  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-purple-400" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-400">Comprehensive insights into feedback and task performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-transparent border-purple-500/30 text-white hover:bg-purple-500/20">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Feedback</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">247</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Resolution Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">87%</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.4h</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              -15% faster
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">94%</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2% increase
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback by Project */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Feedback by Project</CardTitle>
            <CardDescription className="text-gray-400">
              Distribution of feedback across different projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feedbackByProject}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feedback by Type */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Feedback by Type</CardTitle>
            <CardDescription className="text-gray-400">
              Breakdown of feedback categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Monthly Trends</CardTitle>
            <CardDescription className="text-gray-400">
              Feedback received vs. resolved over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="feedback" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  name="Feedback Received"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Feedback Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Analysis */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Response Time by Priority</CardTitle>
            <CardDescription className="text-gray-400">
              Average response time in hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="category" type="category" stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="avgTime" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
