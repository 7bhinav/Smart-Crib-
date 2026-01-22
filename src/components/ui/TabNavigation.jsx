import React from 'react';

const TabNavigation = ({ tabs = [] }) => (
  <nav className="flex gap-3">
    {tabs.map((t) => (
      <button key={t} className="px-3 py-1 rounded-md text-sm text-gray-700 bg-gray-100">{t}</button>
    ))}
  </nav>
);

export default TabNavigation;
