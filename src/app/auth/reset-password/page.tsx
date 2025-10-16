'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Lock, Users, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

interface ResetPasswordForm {
  new_password: string;
  confirm_password: string;
}

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>();

  const password = watch('new_password');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (data.new_password !== data.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.resetPassword(token, data.new_password);
      if (response.success) {
        toast.success(response.message || 'Password reset successfully!');
        setIsSuccess(true);
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      console.error('Error resetting password:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 form-bg-pattern">
        <div className="form-container-dark w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform duration-200">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-form-text mb-2">
              Password Reset Successful!
            </h1>
            <p className="text-form-text-muted text-sm">
              Your password has been reset successfully. You can now login with your new password.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-form-text text-sm mb-4">
                Your password has been updated successfully. You can now use your new password to login.
              </p>
            </div>
            
            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 form-bg-pattern">
        <div className="form-container-dark w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform duration-200">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-form-text mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-form-text-muted text-sm">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
          </div>
          
          <div className="text-center">
            <Link 
              href="/auth/forgot-password" 
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              Request New Password Reset
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 form-bg-pattern">
      <div className="form-container-dark w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform duration-200">
              <Users className="w-10 h-10 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-form-text mb-2">
            Reset your password
          </h1>
          <p className="text-form-text-muted text-sm">
            Enter your new password below.
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="new_password" className="label-dark">
              New Password
            </label>
            <div className="relative">
              <input
                {...register('new_password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                className={`input-dark pl-10 pr-10 ${errors.new_password ? 'input-error' : ''}`}
                placeholder="Enter your new password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-form-text-placeholder hover:text-form-text transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.new_password && (
              <p className="form-error">{errors.new_password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm_password" className="label-dark">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                {...register('confirm_password', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match'
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`input-dark pl-10 pr-10 ${errors.confirm_password ? 'input-error' : ''}`}
                placeholder="Confirm your new password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-form-text-placeholder hover:text-form-text transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="form-error">{errors.confirm_password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-dark-primary w-full h-12 rounded-xl font-medium transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Resetting password...</span>
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-form-border/20 mt-8">
          <p className="text-form-text-muted text-sm">
            Remember your password?{' '}
            <Link 
              href="/auth/login" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
