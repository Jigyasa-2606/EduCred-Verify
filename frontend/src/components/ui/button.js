import React from 'react';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  disabled = false,
  asChild = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  
  const variants = {
    default: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/25',
    outline: 'border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 bg-transparent backdrop-blur-sm',
  };
  
  const sizes = {
    default: 'h-12 px-6 py-3 text-base',
    lg: 'h-14 px-8 py-4 text-lg',
  };
  
  // If asChild is true, render children directly (for Link components)
  if (asChild && React.Children.count(children) === 1) {
    return React.cloneElement(children, {
      className: `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`,
      disabled,
      ...props
    });
  }
  
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