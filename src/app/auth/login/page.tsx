'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Users, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
    } catch (error) {
      // Error is handled by the useAuth hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 form-bg-pattern">
      <div className="form-container-dark w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform duration-200">
              <Users className="w-10 h-10 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-form-text mb-2">
            Sign in to your account
          </h2>
          <p className="text-form-text-muted text-sm">
            Or{' '}
            <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
              create a new account
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="username_or_email" className="label-dark">
              Username or Email
            </label>
            <div className="relative">
              <input
                {...register('username_or_email', { 
                  required: 'Username or email is required',
                  validate: (value) => {
                    if (!value) return 'Username or email is required';
                    if (value.includes('@')) {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(value)) {
                        return 'Please enter a valid email address';
                      }
                    }
                    return true;
                  }
                })}
                type="text"
                className={`input-dark pl-10 ${errors.username_or_email ? 'input-error' : ''}`}
                placeholder="Enter your username or email"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
            </div>
            {errors.username_or_email && (
              <p className="form-error">{errors.username_or_email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="label-dark">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                className={`input-dark pl-10 pr-12 ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-form-text-placeholder hover:text-form-text transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="checkbox-dark mt-0.5"
              />
              <label htmlFor="remember-me" className="text-sm text-form-text leading-5 cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-dark-primary w-full h-12 rounded-xl font-medium transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>


        <div className="text-center pt-8 border-t border-form-border/20 mt-8">
          <p className="text-form-text-muted text-sm">
            Don&apos;t have an account?{' '}
            <Link 
              href="/auth/register" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 