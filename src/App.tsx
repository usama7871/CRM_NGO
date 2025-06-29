
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '././components/ui/sonner';
import { ThemeProvider } from '././components/theme-provider';
import { AuthProvider } from '././contexts/auth-context';
import { ProtectedRoute } from '././components/protected-route';
import Dashboard from '././pages/Dashboard';
import FeedbackForm from '././pages/FeedbackForm';
import TaskManager from '././pages/TaskManager';
import Analytics from '././pages/Analytics';
import UserManagement from '././pages/UserManagement';
import Login from '././pages/Login';
import Layout from '././components/layout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="crm-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/feedback" element={<FeedbackForm />} />
                          <Route path="/tasks" element={<TaskManager />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/users" element={<UserManagement />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
