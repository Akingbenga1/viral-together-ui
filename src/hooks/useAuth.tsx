'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api';
import { LoginCredentials, RegisterData, User, Role } from '@/types';
import { getHighestRole, getDashboardPath, hasRole, hasAnyRole, hasRoleLevel } from '@/lib/roleUtils';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRoles: Role[];
  highestRole: string;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasRoleLevel: (requiredRole: string) => boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  redirectToRoleDashboard: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;
  const userRoles = user?.roles || [];
  const highestRole = getHighestRole(userRoles);

  useEffect(() => {
    const init = async () => {
      try {
        const token = Cookies.get('access_token');
        if (token) {
          const currentUser = await apiClient.getCurrentUser();
          setUser(currentUser);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const tokens = await apiClient.login(credentials);
      
      // Store token in cookie
      Cookies.set('access_token', tokens.access_token, { expires: 7 });
      
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
      
      toast.success('Login successful!');
      redirectToRoleDashboard();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      await apiClient.register(data);
      toast.success('Registration successful! Please login.');
      router.push('/auth/login');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToRoleDashboard = () => {
    const dashboardPath = getDashboardPath(user);
    router.push(dashboardPath);
  };

  const logout = () => {
    Cookies.remove('access_token');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        userRoles,
        highestRole,
        hasRole: (role: string) => hasRole(user, role),
        hasAnyRole: (roles: string[]) => hasAnyRole(user, roles),
        hasRoleLevel: (requiredRole: string) => hasRoleLevel(user, requiredRole),
        login,
        register,
        logout,
        redirectToRoleDashboard,
      }}
    >
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