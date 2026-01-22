import React from 'react';

const AlertBanner = ({ children }) => (
  <div className="w-full bg-yellow-50 border-l-4 border-yellow-300 p-3 rounded">
    {children}
  </div>
);

export default AlertBanner;
