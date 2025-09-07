'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Enhanced form wrapper that can be used anywhere
interface FormWrapperProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  fullScreen?: boolean;
  pattern?: boolean;
}

export function FormWrapper({ 
  children, 
  className, 
  dark = false, 
  fullScreen = false,
  pattern = true
}: FormWrapperProps) {
  if (dark) {
    return (
      <div className={cn(
        fullScreen ? 'min-h-screen' : 'min-h-[400px]',
        'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4',
        pattern && 'form-bg-pattern'
      )}>
        <div className={cn('form-container-dark w-full max-w-md', className)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white p-6 rounded-lg shadow-sm', className)}>
      {children}
    </div>
  );
}

// Universal input component that adapts to dark/light mode
interface UniversalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
  dark?: boolean;
}

export function UniversalInput({ 
  label, 
  error, 
  icon, 
  helperText, 
  dark = false,
  className, 
  ...props 
}: UniversalInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className={dark ? 'label-dark' : 'block text-sm font-medium text-gray-700 mb-2'} htmlFor={props.id}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2',
            dark ? 'text-form-text-placeholder' : 'text-gray-400'
          )}>
            {icon}
          </div>
        )}
        
        <input
          {...props}
          className={cn(
            dark ? 'input-dark' : 'input',
            icon && 'pl-10',
            error && (dark ? 'input-error' : 'border-red-500 focus:ring-red-500'),
            className
          )}
        />
      </div>
      
      {error && (
        <p className={dark ? 'form-error' : 'text-red-500 text-sm mt-1'}>{error}</p>
      )}
      
      {helperText && !error && (
        <p className={cn(
          'text-xs',
          dark ? 'text-form-text-placeholder' : 'text-gray-500'
        )}>{helperText}</p>
      )}
    </div>
  );
}

// Universal button component
interface UniversalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  dark?: boolean;
  children: React.ReactNode;
}

export function UniversalButton({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  dark = false,
  children, 
  className, 
  disabled,
  ...props 
}: UniversalButtonProps) {
  const baseClasses = 'btn transition-all duration-200 font-medium';
  
  const getVariantClasses = () => {
    if (dark) {
      return {
        primary: 'btn-dark-primary',
        secondary: 'btn-dark',
        outline: 'border border-form-border text-form-text hover:bg-form-input-focus'
      }[variant];
    }
    
    return {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline'
    }[variant];
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: dark ? 'btn-md h-12' : 'btn-md',
    lg: 'btn-lg'
  };
  
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        getVariantClasses(),
        sizeClasses[size],
        dark && 'rounded-xl',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Universal textarea
interface UniversalTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  dark?: boolean;
}

export function UniversalTextarea({ 
  label, 
  error, 
  helperText, 
  dark = false,
  className, 
  ...props 
}: UniversalTextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className={dark ? 'label-dark' : 'block text-sm font-medium text-gray-700 mb-2'} htmlFor={props.id}>
          {label}
        </label>
      )}
      
      <textarea
        {...props}
        className={cn(
          dark ? 'textarea-dark' : 'input min-h-[100px] resize-vertical',
          error && (dark ? 'input-error' : 'border-red-500 focus:ring-red-500'),
          className
        )}
      />
      
      {error && (
        <p className={dark ? 'form-error' : 'text-red-500 text-sm mt-1'}>{error}</p>
      )}
      
      {helperText && !error && (
        <p className={cn(
          'text-xs',
          dark ? 'text-form-text-placeholder' : 'text-gray-500'
        )}>{helperText}</p>
      )}
    </div>
  );
}

// Universal select
interface UniversalSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
  helperText?: string;
  dark?: boolean;
}

export function UniversalSelect({ 
  label, 
  error, 
  children, 
  helperText, 
  dark = false,
  className, 
  ...props 
}: UniversalSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className={dark ? 'label-dark' : 'block text-sm font-medium text-gray-700 mb-2'} htmlFor={props.id}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          {...props}
          className={cn(
            dark ? 'select-dark' : 'input appearance-none',
            error && (dark ? 'input-error' : 'border-red-500 focus:ring-red-500'),
            className
          )}
        >
          {children}
        </select>
        
        <div className={cn(
          'absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none',
          dark ? 'text-form-text-placeholder' : 'text-gray-400'
        )}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className={dark ? 'form-error' : 'text-red-500 text-sm mt-1'}>{error}</p>
      )}
      
      {helperText && !error && (
        <p className={cn(
          'text-xs',
          dark ? 'text-form-text-placeholder' : 'text-gray-500'
        )}>{helperText}</p>
      )}
    </div>
  );
}

// Universal checkbox
interface UniversalCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

export function UniversalCheckbox({ 
  label, 
  error, 
  dark = false,
  className, 
  ...props 
}: UniversalCheckboxProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <input
          {...props}
          type="checkbox"
          className={cn(
            dark ? 'checkbox-dark mt-0.5' : 'h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5',
            className
          )}
        />
        {label && (
          <label className={cn(
            'text-sm leading-5 cursor-pointer',
            dark ? 'text-form-text' : 'text-gray-900'
          )} htmlFor={props.id}>
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <p className={cn(
          'ml-7',
          dark ? 'form-error' : 'text-red-500 text-sm'
        )}>{error}</p>
      )}
    </div>
  );
}

// Radio group for multiple choice questions (like in uploaded image)
interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  dark?: boolean;
  className?: string;
}

export function RadioGroup({ 
  name, 
  options, 
  value, 
  onChange, 
  dark = false, 
  className 
}: RadioGroupProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {options.map((option) => (
        <div 
          key={option.value}
          className={cn(
            'p-4 rounded-xl cursor-pointer transition-colors border',
            dark 
              ? 'form-surface-dark border-form-border/30 hover:bg-form-input/50' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          )}
        >
          <div className="flex items-center space-x-3">
            <input 
              type="radio" 
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              className={dark ? 'radio-dark' : 'h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'} 
            />
            <label className={cn(
              'font-medium cursor-pointer',
              dark ? 'text-form-text' : 'text-gray-900'
            )}>
              {option.label}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
