
import { useState } from 'react';
import { useAuth } from './../contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from './../components/ui/card';
import { Button } from './../components/ui/button';
import { Input } from './../components/ui/input';
import { Label } from './../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './../components/ui/dialog';
import { Badge } from './../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './../components/ui/avatar';
import { Plus, Edit, Trash2, Users, Shield, Eye, UserCheck, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as 'admin' | 'focal_person' | 'viewer',
    department: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    addUser(newUser);
    setNewUser({ name: '', email: '', role: 'viewer', department: '' });
    setIsAddDialogOpen(false);
    toast.success('User added successfully');
  };

  const handleUpdateUser = () => {
    if (!editingUser.name || !editingUser.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    updateUser(editingUser.id, editingUser);
    setEditingUser(null);
    toast.success('User updated successfully');
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      deleteUser(userId);
      toast.success('User deleted successfully');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'focal_person': return <UserCheck className="h-4 w-4" />;
      case 'viewer': return <Eye className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500 text-white';
      case 'focal_person': return 'bg-blue-500 text-white';
      case 'viewer': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUserStats = () => {
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      focalPersons: users.filter(u => u.role === 'focal_person').length,
      viewers: users.filter(u => u.role === 'viewer').length
    };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Users className="mr-3 h-8 w-8 text-purple-400" />
            User Management
          </h1>
          <p className="text-gray-400">Manage system users and their permissions</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-purple-500/30 text-white">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-white"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-white"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="focal_person">Focal Person</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-white"
                  placeholder="Enter department"
                />
              </div>
              <Button onClick={handleAddUser} className="w-full bg-purple-500 hover:bg-purple-600">
                Add User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-blue-300">Total Users</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.admins}</div>
            <div className="text-sm text-red-300">Admins</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.focalPersons}</div>
            <div className="text-sm text-purple-300">Focal Persons</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.viewers}</div>
            <div className="text-sm text-green-300">Viewers</div>
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
                  placeholder="Search users..."
                  className="pl-10 bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 bg-black/20 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="focal_person">Focal Person</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="bg-black/20 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                    <p className="text-gray-400">{user.email}</p>
                    {user.department && (
                      <p className="text-sm text-gray-500">{user.department}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={`${getRoleColor(user.role)} flex items-center gap-1`}>
                    {getRoleIcon(user.role)}
                    {user.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingUser({...user})}
                      className="bg-transparent border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="bg-transparent border-red-500/30 text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role *</Label>
                <Select value={editingUser.role} onValueChange={(value: any) => setEditingUser({...editingUser, role: value})}>
                  <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="focal_person">Focal Person</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={editingUser.department || ''}
                  onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-white"
                />
              </div>
              <Button onClick={handleUpdateUser} className="w-full bg-purple-500 hover:bg-purple-600">
                Update User
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
