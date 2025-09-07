'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types';
import { 
  DarkForm, 
  DarkInput, 
  DarkButton, 
  DarkCheckbox 
} from '@/components/ui/DarkForm';

export default function LoginDarkPage() {
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
    <DarkForm
      title="How many team members use SSH?"
      subtitle="This helps customize your vault structure for your team to manage connections and credentials."
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Username/Email Field */}
      <DarkInput
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
        label="Username or Email"
        placeholder="Enter your username or email"
        icon={<Mail className="w-5 h-5" />}
        error={errors.username_or_email?.message}
      />

      {/* Password Field */}
      <div className="space-y-2">
        <label className="label-dark">Password</label>
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
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between">
        <DarkCheckbox
          id="remember-me"
          label="Remember me"
        />
        <Link 
          href="#" 
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Multiple Choice Options (matching uploaded image) */}
      <div className="space-y-3">
        <div className="form-surface-dark p-4 rounded-xl cursor-pointer hover:bg-form-input/50 transition-colors border border-form-border/30">
          <div className="flex items-center space-x-3">
            <input 
              type="radio" 
              name="team-size" 
              value="just-me" 
              className="radio-dark" 
              defaultChecked
            />
            <label className="text-form-text font-medium cursor-pointer">Just me</label>
          </div>
        </div>
        
        <div className="form-surface-dark p-4 rounded-xl cursor-pointer hover:bg-form-input/50 transition-colors border border-form-border/30">
          <div className="flex items-center space-x-3">
            <input 
              type="radio" 
              name="team-size" 
              value="2-4" 
              className="radio-dark" 
            />
            <label className="text-form-text font-medium cursor-pointer">2-4</label>
          </div>
        </div>
        
        <div className="form-surface-dark p-4 rounded-xl cursor-pointer hover:bg-form-input/50 transition-colors border border-form-border/30">
          <div className="flex items-center space-x-3">
            <input 
              type="radio" 
              name="team-size" 
              value="5+" 
              className="radio-dark" 
            />
            <label className="text-form-text font-medium cursor-pointer">5+</label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <DarkButton
        type="submit"
        loading={isLoading}
        className="mt-8"
      >
        Next
      </DarkButton>

      {/* Footer Links */}
      <div className="text-center pt-6 border-t border-form-border/20">
        <p className="text-form-text-muted text-sm">
          Don't have an account?{' '}
          <Link 
            href="/auth/register" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </DarkForm>
  );
}
