import { useState } from 'react';
import { useAuth } from './../contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from './../components/ui/card';
import { Badge } from './../components/ui/badge';
import { Button } from './../components/ui/button';
import { Input } from './../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './../components/ui/dialog';
import { Textarea } from './../components/ui/textarea';
import { Label } from './../components/ui/label';
import { Alert, AlertDescription } from './../components/ui/alert';
import { 
  CheckSquare, 
  Clock, 
  User, 
  Calendar, 
  Filter, 
  Search, 
  Plus,
  AlertCircle,
  MessageSquare,
  Eye,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

type TaskStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type TaskType = 'programmatic' | 'sensitive' | 'out_of_scope';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  assignee: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  project: string;
  location: string;
  age?: number;
  gender?: string;
}

const mockTasks: Task[] = [
  {
    id: 'FB-001',
    title: 'Teacher attendance issue in rural school',
    description: 'Students report that their teacher is frequently absent, affecting their learning progress.',
    status: 'pending',
    priority: 'high',
    type: 'programmatic',
    assignee: 'Sarah Johnson',
    reporter: 'Anonymous',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    dueDate: '2024-01-20',
    project: 'Education Support Program',
    location: 'Rural District A',
    age: 25,
    gender: 'female'
  },
  {
    id: 'FB-002',
    title: 'Inappropriate behavior by project staff',
    description: 'Confidential report about staff misconduct that requires immediate attention.',
    status: 'in_progress',
    priority: 'urgent',
    type: 'sensitive',
    assignee: 'Michael Chen',
    reporter: 'Protected Identity',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-16',
    dueDate: '2024-01-18',
    project: 'Women Empowerment Program',
    location: 'Urban District B',
    age: 32,
    gender: 'female'
  },
  {
    id: 'FB-003',
    title: 'Request for additional water pump',
    description: 'Community requesting additional water pump installation outside current project scope.',
    status: 'resolved',
    priority: 'medium',
    type: 'out_of_scope',
    assignee: 'David Wilson',
    reporter: 'Community Leader',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-17',
    dueDate: '2024-01-25',
    project: 'Water & Sanitation Project',
    location: 'Central District',
    age: 45,
    gender: 'male'
  },
  {
    id: 'FB-004',
    title: 'Healthcare supplies shortage',
    description: 'Local clinic reports running low on essential medical supplies provided by the project.',
    status: 'pending',
    priority: 'high',
    type: 'programmatic',
    assignee: 'Emily Davis',
    reporter: 'Dr. Ahmed Hassan',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16',
    dueDate: '2024-01-22',
    project: 'Healthcare Initiative',
    location: 'Northern District',
    age: 38,
    gender: 'male'
  },
  {
    id: 'FB-005',
    title: 'Youth training program feedback',
    description: 'Positive feedback about the skills training program with suggestions for improvement.',
    status: 'closed',
    priority: 'low',
    type: 'programmatic',
    assignee: 'Anna Martinez',
    reporter: 'Training Participant',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-18',
    dueDate: '2024-01-30',
    project: 'Youth Skills Development',
    location: 'Eastern District',
    age: 22,
    gender: 'male'
  }
];

