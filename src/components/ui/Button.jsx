import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...rest }) => {
  const base = 'px-4 py-2 rounded-md font-medium';
  const tone = variant === 'outline' ? 'border border-gray-300 bg-white text-gray-800' : 'bg-blue-600 text-white';
  return (
    <button className={`${base} ${tone} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
