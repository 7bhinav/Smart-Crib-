import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  fullWidth = false,
  iconName = null,
  iconPosition = 'left',
  size = 'md',
  ...rest 
}) => {
  const base = 'rounded-md font-medium transition-colors';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const tone = variant === 'outline' 
    ? 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50' 
    : 'bg-blue-600 text-white hover:bg-blue-700';
  
  return (
    <button className={`${base} ${sizeClasses[size]} ${tone} ${widthClass} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
