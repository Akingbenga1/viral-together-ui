'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DarkFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
  title?: string;
  subtitle?: string;
  showPattern?: boolean;
}

interface DarkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

interface DarkTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

interface DarkSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
  helperText?: string;
}

interface DarkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

interface DarkCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Main form container
export const DarkForm = ({ 
  children, 
  className, 
  onSubmit, 
  title, 
  subtitle, 
  showPattern = true 
}: DarkFormProps) => {
  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4',
      showPattern && 'form-bg-pattern'
    )}>
      <div className={cn('form-container-dark w-full max-w-md', className)}>
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-form-text mb-2">{title}</h2>
            {subtitle && (
              <p className="text-form-text-muted text-sm">{subtitle}</p>
            )}
          </div>
        )}
        
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
        </form>
      </div>
    </div>
  );
};

// Dark input component
export const DarkInput = ({ 
  label, 
  error, 
  icon, 
  helperText, 
  className, 
  ...props 
}: DarkInputProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="label-dark" htmlFor={props.id}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-form-text-placeholder">
            {icon}
          </div>
        )}
        
        <input
          {...props}
          className={cn(
            'input-dark',
            icon && 'pl-10',
            error && 'input-error',
            className
          )}
        />
      </div>
      
      {error && (
        <p className="form-error">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-form-text-placeholder text-xs">{helperText}</p>
      )}
    </div>
  );
}

// Dark textarea component
export const DarkTextarea = ({ 
  label, 
  error, 
  helperText, 
  className, 
  ...props 
}: DarkTextareaProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="label-dark" htmlFor={props.id}>
          {label}
        </label>
      )}
      
      <textarea
        {...props}
        className={cn(
          'textarea-dark',
          error && 'input-error',
          className
        )}
      />
      
      {error && (
        <p className="form-error">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-form-text-placeholder text-xs">{helperText}</p>
      )}
    </div>
  );
};

// Dark select component
export const DarkSelect = ({ 
  label, 
  error, 
  children, 
  helperText, 
  className, 
  ...props 
}: DarkSelectProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="label-dark" htmlFor={props.id}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          {...props}
          className={cn(
            'select-dark',
            error && 'input-error',
            className
          )}
        >
          {children}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-form-text-placeholder" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="form-error">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-form-text-placeholder text-xs">{helperText}</p>
      )}
    </div>
  );
};

// Dark button component
export const DarkButton = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  children, 
  className, 
  disabled,
  ...props 
}: DarkButtonProps) => {
  const baseClasses = 'btn transition-all duration-200 font-medium';
  
  const variantClasses = {
    primary: 'btn-dark-primary',
    secondary: 'btn-dark',
    outline: 'border border-form-border text-form-text hover:bg-form-input-focus'
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md h-12', // Match input height
    lg: 'btn-lg'
  };
  
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        'w-full rounded-xl', // Match input styling
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Dark checkbox component
export const DarkCheckbox = ({ 
  label, 
  error, 
  className, 
  ...props 
}: DarkCheckboxProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <input
          {...props}
          type="checkbox"
          className={cn('checkbox-dark mt-0.5', className)}
        />
        {label && (
          <label className="text-sm text-form-text leading-5" htmlFor={props.id}>
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <p className="form-error ml-7">{error}</p>
      )}
    </div>
  );
};

// Form section divider
export const DarkFormSection = ({ 
  title, 
  children, 
  className 
}: { 
  title?: string; 
  children: React.ReactNode; 
  className?: string; 
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <div className="border-b border-form-border/30 pb-2">
          <h3 className="text-lg font-medium text-form-text">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

// Form group for organizing related fields
export const DarkFormGroup = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {children}
    </div>
  );
};
