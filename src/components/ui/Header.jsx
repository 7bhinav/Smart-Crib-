import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ title = 'Baby Crib Monitor', userRole, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-card/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <div className="text-xs text-muted-foreground">{userRole ? userRole.replace('_', ' ') : ''}</div>
          </div>

          <nav className="hidden sm:flex items-center gap-2">
            <Link to="/real-time-monitor-hub" className="text-sm px-3 py-1 rounded-md hover:bg-gray-100">Monitor</Link>
            <Link to="/vital-signs-analytics" className="text-sm px-3 py-1 rounded-md hover:bg-gray-100">Analytics</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={() => {
              const next = document.documentElement.classList.toggle('dark');
              localStorage.setItem('theme', next ? 'dark' : 'light');
            }}
            className="p-2 rounded-md border"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>
          </button>
          <button
            type="button"
            className="text-sm px-3 py-1 rounded-md bg-red-600 text-white"
            onClick={() => navigate('/real-time-monitor-hub', { state: { emergency: true } })}
          >
            Emergency
          </button>

          <button
            type="button"
            className="text-sm px-3 py-1 rounded-md border"
            onClick={() => (onLogout ? onLogout() : navigate('/'))}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
