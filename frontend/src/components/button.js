import React from 'react';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  
  const variants = {
    default: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/25',
    secondary: 'bg-slate-800 text-white border-2 border-purple-500 hover:bg-purple-500/10 hover:border-purple-400',
    outline: 'border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400',
    ghost: 'text-purple-300 hover:bg-purple-500/10 hover:text-purple-200',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-500/25',
  };
  
  const sizes = {
    default: 'h-12 px-6 py-3 text-base',
    sm: 'h-9 px-3 py-2 text-sm',
    lg: 'h-14 px-8 py-4 text-lg',
    xl: 'h-16 px-10 py-5 text-xl',
    icon: 'h-10 w-10',
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };