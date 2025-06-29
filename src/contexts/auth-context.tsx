
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'focal_person' | 'viewer';
  avatar?: string;
  department?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  users: User[];
  addUser: (userData: Omit<User, 'id' | 'joinedAt'>) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  canEdit: () => boolean;
  canSubmitFeedback: () => boolean;
  canViewAnalytics: () => boolean;
  canManageUsers: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@ngo.org',
    name: 'John Admin',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    department: 'Management',
    joinedAt: '2023-01-15'
  },
  {
    id: '2',
    email: 'focal@ngo.org',
    name: 'Sarah Focal',
    role: 'focal_person',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c93c?w=400&h=400&fit=crop&crop=face',
    department: 'Field Operations',
    joinedAt: '2023-02-20'
  },
  {
    id: '3',
    email: 'viewer@ngo.org',
    name: 'Mike Viewer',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    department: 'Monitoring',
    joinedAt: '2023-03-10'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('crm-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Find the full user data from our mock users
      const fullUser = mockUsers.find(u => u.email === parsedUser.email);
      setUser(fullUser || parsedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('crm-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm-user');
  };

  const addUser = (userData: Omit<User, 'id' | 'joinedAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (userId: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...userData } : u));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Permission helpers
  const canEdit = () => user?.role === 'admin' || user?.role === 'focal_person';
  const canSubmitFeedback = () => user?.role === 'focal_person';
  const canViewAnalytics = () => user?.role === 'admin' || user?.role === 'viewer';
  const canManageUsers = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      users,
      addUser,
      updateUser,
      deleteUser,
      canEdit,
      canSubmitFeedback,
      canViewAnalytics,
      canManageUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
