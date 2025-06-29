
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from './../contexts/auth-context';
import { Button } from './../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './../components/ui/avatar';
import { 
  LayoutDashboard, 
  MessageSquare, 
  CheckSquare, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Zap,
  Users,
  Settings,
  UserCog
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, canEdit, canSubmitFeedback, canViewAnalytics, canManageUsers } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard, 
      show: true 
    },
    { 
      name: 'Feedback Form', 
      href: '/feedback', 
      icon: MessageSquare, 
      show: canSubmitFeedback() 
    },
    { 
      name: 'Task Manager', 
      href: '/tasks', 
      icon: CheckSquare, 
      show: canEdit() 
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: BarChart3, 
      show: canViewAnalytics() 
    },
    { 
      name: 'User Management', 
      href: '/users', 
      icon: UserCog, 
      show: canManageUsers() 
    },
  ];

  const visibleNavigation = navigation.filter(item => item.show);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-xl border-r border-purple-500/20 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-purple-500/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">NGO CRM</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-purple-500/20"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-purple-400' : 'group-hover:text-purple-400'}`} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user?.name}</p>
              <p className="text-gray-400 text-sm capitalize">{user?.role?.replace('_', ' ')}</p>
              {user?.department && (
                <p className="text-gray-500 text-xs">{user.department}</p>
              )}
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="w-full bg-transparent border-purple-500/30 text-white hover:bg-purple-500/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-purple-500/20 h-16 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white hover:bg-purple-500/20"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <span className="text-sm text-gray-300">Welcome back,</span>
              <span className="ml-1 font-medium">{user?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                user?.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                user?.role === 'focal_person' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-green-500/20 text-green-300 border border-green-500/30'
              }`}>
                {user?.role?.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>
      )}
    </div>
  );
}
