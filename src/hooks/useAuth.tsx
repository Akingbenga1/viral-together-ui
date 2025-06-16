'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api';
import { LoginCredentials, RegisterData, User } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      // In a real app, you'd validate the token with the server
      // For now, we'll assume the token is valid if it exists
      setUser({ id: 1, username: 'user' }); // Mock user data
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const tokens = await apiClient.login(credentials);
      
      // Store token in cookie
      Cookies.set('access_token', tokens.access_token, { expires: 7 });
      
      // Set user data (in a real app, you'd get this from the API)
      setUser({ id: 1, username: credentials.username });
      
      toast.success('Login successful!');
      router.push('/dashboard');
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
        login,
        register,
        logout,
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