export default function TaskManager() {
  const { user, canEdit } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Filter tasks based on search and filters
  const applyFilters = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(task => task.type === typeFilter);
    }

    setFilteredTasks(filtered);
  };

  // Apply filters whenever search or filter values change
  useState(() => {
    applyFilters();
  });

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-400 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'sensitive': return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'programmatic': return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case 'out_of_scope': return <XCircle className="h-4 w-4 text-gray-400" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    toast.success(`Task ${taskId} status updated to ${newStatus}`);
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const getTaskStats = () => {
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      resolved: tasks.filter(t => t.status === 'resolved').length,
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'closed').length,
    };
    return stats;
  };

  const stats = getTaskStats();

  const handleAddTask = () => {
    if (!canEdit()) {
      toast.error('You do not have permission to add tasks');
      return;
    }
    setIsAddTaskOpen(true);
  };

  const handleEditTask = (task: Task) => {
    if (!canEdit()) {
      toast.error('You do not have permission to edit tasks');
      return;
    }
    // Implementation for edit task
    toast.info('Edit task functionality coming soon!');
  };

  const handleDeleteTask = (taskId: string) => {
    if (user?.role !== 'admin') {
      toast.error('Only admins can delete tasks');
      return;
    }
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setFilteredTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Task Manager</h1>
          <p className="text-gray-400">Manage and track feedback resolution tasks</p>
        </div>
        {canEdit() && (
          <Button 
            onClick={handleAddTask}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        )}
      </div>

      {/* Role-based Access Alert */}
      {!canEdit() && (
        <Alert className="border-yellow-500/50 bg-yellow-900/20">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-yellow-200">
            You have view-only access to tasks. Contact an admin or focal person to make changes.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-blue-300">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.pending}</div>
            <div className="text-sm text-yellow-300">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.inProgress}</div>
            <div className="text-sm text-purple-300">In Progress</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.resolved}</div>
            <div className="text-sm text-green-300">Resolved</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.urgent}</div>
            <div className="text-sm text-red-300">Urgent</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-500/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.overdue}</div>
            <div className="text-sm text-orange-300">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-10 bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    applyFilters();
                  }}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              applyFilters();
            }}>
              <SelectTrigger className="w-32 bg-black/20 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(value) => {
              setPriorityFilter(value);
              applyFilters();
            }}>
              <SelectTrigger className="w-32 bg-black/20 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value) => {
              setTypeFilter(value);
              applyFilters();
            }}>
              <SelectTrigger className="w-40 bg-black/20 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="programmatic">Programmatic</SelectItem>
                <SelectItem value="sensitive">Sensitive</SelectItem>
                <SelectItem value="out_of_scope">Out of Scope</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="bg-black/20 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(task.type)}
                      <Badge variant="outline" className="text-xs">
                        {task.id}
                      </Badge>
                      {task.type === 'sensitive' && (
                        <Shield className="h-4 w-4 text-red-400" title="Sensitive Content" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{task.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{task.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {task.assignee}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {task.dueDate}
                    </div>
                    <span>•</span>
                    <span>{task.location}</span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={`${getStatusColor(task.status)} text-white border-0`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openTaskDetail(task)}
                      className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    
                    {canEdit() && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTask(task)}
                          className="bg-transparent border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        
                        {task.status !== 'closed' && (
                          <Select
                            value={task.status}
                            onValueChange={(value: TaskStatus) => updateTaskStatus(task.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8 bg-black/20 border-purple-500/30 text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-purple-500/30">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </>
                    )}
                    
                    {user?.role === 'admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-transparent border-red-500/30 text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Task Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedTask && getTypeIcon(selectedTask.type)}
              Task Details - {selectedTask?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-6">
              <div className="flex gap-2">
                <Badge className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority.toUpperCase()}
                </Badge>
                <Badge variant="outline" className={`${getStatusColor(selectedTask.status)} text-white border-0`}>
                  {selectedTask.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedTask.title}</h3>
                <p className="text-gray-300">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-400">Project</Label>
                  <p className="text-white">{selectedTask.project}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Location</Label>
                  <p className="text-white">{selectedTask.location}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Assignee</Label>
                  <p className="text-white">{selectedTask.assignee}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Reporter</Label>
                  <p className="text-white">{selectedTask.reporter}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Created</Label>
                  <p className="text-white">{selectedTask.createdAt}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Due Date</Label>
                  <p className="text-white">{selectedTask.dueDate}</p>
                </div>
                {selectedTask.age && (
                  <div>
                    <Label className="text-gray-400">Reporter Age</Label>
                    <p className="text-white">{selectedTask.age} years</p>
                  </div>
                )}
                {selectedTask.gender && (
                  <div>
                    <Label className="text-gray-400">Reporter Gender</Label>
                    <p className="text-white capitalize">{selectedTask.gender}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
