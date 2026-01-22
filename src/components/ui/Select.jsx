import React from 'react';

const Select = ({ children, className = '', ...rest }) => (
  <select className={`border rounded-md px-3 py-2 ${className}`} {...rest}>
    {children}
  </select>
);

export default Select;
