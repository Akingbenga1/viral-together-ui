'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Mail, Users, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      const response = await apiClient.forgotPassword(data.email);
      toast.success(response.message || 'Reset link sent successfully!');
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to send reset email';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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
              Check your email
            </h1>
            <p className="text-form-text-muted text-sm">
              We've sent a password reset link to{' '}
              <span className="text-cyan-400 font-medium">{getValues('email')}</span>
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
              <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <p className="text-form-text text-sm mb-4">
                Click the link in the email to reset your password. If you don't see it, check your spam folder.
              </p>
              <button 
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const response = await apiClient.forgotPassword(getValues('email'));
                    toast.success(response.message || 'Reset link sent again!');
                  } catch (error: any) {
                    const errorMessage = error.response?.data?.detail || error.message || 'Failed to resend email';
                    toast.error(errorMessage);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-sm disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Resend email'}
              </button>
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
            Forgot your password?
          </h1>
          <p className="text-form-text-muted text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="email" className="label-dark">
              Email address
            </label>
            <div className="relative">
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className={`input-dark pl-10 ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email address"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
            </div>
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
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
                <span>Sending reset link...</span>
              </div>
            ) : (
              'Send reset link'
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